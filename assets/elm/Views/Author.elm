module Elm.Views.Author exposing (view)

{-| View an author. We basically render their username and a link to their profile, ant that's it
-}


import Elm.Data.User as User exposing (Username)
import Elm.Route as Route exposing (Route)
import Html exposing (Html, a)
import Html.Attributes exposing (attribute, class, href, id, placeholder)


view : Username -> Html msg
view username =
  a [ class "author", Route.href (Route.Profile username) ]
    [ User.usernameToHtml username]