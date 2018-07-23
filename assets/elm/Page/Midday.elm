module Elm.Page.Midday exposing (Model, Msg, init, subscriptions, update, view)

-- import Html.Attributes exposing (class, style)
-- import Elm.Util as Util exposing ((=>))

import Elm.Data.Psalm as Psalm exposing (Psalm)
import Elm.Page.Office.Format as Format exposing (..)
import Elm.Page.Office.Prayers exposing (gloria, lordsPrayerTraditional, mercy3)
import Elm.Views.Psalm exposing (formattedPsalms)
import Elm.Ports as Ports exposing (requestPsalms, requestedPsalms)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (Value)


-- MODEL --


type alias Toggle =
    { lordsPrayerTrad : Bool
    , directives : Bool
    }


initToggle : Toggle
initToggle =
    { lordsPrayerTrad = True
    , directives = False
    }


type alias Model =
    { errors : List String
    , thisOption : String
    , psalms : List Psalm
    , toggle : Toggle
    }


init : Model
init =
    { errors = []
    , thisOption = ""
    , psalms = []
    , toggle = initToggle
    }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map SetPsalm psalmChange
        ]


psalmChange : Sub (Maybe (List Psalm))
psalmChange =
    Ports.requestedPsalms (Decode.decodeValue Psalm.decoder >> Result.toMaybe)



-- UPDATE --


type Msg
    = NoOp
    | GetPsalm Int Int Int
    | SetPsalm (Maybe (List Psalm))
    | MoreOptions
    | LordsPrayerTrad
    | AdditionalDirectives


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        SetPsalm (Just psalms) ->
            ( { model | psalms = psalms }, Cmd.none )

        SetPsalm Maybe.Nothing ->
            let
                _ =
                    Debug.log "COULDNT GET PSALMS" ""
            in
            ( model, Cmd.none )

        GetPsalm ps vsFrom vsTo ->
            ( model, Ports.requestPsalms [ ( ps, vsFrom, vsTo ) ] )

        MoreOptions ->
            let
                _ =
                    Debug.log "MORE OPTIONS CLICKED" "Midday"
            in
            ( model, Cmd.none )

        LordsPrayerTrad ->
            let
                toggle =
                    model.toggle

                newToggle =
                    { toggle | lordsPrayerTrad = not toggle.lordsPrayerTrad }
            in
            ( { model | toggle = newToggle }, Cmd.none )

        AdditionalDirectives ->
            let
                toggle =
                    model.toggle

                newToggle =
                    { toggle | directives = not toggle.directives }
            in
            ( { model | toggle = newToggle }, Cmd.none )


view : Model -> Html Msg
view model =
    div [ class "z-0"]
        [ div [ class "" ]
            [ p [ class "h4" ] [ text "Midday" ] -- put a real header here
            , p [] [ text model.thisOption ]
            , versicals
                [ ( "Officiant", "O God, make speed to save us." )
                , ( "People", "O Lord, make haste to help us." )
                , ( "Officiant", "Glory be to the Father, and to the Son, and to the Holy Spirit;" )
                , ( "People", "as it was in the beginning, is now, and ever shall be, world without end. Amen." )
                ]
            , rubricWithText ( "Except in Lent, add", "Alleluia." )
            , rubric "A suitable hymn may be sung."
            , rubric
                """
          One or more of the following Psalms is sung or said. Other suitable selections include Psalms 19, 67, one or more sections of Psalm
          119, or a selection from Psalms 120 through 133."
        """
            , ul [ class "pick-psalm" ]
                [ psalmButton 119 105 112 "119"
                , psalmButton 121 1 8 "121"
                , psalmButton 124 1 6 "124"
                , psalmButton 126 1 7 "126"
                , li [] [ button [ class "iphod" ] [ text "Others" ] ]
                ]
            , formattedPsalms model.psalms
            , rubric "At the end of the Psalms is sung or said"
            , gloria
            , rubric "One of the following, or some other suitable passage of Scripture, is read"
            , bibleText
                """
          Jesus said, “Now is the judgment of this world; now will the ruler of this world be cast out. And I,
          when I am lifted up from the earth, will draw all people to myself.”
        """
                "John 12:31-32"
            , bibleText
                """
          If anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come. All
          this is from God, who through Christ reconciled us to himself and gave us the ministry of
          reconciliation.
        """
                "2 Corinthians 5:17-18"
            , bibleText
                """
          From the rising of the sun to its setting my Name will be great among the nations, and in every place
          incense will be offered to my Name, and a pure offering. For my Name will be great among the
          nations, says the Lord of Hosts.
        """
                "Malachi 1:11 "
            , rubric "At the end of the reading is said"
            , wordOfTheLord
            , rubric "A meditation, silent or spoken, may follow."
            , rubric "The Officiant then begins the Prayers"
            , versicals
                [ ( "Officiant", "I will bless the Lord at all times." )
                , ( "People", "His praise shall continually be in my mouth." )
                ]
            , mercy3
            , ul [ class "pick-psalm" ]
                [ li [] [ button [ class "iphod", onClick LordsPrayerTrad ] [ text "Lord's Prayer" ] ]
                , li [] [ button [ class "iphod", onClick AdditionalDirectives ] [ text "Additional Directives" ] ]
                ]
            , middayDirectives model.toggle.directives
            , lordsPrayerTraditional model.toggle.lordsPrayerTrad
            , versicals
                [ ( "Officiant", "O Lord, hear our prayer;" )
                , ( "People", "And let our cry come to you." )
                , ( "Officiant", "Let us pray. " )
                ]
            , rubric "The Officiant then says one or more of the following Collects. Other appropriate Collects may also be used."
            , withAmen
                """
          Blessed Savior, at this hour you hung upon the cross, stretching out your loving arms: Grant that all
          the peoples of the earth may look to you and be saved; for your tender mercies’ sake. Amen.
          Almighty Savior, who at mid-day called your servant Saint Paul to be an apostle to the Gentiles: We
          pray you to illumine the world with the radiance of your glory, that all nations may come and
          worship you; for you live and reign with the Father and the Holy Spirit, one God, for ever and ever.
        """
            , withAmen
                """
          Father of all mercies, you revealed your boundless compassion to your apostle Saint Peter in a threefold
          vision: Forgive our unbelief, we pray, and so strengthen our hearts and enkindle our zeal, that
          we may fervently desire the salvation of all people, and diligently labor in the extension of your
          kingdom; through him who gave himself for the life of the world, your Son our Savior Jesus Christ.
        """
            , withAmen
                """
          Pour your grace into our hearts, O Lord, that we who have known the incarnation of your Son Jesus
          Christ, announced by an angel to the Virgin Mary, may by his cross and passion be brought to the
          glory of his resurrection; who lives and reigns with you, in the unity of the Holy Spirit, one God,
          now and for ever.
        """
            , rubric "Silence may be kept, and other intercessions and thanksgivings may be offered."
            , versicals
                [ ( "Officiant", "Let us bless the Lord." )
                , ( "People", "Thanks be to God. " )
                ]
            , rubric "From Easter Day through the Day of Pentecost “Alleluia, alleluia” may be added to the preceding versicle and response."
            , rubric "The Officiant may conclude with this, or one of the other Concluding Sentences from Morning and Evening Prayer."
            , withAmen
                """
          The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the Holy Spirit, be
          with us all evermore.
        """
            , reference "2 Corinthians 13:14"
            , button [ class "iphod", onClick AdditionalDirectives ] [ text "Additional Directives" ]
            , middayDirectives model.toggle.directives
            ]
        ]



-- HELPERS --


psalmButton : Int -> Int -> Int -> String -> Html Msg
psalmButton ps vsFrom vsTo str =
    li []
        [ button [ class "iphod", onClick (GetPsalm ps vsFrom vsTo) ] [ text str ]
        ]
