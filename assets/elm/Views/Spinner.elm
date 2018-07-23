module Elm.Views.Spinner exposing (spinner, syncing)

import Elm.Util as Util exposing ((=>))

import Html exposing (Attribute, Html, div, li, text)
import Html.Attributes exposing (class, style)


spinner : Html msg
spinner =
    li [ class "sk-three-bounce", style [ "float" => "left", "margin" => "8px" ] ]
        [ div [ class "sk-child sk-bounce1" ] []
        , div [ class "sk-child sk-bounce2" ] []
        , div [ class "sk-child sk-bounce3" ] []
        ]


syncing : Html msg
syncing =
    div [ class "blinky" ] [ text "Syncing DB" ]
