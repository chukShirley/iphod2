module Elm.Page.NotFound exposing (view)

import Elm.Data.Session as Session exposing (Session)
import Elm.Views.Assets as Assets
import Html exposing (Html, div, h1, img, main_, text)
import Html.Attributes exposing (alt, class, id, src, tabindex)

-- VIEW --

view : Session -> Html msg
view session =
  main_ [ id "content", class "container", tabindex -1 ]
      [ h1 [] [ text "Not Found" ]
      , div [ class "row" ]
          [ img [ Assets.src Assets.error, alt "giant laser walrus wreaking havoc"] [] ]
      ]
