module Elm.Views.Page exposing (ActivePage(..), bodyId, frame)

{-| The frams around a typical page - that is, the header and footer
-}

import Elm.Data.User as User exposing (User, Username)
import Elm.Data.UserPhoto as UserPhoto exposing (UserPhoto)
import Elm.Views.Spinner as ViewsSpinner exposing (spinner, syncing)
import Elm.Route as Route exposing (Route)
import Elm.Util as Util exposing ((=>))
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Lazy exposing (lazy2)
-- import Tachyons exposing(classes)
-- import Tachyons.Classes as Tachyon exposing (..)


{-| Deteremins which navbar link (if any) will be rendered as active.

Note that we don't enumerate every page here, becausse the navbar doesn't
have links for every page. Anything tha's not part of the navbar falls
under Other.

-}
type ActivePage
    = Other
    | Home
    | Login
    | Register
    | Settings
    | Profile Username
    | NewArticle
    | Calendar
    | MP
    | EP
    | Midday
    | Compline
    | CommunionToSick


{-| Take a page's Html and frame it with a header and footer.

The caller provides the current user, so we can display in either
"signed in" (rendering username) or "signed out" mode.

isLoading si for determing whether we should show a loading spinner
in the header. (this comes up during slow page transitions.)

-}
frame : Bool -> Bool -> Maybe User -> ActivePage -> Html msg -> Html msg
frame isLoading isSyncing user page content =
    let
        _ =
            Debug.log "FRAME: " (isLoading, isSyncing, page)
    in
            

    div [ class "page-frame" ]
        [ viewHeader page user isLoading isSyncing
        , Util.viewIf isSyncing syncing
        , content
        , viewFooter
        ]


viewHeader : ActivePage -> Maybe User -> Bool -> Bool -> Html msg
viewHeader page user isLoading isSyncing =
    nav [ class "" ]
        [ div [ class "" ]
            [ a [ class "", Route.href Route.Home ]
                [ text "Legereme" ]
            , button [ id "navButton", class "h2 pb5 bn"] [ text "\x2630" ]
            , ul [ id "navMenu", class "dn list w-100 z-5 absolute bg-near-white" ] <|
                    lazy2 Util.viewIf isLoading ViewsSpinner.spinner
                        :: navbarLink page Route.Home [ text "The Door" ]
                        :: viewSignIn page user
            ]



            -- , ul [ class "" ] <|
            --     lazy2 Util.viewIf isLoading ViewsSpinner.spinner
            --         :: div [ class "h2" ] [text "\x2630"]
            --         :: div [ class "child absolute" ] [navbarLink page Route.Home [ text "HOME" ]]
            --         :: viewSignIn page user
            -- ]
        ]


viewSignIn : ActivePage -> Maybe User -> List (Html msg)
viewSignIn page user =
    let
        linkTo =
            navbarLink page
    in
    case user of
        Nothing ->
            [ linkTo Route.Login [ text "Sign in" ]
            , linkTo Route.Register [ text "Sign up" ]
            , linkTo Route.Narthex [ text "Narthex" ]
            , linkTo Route.Calendar [ text "Calendar" ]
            , linkTo Route.MP [ text "Morning Prayer" ]
            , linkTo Route.Midday [ text "Midday" ]
            , linkTo Route.EP [ text "Evening Prayer" ]
            , linkTo Route.Compline [ text "Compline" ]
            , linkTo Route.CommunionToSick [ text "Communion to Sick" ]
            ]

        Just user ->
            [ linkTo Route.NewArticle [ Html.i [ class "" ] [], text " New Post" ]
            , linkTo Route.Settings [ Html.i [ class "" ] [], text " Settings" ]
            , linkTo
                (Route.Profile user.username)
                [ img [ class "", UserPhoto.src user.image ] []
                , User.usernameToHtml user.username
                ]
            , linkTo Route.Narthex [ text "Narthex" ]
            , linkTo Route.Calendar [ text "Calendar" ]
            , linkTo Route.MP [ text "Morning Prayer" ]
            , linkTo Route.Midday [ text "Midday" ]
            , linkTo Route.EP [ text "Evening Prayer" ]
            , linkTo Route.Compline [ text "Compline" ]
            , linkTo Route.CommunionToSick [ text "Communion to Sick" ]
            , linkTo Route.Logout [ text "Sign out" ]
            ]


viewFooter : Html msg
viewFooter =
    footer []
        [ div [ class "content-center" ]
            [ a [ class "", href "/" ] [ text "Legereme " ]
            , span [ class "" ] [ text "Prayers and Offices from ACNA" ]
            , p [] [ text "Code & design licensed under MIT." ]
            ]
        ]


navbarLink : ActivePage -> Route -> List (Html msg) -> Html msg
navbarLink page route linkContent =
    li [ classList [ ("dark-blue", True ), ( "dark-red", isActive page route ) ] ]
        [ a [ class "pageLink bg_light_gray mb4", Route.href route ] linkContent ]
        


isActive : ActivePage -> Route -> Bool
isActive page route =
    case ( page, route ) of
        ( Home, Route.Home ) ->
            True

        ( Login, Route.Login ) ->
            True

        ( Register, Route.Register ) ->
            True

        ( Settings, Route.Settings ) ->
            True

        ( Profile pageUsername, Route.Profile routeUsername ) ->
            True

        ( NewArticle, Route.NewArticle ) ->
            True

        ( Calendar, Route.Calendar ) ->
            True

        ( MP, Route.MP ) ->
            True

        ( EP, Route.EP ) ->
            True

        ( Midday, Route.Midday ) ->
            True

        ( Compline, Route.Compline ) ->
            True

        ( CommunionToSick, Route.CommunionToSick ) ->
            True

        _ ->
            False


{-| This id comes from index.html.

The Feed uses it to scroll to the top of the page (by ID) when switching pages
in the pagination sense.

-}
bodyId : String
bodyId =
    "page-body"
