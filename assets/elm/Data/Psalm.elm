module Elm.Data.Psalm exposing (Psalm, Vs, decoder, initPsalm, initVs)

-- import Html exposing (Html)

import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline exposing (decode, hardcoded, optional, required)
import Task


-- import Elm.Util as Util exposing ((=>))


type alias Vs =
    { vs : String
    , title : String
    , first : String
    , second : String
    }


initVs : Vs
initVs =
    { vs = ""
    , title = ""
    , first = ""
    , second = ""
    }


type alias Psalm =
    { id : String
    , rev : String
    , name : String
    , title : String
    , show : Bool
    , vss : List Vs
    }


initPsalm : Psalm
initPsalm =
    { id = ""
    , rev = ""
    , name = ""
    , title = ""
    , show = True
    , vss = []
    }


type alias Psalms =
    List Psalm



-- SERIALIZATION --


decoder : Decoder (List Psalm)
decoder =
    Decode.list psalmDecoder


psalmDecoder : Decoder Psalm
psalmDecoder =
    decode Psalm
        |> required "_id" Decode.string
        |> required "_rev" Decode.string
        |> required "name" Decode.string
        |> required "title" Decode.string
        |> hardcoded True
        |> required "vss" (Decode.list vsDecoder)


vsDecoder : Decoder Vs
vsDecoder =
    decode Vs
        |> required "vs" Decode.string
        |> optional "title" Decode.string ""
        |> required "first" Decode.string
        |> required "second" Decode.string



-- fake : String
-- fake =
--   """{ "id":"bcp23"
--       , "rev":"2-b9f412d5a41b2ac6c15ee149beaff0f8"
--       , "name":"Psalm 23."
--       , "title":"Dominus regit me"
--       , "formatted":"<div id='Psalm_23' class='esv_text'><span style='position: relative; top: 1em;'><button class='translationButton'>Hide</button><button class='translationButton'>Coverdale</button><button class='translationButton'>BCP</button><select><option value='ESV'>ESV</option><option value='cus'>cus</option><option value='cns'>cns</option><option value='web'>web</option></select><input placeholder='Alt Reading' autofocus=' name='altReading'></span><div><div id='Psalm_23'> <h3>Psalm 23.<span class='ps_title'>Dominus regit me</span></h3><br> <p><span class='ps_first'><sup class='verse-num'>1</sup>The Lord is my shepherd; *</span><br><span class='ps_second'>I shall not be in want.</span></p><p><span class='ps_first'><sup class='verse-num'>2</sup>He makes me lie down in green pastures *</span><br><span class='ps_second'>and leads me beside still waters.</span></p><p><span class='ps_first'><sup class='verse-num'>3</sup>He revives my soul *</span><br><span class='ps_second'>and guides me along right pathways for his Name’s sake.</span></p><p><span class='ps_first'><sup class='verse-num'>4</sup>Though I walk through the valley of the shadow of death, I shall fear no evil; *</span><br><span class='ps_second'>for you are with me; your rod and your staff, they comfort me.</span></p><p><span class='ps_first'><sup class='verse-num'>5</sup>You spread a table before me in the presence of those who trouble me; *</span><br><span class='ps_second'>you have anointed my head with oil, and my cup is running over.</span></p><p><span class='ps_first'><sup class='verse-num'>6</sup>Surely your goodness and mercy shall follow me all the days of my life, *</span><br><span class='ps_second'>and I will dwell in the house of the Lord for ever.</span></p></div></div></div>"
--       , "show":true
--       }"""
--
-- loadPsalm : String -> Cmd msg
-- loadPsalm _ =
--   Decode.decodeString decoder fake
