module Elm.Page.Home exposing 
    ( Model
    , Msg
    , init
    , update
    , view
    )

{-| The homepage, You can get here via ether the / or /#/ routes
-}

import Elm.Data.Article as Article exposing (Tag, bodyToHtml, bodyPreviewHtml)
import Elm.Data.Article.Feed as DataFeed exposing (Feed)
import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User exposing (usernameToString)
import Elm.Data.UserPhoto exposing (src)
import Elm.Views.Article.Feed as Feed exposing (FeedSource, globalFeed, tagFeed, yourFeed, Model)
-- import Elm.Request.Article exposing (defaultListConfig)
-- import Elm.Request.Article
import Html exposing (..)
import Html.Attributes exposing (attribute, class, classList, href, id, placeholder)
import Html.Events exposing (onClick)
import Markdown as Markdown
-- import Elm.Ports as Ports exposing(chatReceived)
import Elm.Util as Util exposing ((=>), onClickStopPropagation)
-- import Elm.Page.Errored as Errored exposing (PageLoadError, pageLoadError)
-- import Elm.Views.Page as ViewsPage

-- import Http
import Json.Encode as Encode
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline exposing(decode, hardcoded, required, optional)
import SelectList exposing (SelectList)
-- import Phoenix.Socket
-- import Phoenix.Channel
-- import Phoenix.Push
-- import Task exposing (Task)
import Elm.Ports as Ports



-- MODEL --

type alias Model =
    { tags : List Tag
    , errors : List String
    , feed : DataFeed.Feed
    , feedSources : SelectList FeedSource
    , activePage : Int
    , isLoading : Bool
    }


decoder : Decoder Model
decoder =
    decode Model
        |> hardcoded [] -- tags
        |> required "errors" (Decode.list Decode.string)
        |> hardcoded DataFeed.init -- required "feed" Feed.decoder
        |> hardcoded Feed.initFeedSources -- not sure how to get feed sources, so empty for now
        |> hardcoded 1 -- no good either, do something smart instead
        |> hardcoded True -- it's just true unless there is an error - something smart required here


userParams: Encode.Value
userParams =
    Encode.object [ ("user_id", Encode.string "123")]

    

init : Session -> DataFeed.Feed -> Model
init session feed =
    let
        feedSources =
            if session.user == Nothing then
                SelectList.singleton globalFeed
            else
                SelectList.fromLists [] yourFeed [ globalFeed ]
        feedMe = Feed.sourceName (SelectList.selected feedSources)

    in
    { tags = feed.tags
    , errors = []
    , feed = feed
    , feedSources = Feed.initFeedSources 
    , activePage = 0
    , isLoading = True
    }


-- VIEW

view : Session -> Model -> Html Msg
view session model =
    div [ class "" ]
        [ viewBanner
        , div [ class "ml0 pl0" ]
            [ div [ class "fl w-60" ] (viewFeed model.feed)
            , div [ class "fr w-40" ]
                [ p [] [ text "Popular Tags" ]
                , viewTags model.tags
                ]
            ]
        ]


viewBanner : Html msg
viewBanner =
    div [ class "bg-green w-100 ph3 pv3 pv4-ns ph4-m ph5-l" ]
        [ div [ class "" ]
            [ h2 [ class "" ] [ text "The Door" ]
            , span [] [ text "A place to share your knowledge" ]
            ]
        ]



viewFeed : DataFeed.Feed -> List (Html Msg)
viewFeed feed = 
    let
        listThis art = ul [class "list pl0"] (viewArticle art)
            
    in
    List.map listThis feed.articles

viewArticle : Article.Article -> List (Html Msg)
viewArticle article =
    [   li [ class "", onClick (SelectArticle article) ] 
        [ img [ class "mw4 fl", src article.author.image] [] 
        , p [ class "" ] [ text article.title ] 
        , p [ class "" ] [ text ("by " ++ usernameToString article.author.username)]
        ]
    ,   li [class ""] [ text article.description]
    ,   li [] [ bodyPreviewHtml article.body [] ]
    ]

viewTags : List Tag -> Html Msg
viewTags tags =
    div [ class "flex flex-wrap" ] (List.map viewTag tags)


viewTag : Tag -> Html Msg
viewTag tagName =
    a
        [ class "b--green f3 ba br3 pa1 ma2"
        , href "javascript:void(0)"
        , onClick (SelectTag tagName)
        ]
        [ text (Article.tagToString tagName) ]



-- UPDATE --


type Msg
    -- = FeedMsg Feed.Msg
    = SelectTag Tag
    | SetFeed (Maybe Model)
    | SelectArticle Article.Article


update : Session -> Msg -> Model -> ( Model, Cmd Msg )
update session msg model =
    case msg of

        SetFeed (Just im) ->
            model => Cmd.none

        SetFeed Maybe.Nothing -> model =>Cmd.none

        SelectTag tagName ->
            let
                _ =
                    Debug.log "TAG NAME: " tagName
                _ = Debug.log "FEED SOURCE: " model.feedSources
            in
                    
            model => Cmd.batch
                [ Ports.requestFeed session.user tagName.name 20 0
                , Cmd.none
                ]

        SelectArticle article ->
            let
                _ =
                    Debug.log "SelectArticle: " article
            in
            model => Cmd.none


--        SetTags (Just tags) ->
--            { model | tags = tags } => Cmd.none
--
--        SetTags Maybe.Nothing ->
--            let
--                _ =
--                    Debug.log "debug 182:" "Failed to get tags"
--            in
--            model => Cmd.none
--
--        SetFeed (Just feed) ->
--            let
--                _ = Debug.log "HOME PAGE FEED:" feed
--            in
--            model => Cmd.none
--
--        SetFeed Maybe.Nothing ->
--            let
--                _ =
--                    Debug.log "debug 192:" "Failed to get feed"
--            in
--            model => Cmd.none
