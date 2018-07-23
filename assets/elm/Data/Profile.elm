module Elm.Data.Profile exposing (Profile, decoder, initProfile)

import Elm.Data.User as User exposing (Username, initUsername)
import Elm.Data.UserPhoto as UserPhoto exposing (UserPhoto, initUserPhoto)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline exposing (decode, required)


type alias Profile =
    { bio : Maybe String
    , following : Bool
    , image : UserPhoto
    , username : Username
    , whoami : String
    }


decoder : Decoder Profile
decoder =
    decode Profile
        |> required "bio" (Decode.nullable Decode.string)
        |> required "following" Decode.bool
        |> required "image" UserPhoto.decoder
        |> required "_id" User.usernameDecoder
        |> required "whoami" Decode.string

initProfile : Profile
initProfile =
    { bio = Nothing
    , following = False
    , image = initUserPhoto
    , username = initUsername
    , whoami = ""
    }
