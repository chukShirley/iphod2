module Elm.Data.Error exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline exposing (decode, required)

type alias Error =
  { msg : String
  }
decoder : Decoder Error
decoder =
  decode Error
    |> required "msg" Decode.string

