module Elm.Data.Article
    exposing
        ( Article
        , Body
        , Slug
        , SlugTag
        , Tag
        , bodyPreviewHtml
        , bodyToHtml
        , bodyToMarkdownString
        , decoder
          -- , decoderWithBody
        , slugParser
        , slugToString
        , tagDecoder
        , tagListDecoder
        , tagToString
        , initTag
        )

import Elm.Data.Article.Author as Author exposing (Author)
import Date exposing (Date)
import Html exposing (Attribute, Html)
import String.Extra exposing(ellipsis)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Extra
import Json.Decode.Pipeline as Pipeline exposing (custom, decode, hardcoded, required, requiredAt)
import Markdown
import UrlParser


{-| An article, optionally with as article body

To see the difference between {body : body} and {body : Maybe Body},
consider the difference between the "view individual article" page (which
renders one article, including its body) and the "article feed" -
which displays multiple articles, but without bodies.

This definition for `Article` means we can write

viewArticle : Article Body -> Html msg
viewFeed : List (Article ()) -> Html msg

This indicate that `viewAtricle` requires as an article _with a `body` present_,
whereas `viewFeed` accepts articles with no bodies. (We could also have written
it as `List (Article a)` to specify that feeds can accept either aricles that
have `body` present or not. Either work, given that feeds do not attempt to
read the `body` field from articles.)

SAMPLE ROW...
{
"id": "frpaulas@gmail.com1523137444",
"key": 1523137444,
"value":
{
"article":
{
"_id": "frpaulas@gmail.com1523137444",
"_rev": "5-bf12db03224096ba336d0da980fb5d31",
"type": "post",
"description": "test",
"title": "test",
"tagList": ["test", "test1"],
"author": "frpaulas@gmail.com",
"body": "test duplicate slug",
"createdAt": 1523137444,
"updatedAt": 1523137444,
"favorated": false,
"favoritedCount": 0,
"slug": "test-test"
},
"_id": "frpaulas@gmail.com"
},
"doc":
{
"_id": "frpaulas@gmail.com",
"_rev": "2-d5d4f65f5918f8e46316fb75724f31ca",
"type": "author",
"whoami": "Fr Paul",
"token": "",
"bio": "more short bio etc",
"image": "<https://scontent.fagc3-1.fna.fbcdn.net/v/t1.0-1/p160x160/12313802_439281336257713_5477681135684869526_n.jpg?_nc_cat=0&oh=aff9f0815980c5f62d532eccf210a835&oe=5B67093F">
}
},

-}



-- type alias Article a =
--     { description : String
--     , slug : Slug
--     , title : String
--     , tags : List String
--     , createdAt : Date
--     , updatedAt : Date
--     , favorited : Bool
--     , favoritesCount : Int
--     , author : Author
--     , body : a
--     }


type alias Article =
    { description : String
    , slug : Slug
    , title : String
    , tags : List String
    , createdAt : Date
    , updatedAt : Date
    , favorited : Bool
    , favoritesCount : Int
    , author : Author

    -- , body : a
    , body : Body
    }


type alias TagRows =
    { rows : List Tag
    }


type alias Tag =
    { name : String
    , count : Int
    , articleIds : List String
    }


initTag : Tag
initTag =
    { name = "No Tag"
    , count = 0
    , articleIds = []
    }



-- SERIALIZATION --
-- decoder : Decoder (Article ())
-- decoder =
--     baseArticleDecoder
--         |> hardcoded ()
--
--
-- decoderWithBody : Decoder (Article Body)
-- decoderWithBody =
--     baseArticleDecoder
--         |> requiredAt [ "value", "article", "body" ] bodyDecoder
--
--
-- baseArticleDecoder : Decoder (a -> Article a)
-- baseArticleDecoder =
--     decode Article
--         |> requiredAt [ "value", "article", "description" ] (Decode.map (Maybe.withDefault "") (Decode.nullable Decode.string))
--         |> requiredAt [ "value", "article", "slug" ] (Decode.map Slug Decode.string)
--         |> requiredAt [ "value", "article", "title" ] Decode.string
--         |> requiredAt [ "value", "article", "tagList" ] (Decode.list Decode.string)
--         |> requiredAt [ "value", "article", "createdAt" ] Json.Decode.Extra.date
--         |> requiredAt [ "value", "article", "updatedAt" ] Json.Decode.Extra.date
--         |> requiredAt [ "value", "article", "favorited" ] Decode.bool
--         |> requiredAt [ "value", "article", "favoritedCount" ] Decode.int
--         |> required "doc" Author.decoder


decoder : Decoder Article
decoder =
    decode Article
        |> required "description" (Decode.map (Maybe.withDefault "") (Decode.nullable Decode.string))
        |> required "slug" (Decode.map Slug Decode.string)
        |> required "title" Decode.string
        |> required "tagList" (Decode.list Decode.string)
        |> required "createdAt" Json.Decode.Extra.date
        |> required "updatedAt" Json.Decode.Extra.date
        |> required "favorited" Decode.bool
        |> required "favoritedCount" Decode.int
        |> required "authorBio" Author.decoder
        |> required "body" bodyDecoder



-- IDENTIFIERS --


type Slug
    = Slug String


slugParser : UrlParser.Parser (Slug -> a) a
slugParser =
    UrlParser.custom "SLUG" (Ok << Slug)


slugToString : Slug -> String
slugToString (Slug slug) =
    slug



-- TAGS --


type SlugTag
    = SlugTag String


tagToString : Tag -> String
tagToString tag =
    tag.name


tagDecoder : Decoder Tag
tagDecoder =
    -- Decode.map SlugTag Decode.string
    decode Tag
        |> required "_id" Decode.string
        |> required "popular" Decode.int
        |> required "tags" (Decode.list Decode.string)



tagListDecoder : Decoder (List Tag)
tagListDecoder =
    Decode.at [ "rows" ] (Decode.list eachTag)


eachTag : Decoder Tag
eachTag =
    Decode.succeed (\id value tags -> { name = id, count = value, articleIds = tags })
        |> required "_id" Decode.string
        |> required "popular" Decode.int
        |> required "tags" (Decode.list Decode.string)



--    decode (Decode.list Tag)
--        |> requiredAt [ "rows" ] (Decode.list tagDecoder)
-- BODY --


type Body
    = Body Markdown


type alias Markdown =
    String

bodyPreviewHtml : Body -> List (Attribute msg) -> Html msg
bodyPreviewHtml (Body markdown) attributes =
    let
        preview =
            ellipsis 50 markdown
    in
    Markdown.toHtml attributes preview
            


bodyToHtml : Body -> List (Attribute msg) -> Html msg
bodyToHtml (Body markdown) attributes =
    Markdown.toHtml attributes markdown


bodyToMarkdownString : Body -> String
bodyToMarkdownString (Body markdown) =
    markdown


bodyDecoder : Decoder Body
bodyDecoder =
    Decode.map Body Decode.string
