module Elm.Page.EP exposing (Model, Msg, init, initEP, subscriptions, update, view)

-- COB 2018 EP

import Elm.Data.Lessons as Lessons exposing (DailyLessons, dailyLessonsDecoder, initDailyLessons)
import Elm.Views.Collects exposing (collects, epCollectOfDay)
import Elm.Views.Lessons exposing (formattedLessons)
import Elm.Views.OpeningSentences exposing (epDaysOfThanksgiving, epOpeningSentences)
import Elm.Views.Psalm exposing (formattedPsalms)
import Elm.Page.Office.Format as Format exposing (..)
import Elm.Page.Office.Prayers
    exposing
        ( apostlesCreed
        , chrysostom
        , confession
        , generalThanksgiving
        , gloria
        , invitatory
        , lordsPrayerModern
        , lordsPrayerTrad
        , magnificat
        , mercy3
        , nuncDimittis
        , phosHilaron
        )
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (Value)
import Elm.Ports as Ports exposing (requestLessons, requestedLessons)
import Task exposing (..)
import Time exposing (..)


-- MODEL --


type alias Toggle =
    { tradionalLordsPrayer : Bool
    , teDeum : Bool
    , directions : Bool
    }


initToggle : Toggle
initToggle =
    { tradionalLordsPrayer = True
    , teDeum = True
    , directions = False
    }


type alias Model =
    { errors : List String
    , thisOption : String
    , toggle : Toggle
    , lessons : DailyLessons
    , time : Time
    , showDirections : Bool
    , daysOfThanksgiving : Bool
    }


initNew : Model
initNew =
    { errors = []
    , thisOption = ""
    , toggle = initToggle
    , lessons = initDailyLessons
    , time = 0
    , showDirections = False
    , daysOfThanksgiving = False
    }


fetchLessons : Model -> ( Model, Cmd Msg )
fetchLessons model =
    model ! [ Ports.requestLessons "ep" ]


initEP : DailyLessons -> Model
initEP lessons =
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
    | DaysOfThanksgiving


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        FetchLessons ->
            ( model, Ports.requestLessons "ep" )

        SetLessons (Just lessons) ->
            ( { model | lessons = lessons }, Cmd.none )

        SetLessons Maybe.Nothing ->
            ( model, Cmd.none )

        MoreOptions ->
            ( model, Cmd.none )

        RequestTime ->
            ( model, Task.perform UpdateTime Time.now )

        UpdateTime time ->
            ( { model | time = time }, Cmd.none )

        ShowDirections ->
            ( { model | showDirections = not model.showDirections }, Cmd.none )

        DaysOfThanksgiving ->
            ( { model | daysOfThanksgiving = not model.daysOfThanksgiving }, Cmd.none )



-- VIEW --
-- view : Session -> Model -> Html Msg
-- view session model =
--   div []
--       [ text "MORNING PRAYER GOES HERE"]


view : Model -> Html Msg
view model =
    div []
        [ button [ class "iphod more-options", onClick MoreOptions ] [ text "Options" ]
        , emptyLine
        , div [ class "mpep" ]
            [ p [ class "midday" ] [ text "Daily Evening Prayer" ] -- put a real header here
            , p [] [ text model.thisOption ]
            , p [] [ text model.lessons.dateString ]
            , epOpeningSentences model.lessons.season
            , button [ class "iphod", onClick DaysOfThanksgiving ] [ text "Days of Thanksgiving" ]
            , if model.daysOfThanksgiving then
                epDaysOfThanksgiving
              else
                div [] []
            , confession
            , invitatory
            , rubric "Alternative forms of the “Glory be” and “Praise the Lord” are found in Additional Directions."
            , rubric "The following or some other suitable hymn or Psalm may be sung or said"
            , phosHilaron
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
            , rubric """
                    The following Canticles are normally sung or said after each of the lessons.
                    The Officiant may also use a Canticle drawn from the
                    “Supplemental Canticles” or an appropriate song of praise.
                """
            , magnificat
            , phosHilaron
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
            , rubric "or this"
            , justText "That this evening may be holy, good, and peaceful,"
            , italic "We entreat you, O Lord."
            , justText "That your holy angels may lead us in paths of peace and goodwill,"
            , italic "We entreat you, O Lord."
            , justText "That we may be pardoned and forgiven for our sins and offenses,"
            , italic "We entreat you, O Lord."
            , justText "That there may be peace in your Church and in the whole world,"
            , italic "We entreat you, O Lord."
            , justText """That we may depart this life in your faith and fear,
                        and not be condemned before the great judgment
                        seat of Christ,"""
            , italic "We entreat you, O Lord."
            , justText """That we may be bound together by your Holy Spirit in the communion
                    of [________ and] all your
                    saints, entrusting one another and all our life to Christ,"""
            , rubric """
                    The Officiant then prays one or more of the following collects, always beginning with the
                    Collect of the Day (the prayer of the previous Sunday or of the Holy Day being observed).
                    It is traditional to pray the Collects for Peace and Aid against Perils daily. Alternatively,
                    one may pray the collects on a weekly rotation, using the suggestions in parentheses.
                """
            , justText "COLLECT OF WEEK GOES HERE"
            , collects model.lessons.collects.texts
            , justText "COLLECT OF DAY GOES HERE"
            , epCollectOfDay model.lessons.dayOfWeek
            , rubric "The Officiant may invite the People to offer intercessions and thanksgivings."
            , rubric "A hymn or anthem may be sung."
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
            , button [ class "iphod", onClick ShowDirections ] [ text "Additional Directions" ]
            , mpepAdditionalDirectives model.showDirections
            ]
        ]
