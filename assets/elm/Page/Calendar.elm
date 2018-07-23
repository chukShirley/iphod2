module Elm.Page.Calendar exposing (Model, Msg, init, initCal, subscriptions, update, view)

import Elm.Data.Calendar as CalendarData exposing (..)
import Elm.Ports as Ports exposing (requestCalendar, requestedCalendar)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (Value)


-- import Html.Attributes exposing (class, style)
-- import Elm.Util as Util exposing ((=>))
-- import Markdown
-- MODEL --


type alias Toggle =
    { toggleA : Bool
    , toggleB : Bool
    }


initToggle : Toggle
initToggle =
    { toggleA = False
    , toggleB = False
    }


type alias Model =
    { errors : List String
    , thisOption : String
    , cal : CalendarData.Calendar
    , toggle : Toggle
    }


type alias Week =
    { days : List CalendarData.Day
    }


initWeek : Week
initWeek =
    { days = [] }


type alias Weeks =
    { weeks : List Week
    }


initCal : CalendarData.Calendar -> Model
initCal cal =
    let
        model =
            init
    in
    { model | cal = cal }


init : Model
init =
    { errors = []
    , thisOption = ""
    , cal = CalendarData.initCalendar
    , toggle = initToggle
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map SetCalendar calendarChange
        ]


calendarChange : Sub (Maybe CalendarData.Calendar)
calendarChange =
    Ports.requestedCalendar (Decode.decodeValue CalendarData.calendarDecoder >> Result.toMaybe)



-- UPDATE --


type NextCalendar
    = NextMonth
    | LastMonth


type Msg
    = NoOp
    | GetCalendar NextCalendar
    | SetCalendar (Maybe CalendarData.Calendar)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        GetCalendar NextMonth ->
            ( model, Cmd.none )

        GetCalendar LastMonth ->
            ( model, Cmd.none )

        SetCalendar (Just cal) ->
            let
                newModel =
                    { model | cal = cal }
            in
            ( newModel, Cmd.none )

        SetCalendar Maybe.Nothing ->
            ( model, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ text "Calendar goes here"
        , table [ id "calendar" ]
            ([ tr []
                [ th [ class "cal_move_month" ] [ text "<" ]
                , th [ colspan 5 ] [ text (model.cal.month ++ " " ++ model.cal.year) ]
                , th [ class "cal_move_month" ] [ text ">" ]
                ]
             , tr []
                [ th [] [ text "Sun" ]
                , th [] [ text "Mon" ]
                , th [] [ text "Tue" ]
                , th [] [ text "Wed" ]
                , th [] [ text "Thu" ]
                , th [] [ text "Fri" ]
                , th [] [ text "Sat" ]
                ]
             ]
                ++ showWeeks model.cal.weeks
            )
        ]



-- HELPERS


showWeeks : List CalendarData.Week -> List (Html Msg)
showWeeks weeks =
    let
        rowsOfWeeks wk =
            tr [] (showWeek wk)
    in
    List.map rowsOfWeeks weeks


showWeek : CalendarData.Week -> List (Html Msg)
showWeek week =
    let
        rowOfDays day =
            td []
                [ div [ class "td-top" ]
                    [ p [ class (dayClass day) ] [ text day.date ]
                    , dayTitle day
                    ]
                ]
    in
    List.map rowOfDays week.days


dayClass : CalendarData.Day -> String
dayClass day =
    let
        color =
            day.eu.colors |> List.head |> Maybe.withDefault "green"
    in
    "day_of_month day_" ++ color


dayTitle : CalendarData.Day -> Html Msg
dayTitle day =
    let
        title =
            case day.day of
                "Sunday" ->
                    day.eu.title

                _ ->
                    day.mpep.title
    in
    p [ class "day-title" ] [ text title ]
