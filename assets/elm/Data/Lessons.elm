module Elm.Data.Lessons exposing (..)

import Elm.Data.Psalm as Psalm exposing (Psalm, Vs, decoder)
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline exposing (decode, hardcoded, required)


type alias Verse =
    { id : String
    , book : String
    , chap : Int
    , vs : Int
    , html : String
    }


initVerse : Verse
initVerse =
    { id = ""
    , book = ""
    , chap = 0
    , vs = 0
    , html = ""
    }


type alias Collects =
    { id : String
    , title : String
    , texts : List String
    , preface : String
    }


initCollects : Collects
initCollects =
    { id = ""
    , title = ""
    , texts = []
    , preface = ""
    }


type alias Lesson =
    { title : String
    , vss : List Verse
    }


initLesson : Lesson
initLesson =
    { title = ""
    , vss = []
    }


type alias DailyLessons =
    { office : String
    , season : String
    , dateString : String
    , dayOfWeek : Int
    , lesson1 : List Lesson
    , lesson2 : List Lesson
    , psalms : List Psalm
    , collects : Collects
    }


initDailyLessons : DailyLessons
initDailyLessons =
    { office = ""
    , season = ""
    , dateString = ""
    , dayOfWeek = 0 -- 0 is Sunday
    , lesson1 = []
    , lesson2 = []
    , psalms = []
    , collects = initCollects
    }


type alias EuLessons =
    { title : String
    , dateString : String
    , ot : List Lesson
    , ps : List Psalm
    , nt : List Lesson
    , gs : List Lesson
    }


initEuLessons : EuLessons
initEuLessons =
    { title = ""
    , dateString = ""
    , ot = []
    , ps = []
    , nt = []
    , gs = []
    }



-- DAILY DECODER --


dailyLessonsDecoder : Decoder DailyLessons
dailyLessonsDecoder =
    decode DailyLessons
        |> required "office" Decode.string
        |> required "season" Decode.string
        |> required "date" Decode.string
        |> required "dayOfWeek" Decode.int
        |> required "lesson1" (Decode.list lessonDecoder)
        |> required "lesson2" (Decode.list lessonDecoder)
        |> required "psalms" Psalm.decoder
        |> required "collects" collectDecoder


lessonDecoder : Decoder Lesson
lessonDecoder =
    decode Lesson
        |> required "title" Decode.string
        |> required "vss" (Decode.list verseDecoder)


verseDecoder : Decoder Verse
verseDecoder =
    decode Verse
        |> required "_id" Decode.string
        |> required "book" Decode.string
        |> required "chap" Decode.int
        |> required "vs" Decode.int
        |> required "vss" Decode.string


collectDecoder : Decoder Collects
collectDecoder =
    decode Collects
        |> required "_id" Decode.string
        |> required "title" Decode.string
        |> required "text" (Decode.list Decode.string)
        |> required "preface" Decode.string
