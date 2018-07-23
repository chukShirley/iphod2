module Elm.Views.Article exposing (view, viewTimestamp)

{-| Viewina a preview of an individual article, excluding it's body
-}

import Elm.Data.Article as Article exposing (Article)
import Elm.Data.UserPhoto as UserPhoto exposing (UserPhoto)
import Elm.Views.Article.Favorite as Favorite
import Elm.Views.Author as Author
import Elm.Route as Route exposing (Route)
import Html exposing (..)
import Html.Attributes exposing (attribute, class, classList, href, id, placeholder, src)
import Date.Format


-- VIEWS --


{-| Some pages want to view just the timestamp, not the whole article
-}
viewTimestamp : Article -> Html msg
viewTimestamp article =
    span [ class "date" ] [ text (formattedTimestamp article) ]


view : (Article -> msg) -> Article -> Html msg
view toggleFavorite article =
    let
        author =
            article.author
    in
    div [ class "article-preview" ]
        [ div [ class "article-meta" ]
            [ a [ Route.href (Route.Profile author.username) ]
                [ img [ UserPhoto.src author.image ] [] ]
            , div [ class "info" ]
                [ Author.view author.username
                , span [ class "date" ] [ text (formattedTimestamp article) ]
                ]
            , Favorite.button
                toggleFavorite
                article
                [ class "pull-xs-right" ]
                [ text (" " ++ toString article.favoritesCount) ]
            ]
        , a [ class "preview-link", Route.href (Route.Article article.slug) ]
            [ h1 [] [ text article.title ]
            , p [] [ text article.description ]
            , span [] [ text "Read more..." ]
            ]
        ]



-- INTERNAL --


formattedTimestamp : Article -> String
formattedTimestamp article =
    Date.Format.format "%B %e, %Y" article.createdAt
