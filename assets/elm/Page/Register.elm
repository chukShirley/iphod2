module Elm.Page.Register exposing (ExternalMsg(..), Model, Msg, initialModel, subscriptions, update, view)

import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User as User exposing (User)
import Elm.Request.User exposing (storeSession)
import Elm.Views.Form as Form
import Elm.Ports as Ports exposing (register)
import Elm.Route as Route exposing (Route)
import Elm.Util as Util exposing ((=>))

import Validate exposing (Validator, ifBlank, validate)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Http
import Json.Decode as Decode exposing (Decoder, decodeString, field, string)
import Json.Decode.Pipeline as Pipeline exposing (decode, hardcoded, optional, required)


-- MODEL --


type alias Model =
    { errors : List Error
    , name : String
    , username : String
    , password : String
    }


initialModel : Model
initialModel =
    { errors = []
    , name = ""
    , username = ""
    , password = ""
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map Registration registering
        ]


registering : Sub (Maybe User)
registering =
    -- Ports.registrationComplete (Decode.decodeValue registrationDecode >> Result.toMaybe)
    Ports.registrationComplete (Decode.decodeValue User.decoder >> Result.toMaybe)



-- VIEW --


view : Session -> Model -> Html Msg
view session model =
    div [ class "auth-page" ]
        [ div [ class "container page" ]
            [ div [ class "row" ]
                [ div [ class "col-md-6 offset-md-3 col0xs-12" ]
                    [ h1 [ class "text-xs-center" ] [ text "Sign up" ]
                    , p [ class "text-xs-center" ]
                        [ a [ Route.href Route.Login ]
                            [ text "Have an account?" ]
                        ]
                    , Form.viewErrors model.errors
                    , viewForm
                    ]
                ]
            ]
        ]


viewForm : Html Msg
viewForm =
    Html.form [ onSubmit SubmitForm ]
        [ Form.input
            [ class "form-control-lg"
            , placeholder "Username"
            , onInput SetUsername
            ]
            []
        , Form.input
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
            [ text "Sign up" ]
        ]



-- UODATE --


type Msg
    = SubmitForm
    | SetEmail String
    | SetUsername String
    | SetPassword String
    | RegisterCompleted (Result Http.Error User)
    | Registration (Maybe User)


type ExternalMsg
    = NoOp
    | SetUser User


update : Msg -> Model -> ( ( Model, Cmd Msg ), ExternalMsg )
update msg model =
    case msg of
        SubmitForm ->
            case validate modelValidator model of
                [] ->
                    { model | errors = [] }
                        -- => Http.send RegisterCompleted (Request.User.register model)
                        => Ports.register model.name model.username model.password
                        => NoOp

                errors ->
                    { model | errors = errors }
                        => Cmd.none
                        => NoOp

        SetEmail name ->
            { model | name = name }
                => Cmd.none
                => NoOp

        SetUsername username ->
            { model | username = username }
                => Cmd.none
                => NoOp

        SetPassword password ->
            { model | password = password }
                => Cmd.none
                => NoOp

        Registration (Just registration) ->
            model
                -- => Cmd.none
                => Cmd.batch [ storeSession registration, Route.modifyUrl Route.Settings ]
                => NoOp

        Registration Maybe.Nothing ->
            model => Cmd.none => NoOp

        RegisterCompleted (Err error) ->
            let
                errorMessages =
                    case error of
                        Http.BadStatus response ->
                            response.body
                                |> decodeString (field "errors" errorsDecoder)
                                |> Result.withDefault []

                        _ ->
                            [ "undable to process registration" ]
            in
            { model | errors = List.map (\errorMessage -> Form => errorMessage) errorMessages }
                => Cmd.none
                => NoOp

        RegisterCompleted (Ok user) ->
            model
                => Cmd.batch [ storeSession user, Route.modifyUrl Route.Home ]
                => SetUser user



-- VALIDATION --


type Field
    = Form
    | Username
    | Email
    | Password


type alias Error =
    ( Field, String )


modelValidator : Validator Error Model
modelValidator =
    Validate.all
        [ ifBlank .username (Username => "username can't be blank.")
        , ifBlank .name (Email => "Email can't be blank.")
        , ifBlank .password (Password => "password can't be blank.")
        ]


registrationDecode : Decoder Model
registrationDecode =
    decode Model
        |> hardcoded []
        |> Pipeline.required "name" Decode.string
        |> Pipeline.required "whoami" Decode.string
        |> hardcoded ""



-- |> Pipeline.required "password" Decode.string


errorsDecoder : Decoder (List String)
errorsDecoder =
    decode (\name username password -> List.concat [ name, username, password ])
        |> optionalError "name"
        |> optionalError "username"
        |> optionalError "password"


optionalError : String -> Decoder (List String -> a) -> Decoder a
optionalError fieldName =
    let
        errorToString errorMessage =
            String.join " " [ fieldName, errorMessage ]
    in
    optional fieldName (Decode.list (Decode.map errorToString string)) []
