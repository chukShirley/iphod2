module Elm.Page.Settings exposing (ExternalMsg(..), Model, Msg, init, subscriptions, update, view)

-- import Http

import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User as User exposing (User)
import Elm.Data.UserPhoto as UserPhoto
import Elm.Request.User exposing (storeSession)
import Elm.Views.Form as Form
import Elm.Ports as Ports
import Elm.Route as Route
import Elm.Util as Util exposing ((=>), pair)

import Validate exposing (..)
import Html exposing (Html, button, div, fieldset, h1, input, text, textarea)
import Html.Attributes exposing (attribute, class, defaultValue, placeholder, type_)
import Html.Events exposing (onInput, onSubmit)
import Json.Decode as Decode exposing (Decoder, decodeString, field, list, string)
import Json.Decode.Pipeline as Pipeline exposing (decode, optional)
import Json.Encode as Encode
import Json.Encode.Extra as EncodeExtra


-- MODEL --


type alias Model =
    { errors : List Error
    , image : Maybe String
    , name : String
    , bio : String
    , username : String
    , password : Maybe String
    }


init : User -> Model
init user =
    { errors = []
    , image = UserPhoto.toMaybeString user.image
    , name = user.name
    , bio = Maybe.withDefault "" user.bio
    , username = User.usernameToString user.username
    , password = Nothing
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map SaveCompleted saveCompleted
        ]


saveCompleted : Sub (Maybe User)
saveCompleted =
    Ports.updateUserComplete (Decode.decodeValue User.decoder >> Result.toMaybe)



-- VIEW --


view : Session -> Model -> Html Msg
view session model =
    div [ class "settings-page" ]
        [ div [ class "container page" ]
            [ div [ class "row" ]
                [ div [ class "col-md-6 offset-md-3 col-xs" ]
                    [ h1 [ class "text-xs-center" ] [ text "Your Settings" ]
                    , Form.viewErrors model.errors
                    , viewForm model
                    ]
                ]
            ]
        ]


viewForm : Model -> Html Msg
viewForm model =
    Html.form [ onSubmit SubmitForm ]
        [ fieldset []
            [ Form.input
                [ placeholder "URL of profile picture"
                , defaultValue (Maybe.withDefault "" model.image)
                , onInput SetImage
                ]
                []
            , Form.input
                [ class "form-control-lg"
                , placeholder "Username"
                , defaultValue model.username
                , onInput SetUsername
                ]
                []
            , Form.textarea
                [ class "form-control-lg"
                , placeholder "Short bio about you"
                , attribute "rows" "8"
                , defaultValue model.bio
                , onInput SetBio
                ]
                []
            , Form.input
                [ class "form-control-lg"
                , placeholder "Email"
                , defaultValue model.name
                , onInput SetName
                ]
                []
            , Form.password
                [ class "form-control-lg"
                , placeholder "Password"
                , defaultValue (Maybe.withDefault "" model.password)
                , onInput SetPassword
                ]
                []
            , button
                [ class "btn btn-lg btn-primary pull-xs-right" ]
                [ text "Update Settings" ]
            ]
        ]



-- UPDATE --


type Msg
    = SubmitForm
    | SetName String
    | SetUsername String
    | SetPassword String
    | SetBio String
    | SetImage String
    | SaveCompleted (Maybe User)


type ExternalMsg
    = NoOp
    | SetUser User


update : Session -> Msg -> Model -> ( ( Model, Cmd Msg ), ExternalMsg )
update session msg model =
    case msg of
        SubmitForm ->
            case validate modelValidator model of
                [] ->
                    let
                        updates =
                            Encode.object
                                [ ( "username", Encode.string model.username )
                                , ( "name", Encode.string model.name )
                                , ( "bio", Encode.string model.bio )
                                , ( "image", EncodeExtra.maybe Encode.string model.image )
                                , ( "password", EncodeExtra.maybe Encode.string model.password )
                                ]
                    in
                    model => Ports.updateUser updates => NoOp

                errors ->
                    { model | errors = errors }
                        => Cmd.none
                        => NoOp

        SetName name ->
            { model | name = name }
                => Cmd.none
                => NoOp

        SetUsername username ->
            { model | username = username }
                => Cmd.none
                => NoOp

        SetPassword passwordStr ->
            let
                password =
                    if String.isEmpty passwordStr then
                        Nothing
                    else
                        Just passwordStr
            in
            { model | password = password }
                => Cmd.none
                => NoOp

        SetBio bio ->
            { model | bio = bio }
                => Cmd.none
                => NoOp

        SetImage imageStr ->
            let
                image =
                    if String.isEmpty imageStr then
                        Nothing
                    else
                        Just imageStr
            in
            { model | image = image }
                => Cmd.none
                => NoOp

        SaveCompleted Maybe.Nothing ->
            let
                --                 errorMessages =
                --                     case error of
                --                         Http.BadStatus response ->
                --                             response.body
                --                                 |> decodeString (field "errors" errorsDecoder)
                --                                 |> Result.withDefault []
                --
                --                         _ ->
                --                             [ "unable to save changes" ]
                --
                --                 errors =
                --                     errorMessages
                --                         |> List.map (\errorMessage -> Form => errorMessage)
                errors =
                    [ ( Unknown, "Could not save changes" ) ]
            in
            { model | errors = errors }
                => Cmd.none
                => NoOp

        SaveCompleted (Just user) ->
            model
                => Cmd.batch [ storeSession user, Route.modifyUrl Route.Home ]
                => SetUser user



-- VALIDATION --


type Field
    = Form
    | Username
    | Name
    | Password
    | ImageUrl
    | Bio
    | Unknown


type alias Error =
    ( Field, String )


modelValidator : Validator Error Model
modelValidator =
    Validate.all
        [ ifBlank .username (Username => "username can't be blank.")
        , ifBlank .name (Name => "email can't be blank.")
        ]


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
    optional fieldName (list (Decode.map errorToString string)) []
