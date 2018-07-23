module Elm.Data.Article.Feed exposing (Feed, decoder, init)

import Elm.Data.Article as Article exposing (Article)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline exposing (decode, required, hardcoded)


type alias Feed =
    { articles : List Article
    , articlesCount : Int
    , tags : List Article.Tag
    }


init : Feed
init =
    { articles = []
    , articlesCount = -1
    , tags = []
    }



-- SERIALIZATION --


decoder : Decoder Feed
decoder =
    decode Feed
      |> required "rows" (Decode.list Article.decoder)
      |> required "total_rows" Decode.int
      |> required "tags" (Decode.list Article.tagDecoder)