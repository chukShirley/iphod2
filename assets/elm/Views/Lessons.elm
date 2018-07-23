module Elm.Views.Lessons exposing (..)

import Elm.Data.Lessons as Lessons exposing (Lesson, Verse)
import Html exposing (..)
import Html.Attributes exposing (..)
import Markdown


-- type alias Verse =
--     { id : String
--     , book : String
--     , chap : Int
--     , vs : Int
--     , html : String
--     }
--
-- type alias Lesson =
--     { title : String
--     , vss : List Verse
--     }


formattedVerses : List Verse -> Html msg
formattedVerses vss =
    let
        formattedVerse vs =
            Markdown.toHtml [] vs.html
    in
    div [ class "esv_text" ]
        (List.map formattedVerse vss)


formattedLessons : List Lesson -> Html msg
formattedLessons lessons =
    let
        formattedLesson l =
            div []
                [ text l.title, formattedVerses l.vss ]
    in
    div []
        (List.map formattedLesson lessons)
