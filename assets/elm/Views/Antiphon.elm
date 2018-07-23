module Elm.Views.Antiphon exposing (..)

import Elm.Page.Office.Format as Format exposing (..)
import Html exposing (..)


seasonalAntiphon : String -> String -> Html msg
seasonalAntiphon office season =
    case ( office, season ) of
        ( "mp", "advent" ) ->
            Format.antiphon ( "Advent", "Our King and Savior now draws near: * O come, let us adore him." )

        ( "mp", "christmas" ) ->
            Format.antiphon ( "Christmas", "Alleluia, to us a child is born: * O come, let us adore him. Alleluia." )

        ( "mp", "epiphany" ) ->
            Format.antiphon ( "Epiphany, and the Feast of the Transfiguration", "The Lord has shown forth his glory: * O come, let us adore him." )

        ( "mp", "presentation" ) ->
            Format.antiphon ( "Presentation and Annunciation", "The Word was made flesh and dwelt among us: * O come, let us adore him." )

        ( "mp", "annunciation" ) ->
            Format.antiphon ( "Presentation and Annunciation", "The Word was made flesh and dwelt among us: * O come, let us adore him." )

        ( "mp", "lent" ) ->
            Format.antiphon ( "Lent", "The Lord is full of compassion and mercy: * O come, let us adore him." )

        ( "mp", "easter" ) ->
            Format.antiphon ( "Easter until Ascension", "Alleluia. The Lord is risen indeed: * O come, let us adore him. Alleluia." )

        ( "mp", "ascension" ) ->
            Format.antiphon ( "Ascension until Pentecost", "Alleluia. Christ the Lord has ascended into heaven: * O come, let us adore him. Alleluia" )

        ( "mp", "pentecost" ) ->
            Format.antiphon ( "Day of Pentecost", "Alleluia. The Spirit of the Lord renews the face of the earth: * O come, let us adore him. Alleluia." )

        ( "mp", "trinity" ) ->
            Format.antiphon ( "Trinity Sunday", "Father, Son, and Holy Spirit, one God: * O come, let us adore him." )

        ( "mp", "rld" ) ->
            Format.antiphon ( "All Saints and other major saints’ days", "The Lord is glorious in his saints: * O come, let us adore him." )

        ( "mp", _ ) ->
            Format.antiphon ( "For use at any time", "The earth is the Lord's for he made it: * O come let us adore him." )

        ( _, _ ) ->
            Format.antiphon ( "", "" )


antiphons : String -> String -> Html msg
antiphons office season =
    case office of
        "mp" ->
            div []
                [ seasonalAntiphon office season
                , orThis
                , justText "Worship the Lord in the beauty of holiness: * O come let us adore him."
                , orThis
                , justText "The mercy of the Lord is everlasting: * O come let us adore him."
                ]

        "ep" ->
            div []
                [ seasonalAntiphon office season
                ]

        _ ->
            div [] []
