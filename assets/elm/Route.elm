module Elm.Route exposing (Route(..), fromLocation, href, modifyUrl)

import Elm.Data.Article as Article
import Elm.Data.User as User exposing (Username)

import Html exposing (Attribute)
import Html.Attributes as Attr
import Navigation exposing (Location)
import UrlParser as Url exposing ((</>), Parser, oneOf, parseHash, s, string)


-- ROUTING


type Route
    = Home
    | About
    | Login
    | Logout
    | Register
    | Settings
    | Narthex
    | Article Article.Slug
    | Profile Username
    | NewArticle
    | EditArticle Article.Slug
    | Calendar
    | MP
    | EP
    | Midday
    | Compline
    | CommunionToSick


route : Parser (Route -> a) a
route =
    oneOf
        [ Url.map Home (s "")
        , Url.map Login (s "login")
        , Url.map Logout (s "logout")
        , Url.map About (s "about")
        , Url.map Settings (s "settings")
        , Url.map Profile (s "profile" </> User.usernameParser)
        , Url.map Register (s "register")
        , Url.map Narthex (s "narthex")
        , Url.map Article (s "article" </> Article.slugParser)
        , Url.map NewArticle (s "editor")
        , Url.map EditArticle (s "editor" </> Article.slugParser)
        , Url.map Calendar (s "calendar")
        , Url.map MP (s "mp")
        , Url.map Midday (s "midday")
        , Url.map EP (s "ep")
        , Url.map Compline (s "compline")
        , Url.map CommunionToSick (s "communionToSick")

        -- is this how more complex routes work?
        -- , UrlParser.map MorningPrayerPsTxt (UrlParser.s "mp" </> string </> string)
        ]



-- INTERNAL


routeToString : Route -> String
routeToString page =
    let
        pieces =
            case page of
                Home ->
                    []

                Login ->
                    [ "login" ]

                Logout ->
                    [ "logout" ]

                Register ->
                    [ "register" ]

                Settings ->
                    [ "settings" ]

                Narthex ->
                    [ "narthex" ]

                Article slug ->
                    [ "article", Article.slugToString slug ]

                Profile username ->
                    [ "profile", User.usernameToString username ]

                NewArticle ->
                    [ "editor" ]

                EditArticle slug ->
                    [ "editor", Article.slugToString slug ]

                About ->
                    []

                Calendar ->
                    [ "calendar" ]

                MP ->
                    [ "mp" ]

                Midday ->
                    [ "midday" ]

                EP ->
                    [ "ep" ]

                Compline ->
                    [ "compline" ]

                CommunionToSick ->
                    [ "communionToSick" ]
    in
    "#/" ++ String.join "/" pieces



-- PUBLIC HELPERS --


href : Route -> Attribute msg
href route =
    Attr.href (routeToString route)


modifyUrl : Route -> Cmd msg
modifyUrl =
    routeToString >> Navigation.modifyUrl


fromLocation : Location -> Maybe Route
fromLocation location =
    if String.isEmpty location.hash then
        Just Home
    else
        parseHash route location



-- locFor : Location -> Msg
-- locFor location =
--   parseHash route location |> GoTo
