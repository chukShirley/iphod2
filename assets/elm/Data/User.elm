module Elm.Data.User
    exposing
        ( User
        , Username
        , decoder
        , encode
        , initUsername
        , usernameDecoder
        , usernameParser
        , usernameToHtml
        , usernameToString
        )

import Elm.Data.AuthToken as AuthToken exposing (AuthToken)
import Elm.Data.UserPhoto as UserPhoto exposing (UserPhoto)
import Elm.Util as Util exposing ((=>))

import Html exposing (Html)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline exposing (decode, required)
import Json.Encode as Encode exposing (Value)
import Json.Encode.Extra as EncodeExtra
import UrlParser


type alias User =
    { name : String
    , token : AuthToken
    , username : Username
    , bio : Maybe String
    , image : UserPhoto
    , createdAt : Int
    , updatedAt : Int
    }



-- SERIALIZATION --


decoder : Decoder User
decoder =
    decode User
        |> required "name" Decode.string
        |> required "token" AuthToken.decoder
        |> required "whoami" usernameDecoder
        |> required "bio" (Decode.nullable Decode.string)
        |> required "image" UserPhoto.decoder
        -- unix time stamp
        |> required "createdAt" Decode.int
        |> required "updatedAt" Decode.int


encode : User -> Value
encode user =
    Encode.object
        [ "whoami" => Encode.string user.name
        , "token" => AuthToken.encode user.token
        , "name" => encodeUsername user.username
        , "bio" => EncodeExtra.maybe Encode.string user.bio
        , "image" => UserPhoto.encode user.image
        , "createdAt" => Encode.int user.createdAt
        , "updatedAt" => Encode.int user.updatedAt
        ]



-- IDENTIFIERS --


type Username
    = Username String

initUsername : Username
initUsername = Username ""


usernameToString : Username -> String
usernameToString (Username username) =
    username


usernameParser : UrlParser.Parser (Username -> a) a
usernameParser =
    UrlParser.custom "USERNAME" (Ok << Username)


usernameDecoder : Decoder Username
usernameDecoder =
    Decode.map Username Decode.string


encodeUsername : Username -> Value
encodeUsername (Username username) =
    Encode.string username


usernameToHtml : Username -> Html msg
usernameToHtml (Username username) =
    Html.text username
