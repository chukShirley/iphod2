module Elm.Page.Profile exposing (Model, Msg, init, subscriptions, update, view)


{-| Viewing a user's Profile
-}

import Elm.Data.Article.Feed as FeedData
import Elm.Data.Profile as Profile exposing (Profile, initProfile)
import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User as User exposing (Username, initUsername, usernameToString)
import Elm.Data.UserPhoto as UserPhoto exposing (UserPhoto)
import Elm.Page.Errored as Errored exposing (PageLoadError, pageLoadError)
import Elm.Request.Article as RequestArticle exposing (ListConfig, defaultListConfig)
import Elm.Request.Profile as RequestProfile
import Elm.Views.Article.Feed as Feed exposing (FeedSource, authorFeed, favoritedFeed, globalFeed, yourFeed)
import Elm.Views.Errors as Errors
import Elm.Views.Page as Page
import Elm.Views.User.Follow as Follow
import Elm.Util as Util exposing((=>), pair, viewIf)
import Elm.Ports as Ports exposing(requestedProfile)

import Task exposing (Task)
import Html exposing (..)
import Html.Attributes exposing (..)
import Http
import SelectList exposing (SelectList)
import Json.Decode as Decode exposing(Value)


-- MODEL --


type alias Model =
    { errors : List String
    , profile : Profile
    , feed : Feed.Model
    }

init : Session -> Username -> (Model, Cmd Msg)
init session author =
    let
        model  =
            { errors = []
            , profile = initProfile
            , feed = Feed.init session (defaultFeedSources author)
            }
        sessionUsername = 
            case Maybe.map .username session.user of
                Nothing ->
                    initUsername
                Just username ->
                    username 

        cmds =
            if session.user == Nothing then
                Cmd.none
            else
                Cmd.batch
                    [ Ports.profileRequest sessionUsername author
                    , Ports.requestFeed session.user (usernameToString author) defaultListConfig.limit defaultListConfig.offset
                    , Cmd.none
                    ]
    in
    model => cmds
            

-- init : Session -> Username -> Task PageLoadError Model
-- init session username =
--     let
--         _ =
--             Debug.log "INIT PROFILE PAGE" ( session, username )
--
--         config : ListConfig
--         config =
--             { defaultListConfig | limit = 5, author = Just username }
--
--         maybeAuthToken =
--             session.user
--                 |> Maybe.map .token
--
--         loadProfile =
--             Request.Profile.get username maybeAuthToken
--                 |> Http.toTask
--
--         loadFeedSources =
--             Feed.init session (defaultFeedSources username)
--
--         handleLoadError _ =
--             "Profile is currently unavailable."
--                 |> pageLoadError (Page.Profile username)
--     in
--     Task.map2 (Model []) loadProfile loadFeedSources
--         |> Task.mapError handleLoadError

subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map SetProfile setProfile
        -- , Sub.map SetFeed setFeed
        ]

setProfile : Sub (Maybe Profile)
setProfile =
    Ports.requestedProfile (Decode.decodeValue Profile.decoder >> Result.toMaybe)


-- VIEW --


view : Session -> Model -> Html Msg
view session model =
    let
        profile =
            model.profile

        isMyProfile =
            session.user
                |> Maybe.map (\{ username } -> username == profile.username)
                |> Maybe.withDefault False
    in
    div [ class "profile-page" ]
        [ Errors.view DismissErrors model.errors
        , div [ class "user-info" ]
            [ div [ class "user-info" ]
                [ div [ class "row" ]
                    [ viewProfileInfo isMyProfile profile ]
                ]
            ]
        , div [ class "container" ]
            [ div [ class "row" ] [ viewFeed model.feed ] ]
        ]


viewProfileInfo : Bool -> Profile -> Html Msg
viewProfileInfo isMyProfile profile =
    div [ class "col-xs12 col-md-10 offset-md-1" ]
        [ img [ class "user-img", UserPhoto.src profile.image ] []
        , h4 [] [ User.usernameToHtml profile.username ]
        , p [] [ text (Maybe.withDefault "" profile.bio) ]
        , viewIf (not isMyProfile) (followButton profile)
        ]


viewFeed : Feed.Model -> Html Msg
viewFeed feed =
    div [ class "col-xs-12 col-md-10 offset-md-1" ] <|
        div [ class "articles-toggle" ]
            [ Feed.viewFeedSources feed |> Html.map FeedMsg ]
            :: (Feed.viewArticles feed |> List.map (Html.map FeedMsg))



-- UPDATE --


type Msg
    = DismissErrors
    | ToggleFollow
    | FollowCompleted (Result Http.Error Profile)
    | FeedMsg Feed.Msg
    | SetProfile (Maybe Profile)
    | SetFeed (Maybe Feed.Model)


update : Session -> Msg -> Model -> ( Model, Cmd Msg )
update session msg model =
    let
        profile =
            model.profile
    in
    case msg of
        DismissErrors ->
            { model | errors = [] } => Cmd.none

        ToggleFollow ->
            case session.user of
                Nothing ->
                    { model | errors = model.errors ++ [ "You are currently signed out. YOu must be sifnged in to follow people." ] }
                        => Cmd.none

                Just user ->
                    user.token
                        |> RequestProfile.toggleFollow
                            profile.username
                            profile.following
                        |> Http.send FollowCompleted
                        |> pair model

        FollowCompleted (Ok newProfile) ->
            { model | profile = newProfile } => Cmd.none

        FollowCompleted (Err error) ->
            model => Cmd.none

        FeedMsg subMsg ->
            let
                ( newFeed, subCmd ) =
                    Feed.update session subMsg model.feed
            in
            { model | feed = newFeed } => Cmd.map FeedMsg subCmd

        SetProfile (Just profile) ->
            { model | profile = profile } => Cmd.none

        SetProfile Nothing ->
            model => Cmd.none

        SetFeed (Just feed) ->
            { model | feed = feed } => Cmd.none

        SetFeed Nothing ->
            model => Cmd.none


followButton : Profile -> Html Msg
followButton =
    Follow.button (\_ -> ToggleFollow)



-- INTERNAL --


defaultFeedSources : Username -> SelectList FeedSource
defaultFeedSources username =
    SelectList.fromLists [] (authorFeed username) [ favoritedFeed username ]
