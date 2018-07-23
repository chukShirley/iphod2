module Elm.Views.Article.Feed exposing (
      FeedSource
    , Model
    , InternalModel
    , Msg
    , initFeedSources
    , authorFeed
    , favoritedFeed
    , globalFeed
    , init
    , selectTag
    , tagFeed
    , update
    , viewArticles
    , viewFeedSources
    , yourFeed
    , sourceName
    , decoder
    )

{-| The reusable Article Feed that appears on both the Home page as well as on
the Profile page. There's a lot of logic here, so it's more convenient to use
the heavyweight approach of giving this its own Model, view, and update.

This means callers must use Html.map and Cmd.map to use this thing, but in
this case that's totally worth it because of the amount of logic wrapped up
in this thing.

For every other reusable view in this application, this API would be totally
overkill, so we use simploer API's instead.

-}

import Elm.Data.Article as Article exposing (Article, Tag, initTag)
import Elm.Data.Article.Feed as Feed exposing (Feed)
import Elm.Data.AuthToken as AuthToke exposing (AuthToken)
import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User as User exposing (Username, initUsername)
import Elm.Request.Article as RequestArticle
import Elm.Views.Article as ViewsArticle
import Elm.Views.Errors as Errors
import Elm.Views.Page as ViewsPage exposing (bodyId)
import Elm.Views.Spinner exposing (spinner)
import Elm.Util as Util exposing ((=>), onClickStopPropagation, pair, viewIf)
import Elm.Ports as Ports

import Task exposing (Task)
import Dom.Scroll
import Html exposing (..)
import Html.Attributes exposing (attribute, class, classList, href, id, placeholder, src)
import Html.Events exposing (onClick)
import Http
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline exposing(decode, hardcoded, required)
import SelectList exposing (Position(..), SelectList)


-- MODEL --


{-| This should not be exposed! We want to benefit from the guarantee that only
this module can create or alter this model. This way if it ever ends up in a
a surprising state, we know exactly where to look: this file.
-}
type Model
    = Model InternalModel


type alias InternalModel =
    { errors : List String
    , feed : Feed
    , feedSources : SelectList FeedSource
    , activePage : Int
    , isLoading : Bool
    }


decoder : Decoder InternalModel
decoder =
    decode InternalModel
        |> required "errors" (Decode.list Decode.string)
        |> hardcoded Feed.init -- required "feed" Feed.decoder
        |> hardcoded initFeedSources -- not sure how to get feed sources, so empty for now
        |> hardcoded 1 -- no good either, do something smart instead
        |> hardcoded True -- it's just true unless there is an error - something smart required here

initFeedSources : SelectList FeedSource
initFeedSources =
    SelectList.fromLists [] yourFeed [globalFeed, tagFeed initTag, favoritedFeed initUsername, authorFeed initUsername]

init : Session -> SelectList FeedSource -> Model
init session feedSources =
    Model { errors = []
    , feed = Feed.init
    , feedSources = feedSources
    , activePage = 1
    , isLoading = True
    }

    -- this need to happen somewhere...
    --  => Ports.requestFeed session.user thisFeed

-- init : Session -> SelectList FeedSource -> Task Http.Error Model
-- init session feedSources =
--     let
--         source =
--             SelectList.selected feedSources
-- 
--         toModel ( activePage, feed ) =
--             Model
--                 { errors = []
--                 , activePage = activePage
--                 , feed = feed
--                 , feedSources = feedSources
--                 , isLoading = False
--                 }
--     in
--     source
--         |> fetch (Maybe.map .token session.user) 1
--         |> Task.map toModel



-- VIEW --


viewArticles : Model -> List (Html Msg)
viewArticles (Model { activePage, feed, feedSources }) =
    List.map (ViewsArticle.view ToggleFavorite) feed.articles
        ++ [ pagination activePage feed (SelectList.selected feedSources) ]


viewFeedSources : Model -> Html Msg
viewFeedSources (Model { feedSources, isLoading, errors }) =
    ul [ class "nav nav-pills outline-active" ] <|
        SelectList.toList (SelectList.mapBy viewFeedSource feedSources)
            ++ [ Errors.view DismissErrors errors, viewIf isLoading spinner ]


viewFeedSource : Position -> FeedSource -> Html Msg
viewFeedSource position source =
    li [ class "nav-item" ]
        [ a
            [ classList [ "nav-link" => True, "active" => position == Selected ]
            , href "javascript:void(0);"
            , onClick (SelectFeedSource source)
            ]
            [ text (sourceName source) ]
        ]


selectTag : Maybe AuthToken -> Tag -> Cmd Msg
selectTag maybeAuthToken tagName =
    let
        source =
            tagFeed tagName
    in
    source
        |> fetch maybeAuthToken 1
        |> Task.attempt (FeedLoadCompleted source)


sourceName : FeedSource -> String
sourceName source =
    case source of
        YourFeed ->
            "Your Feed"

        GlobalFeed ->
            "Global Feed"

        TagFeed tagName ->
            "#" ++ Article.tagToString tagName

        FavoritedFeed username ->
            "Favorite Articles"

        AuthorFeed username ->
            "My Articles"


limit : FeedSource -> Int
limit feedSource =
    case feedSource of
        YourFeed ->
            10

        GlobalFeed ->
            10

        TagFeed tagName ->
            10

        FavoritedFeed username ->
            5

        AuthorFeed username ->
            5


pagination : Int -> Feed -> FeedSource -> Html Msg
pagination activePage feed feedSource =
    let
        articlesPerPage =
            limit feedSource

        totalPages =
            ceiling (toFloat feed.articlesCount / toFloat articlesPerPage)
    in
    if totalPages > 1 then
        List.range 1 totalPages
            |> List.map (\page -> pageLink page (page == activePage))
            |> ul [ class "pagination " ]
    else
        Html.text ""


pageLink : Int -> Bool -> Html Msg
pageLink page isActive =
    li [ classList [ "page-item" => True, "active" => isActive ] ]
        [ a
            [ class "page-link"
            , href "javascript:void(0);"
            , onClick (SelectPage page)
            ]
            [ text (toString page) ]
        ]



-- UPDATE --


type Msg
    = DismissErrors
    | SelectFeedSource FeedSource
    | FeedLoadCompleted FeedSource (Result Http.Error ( Int, Feed ))
    | ToggleFavorite Article
    | FavoriteCompleted (Result Http.Error Article)
    | SelectPage Int
    | SetFeed (Maybe InternalModel)


update : Session -> Msg -> Model -> ( Model, Cmd Msg )
update session msg (Model internalModel) =
    updateInternal session msg internalModel
        |> Tuple.mapFirst Model


updateInternal : Session -> Msg -> InternalModel -> ( InternalModel, Cmd Msg )
updateInternal session msg model =
    case msg of
        DismissErrors ->
            { model | errors = [] } => Cmd.none

        SelectFeedSource source ->
            source
                |> fetch (Maybe.map .token session.user) 1
                |> Task.attempt (FeedLoadCompleted source)
                |> pair { model | isLoading = True }

        FeedLoadCompleted source (Ok ( activePage, feed )) ->
            { model
                | feed = feed
                , feedSources = selectFeedSource source model.feedSources
                , activePage = activePage
                , isLoading = False
            }
                => Cmd.none

        FeedLoadCompleted _ (Err error) ->
            { model
                | errors = model.errors ++ [ "Server error while trying to load feed" ]
                , isLoading = False
            }
                => Cmd.none

        ToggleFavorite article ->
            case session.user of
                Nothing ->
                    { model | errors = model.errors ++ [ "You are currently signed out. You must sign in go favorite articles." ] }
                        => Cmd.none

                Just user ->
                    RequestArticle.toggleFavorite article user.token
                        |> Http.send FavoriteCompleted
                        |> pair model

        FavoriteCompleted (Ok article) ->
            let
                feed =
                    model.feed

                newFeed =
                    { feed | articles = List.map (replaceArticle article) feed.articles }
            in
            { model | feed = newFeed } => Cmd.none

        FavoriteCompleted (Err error) ->
            { model | errors = model.errors ++ [ "Server error while trying to favorite article" ] }
                => Cmd.none

        SelectPage page ->
            let
                source =
                    SelectList.selected model.feedSources
            in
            source
                |> fetch (Maybe.map .token session.user) page
                |> Task.andThen (\feed -> Task.map (\_ -> feed) scrollToTop)
                |> Task.attempt (FeedLoadCompleted source)
                |> pair model

        SetFeed (Just newModel) ->
            newModel => Cmd.none

        SetFeed Nothing ->
            model => Cmd.none


scrollToTop : Task x ()
scrollToTop =
    Dom.Scroll.toTop bodyId
        -- it's not worth showing the user anything spectial if scrolling fails
        -- if anything, we'd log this to an error recording service
        |> Task.onError (\_ -> Task.succeed ())


fetch : Maybe AuthToken -> Int -> FeedSource -> Task Http.Error ( Int, Feed )
fetch token page feedSource =
    let
        defaultListConfig =
            RequestArticle.defaultListConfig

        articlesPerPage =
            limit feedSource

        offset =
            (page - 1) * articlesPerPage

        listConfig =
            { defaultListConfig | offset = offset, limit = articlesPerPage }

        task =
            case feedSource of
                YourFeed ->
                    let
                        defaultFeedConfig =
                            RequestArticle.defaultFeedConfig

                        feedConfig =
                            { defaultFeedConfig | offset = offset, limit = articlesPerPage }
                    in
                    token
                        |> Maybe.map (RequestArticle.feed feedConfig >> Http.toTask)
                        |> Maybe.withDefault (Task.fail (Http.BadUrl "You need to be signed in to view your feed."))

                GlobalFeed ->
                    RequestArticle.list listConfig token
                        |> Http.toTask

                TagFeed tagName ->
                    RequestArticle.list { listConfig | tag = Just tagName } token
                        |> Http.toTask

                FavoritedFeed username ->
                    RequestArticle.list { listConfig | favorited = Just username } token
                        |> Http.toTask

                AuthorFeed username ->
                    RequestArticle.list { listConfig | author = Just username } token
                        |> Http.toTask
    in
    task
        |> Task.map (\feed -> ( page, feed ))


replaceArticle : Article -> Article -> Article
replaceArticle newArticle oldArticle =
    if newArticle.slug == oldArticle.slug then
        newArticle
    else
        oldArticle


selectFeedSource : FeedSource -> SelectList FeedSource -> SelectList FeedSource
selectFeedSource source sources =
    let
        withoutTags =
            sources
                |> SelectList.toList
                |> List.filter (not << isTagFeed)

        newSources =
            case source of
                YourFeed ->
                    withoutTags

                GlobalFeed ->
                    withoutTags

                FavoritedFeed _ ->
                    withoutTags

                AuthorFeed _ ->
                    withoutTags

                TagFeed _ ->
                    withoutTags ++ [ source ]
    in
    case newSources of
        [] ->
            -- This should never happen. If we had a logging service set up,
            -- we would definitely want to report if it somehow did happen!
            sources

        first :: rest ->
            SelectList.fromLists [] first rest
                |> SelectList.select ((==) source)


isTagFeed : FeedSource -> Bool
isTagFeed source =
    case source of
        TagFeed _ ->
            True

        _ ->
            False



-- FEEDSOURCE --


type FeedSource
    = YourFeed
    | GlobalFeed
    | TagFeed Tag
    | FavoritedFeed Username
    | AuthorFeed Username


yourFeed : FeedSource
yourFeed =
    YourFeed


globalFeed : FeedSource
globalFeed =
    GlobalFeed


tagFeed : Tag -> FeedSource
tagFeed =
    TagFeed


favoritedFeed : Username -> FeedSource
favoritedFeed =
    FavoritedFeed


authorFeed : Username -> FeedSource
authorFeed =
    AuthorFeed
