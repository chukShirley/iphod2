module Elm.Data.Article.Author exposing (Author, initAuthor, decoder)

import Elm.Data.User as User exposing (Username, initUsername)
import Elm.Data.UserPhoto as UserPhoto exposing (UserPhoto, initUserPhoto)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline exposing (custom, decode, hardcoded, required)


decoder : Decoder Author
decoder =
    decode Author
    |> required "whoami" User.usernameDecoder
    |> required "bio" (Decode.nullable Decode.string)
    |> required "image" UserPhoto.decoder
    |> required "following" Decode.bool



-- |> required "following" Decode.bool


type alias Author =
    { username : Username
    , bio : Maybe String
    , image : UserPhoto
    , following : Bool
    }

initAuthor : Author
initAuthor =
    { username = initUsername
    , bio = Just ""
    , image = UserPhoto.initUserPhoto
    , following = False
    }
