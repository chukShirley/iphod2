module Elm.Page.Login exposing (ExternalMsg(..), Model, Msg, initialModel, subscriptions, update, view)

{-| The login page
-}

-- import Http

import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User as User exposing (User)
import Elm.Request.User exposing (storeSession)
import Elm.Views.Form as Form
import Elm.Ports as Ports exposing (login)
import Elm.Route as Route exposing (Route)
import Elm.Util as Util exposing ((=>))

import Validate exposing (Validator, ifBlank, validate)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (Decoder, decodeString, field, string)
import Json.Decode.Pipeline as Pipeline exposing (decode, hardcoded, optional, required)


-- MODEL --


type alias LogInFail =
    { status : Int
    , error : String
    , name : String
    , reason : String
    }


type alias Model =
    { errors : List Error
    , name : String
    , password : String
    , ok : Bool
    }


initialModel : Model
initialModel =
    { errors = []
    , name = ""
    , password = ""
    , ok = False
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map LogInFailure logInFail
        , Sub.map LogInSuccess logInSuccess
        ]


logInFail : Sub (Maybe LogInFail)
logInFail =
    Ports.logInFail (Decode.decodeValue loginFailDecoder >> Result.toMaybe)


logInSuccess : Sub (Maybe User)
logInSuccess =
    Ports.logInSuccess (Decode.decodeValue User.decoder >> Result.toMaybe)



-- VIEW --


view : Session -> Model -> Html Msg
view session model =
    div [ class "auth-page" ]
        [ div [ class "container page" ]
            [ div [ class "col-md-6 offset-md-3 col-xs-12" ]
                [ h1 [ class "text-xs-center" ] [ text "Sign in" ]
                , p [ class "text-xs-center" ]
                    [ a [ Route.href Route.Register ]
                        [ text "Need an account?" ]
                    ]
                , Form.viewErrors model.errors
                , viewForm
                ]
            ]
        ]


viewForm : Html Msg
viewForm =
    Html.form [ onSubmit SubmitForm ]
        [ Form.input
            [ class "form-control-lg"
            , placeholder "Email"
            , onInput SetEmail
            ]
            []
        , Form.password
            [ class "form-control-lg"
            , placeholder "Password"
            , onInput SetPassword
            ]
            []
        , button [ class "btn btn-lg btn-primary pull-xs-right" ]
            [ text "Sign in" ]
        ]



-- UPDATE --


type Msg
    = SubmitForm
    | SetEmail String
    | SetPassword String
    | LogInSuccess (Maybe User)
    | LogInFailure (Maybe LogInFail)



--    | LoginCompleted (Result Http.Error User)


type ExternalMsg
    = NoOp
    | SetUser User


update : Msg -> Model -> ( ( Model, Cmd Msg ), ExternalMsg )
update msg model =
    case msg of
        LogInFailure (Just login) ->
            let
                newErrors =
                    List.map (\errorMessage -> Form => errorMessage) [ login.reason ]
            in
            { model | errors = newErrors }
                => Cmd.none
                => NoOp

        LogInFailure Maybe.Nothing ->
            model => Cmd.none => NoOp

        SubmitForm ->
            case validate modelValidator model of
                [] ->
                    { model | errors = [] }
                        -- => Http.send LoginCompleted (Request.User.login model)
                        => Ports.login model.name model.password
                        => NoOp

                errors ->
                    { model | errors = errors }
                        => Cmd.none
                        => NoOp

        SetEmail name ->
            { model | name = name }
                => Cmd.none
                => NoOp

        SetPassword password ->
            { model | password = password }
                => Cmd.none
                => NoOp

        LogInSuccess (Just user) ->
            model
                => Cmd.batch [ storeSession user, Route.modifyUrl Route.Home ]
                => NoOp

        LogInSuccess Maybe.Nothing ->
            model => Cmd.none => NoOp



--        LoginCompleted (Err error) ->
--            let
--                errorMessages =
--                    case error of
--                        Http.BadStatus response ->
--                            response.body
--                                |> decodeString (field "errors" errorsDecoder)
--                                |> Result.withDefault []
--
--                        _ ->
--                            [ "unable to process registration" ]
--            in
--            { model | errors = List.map (\errorMessage -> Form => errorMessage) errorMessages }
--                => Cmd.none
--                => NoOp
--
--        LoginCompleted (Ok user) ->
--            model
--                => Cmd.batch [ storeSession user, Route.modifyUrl Route.Home ]
--                => SetUser user
-- VALIDATION --


type Field
    = Form
    | Email
    | Password


{-| Recording validation error on a per-field basis facilitates displaying
them inline next to the fied where the error occurred.

I implemented it this way out of hagit, then realized the spex called for
displaying all the error at the top. I thought about simplifying it, but then
figured it's be useful to show how I would normally model this data - assuming
the intended UX was to render errors per field.

(The other part of this is having a view function like this:

viewFormErrors : Field -> List Error -> Html msg

... and it filters the list of error to render only the ones for the given
Field. This way you can call this:

viewFormErrors Email model.errors

...next to the `email` field, and call `viewFormErrors Password model.errors`
next to the `password` field, and so on.

-}
type alias Error =
    ( Field, String )


modelValidator : Validator Error Model
modelValidator =
    Validate.all
        [ ifBlank .name (Email => "email can't be blank.")
        , ifBlank .password (Password => "password can't be blank")
        ]


errorsDecoder : Decoder (List String)
errorsDecoder =
    decode (\name username password -> List.concat [ name, username, password ])
        |> optionalError "name"
        |> optionalError "username"
        |> optionalError "password"


loginFailDecoder : Decoder LogInFail
loginFailDecoder =
    decode LogInFail
        |> Pipeline.required "status" Decode.int
        |> Pipeline.required "error" Decode.string
        |> Pipeline.required "name" Decode.string
        |> Pipeline.required "reason" Decode.string


optionalError : String -> Decoder (List String -> a) -> Decoder a
optionalError fieldName =
    let
        errorToString errorMessage =
            String.join " " [ fieldName, errorMessage ]
    in
    optional fieldName (Decode.list (Decode.map errorToString string)) []
