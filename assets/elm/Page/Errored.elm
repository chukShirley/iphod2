module Elm.Page.Errored exposing (PageLoadError, pageLoadError, view)

{-| The page that renders when there was an error trying to load another page,
for example a Page Not Found Error.

It includes a photo I took of a painting on a building in San Franscisco,
of a giant walrus exploging the golden Gare bridge with a laser beams. Pew pew!

-}

import Elm.Data.Session as Session exposing (Session)
import Html exposing (Html, div, h1, img, main_, p, text)
import Html.Attributes exposing (alt, class, id, tabindex)
import Elm.Views.Page as Page exposing (ActivePage)


-- MODEL --

type PageLoadError
  = PageLoadError Model


type alias Model =
  { activePage : ActivePage
  , errorMessage : String
  }


pageLoadError : ActivePage -> String -> PageLoadError
pageLoadError activePage errorMessage =
  PageLoadError { activePage = activePage, errorMessage = errorMessage }


-- VIEW --

view : Session -> PageLoadError -> Html msg
view session (PageLoadError model) =
  main_ [ id "content", class "container", tabindex -1 ]
    [ h1 [] [text "Error Loading Page"]
    , div [ class "row" ]
        [ p [] [ text model.errorMessage ] ]
    ]