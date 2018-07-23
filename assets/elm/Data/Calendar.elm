module Elm.Data.Calendar exposing (..)

import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline exposing (decode, hardcoded, optional, required)


type alias PsalmRef =
    { ps : Int
    , vsFrom : Int
    , vsTo : Int
    }


initPsalmRef : PsalmRef
initPsalmRef =
    { ps = 0
    , vsFrom = 0
    , vsTo = 0
    }


type alias Mpep =
    { id : String
    , title : String
    , ep1 : String
    , ep2 : String
    , mp1 : String
    , mp2 : String
    }


initMpep : Mpep
initMpep =
    { id = ""
    , title = ""
    , mp1 = ""
    , mp2 = ""
    , ep1 = ""
    , ep2 = ""
    }


type alias EuReading =
    { style : String
    , ref : String
    }


initEuReading : EuReading
initEuReading =
    { style = ""
    , ref = ""
    }


type alias Eu =
    { id : String
    , title : String
    , colors : List String
    , ot : List EuReading
    , ps : List EuReading
    , nt : List EuReading
    , gs : List EuReading
    }


initEu : Eu
initEu =
    { id = ""
    , title = ""
    , colors = []
    , ot = []
    , ps = []
    , nt = []
    , gs = []
    }


type alias Day =
    { year : String
    , month : String
    , date : String -- day of month
    , day : String -- day of week
    , mppss : List PsalmRef -- MP psalms
    , eppss : List PsalmRef -- EP Psalms
    , mpep : Mpep
    , eu : Eu
    , reflection : String
    }


initDay : Day
initDay =
    { year = ""
    , month = ""
    , date = "" -- day of month
    , day = "" -- day of week
    , mppss = [] -- MP psalms
    , eppss = [] -- EP Psalms
    , mpep = initMpep
    , eu = initEu
    , reflection = ""
    }


type alias Week =
    { days : List Day
    }


type alias Calendar =
    { weeks : List Week
    , month : String
    , year : String
    }


initCalendar : Calendar
initCalendar =
    { weeks = []
    , month = ""
    , year = ""
    }



-- MONTH DECODER --


calendarDecoder : Decoder Calendar
calendarDecoder =
    decode Calendar
        |> required "weeks" (Decode.list weekDecoder)
        |> required "month" Decode.string
        |> required "year" Decode.string


weekDecoder : Decoder Week
weekDecoder =
    decode Week
        |> required "days" (Decode.list dayDecoder)


dayDecoder : Decoder Day
dayDecoder =
    decode Day
        |> required "year" Decode.string
        |> required "month" Decode.string
        |> required "date" Decode.string
        |> required "day" Decode.string
        |> required "mppss" (Decode.list psalmRefDecoder)
        |> required "eppss" (Decode.list psalmRefDecoder)
        |> required "mpep" mpepDecoder
        |> required "eu" euDecoder
        |> hardcoded "Nothing Today"


psalmRefDecoder : Decoder PsalmRef
psalmRefDecoder =
    decode PsalmRef
        |> required "ps" Decode.int
        |> required "vsFrom" Decode.int
        |> required "vsTo" Decode.int


mpepDecoder : Decoder Mpep
mpepDecoder =
    decode Mpep
        |> required "_id" Decode.string
        |> optional "title" Decode.string ""
        |> required "mp1" Decode.string
        |> required "mp2" Decode.string
        |> required "ep1" Decode.string
        |> required "ep2" Decode.string


euDecoder : Decoder Eu
euDecoder =
    decode Eu
        |> required "_id" Decode.string
        |> required "title" Decode.string
        |> required "colors" (Decode.list Decode.string)
        |> required "ot" (Decode.list euReadingDecoder)
        |> required "ps" (Decode.list euReadingDecoder)
        |> required "nt" (Decode.list euReadingDecoder)
        |> required "gs" (Decode.list euReadingDecoder)


euReadingDecoder : Decoder EuReading
euReadingDecoder =
    decode EuReading
        |> required "style" Decode.string
        |> required "read" Decode.string



-- it's a reference
