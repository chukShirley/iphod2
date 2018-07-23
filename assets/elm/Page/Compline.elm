module Elm.Page.Compline exposing (Model, Msg, init, subscriptions, update, view)

-- import Html.Attributes exposing (class, style)
-- import Elm.Util as Util exposing ((=>))

import Elm.Data.Psalm as Psalm exposing (Psalm)
import Elm.Page.Office.Format as Format exposing (..)
import Elm.Page.Office.Prayers exposing (gloria, lordsPrayerModern, lordsPrayerTrad, mercy3)
import Elm.Views.Psalm exposing (formattedPsalms)
import Elm.Ports as Ports exposing (requestPsalms, requestedPsalms)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (Value)


-- MODEL --


type alias Model =
    { errors : List String
    , thisOption : String
    , directions : Bool
    , psalms : List Psalm
    }


init : Model
init =
    { errors = []
    , thisOption = ""
    , directions = False
    , psalms = []
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
    | ShowDirections


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        GetPsalm ps vsFrom vsTo ->
            ( model, Ports.requestPsalms [ ( ps, vsFrom, vsTo ) ] )

        SetPsalm (Just psalms) ->
            ( { model | psalms = psalms }, Cmd.none )

        SetPsalm Maybe.Nothing ->
            let
                _ =
                    Debug.log "COULDNT GET PSALMS" ""
            in
            ( model, Cmd.none )

        MoreOptions ->
            ( model, Cmd.none )

        ShowDirections ->
            ( { model | directions = not model.directions }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ button [ class "more-options", onClick MoreOptions ] [ text "Options" ]
        , emptyLine
        , div [ class "mpep" ]
            [ p [ class "midday" ] [ text "Compline" ] -- put a real header here
            , p [] [ text model.thisOption ]
            , rubric "The Officient begins"
            , versicals
                [ ( "", "Our Help is in the Name of the Lord" )
                , ( "People", "The maker of heaven and earth" )
                ]
            , rubric "The Officiant continues"
            , justText "Let us humbly confess our sins to Almighty God."
            , rubric "Silence may be kept. The Officiant and People then say"
            , pbVss
                [ "Almighty God and Father, we confess to you,"
                , "to one another, and to the whole company of heaven,"
                , "that we have sinned, through our own fault,"
                , "in thought, and word, and deed,"
                , "and in what we have left undone."
                , "For the sake of your Son our Lord Jesus Christ,"
                , "have mercy upon us, forgive us all our sins,"
                , "and by the power of your Holy Spirit"
                , "raise us up to serve you in newness of life,"
                , "to the glory of your Name. Amen."
                ]
            , rubric "The Officiant alone says"
            , justText "May Almighty God grant us forgiveness of our sins,"
            , withAmen "and the grace and comfort of his Holy Spirit. "
            , versicals
                [ ( "Officiant", "O God, make speed to save us" )
                , ( "People", "O Lord, make haste to help us." )
                , ( "Officiant", "Glory be to the Father, and to the Son, and to the Holy Spirit;" )
                , ( "People", "as it was in the beginning, is now, and ever shall be, world without end. Amen." )
                ]
            , rubricWithText ( "Except in Lent, add", "Alleluia" )
            , rubric """
        One or more of the following Psalms are sung or said.
        Traditionally three are used: 4, 91, and 134.
        Other suitable selections from the Psalms may be substituted.
        """

            -- psalms for compline --
            , ul [ class "pick-psalm" ]
                [ psalmButton 4 1 999 "4"
                , psalmButton 31 1 5 "31:1-5"
                , psalmButton 91 1 999 "91"
                , psalmButton 134 1 999 "134"
                ]
            , formattedPsalms model.psalms
            , rubric "At the end of the Psalms is sung or said"
            , gloria
            , rubric "One of the following, or some other suitable passage of Scripture, is read."
            , bibleText """
        You, O Lord, are in the midst of us, and we are called by your Name: do not forsake us.
        """
                "Jeremiah 14:9"
            , bibleText """
        Come to me, all who labor and are heavy-laden, and I will give you rest. Take my yoke upon you,
        and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls. For my
        yoke is easy, and my burden is light.
        """
                "Matthew 11:28-30"
            , bibleText """
        Now may the God of peace who brought again from the dead our Lord Jesus, the great shepherd of
        the sheep, by the blood of the eternal covenant, equip you with everything good that you may do his
        will, working in us that which is pleasing in his sight, through Jesus Christ, to whom be glory for
        ever and ever. Amen.
        """
                "Hebrews 13:20-21"
            , bibleText """
        Be sober-minded, be watchful. Your adversary the devil prowls around like a roaring lion, seeking
        someone to devour. Resist him, firm in your faith.
        """
                "1 Peter 5:8-9a"
            , rubric "At the end of the reading is said"
            , wordOfTheLord
            , rubric "A period of silence may follow. A suitable hymn may be sung."
            , versicals
                [ ( "Officiant", "Into your hands, O Lord, I commend my spirit;" )
                , ( "People", "For you have redeemed me, O Lord, O God of truth." )
                , ( "Officiant", "Keep me as the apple of your eye;" )
                , ( "People", "Hide me under the shadow of your wings." )
                ]
            , mercy3
            , rubric "Officiant and People"
            , lordsPrayerTrad -- need a toggle button here
            , lordsPrayerModern
            , versicals
                [ ( "Officiant", "O Lord, hear our prayer;" )
                , ( "People", "And let our cry come to you." )
                , ( "Officiant", "Let us pray." )
                ]
            , rubric "The Officiant then says one or more of the following Collects. Other appropriate Collects may also be used."
            , withAmen """
        Visit this place, O Lord, and drive far from it all snares of the enemy; let your holy angels dwell with
        us to preserve us in peace; and let your blessing be upon us always; through Jesus Christ our Lord.
        """
            , withAmen """
        Lighten our darkness, we beseech you, O Lord; and by your great mercy defend us from all perils
        and dangers of this night; for the love of your only Son, our Savior Jesus Christ.
        """
            , withAmen """
        Be present, O merciful God, and protect us through the hours of this night, so that we who are
        wearied by the changes and chances of this life may rest in your eternal changelessness; through
        Jesus Christ our Lord.
        """
            , withAmen """
        Look down, O Lord, from your heavenly throne, illumine this night with your celestial brightness,
        and from the children of light banish the deeds of darkness; through Jesus Christ our Lord.
        """
            , justText "A Collect for Saturdays"
            , withAmen """
        We give you thanks, O God, for revealing your Son Jesus Christ to us by the light of his
        resurrection: Grant that as we sing your glory at the close of this day, our joy may abound in the
        morning as we celebrate the Paschal mystery; through Jesus Christ our Lord.
        """
            , rubric "One of the following prayers may be added"
            , withAmen """
        Keep watch, dear Lord, with those who work, or watch, or weep this night, and give your angels
        charge over those who sleep. Tend the sick, Lord Christ; give rest to the weary, bless the dying,
        soothe the suffering, pity the afflicted, shield the joyous; and all for your love’s sake.
        """
            , rubric "or this"
            , withAmen """
        O God, your unfailing providence sustains the world we live in and the life we live: Watch over
        those, both night and day, who work while others sleep, and grant that we may never forget that our
        common life depends upon each other’s toil; through Jesus Christ our Lord.
        """
            , rubric "Silence may be kept, and free intercessions and thanksgivings may be offered."
            , rubric "The Officiant and People say or sing the Song of Simeon (Luke 2:29-32) with this Antiphon"
            , justText "Guide us waking, O Lord, and guard us sleeping; that awake"
            , justText "we may watch with Christ, and asleep we may rest in peace."
            , rubricWithText ( "In Easter Season, add", "Alleluia, alleluia, alleluia." )
            , pbVs "Lord, now let your servant depart in peace,"
            , pbVsIndent "according to your word."
            , pbVs "For my eyes have seen your salvation,"
            , pbVsIndent "which you have prepared before the face of all people;"
            , pbVs "to be a light to lighten the Gentiles,"
            , pbVsIndent "and to be the glory of your people Israel."
            , gloria
            , emptyLine
            , justText "Guide us waking, O Lord, and guard us sleeping; that awake"
            , justText "we may watch with Christ, and asleep we may rest in peace."
            , rubricWithText ( "In Easter Season, add", "Alleluia, alleluia, alleluia." )
            , versicals
                [ ( "Officiant", "Let us bless the Lord." )
                , ( "People", "Thanks be to God." )
                ]
            , rubric "The Officiant concludes with the following"
            , withAmen "The Lord Almighty grant us a peaceful night and a perfect end."
            , rubric "Or This"
            , withAmen """
        The almighty and merciful Lord, Father, Son, and Holy Spirit,
        bless us and keep us, this night and evermore.
        """
            , button [ class "more-options", onClick ShowDirections ] [ text "Additional Directives" ]
            , complineAdditionalDirectives model.directions
            ]

        -- end of mpep
        ]



-- end of view
-- HELPERS --


psalmButton : Int -> Int -> Int -> String -> Html Msg
psalmButton ps vsFrom vsTo str =
    li []
        [ button [ class "more-options", onClick (GetPsalm ps vsFrom vsTo) ] [ text str ]
        ]
