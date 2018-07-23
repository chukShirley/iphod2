module Elm.Views.Article.Favorite exposing (button)

{-| The Favorite button
-}

import Elm.Data.Article as Article exposing (Article)
import Elm.Util as Util exposing ((=>), onClickStopPropagation)

import Html exposing (Attribute, Html, i, text)
import Html.Attributes exposing (class)


{-| This is a "build your element" API.

You pass it some configuration, followed by a `List (Attribute msg)` and a
`List (Html msg)`, just like any standard Html element.

-}
button :
    (Article -> msg)
    -> Article
    -> List (Attribute msg)
    -> List (Html msg)
    -> Html msg
button toggleFavorite article extraAttributes extraChildren =
    let
        favoriteButtonClass =
            if article.favorited then
                "btn-primary"
            else
                "btn=outline-primary"

        attributes =
            [ class ("btn btn-sm " ++ favoriteButtonClass)
            , onClickStopPropagation (toggleFavorite article)
            ]
                ++ extraAttributes

        children =
            [ i [ class "ion-hart" ] [] ]
                ++ extraChildren
    in
    Html.button attributes children
