module Elm.Request.Article
    exposing
        ( FeedConfig
        , ListConfig
        , create
        , defaultFeedConfig
        , defaultListConfig
        , delete
        , feed
        , get
        , list
        , tags
        , toggleFavorite
        , update
        )

import Elm.Data.Article as Article exposing (Article, Body, SlugTag, Tag, slugToString)
import Elm.Data.Article.Feed as Feed exposing (Feed)
import Elm.Data.AuthToken as AuthToken exposing (AuthToken, withAuthorization)
import Elm.Data.User as User exposing (User, Username)
import Elm.Request.Helpers as RequestHelpers exposing (apiUrl, articleUrl)
import Elm.Ports as Ports exposing (requestArticle, submitArticle)
import Elm.Util as Util exposing ((=>))

import Http
import HttpBuilder exposing (RequestBuilder, withBody, withExpect, withQueryParams)
import Json.Decode as Decode
import Json.Encode as Encode


-- SINGLE --


get : Maybe AuthToken -> Article.Slug -> Http.Request Article
get maybeToken slug =
    let
        expect =
            Article.decoder
                |> Decode.field "article"
                |> Http.expectJson
    in
    articleUrl ("/articles/_design/slugs/_view/slug-view?key=" ++ "\"" ++ Article.slugToString slug ++ "\"")
        |> HttpBuilder.get
        |> HttpBuilder.withExpect expect
        |> withAuthorization maybeToken
        |> HttpBuilder.toRequest



-- http://legereme.com:5984/articles/_design/slugs/_view/slug-view?key="test-test"
-- LIST --


type alias ListConfig =
    { tag : Maybe Tag
    , author : Maybe Username
    , favorited : Maybe Username
    , limit : Int
    , offset : Int
    }


defaultListConfig : ListConfig
defaultListConfig =
    { tag = Nothing
    , author = Nothing
    , favorited = Nothing
    , limit = 20
    , offset = 0
    }


list : ListConfig -> Maybe AuthToken -> Http.Request Feed
list config maybeToken =
    [ "tag" => Maybe.map Article.tagToString config.tag
    , "author" => Maybe.map User.usernameToString config.author
    , "favorited" => Maybe.map User.usernameToString config.favorited

    -- , "limit" => Just (toString config.limit)
    -- , "offset" => Just (toString config.offset)
    , "limit" => Just (toString config.limit)
    , "skip" => Just (toString config.offset)
    , "descending" => Just "true"
    , "include_docs" => Just "true"
    ]
        |> List.filterMap maybeVal
        |> buildFromQueryParams "/articles/_design/latest/_view/feed"
        |> withAuthorization maybeToken
        |> HttpBuilder.toRequest



-- FEED --


type alias FeedConfig =
    { limit : Int
    , offset : Int
    }


defaultFeedConfig : FeedConfig
defaultFeedConfig =
    { limit = 10
    , offset = 0
    }


feed : FeedConfig -> AuthToken -> Http.Request Feed
feed config token =
    [ "limit" => Just (toString config.limit)
    , "offset" => Just (toString config.offset)
    , "descending" => Just "true"
    , "include_docs" => Just "true"
    ]
        |> List.filterMap maybeVal
        -- |> buildFromQueryParams "/articles/feed"
        |> buildFromQueryParams "/articles/_design/latest/_view/feed"
        |> withAuthorization (Just token)
        |> HttpBuilder.toRequest



-- TAGS --


tags : Http.Request (List Tag)
tags =
    -- Decode.field "tags" (Decode.list Article.tagDecoder)
    Article.tagListDecoder
        |> Http.get (RequestHelpers.tagsUrl "/tags/_design/slugs/_view/slug-view")



-- FAVORITE --


toggleFavorite : Article -> AuthToken -> Http.Request Article
toggleFavorite article authToken =
    if article.favorited then
        unfavorite article.slug authToken
    else
        favorite article.slug authToken


favorite : Article.Slug -> AuthToken -> Http.Request Article
favorite =
    buildFavorite HttpBuilder.post


unfavorite : Article.Slug -> AuthToken -> Http.Request Article
unfavorite =
    buildFavorite HttpBuilder.delete


buildFavorite :
    (String -> RequestBuilder a)
    -> Article.Slug
    -> AuthToken
    -> Http.Request Article
buildFavorite builderFromUrl slug token =
    let
        expect =
            Article.decoder
                |> Decode.field "article"
                |> Http.expectJson
    in
    [ apiUrl "/articles", slugToString slug, "favorite" ]
        |> String.join "/"
        |> builderFromUrl
        |> withAuthorization (Just token)
        |> withExpect expect
        |> HttpBuilder.toRequest



-- CREATE --


type alias CreateConfig record =
    { record
        | title : String
        , description : String
        , body : String
        , tags : List String
    }


type alias EditConfig record =
    { record
        | title : String
        , description : String
        , body : String
    }



-- create : CreateConfig record -> AuthToken -> Http.Request (Article Body)
-- create : CreateConfig record -> AuthToken -> Cmd msg
-- create config token =


create : CreateConfig record -> User -> Cmd msg
create config user =
    let
        --    expect =
        --      Article.decoderWithBody
        --        |> Decode.field "article"
        --        |> Http.expectJson
        --
        article =
            Encode.object
                [ "title" => Encode.string config.title
                , "description" => Encode.string config.description
                , "body" => Encode.string config.body
                , "tagList" => Encode.list (List.map Encode.string config.tags)
                , "favorited" => Encode.bool False
                , "favoritedCount" => Encode.int 0
                , "author" => Encode.string (User.usernameToString user.username)
                , "name" => Encode.string user.name
                ]

        --
        --    body =
        --      Encode.object [ "article" => article ]
        --        |> Http.jsonBody
    in
    submitArticle article



--  apiUrl "/articles"
--    |> HttpBuilder.post
--    |> withAuthorization (Just token)
--    |> withBody body
--    |> withExpect expect
--    |> HttpBuilder.toRequest


update : Article.Slug -> EditConfig record -> AuthToken -> Http.Request Article
update slug config token =
    let
        expect =
            Article.decoder
                |> Decode.field "article"
                |> Http.expectJson

        article =
            Encode.object
                [ "title" => Encode.string config.title
                , "description" => Encode.string config.description
                , "body" => Encode.string config.body
                ]

        body =
            Encode.object [ "article" => article ]
                |> Http.jsonBody
    in
    apiUrl ("/artices/" ++ slugToString slug)
        |> HttpBuilder.put
        |> withAuthorization (Just token)
        |> withBody body
        |> withExpect expect
        |> HttpBuilder.toRequest



-- DELETE --


delete : Article.Slug -> AuthToken -> Http.Request ()
delete slug token =
    apiUrl ("/artices/" ++ Article.slugToString slug)
        |> HttpBuilder.delete
        |> withAuthorization (Just token)
        |> HttpBuilder.toRequest



-- HELPERS --


maybeVal : ( a, Maybe b ) -> Maybe ( a, b )
maybeVal ( key, value ) =
    case value of
        Nothing ->
            Nothing

        Just val ->
            Just (key => val)


buildFromQueryParams : String -> List ( String, String ) -> RequestBuilder Feed
buildFromQueryParams url queryParams =
    url
        |> RequestHelpers.articleUrl
        -- apiUrl
        |> HttpBuilder.get
        |> withExpect (Http.expectJson Feed.decoder)
        |> withQueryParams queryParams
