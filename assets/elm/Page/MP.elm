module Elm.Page.MP exposing (Model, Msg, init, initMP, subscriptions, update, view)

-- COB 2018 MP
-- import Date exposing (..)
-- import Html.Attributes exposing (class, style)
-- import Elm.Util as Util exposing ((=>))
-- import Page.Errored as Errored exposing (PageLoadError, pageLoadError)
-- import Page.Errored as Errored exposing (PageLoadError, pageLoadError)

import Elm.Data.Lessons as Lessons exposing (DailyLessons, dailyLessonsDecoder, initDailyLessons)
import Elm.Page.Office.Format as Format exposing (..)
import Elm.Page.Office.Prayers as Prayers
    exposing
        ( apostlesCreed
        , benedictisEsDomine
        , benedictus
        , chrysostom
        , confession
        , generalThanksgiving
        , gloria
        , invitatory
        , jubilate
        , lentVeniteAddOn
        , lordsPrayerModern
        , lordsPrayerTrad
        , mercy3
        , paschaNostrum
        , teDeum
        , venite
        )
import Elm.Views.Antiphon exposing (antiphons)
import Elm.Views.Collects exposing (collects, mpCollectOfDay)
import Elm.Views.Lessons exposing (formattedLessons)
import Elm.Views.OpeningSentences exposing (mpOpeningSentences)
import Elm.Views.Psalm exposing (formattedPsalms)
import Elm.Ports as Ports exposing (requestLessons, requestedLessons)

import Task exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (Value)
import Time exposing (..)


-- import Markdown
-- MODEL --


type alias Toggle =
    { tradionalLordsPrayer : Bool
    , teDeum : Bool
    , directions : Bool
    , options : Bool
    }


initToggle : Toggle
initToggle =
    { tradionalLordsPrayer = True
    , teDeum = True
    , directions = False
    , options = False
    }


type alias Model =
    { errors : List String
    , thisOption : String
    , toggle : Toggle
    , lessons : DailyLessons
    , time : Time
    }


initNew : Model
initNew =
    { errors = []
    , thisOption = ""
    , toggle = initToggle
    , lessons = initDailyLessons
    , time = 0
    }


fetchLessons : Model -> ( Model, Cmd Msg )
fetchLessons model =
    model ! [ Ports.requestLessons "mp" ]


initMP : DailyLessons -> Model
initMP lessons =
    let
        model =
            initNew
    in
    { model | lessons = lessons }


init : ( Model, Cmd Msg )
init =
    let
        newModel =
            initNew
    in
    update FetchLessons newModel


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map SetLessons lessonsChange
        ]


lessonsChange : Sub (Maybe DailyLessons)
lessonsChange =
    Ports.requestedLessons (Decode.decodeValue dailyLessonsDecoder >> Result.toMaybe)



-- UPDATE --


type Msg
    = NoOp
    | FetchLessons
    | SetLessons (Maybe DailyLessons)
    | MoreOptions
    | RequestTime
    | UpdateTime Time
    | ShowDirections


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        FetchLessons ->
            ( model, Ports.requestLessons "mp" )

        SetLessons (Just lessons) ->
            ( { model | lessons = lessons }, Cmd.none )

        SetLessons Maybe.Nothing ->
            ( model, Cmd.none )

        MoreOptions ->
            let
                toggle =
                    model.toggle

                newToggle =
                    { toggle | options = not toggle.options }

                newModel =
                    { model | toggle = newToggle }
            in
            ( newModel, Cmd.none )

        RequestTime ->
            ( model, Task.perform UpdateTime Time.now )

        UpdateTime time ->
            ( { model | time = time }, Cmd.none )

        ShowDirections ->
            let
                toggle =
                    model.toggle

                newToggle =
                    { toggle | directions = not toggle.directions }

                newModel =
                    { model | toggle = newToggle }
            in
            ( newModel, Cmd.none )



-- _ -> (model, Cmd.none)
-- VIEW --


view : Model -> Html Msg
view model =
    div []
        [ button [ class "more-options", onClick MoreOptions ] [ text "Options" ]
        , emptyLine
        , div [ class "" ]
            [ p [ class "" ] [ text "Daily Morning Prayer" ] -- put a real header here
            , p [] [ text model.thisOption ]
            , p [] [ text ("Time: " ++ toString model.time) ]
            , mpOpeningSentences model.lessons.season
            , confession
            , invitatory
            , rubric "Alternative forms of the “Glory be” and “Praise the Lord” are found in Additional Directions."
            , rubric "Then follows the Venite. Alternatively, the Jubilate may be used."
            , rubric "These antiphons may be sung or said before and after the Invitatory Psalm."
            , antiphons "mp" model.lessons.season

            --            , orThis
            --            , justText "Worship the Lord in the beauty of holiness: * O come let us adore him."
            --            , orThis
            --            , justText "The mercy of the Lord is everlasting: * O come let us adore him."
            , venite
            , rubric "In Lent, and on other penitential occasions, the following verses are added."
            , lentVeniteAddOn
            , orThis
            , jubilate
            , rubric "During the first week of Easter, the Pascha Nostrum is used in place of the Invitatory Psalm and may be used throughout Eastertide."
            , paschaNostrum
            , rubric "Then follows"
            , pbSection "The Psalm or Psalms Appointed"
            , formattedPsalms model.lessons.psalms
            , rubric "At the end of the Psalms is sung or said"
            , gloria
            , pbSection "The Lessons"
            , rubric "One or more lessons, as appointed, are read, the Reader first saying"
            , formattedLessons model.lessons.lesson1
            , formattedLessons model.lessons.lesson2
            , rubric "A citation giving chapter and verse may be added."
            , rubric "After each lesson the Reader may say"
            , wordOfTheLord
            , rubric "Or the Reader may say"
            , versical "" "Here ends the Reading."
            , rubric
                """
          The following Canticles are normally sung or said after each of the lessons. The Officiant may also use a Canticle drawn from the
          “Supplemental Canticles” or an appropriate song of praise.
        """
            , teDeum
            , rubric "During Lent the Benedictus es, Domine usually replaces the Te Deum and may be used at other times."
            , benedictisEsDomine
            , benedictus
            , pbSection "The Apostles’ Creed"
            , rubric "Officiant and People together, all standing"
            , apostlesCreed
            , pbSection "The Prayers"
            , theLordBeWithYou
            , rubric "The People kneel or stand."
            , mercy3
            , rubric "Officiant and People"
            , lordsPrayerTrad
            , rubric "or" -- ADD A TOGGLE
            , lordsPrayerModern
            , versicals
                [ ( "Officiant", "O Lord, show your mercy upon us;" )
                , ( "People", "And grant us your salvation." )
                , ( "Officiant", "O Lord, guide those who govern us;" )
                , ( "People", "And lead us in the way of justice and truth." )
                , ( "Officiant", "Clothe your ministers with righteousness;" )
                , ( "People", "And let your people sing with joy." )
                , ( "Officiant", "O Lord, save your people;" )
                , ( "People", "And bless your inheritance." )
                , ( "Officiant", "Give peace in our time, O Lord;" )
                , ( "People", "And defend us by your mighty power." )
                , ( "Officiant", "Let not the needy, O Lord, be forgotten;" )
                , ( "People", "Nor the hope of the poor be taken away." )
                , ( "Officiant", "Create in us clean hearts, O God;" )
                , ( "People", "And take not your Holy Spirit from us." )
                ]
            , rubric
                """
          The Officiant then prays one or more of the following collects, always beginning with the Collect of the Day (the prayer of the previous Sunday
          or of the Holy Day being observed). It is traditional to pray the Collects for Peace and Grace daily. Alternatively, one may pray the collects on
          a weekly rotation, using the suggestions in parentheses.
        """
            , justText "COLLECT OF WEEK GOES HERE"
            , collects model.lessons.collects.texts
            , justText "COLLECT OF DAY GOES HERE"
            , mpCollectOfDay model.lessons.dayOfWeek
            , rubric "The Officiant may invite the People to offer intercessions and thanksgivings."
            , rubric "A hymn or anthem may be sung."
            , rubric "Before the close of the Office one or both of the following prayers may be used."
            , generalThanksgiving
            , chrysostom
            , versicals
                [ ( "Officiant", "Let us bless the Lord." )
                , ( "People", "Thanks be to God." )
                ]
            , rubric "From Easter Day through the Day of Pentecost “Alleluia, alleluia” may be added to the preceding versicle and response."
            , rubric "The Officiant says one of these concluding sentences (and the People may be invited to join)"
            , withAmen
                """
          The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit, be
          with us all evermore.
        """
            , reference "2 Corinthians 13:14"
            , withAmen
                """
          May the God of hope fill us with all joy and peace in believing through the power of the Holy Spirit.
        """
            , reference "Romans 15:13"
            , withAmen
                """
          Glory to God whose power, working in us, can do infinitely more than we can ask or imagine: Glory
          to him from generation to generation in the Church, and in Christ Jesus forever and ever.
        """
            , reference "Ephesians 3:20-21"
            , button [ class "more-options", onClick ShowDirections ] [ text "Additional Directions" ]
            , mpepAdditionalDirectives model.toggle.directions
            ]
        ]
