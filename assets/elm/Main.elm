module Main exposing (main)

-- import Data.Psalm as Psalm exposing (..)

import Elm.Data.Article exposing (Slug)
import Elm.Data.Calendar as CalendarData exposing (..)
import Elm.Data.Article.Feed as Feed exposing (decoder)
import Elm.Data.Lessons as Lessons exposing (..)
import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User as User exposing (User, Username, usernameToString)
import Elm.Data.Profile as ProfileData exposing(Profile)
import Elm.Data.Error as Error exposing(Error)
import Elm.Page.About as About
import Elm.Page.Article as Article
import Elm.Page.Article.Editor as Editor
import Elm.Page.Calendar as CalendarPage
import Elm.Page.CommunionToSick as CommunionToSick exposing (..)
import Elm.Page.Compline as Compline
import Elm.Page.EP as EP
import Elm.Page.Errored as Errored exposing (PageLoadError)
import Elm.Page.Home as Home
import Elm.Page.Login as Login
import Elm.Page.MP as MP
import Elm.Page.Midday as Midday
import Elm.Page.Narthex as Narthex
import Elm.Page.NotFound as NotFound
import Elm.Page.Profile as Profile
import Elm.Page.Register as Register
import Elm.Page.Settings as Settings
import Elm.Views.Page as Page exposing (ActivePage)
import Elm.Ports as Ports
import Elm.Route as Route exposing (Route)
import Elm.Util as Util exposing ((=>))

import Navigation exposing (Location)
import Task
import Html exposing (..)
import Json.Decode as Decode exposing (Value)
import Json.Encode as Encode


-- WARNING: based on discussions around how asset management features
-- like code splitting and lazy loading have been shaping up, I expect
-- most of this file to become unnecessary in a future release of Elm.
-- Avoid putting things in here unless there is no alternative!


type Page
    = Blank
    | NotFound
    | Errored PageLoadError
    | Home Home.Model
    | Settings Settings.Model
    | Login Login.Model
    | Register Register.Model
    | Profile Username Profile.Model
    | Narthex Narthex.Model
    | Article Article.Model
    | Editor (Maybe Slug) Editor.Model
    | About About.Model
    | Calendar CalendarPage.Model
    | MP MP.Model
    | Midday Midday.Model
    | EP EP.Model
    | Compline Compline.Model
    | CommunionToSick CommunionToSick.Model


type PageState
    = Loaded Page
    | TransitioningFrom Page


-- MODEL


type alias Model =
    { session : Session
    , pageState : PageState
    , dailyLessons : DailyLessons
    , euLessons : EuLessons
    , calendar : CalendarData.Calendar
    , dbSyncing : Bool
    }


init : Value -> Location -> ( Model, Cmd Msg )
init val location =
    setRoute (Route.fromLocation location)
        { pageState = Loaded initialPage
        , session = { user = decodeUserFromJson val }
        , dailyLessons = Lessons.initDailyLessons
        , euLessons = Lessons.initEuLessons
        , calendar = CalendarData.initCalendar
        , dbSyncing = False
        }


decodeUserFromJson : Value -> Maybe User
decodeUserFromJson json =
    json
        |> Decode.decodeValue Decode.string
        |> Result.toMaybe
        |> Maybe.andThen (Decode.decodeString User.decoder >> Result.toMaybe)


initialPage : Page
initialPage =
    Blank



-- VIEW


view : Model -> Html Msg
view model =
    case model.pageState of
        Loaded page ->
            viewPage model.session False model.dbSyncing page

        TransitioningFrom page ->
            viewPage model.session True model.dbSyncing page


viewPage : Session -> Bool -> Bool -> Page -> Html Msg
viewPage session isLoading isSyncing page =
    let
        frame =
            Page.frame isLoading isSyncing session.user
    in
    case page of
        NotFound ->
            NotFound.view session
                |> frame Page.Other

        Blank ->
            -- this is for the very initialpage load, while we are loading
            -- data via HTTP. We could also render a spinner here
            Html.text ""
                |> frame Page.Other

        Errored subModel ->
            Errored.view session subModel
                |> frame Page.Other

        Settings subModel ->
            Settings.view session subModel
                |> frame Page.Other
                |> Html.map SettingsMsg

        Home subModel ->
            Home.view session subModel
                |> frame Page.Home
                |> Html.map HomeMsg

        Login subModel ->
            Login.view session subModel
                |> frame Page.Other
                |> Html.map LoginMsg

        Register subModel ->
            Register.view session subModel
                |> frame Page.Other
                |> Html.map RegisterMsg

        Profile username subModel ->
            Profile.view session subModel
                |> frame (Page.Profile username)
                |> Html.map ProfileMsg

        Article subModel ->
            Article.view session subModel
                |> frame Page.Other
                |> Html.map ArticleMsg

        Editor maybeSlug subModel ->
            let
                framePage =
                    if maybeSlug == Nothing then
                        Page.NewArticle
                    else
                        Page.Other
            in
            Editor.view subModel
                |> frame framePage
                |> Html.map EditorMsg

        About subModel ->
            About.view subModel
                |> frame Page.Other
                |> Html.map AboutMsg

        Narthex subModel ->
            Narthex.view subModel
                |> frame Page.Other
                |> Html.map NarthexMsg

        Calendar subModel ->
            CalendarPage.view subModel
                |> frame Page.Other
                |> Html.map CalendarMsg

        MP subModel ->
            MP.view subModel
                |> frame Page.Other
                |> Html.map MPMsg

        Midday subModel ->
            Midday.view subModel
                |> frame Page.Other
                |> Html.map MiddayMsg

        EP subModel ->
            EP.view subModel
                |> frame Page.Other
                |> Html.map EPMsg

        Compline subModel ->
            Compline.view subModel
                |> frame Page.Other
                |> Html.map ComplineMsg

        CommunionToSick subModel ->
            CommunionToSick.view subModel
                |> frame Page.Other
                |> Html.map CommunionToSickMsg


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ pageSubscriptions (getPage model.pageState)
        , Sub.map DbSync dbSync
        , Sub.map PortError portError
        , Sub.map RequestedCalendar requestedCalendar
        , Sub.map RequestedFeed requestedFeed
        , Sub.map RequestedLessons requestedLessons
        , Sub.map SetUser sessionChange
        ]


sessionChange : Sub (Maybe User)
sessionChange =
    Ports.onSessionChange (Decode.decodeValue User.decoder >> Result.toMaybe)

portError : Sub (Maybe Error)
portError =
    Ports.error (Decode.decodeValue Error.decoder >> Result.toMaybe)


requestedCalendar : Sub (Maybe Calendar)
requestedCalendar =
    Ports.requestedCalendar (Decode.decodeValue CalendarData.calendarDecoder >> Result.toMaybe)

requestedFeed : Sub (Maybe Feed.Feed)
requestedFeed =
    Ports.requestedFeed (Decode.decodeValue Feed.decoder >> Result.toMaybe)

requestedLessons : Sub (Maybe DailyLessons)
requestedLessons =
    Ports.requestedLessons (Decode.decodeValue Lessons.dailyLessonsDecoder >> Result.toMaybe)


dbSync : Sub (Maybe String)
dbSync =
    Ports.dbSync (Decode.decodeValue Decode.string >> Result.toMaybe)


getPage : PageState -> Page
getPage pageState =
    case pageState of
        Loaded page ->
            page

        TransitioningFrom page ->
            page


pageSubscriptions : Page -> Sub Msg
pageSubscriptions page =
    case page of
        Blank ->
            Sub.none

        Errored _ ->
            Sub.none

        NotFound ->
            Sub.none

        Settings arg ->
            Sub.map SettingsMsg (Settings.subscriptions arg)

        Home _ ->
            Sub.none

        Login arg ->
            Sub.map LoginMsg (Login.subscriptions arg)

        Register arg ->
            Sub.map RegisterMsg (Register.subscriptions arg)

        Profile _ arg ->
            Sub.map ProfileMsg (Profile.subscriptions arg)

        Article arg ->
            Sub.map ArticleMsg (Article.subscriptions arg)

        Editor _ _ ->
            Sub.none

        About _ ->
            Sub.none

        Narthex arg ->
            Sub.map NarthexMsg (Narthex.subscriptions arg)

        Calendar arg ->
            Sub.map CalendarMsg (CalendarPage.subscriptions arg)

        MP arg ->
            Sub.map MPMsg (MP.subscriptions arg)

        Midday arg ->
            Sub.map MiddayMsg (Midday.subscriptions arg)

        EP arg ->
            Sub.map EPMsg (EP.subscriptions arg)

        Compline arg ->
            Sub.map ComplineMsg (Compline.subscriptions arg)

        CommunionToSick arg ->
            Sub.map CommunionToSickMsg (CommunionToSick.subscriptions arg)



-- UPDATE


type Msg
    = SetRoute (Maybe Route)
    | HomeLoaded (Result PageLoadError Home.Model)
    | ArtileLoaded (Result PageLoadError Article.Model)
    | ProfileLoaded Username (Result PageLoadError Profile.Model)
    | EditArticleLoaded Slug (Result PageLoadError Editor.Model)
    | HomeMsg Home.Msg
    | SettingsMsg Settings.Msg
    | SetUser (Maybe User)
    | RequestedProfile (Maybe ProfileData.Profile)
    | RequestedLessons (Maybe DailyLessons)
    | LoginMsg Login.Msg
    | RegisterMsg Register.Msg
    | ProfileMsg Profile.Msg
    | ArticleMsg Article.Msg
    | EditorMsg Editor.Msg
    | AboutMsg About.Msg
    | NarthexMsg Narthex.Msg
    | CalendarMsg CalendarPage.Msg
    | MPLoaded (Result PageLoadError MP.Model)
    | MPMsg MP.Msg
    | MiddayMsg Midday.Msg
    | EPMsg EP.Msg
    | ComplineMsg Compline.Msg
    | CommunionToSickMsg CommunionToSick.Msg
    | GetDailyLessons String
    | GetCalendar String
    | DbSync (Maybe String)
    | RequestedCalendar (Maybe Calendar)
    | RequestedFeed (Maybe Feed.Feed)
    | PortError (Maybe Error)


setRoute : Maybe Route -> Model -> ( Model, Cmd Msg )
setRoute maybeRoute model =
    let
        transition toMsg task =
            { model | pageState = TransitioningFrom (getPage model.pageState) }
                => Task.attempt toMsg task

        errored =
            pageErrored model
    in
    case maybeRoute of
        Nothing ->
            { model | pageState = Loaded NotFound } => Cmd.none

        Just Route.NewArticle ->
            case model.session.user of
                Just user ->
                    { model | pageState = Loaded (Editor Nothing Editor.initNew) } => Cmd.none

                Nothing ->
                    errored Page.NewArticle "You must be signed in t post an article."

        Just (Route.EditArticle slug) ->
            case model.session.user of
                Just user ->
                    transition (EditArticleLoaded slug) (Editor.initEdit model.session slug)

                Nothing ->
                    errored Page.Other "You must be signed in to edit an article."

        Just Route.Settings ->
            case model.session.user of
                Just user ->
                    { model | pageState = Loaded (Settings (Settings.init user)) } => Cmd.none

                Nothing ->
                    errored Page.Settings "You must be signed in to access  your settings."

        Just Route.Home ->
            model => Ports.requestFeed model.session.user "global" 20 0
            -- transition HomeLoaded (Home.init model.session)

        -- { model | pageState = Loaded (Home (Home.init model.session)) } => Cmd.none
        Just Route.Login ->
            { model | pageState = Loaded (Login Login.initialModel) } => Cmd.none

        Just Route.Logout ->
            let
                session =
                    model.session
            in
            { model | session = { session | user = Nothing } }
                => Cmd.batch
                    [ Ports.storeSession (Just "{}")
                    , Route.modifyUrl Route.Home
                    ]

        Just Route.Register ->
            { model | pageState = Loaded (Register Register.initialModel) } => Cmd.none

        Just (Route.Profile username) ->
            model => Ports.profileRequest username username 
            -- transition (ProfileLoaded username) (Profile.init model.session username)

        Just (Route.Article slug) ->
            transition ArtileLoaded (Article.init model.session slug)

        Just Route.About ->
            { model | pageState = Loaded (About About.init) } => Cmd.none

        Just Route.Narthex ->
            { model | pageState = Loaded (Narthex Narthex.init) } => Cmd.none

        Just Route.Calendar ->
            model => Ports.requestCalendar

        Just Route.MP ->
            model => Ports.requestLessons "mp"

        Just Route.EP ->
            model => Ports.requestLessons "ep"

        Just Route.Midday ->
            { model | pageState = Loaded (Midday Midday.init) } => Cmd.none

        Just Route.Compline ->
            { model | pageState = Loaded (Compline Compline.init) } => Cmd.none

        Just Route.CommunionToSick ->
            { model | pageState = Loaded (CommunionToSick CommunionToSick.initModel) } => Cmd.none


pageErrored : Model -> ActivePage -> String -> ( Model, Cmd msg )
pageErrored model activePage errorMessage =
    let
        error =
            Errored.pageLoadError activePage errorMessage
    in
    { model | pageState = Loaded (Errored error) } => Cmd.none


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    updatePage (getPage model.pageState) msg model


updatePage : Page -> Msg -> Model -> ( Model, Cmd Msg )
updatePage page msg model =
    let
        session =
            model.session

        toPage toModel toMsg subUpdate subMsg subModel =
            let
                ( newModel, newCmd ) =
                    subUpdate subMsg subModel
            in
            ( { model | pageState = Loaded (toModel newModel) }, Cmd.map toMsg newCmd )

        errored =
            pageErrored model

    in
    case ( msg, page ) of
        ( SetRoute route, _ ) ->
            setRoute route model

        ( HomeLoaded (Ok subModel), _ ) ->
            { model | pageState = Loaded (Home subModel) } => Cmd.none

        ( HomeLoaded (Err error), _ ) ->
            { model | pageState = Loaded (Errored error) } => Cmd.none

        ( ProfileLoaded username (Ok subModel), _ ) ->
            { model | pageState = Loaded (Profile username subModel) } => Cmd.none

        ( ProfileLoaded username (Err error), _ ) ->
            { model | pageState = Loaded (Errored error) } => Cmd.none

        ( ArtileLoaded (Ok subModel), _ ) ->
            { model | pageState = Loaded (Article subModel) } => Cmd.none

        ( ArtileLoaded (Err error), _ ) ->
            { model | pageState = Loaded (Errored error) } => Cmd.none

        ( EditArticleLoaded slug (Ok subModel), _ ) ->
            { model | pageState = Loaded (Editor (Just slug) subModel) } => Cmd.none

        ( EditArticleLoaded slug (Err error), _ ) ->
            { model | pageState = Loaded (Errored error) } => Cmd.none

        --        ( MPLoaded (Ok subModel), _ ) ->
        --            { model | pageState = Loaded (MP subModel) } => Cmd.none
        --
        --        ( MPLoaded (Err error), _ ) ->
        --            { model | pageState = Loaded (Errored error) } => Cmd.none
        ( SetUser user, _ ) ->
            let
                session =
                    model.session

                cmd =
                    -- If we just signed out, then redirect to Home.
                    if session.user /= Nothing && user == Nothing then
                        Route.modifyUrl Route.Home
                    else
                        Cmd.none
            in
            { model | session = { session | user = user } }
                => cmd

        ( SettingsMsg subMsg, Settings subModel ) ->
            let
                ( ( pageModel, cmd ), msgFromPage ) =
                    Settings.update model.session subMsg subModel

                newModel =
                    case msgFromPage of
                        Settings.NoOp ->
                            model

                        Settings.SetUser user ->
                            let
                                session =
                                    model.session
                            in
                            { model | session = { user = Just user } }
            in
            { newModel | pageState = Loaded (Settings pageModel) }
                => Cmd.map SettingsMsg cmd

        ( LoginMsg subMsg, Login subModel ) ->
            let
                ( ( pageModel, cmd ), msgFromPage ) =
                    Login.update subMsg subModel

                newModel =
                    case msgFromPage of
                        Login.NoOp ->
                            model

                        Login.SetUser user ->
                            let
                                session =
                                    model.session
                            in
                            { model | session = { user = Just user } }
            in
            { newModel | pageState = Loaded (Login pageModel) }
                => Cmd.map LoginMsg cmd

        ( RegisterMsg subMsg, Register subModel ) ->
            let
                ( ( pageModel, cmd ), msgFromPage ) =
                    Register.update subMsg subModel

                newModel =
                    case msgFromPage of
                        Register.NoOp ->
                            model

                        Register.SetUser user ->
                            let
                                session =
                                    model.session
                            in
                            { model | session = { user = Just user } }
            in
            { newModel | pageState = Loaded (Register pageModel) }
                => Cmd.map RegisterMsg cmd

        ( HomeMsg subMsg, Home subModel ) ->
            toPage Home HomeMsg (Home.update session) subMsg subModel

        ( ProfileMsg subMsg, Profile username subModel ) ->
            toPage (Profile username) ProfileMsg (Profile.update model.session) subMsg subModel

        ( ArticleMsg subMsg, Article subModel ) ->
            toPage Article ArticleMsg (Article.update model.session) subMsg subModel

        ( EditorMsg subMsg, Editor slug subModel ) ->
            case model.session.user of
                Nothing ->
                    if slug == Nothing then
                        errored Page.NewArticle
                            "You must be signed in to post articles"
                    else
                        errored Page.Other
                            "You must be signed in to edit articles."

                Just user ->
                    toPage (Editor slug) EditorMsg (Editor.update user) subMsg subModel

        ( MPMsg subMsg, MP subModel ) ->
            toPage MP MPMsg MP.update subMsg subModel

        ( MiddayMsg subMsg, Midday subModel ) ->
            toPage Midday MiddayMsg Midday.update subMsg subModel

        ( EPMsg subMsg, EP subModel ) ->
            toPage EP EPMsg EP.update subMsg subModel

        ( ComplineMsg subMsg, Compline subModel ) ->
            toPage Compline ComplineMsg Compline.update subMsg subModel

        ( CommunionToSickMsg subMsg, CommunionToSick subModel ) ->
            toPage CommunionToSick CommunionToSickMsg CommunionToSick.update subMsg subModel

        ( CalendarMsg subMsg, Calendar subModel ) ->
            toPage Calendar CalendarMsg CalendarPage.update subMsg subModel

        ( GetCalendar _, _ ) ->
            model => Ports.requestCalendar

        ( GetDailyLessons mpep, _ ) ->
            model => Ports.requestLessons mpep

        ( DbSync (Just resp), _ ) ->
            let
                dbSyncing =
                    resp == "busy"
            in
            { model | dbSyncing = dbSyncing } => Cmd.none

        ( RequestedFeed (Just feed), _) ->
            { model | pageState = Loaded (Home (Home.init model.session feed)) } => Cmd.none

        (RequestedFeed Nothing, arg) ->
            let
                _ =
                    Debug.log "ELM REQUEST FEED FAIL:" arg
            in
            model => Cmd.none

        ( RequestedProfile (Just resp), _) ->
            -- let
            --     newModel = if session.user /= Nothing then
            --         { model | pageState = Loaded (Profile session.user.username (Profile.init resp)) }
            --     else
            --         model
            -- in
            model => Cmd.none

        (RequestedProfile Nothing, _) ->
            model => Cmd.none

        ( RequestedLessons (Just resp), _ ) ->
            if resp.office == "ep" then
                { model | pageState = Loaded (EP (EP.initEP resp)) } => Cmd.none
            else
                { model | pageState = Loaded (MP (MP.initMP resp)) } => Cmd.none

        -- { model | psalms = resp } => Cmd.none
        ( RequestedLessons Nothing, arg ) ->
            model => Cmd.none

        ( RequestedCalendar (Just resp), _ ) ->
            { model | pageState = Loaded (Calendar (CalendarPage.initCal resp)) } => Cmd.none

        ( PortError (Just msg), _ ) ->
            -- do simething smart here
            let
                _ = Debug.log "PORT ERROR:" msg
            in
            model => Cmd.none


        ( arg, NotFound ) ->
            -- Disregard incoming messages when we're on the
            -- NotFound page.
            let
                _ =
                    Debug.log "ELM UPDATE FAIL NOT FOUND:" arg
            in
                    
            model => Cmd.none

        ( arg1, arg2 ) ->
            -- Disregard incoming messages that arrived for the wrong page
            let
                _ =
                    Debug.log "ELM UPDATE FAIL NO MATCEHS:" (arg1, arg2)
            in
                    
            model => Cmd.none



-- MAIN --


main : Program Value Model Msg
main =
    Navigation.programWithFlags (Route.fromLocation >> SetRoute)
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }
