module Elm.Page.Office.Format exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Regex exposing (regex, replace)


hideable : Bool -> List ( String, String ) -> Attribute msg
hideable show attr =
    if show then
        style attr
    else
        style [ ( "display", "none" ) ]


agnus_dei : String -> Html msg
agnus_dei str =
    p [ class "agnus-dei" ] [ text str ]


agnus_dei_resp : String -> Html msg
agnus_dei_resp str =
    p [ class "agnus-dei-resp" ] [ text str ]


altReadings : List String -> Html msg
altReadings list =
    let
        reading ref =
            li
                [ class "alt_readings-select"
                , attribute "data-ref" (toDataRef ref)
                ]
                [ text ref ]
    in
    ul [ class "alt_readings-options" ] (List.map reading list)


altReadingText : String -> String -> Html msg
altReadingText ref str =
    p [ class "comp_scripture this_alt_reading", id (toDataRef ref) ]
        [ text str
        , span [ class "s_ref" ] [ text ref ]
        ]


antiphon : ( String, String ) -> Html msg
antiphon ( season, str ) =
    p []
        [ span [ class "italic" ] [ text season ]
        , br [] []
        , text str
        ]


bibleRef : String -> Html msg
bibleRef str =
    p [ class "bible_ref" ] [ text str ]


bibleText : String -> String -> Html msg
bibleText vss ref =
    p [ class "office" ]
        [ text vss
        , span [ class "bible_ref" ] [ text ref ]
        ]


canticle : String -> String -> Html msg
canticle title name =
    p [ class "canticle" ]
        [ span [ class "canticle-title" ] [ text title ]
        , span [ class "canticle-name" ] [ text name ]
        ]


centerItalic : String -> Html msg
centerItalic str =
    p [ class "italic", style [ ( "text-align", "center" ) ] ] [ text str ]


emptyLine : Html msg
emptyLine =
    br [] []


italic : String -> Html msg
italic str =
    p [ class "italic" ] [ text str ]


justText : String -> Html msg
justText s =
    p [ class "office" ] [ text s ]


mpepAdditionalDirectives : Bool -> Html msg
mpepAdditionalDirectives show =
    if show then
        div []
            [ pbSection "Additional Directives: Morning and Evening Prayer"
            , justText
                """
          The Confession and Apostles’ Creed may be omitted, provided each is said at least once during the
          course of the day
        """
            , justText
                """
          The Gloria Patri in the opening versicles may be said in unison. The following form of the Gloria
          Patri may alternately be used:
        """
            , pbVsIndent "Glory to the Father, and to the Son, and to the Holy Spirit:"
            , pbVsIndent "As it was in the beginning, is now, and will be forever. Amen."
            , justText
                """
          The Officiant and People may join in saying “Alleluia” (except in Lent) as an alternative to the
          versicles “Praise the Lord. The Lord’s name be praised.”
        """
            , justText "If an offering is to be received, it is appropriate to do so during the hymn or anthem following the collects"
            , justText
                """
          A sermon may be preached after the lessons, after the hymn or anthem following the collects, or
          after the conclusion of the Office.
        """
            ]
    else
        div [] []


complineAdditionalDirectives : Bool -> Html msg
complineAdditionalDirectives show =
    if show then
        div []
            [ h3 [] [ text "Additional Directives" ] -- toggle this
            , justText """
            For those saying Compline every day, particularly in families or other communities, additional short
            Scriptural readings may be desired. Some appropriate readings include:
            """
            , pbVsIndent "Isaiah 26:3-4"
            , pbVsIndent "Isaiah 30:15a"
            , pbVsIndent "Matthew 6:31-34"
            , pbVsIndent "2 Corinthians 4:6"
            , pbVsIndent "1 Thessalonians 5:9-10"
            , pbVsIndent "1 Thessalonians 5:23"
            , pbVsIndent "Ephesians 4:26-27"
            , justText """
            If desired, either version of the Lord’s Prayer may conclude with the phrase, “deliver us from evil,”
            omitting the doxology.
            """
            ]
    else
        div [] []


middayDirectives : Bool -> Html msg
middayDirectives show =
    if show then
        div []
            [ h3 [] [ text "Additional Directives" ] -- toggle this
            , justText
                """
          If desired, either version of the Lord’s Prayer may conclude with the phrase, “deliver us from evil,”
          omitting the doxology.
        """
            ]
    else
        div [] []


openingSentence : ( String, String, String ) -> Html msg
openingSentence ( season, str, ref ) =
    p []
        [ span [ class "italic" ] [ text season ]
        , br [] []
        , text str
        , br [] []
        , span [ class "italic" ] [ text ref ]
        ]


orThis : Html msg
orThis =
    p [ class "alt_confession rubric" ] [ text "or this" ]


pbVs : String -> Html msg
pbVs s =
    p [ class "pb_vs" ] [ text s ]


pbVss : List String -> Html msg
pbVss strings =
    div [] (List.map pbVs strings)


pbVsIndent : String -> Html msg
pbVsIndent s =
    p [ class "pb_vs_indent" ] [ text s ]


reference : String -> Html msg
reference s =
    p [ class "bible_ref" ] [ text s ]


rubric : String -> Html msg
rubric s =
    p [ class "i dark-red" ] [ text s ]


rubricWithText : ( String, String ) -> Html msg
rubricWithText ( rubric, str ) =
    p []
        [ span [ class "i dark-red" ] [ text rubric ]
        , span [ class "office" ] [ text str ]
        ]


rubricBlack : String -> Html msg
rubricBlack s =
    p [ class "i black" ] [ text s ]


rubricOffice : String -> Html msg
rubricOffice s =
    p [ class "rubric-office" ] [ text s ]


rubricNewline : String -> Html msg
rubricNewline s =
    p [ class "rubric-newline" ] [ text s ]


pbSection : String -> Html msg
pbSection s =
    p [ class "section" ] [ text s ]


theWordOfTheLord : Html msg
theWordOfTheLord =
    div []
        [ versicals
            [ ( " ", "The Word of the Lord" )
            , ( "People", "Thanks be to God" )
            ]
        ]


theLordBeWithYou : Html msg
theLordBeWithYou =
    div []
        [ versicals
            [ ( "Officiant", "The Lord be with you." )
            , ( "People", "And with your spirit." )
            , ( "officiant", "Let us pray." )
            ]
        ]


title1 : String -> Html msg
title1 s =
    p [ class "title1" ] [ text s ]


title2 : String -> Html msg
title2 s =
    p [ class "title2" ] [ text s ]


title2Italic : String -> Html msg
title2Italic s =
    p [ class "title2 italic" ] [ text s ]


versical : String -> String -> Html msg
versical speaker says =
    li []
        [ span [ class "versical-speaker" ] [ text speaker ]
        , span [ class "versical-speaker-says" ] [ text says ]
        ]


versicals : List ( String, String ) -> Html msg
versicals vx =
    let
        listVersicals ( speaker, says ) =
            versical speaker says
    in
    ul [ class "versicals" ] (List.map listVersicals vx)


withAmen : String -> Html msg
withAmen s =
    p [ class "office" ]
        [ text s
        , span [ class "italic" ] [ text "Amen." ]
        ]


wordOfTheLord : Html msg
wordOfTheLord =
    versicals
        [ ( "", "The Word of the Lord." )
        , ( "People", "Thanks be to God" )
        ]



-- INTERNAL --


toDataRef : String -> String
toDataRef str =
    replace Regex.All (regex "[\\s\\:\\.\\,\\-]") (\_ -> "_") str



-- replace All (regex "[aeiou]") (\_ -> "")
