module Elm.Views.Psalm exposing (..)

import Elm.Data.Psalm exposing (Psalm, Vs)
import Html exposing (..)
import Html.Attributes exposing (..)


formattedPsalms : List Psalm -> Html msg
formattedPsalms pss =
    div [] (List.map formattedPsalm pss)


formattedPsalm : Psalm -> Html msg
formattedPsalm ps =
    div [ class "esv_text" ]
        [ div [ id ps.id ]
            [ h3 []
                [ text ps.name
                , span [ class "ps_title" ] [ text ps.title ]
                ]
            , div [] (List.map versify ps.vss)
            ]
        ]


versify : Vs -> Html msg
versify vs =
    div []
        [ ul [ class "psalm" ]
            [ li [ class "ps_num" ] [ sup [] [ text vs.vs ] ]
            , li [ class "ps_first" ] [ text vs.first ]
            , li [ class "star" ] [ text "*" ]
            ]
        , ul [ class "psalm" ]
            [ li [ class "ps_second" ] [ text vs.second ] ]
        ]
