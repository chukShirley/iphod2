module Elm.Page.CommunionToSick exposing (Model, Msg, init, initModel, subscriptions, update, view)

-- where
-- import Iphod.Helper exposing (..)

import Elm.Data.Psalm as Psalm exposing (Psalm, initPsalm)
import Elm.Page.Office.Format as Format exposing (..)
import Elm.Page.Office.Prayers exposing (agnusDei, lordsPrayerTrad)
import Elm.Views.Psalm as ViewPsalm exposing (formattedPsalms)
import Elm.Ports as Ports exposing (requestPsalms, requestedPsalms)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Json.Decode as Decode exposing (Value)


type alias Model =
    { psalms : List Psalm.Psalm
    , thisOption : String
    }


initModel : Model
initModel =
    { psalms = []
    , thisOption = ""
    }


init : ( Model, Cmd Msg )
init =
    ( initModel, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Sub.map SetPsalms psalmsChange
        ]


psalmsChange : Sub (Maybe (List Psalm))
psalmsChange =
    Ports.requestedPsalms (Decode.decodeValue Psalm.decoder >> Result.toMaybe)


type Msg
    = NoOp
    | ChangePsalm ( Int, Int, Int )
    | MoreOptions
    | SetPsalms (Maybe (List Psalm))


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        ChangePsalm ps ->
            ( model, requestPsalms [ ps ] )

        SetPsalms (Just pss) ->
            let
                newModel =
                    { model | psalms = pss }
            in
            ( newModel, Cmd.none )

        SetPsalms Maybe.Nothing ->
            ( model, Cmd.none )

        MoreOptions ->
            let
                newOption =
                    if model.thisOption |> String.isEmpty then
                        "Mobile Options go here"
                    else
                        ""
            in
            ( { model | thisOption = newOption }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ button [ class "more-options", onClick MoreOptions ] [ text "Options" ]

        --  , <div id= "header-elm-container"></div>
        , emptyLine
        , div [ class "mpep" ]
            [ p [ class "midday" ] [ text "Communion of the Sick" ] -- REMOVE, this is for testing
            , p [] [ text model.thisOption ]
            , rubric "The Minister begins"
            , justText "Grace to you and peace from God our Father and the Lord Jesus Christ. "
            , reference "Philippians 1:2"
            , rubric "The Minister continues"
            , withAmen """
          Almighty God, to you all hearts are open, all desires known, and from you
          no secrets are hid: Cleanse the thoughts of our hearts by the inspiration
          of your Holy Spirit, that we may perfectly love you, and worthily magnify
          your holy Name; through Christ our Lord.
          """
            , rubric "A Psalm may be prayed. Psalms"
            , p []
                [ button [ class "more-options", onClick (ChangePsalm ( 23, 1, 999 )) ] [ text "23" ]
                , button [ class "more-options", onClick (ChangePsalm ( 62, 1, 999 )) ] [ text "62" ]
                , button [ class "more-options", onClick (ChangePsalm ( 10, 1, 999 )) ] [ text "103" ]
                , text "and"
                , button [ class "more-options", onClick (ChangePsalm ( 145, 1, 999 )) ] [ text "145" ]
                , text "are particularly appropriate. "
                ]
            , formattedPsalms model.psalms
            , div [ id "sick-communion-psalm" ] [ formattedPsalms model.psalms ]
            , rubric """
            One of the following Gospel lessons is read, or the readings appropriate to the day
            """
            , justText """
            For God so loved the world, that he gave his only Son, that whoever believes in
            him should not perish but have eternal life.
            """
            , reference "John 3:16"
            , emptyLine
            , justText """
            Jesus said, “I am the living bread that came down from heaven. If anyone
            eats of this bread, he will live forever. And the bread that I will give
            for the life of the world is my flesh.” For my flesh is true food, and my
            blood is true drink. Whoever feeds on my flesh and drinks my blood abides
            in me, and I in him.
            """
            , reference "John 6:51, 55-56"
            , rubric "Reflection on the lessons may follow."
            , rubric "The minister may say the confession and the sick person joins in as able."
            , pbVs "Most merciful God,"
            , pbVs "we confess that we have sinned against you"
            , pbVs "in thought, word and deed,"
            , pbVs "by what we have done, and by what we have left undone."
            , pbVs "We have not loved you with our whole heart;"
            , pbVs "we have not loved our neighbors as ourselves."
            , pbVs "We are truly sorry and we humbly repent."
            , pbVs "For the sake of your Son Jesus Christ,"
            , pbVs "have mercy on us and forgive us;"
            , pbVs "that we may delight in your will, and walk in your ways,"
            , pbVs "to the glory of your Name. Amen."
            , rubric "A Priest, if present, says"
            , withAmen """
            Almighty God, our heavenly Father, who in his great mercy has promised forgiveness
            of sins to all those who sincerely repent and with true faith turn to him, have
            mercy upon you, pardon and deliver you from all your sins, confirm and strengthen
            you in all goodness, and bring you to everlasting life;
            through Jesus Christ our Lord.
            """
            , rubric "A Deacon or lay person prays"
            , withAmen """
            Grant your faithful people, merciful Lord, pardon and peace; that we may
            be cleansed from all our sins, and serve you with a quiet mind; through
            Jesus Christ our Lord.
            """
            , emptyLine
            , versicals
                [ ( "Minister", "The peace of the Lord be always with you." )
                , ( "People", "And with your spirit. " )
                , ( "Minister", "Let us pray." )
                ]
            , rubric "Minister and People"
            , lordsPrayerTrad
            , rubric "Then may be said"
            , agnusDei
            , rubric "The minister may say"
            , justText """
            The body of our Lord Jesus Christ, which was given for you,
            preserve your body and soul to everlasting life.
            """
            , justText """
            The blood of our Lord Jesus Christ, which was shed for you,
            preserve your body and soul to everlasting life.
            """
            , rubric "After Communion, the minister says"
            , pbVs "Almighty and ever-living God,"
            , pbVs "we thank you for feeding us, in these holy mysteries,"
            , pbVs "with the spiritual food of the most precious Body and Blood"
            , pbVs "of your Son our Savior Jesus Christ;"
            , pbVs "and for assuring us, through this Sacrament, of your favor and goodness towards us;"
            , pbVs "and that we are true members of the mystical body of your Son,"
            , pbVs "the blessed company of all faithful people;"
            , pbVs "and are also heirs, through hope, of your everlasting kingdom."
            , pbVs "And we humbly ask you, heavenly Father,"
            , pbVs "to assist us with your grace,"
            , pbVs "that we may continue in that holy fellowship,"
            , pbVs "and do all such good works as you have prepared for us to walk in;"
            , pbVs "through Jesus Christ our Lord,"
            , pbVs "to whom with you and the Holy Spirit,"
            , pbVs "be all honor and glory, now and forever. Amen."
            , rubric "A Priest gives this blessing"
            , withAmen """
            The peace of God which passes all understanding keep your hearts and minds in the
            knowledge and love of God, and of his Son Jesus Christ our Lord; and the blessing
            of God Almighty, the Father, the Son, and the Holy Spirit, be among you, and remain
            with you always.
            """
            , rubric "A Deacon or lay person says the following"
            , withAmen """
            The grace of our Lord Jesus Christ, and the love of God, and the fellowship of the
            Holy Spirit, be with us all evermore.
            """
            , reference "2 Corinthians 13:14"
            , emptyLine
            , versicals
                [ ( "Minister", "Let us bless the Lord" )
                , ( "People", "Thanks be to God" )
                ]
            ]
        ]
