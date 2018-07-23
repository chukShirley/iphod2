module Elm.Page.Office.Prayers exposing (..)

-- where

import Elm.Page.Office.Format as Format exposing (..)
import Date exposing (Date, Day, dayOfWeek)
import Html exposing (..)
import Html.Attributes exposing (..)


-- import Iphod.Helper exposing (..)


type MpEp
    = Mp
    | Ep


agnusDei : Html msg
agnusDei =
    div []
        [ agnus_dei "Lamb of God, you take away the sin of the world,"
        , agnus_dei_resp "have mercy on us"
        , agnus_dei "Lamb of God, you take away the sin of the world,"
        , agnus_dei_resp "have mercy on us"
        , agnus_dei "Lamb of God, you take away the sin of the world,"
        , agnus_dei_resp "grant us your peace"
        ]


apostlesCreed : Html msg
apostlesCreed =
    div []
        [ pbSection "The Apostles’ Creed"
        , rubric "Officiant and People together, all standing"
        , pbVs "I believe in God, the Father almighty,"
        , pbVsIndent "creator of heaven and earth."
        , pbVs "I believe in Jesus Christ, his only Son, our Lord."
        , pbVsIndent "He was conceived by the Holy Spirit"
        , pbVsIndent "and born of the Virgin Mary."
        , pbVsIndent "He suffered under Pontius Pilate,"
        , pbVsIndent "was crucified, died, and was buried."
        , pbVsIndent "He descended to the dead."
        , pbVsIndent "On the third day he rose again."
        , pbVsIndent "He ascended into heaven,"
        , pbVsIndent "and is seated at the right hand of the Father."
        , pbVsIndent "He will come again to judge the living and the dead."
        , pbVs "I believe in the Holy Spirit,"
        , pbVsIndent "the holy catholic Church,"
        , pbVsIndent "the communion of saints,"
        , pbVsIndent "the forgiveness of sins,"
        , pbVsIndent "the resurrection of the body,"
        , pbVsIndent "and the life everlasting. Amen."
        ]


benediciteOmniaOperaDomini : Html msg
benediciteOmniaOperaDomini =
    div []
        [ rubric "Especially suitable for use on Saturday"
        , canticle "Benedicite, omnia opera Domini" "A Song of Creation"
        , rubricBlack "Song of the Three Young Men, 35-65"
        , centerItalic "Invocation"
        , pbVs "Glorify the Lord, all you works of the Lord,"
        , pbVsIndent "praise him and highly exalt him for ever."
        , pbVs "In the firmament of his power, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him for ever."
        , centerItalic "I The Cosmic Order"
        , pbVs "Glorify the Lord, you angels and all powers of the Lord,"
        , pbVsIndent "O heavens and all waters above the heavens."
        , pbVs "Sun and moon and stars of the sky, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him for ever."
        , pbVs "Glorify the Lord, every shower of rain and fall of dew,"
        , pbVsIndent "all winds and fire and heat,"
        , pbVs "Winter and summer, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him for ever."
        , pbVs "Glorify the Lord, O chill and cold,"
        , pbVsIndent "drops of dew and flakes of snow."
        , pbVs "Frost and cold, ice and sleet, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him for ever."
        , pbVs "Glorify the Lord, of nights and days,"
        , pbVsIndent "O shining light and enfolding dark."
        , pbVs "Storm clouds and thunderbolts, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him for ever."
        , centerItalic "II The Earth and its Creatures"
        , pbVs "Let the earth glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him forever."
        , pbVs "Glorify the Lord, O mountains and hills,"
        , pbVsIndent "and all that grows upon the earth,"
        , pbVsIndent "praise him and highly exalt him forever."
        , pbVs "Glorify the Lord, O springs of water, seas, and streams,"
        , pbVsIndent "O whales and all that move in the waters."
        , pbVs "All birds of the air, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him forever."
        , pbVs "Glorify the Lord, O beasts of the wild,"
        , pbVsIndent "and all you flocks and herds."
        , pbVs "O men and women everywhere, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him forever."
        , centerItalic "III The People of God"
        , pbVs "Let the people of God glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him forever."
        , pbVs "Glorify the Lord, O priests and servants of the Lord,"
        , pbVsIndent "praise him and highly exalt him forever."
        , pbVs "Glorify the Lord, O spirits and souls of the righteous,"
        , pbVsIndent "praise him and highly exalt him forever."
        , pbVs "You that are holy and humble of heart, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him forever."
        , centerItalic "Doxology"
        , pbVs "Let us glorify the Lord: the Father, the Son and the Holy Spirit;"
        , pbVsIndent "praise him and highly exalt him forever."
        , pbVs "In the firmament of his power, glorify the Lord,"
        , pbVsIndent "praise him and highly exalt him forever."
        ]


benedictisEsDomine : Html msg
benedictisEsDomine =
    div []
        [ canticle "Benedictus es, Domine" "A Song of Praise"
        , rubricBlack "Song of the Three Young Men, 29-34<"
        , pbVs "Glory to you, Lord God of our fathers;"
        , pbVsIndent "you are worthy of praise; glory to you."
        , pbVs "Glory to you for the radiance of your holy Name;"
        , pbVsIndent "we will praise you and highly exalt you for ever."
        , pbVs "Glory to you in the splendor of your temple;"
        , pbVsIndent "on the throne of your majesty, glory to you."
        , pbVs "Glory to you, seated between the Cherubim;"
        , pbVsIndent "we will praise you and highly exalt you for ever."
        , pbVs "Glory to you, beholding the depths;"
        , pbVsIndent "in the high vault of heaven, glory to you."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "we will praise you and highly exalt you for ever."
        ]


benedictus : Html msg
benedictus =
    div []
        [ canticle "Benedictus" "The Song of Zechariah"
        , rubricBlack "Luke 1:68-79"
        , pbVs "Blessed be the Lord, the God of Israel;"
        , pbVsIndent "he has come to his people and set them free."
        , pbVs "He has raised up for us a mighty savior,"
        , pbVsIndent "born of the house of his servant David."
        , pbVs "Through his holy prophets he promised of old,"
        , pbVs "that he would save us from our enemies,"
        , pbVsIndent "from the hands of all who hate us."
        , pbVs "He promised to show mercy to our fathers"
        , pbVsIndent "and to remember his holy covenant."
        , pbVs "This was the oath he swore to our father Abraham,"
        , pbVsIndent "to set us free from the hands of our enemies,"
        , pbVs "Free to worship him without fear,"
        , pbVsIndent "holy and righteous in his sight"
        , pbVsIndent "all the days of our life."
        , pbVs "You, my child, shall be called the prophet of the Most High,"
        , pbVsIndent "for you will go before the Lord to prepare his way,"
        , pbVs "To give his people knowledge of salvation"
        , pbVsIndent "by the forgiveness of their sins."
        , pbVs "In the tender compassion of our God"
        , pbVsIndent "the dawn from on high shall break upon us,"
        , pbVs "To shine on those who dwell in darkness and the shadow of death,"
        , pbVsIndent "and to guide our feet into the way of peace."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVsIndent "world without end. Amen."
        , emptyLine
        ]


cantateDomino : Html msg
cantateDomino =
    div []
        [ rubric "Especially suitable for use in Easter and at any time outside penitential seasons"
        , canticle "Cantate Domino" "Sing to the Lord a New Song"
        , rubricBlack "Psalm 98"
        , pbVs "Sing to the Lord a new song,"
        , pbVsIndent "for he has done marvelous things."
        , pbVs "With his right hand and his holy arm"
        , pbVsIndent "has he won for himself the victory."
        , pbVs "The Lord has made known his victory;"
        , pbVsIndent "his righteousness has he openly shown in the sight of the nations."
        , pbVs "He remembers his mercy and faithfulness to the house of Israel,"
        , pbVsIndent "and all the ends of the earth have seen the victory of our God."
        , pbVs "Shout with joy to the Lord, all you lands; lift up your voice, rejoice,"
        , pbVsIndent "and sing."
        , pbVs "Sing to the Lord with the harp,"
        , pbVsIndent "with the harp and the voice of song."
        , pbVs "With trumpets and the sound of the horn"
        , pbVsIndent "shout with joy before the King, the Lord."
        , pbVs "Let the sea make a noise and all that is in it,"
        , pbVsIndent "the lands and those who dwell therein."
        , pbVs "Let the rivers clap their hands,"
        , pbVsIndent "and let the hills ring out with joy before the Lord,"
        , pbVsIndent "when he comes to judge the earth."
        , pbVs "In righteousness shall he judge the world"
        , pbVsIndent "and the peoples with equity."
        , pbVs "Glory to the Father, and tocantate Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVsIndent "world without end. Amen."
        ]


cantemusDomino : Html msg
cantemusDomino =
    div []
        [ rubric "Especially suitable for use in Easter"
        , canticle "Cantemus Domino" "The Song of Moses"
        , rubricBlack "Exodus 15:1-6, 11-13, 17-18"
        , pbVs "I will sing to the Lord, for he is lofty and uplifted;"
        , pbVsIndent "the horse and its rider has he hurled into the sea."
        , pbVs "The Lord is my strength and my refuge;"
        , pbVsIndent "the Lord has become my Savior."
        , pbVs "This is my God and I will praise him,"
        , pbVsIndent "the God of my people and I will exalt him."
        , pbVs "The Lord is a mighty warrior;"
        , pbVs "Yahweh is his Name."
        , pbVs "The chariots of Pharaoh and his army has he hurled into the sea;"
        , pbVsIndent "the finest of those who bear armor have been drowned in the"
        , pbVs "Red Sea."
        , pbVs "The fathomless deep has overwhelmed them;"
        , pbVsIndent "they sank into the depths like a stone."
        , pbVs "Your right hand, O Lord, is glorious in might;"
        , pbVsIndent "your right hand, O Lord, has overthrown the enemy."
        , pbVs "Who can be compared with you, O Lord, among the gods?"
        , pbVsIndent "who is like you, glorious in holiness,"
        , pbVsIndent "awesome in renown, and worker of wonders?"
        , pbVs "You stretched forth your right hand;"
        , pbVsIndent "the earth swallowed them up."
        , pbVs "With your constant love you led the people you redeemed;"
        , pbVsIndent "you brought them in safety to your holy dwelling."
        , pbVs "You will bring them in and plant them"
        , pbVsIndent "on the mount of your possession,"
        , pbVs "The resting-place you have made for yourself, O Lord,"
        , pbVsIndent "the sanctuary, O Lord, that your hand has established."
        , pbVs "The Lord shall reign for ever and for ever."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVsIndent "world without end. Amen."
        ]


chrysostom : Html msg
chrysostom =
    div []
        [ emptyLine
        , pbSection "A Prayer of St. John Chrysostom"
        , justText """
      Almighty God, you have given us grace at this time with one accord
      to make our common supplications to you; and you have promised
      through your well beloved Son that when two or three are gathered
      together in his name you will be in the midst of them: Fulfill now, O
      Lord, our desires and petitions as may be best for us; granting us in
      this world knowledge of your truth, and in the age to come life
      everlasting. Amen.
      """
        ]


compAltReadings : Html msg
compAltReadings =
    div [ class "alt_readings" ]
        [ button [ class "alt_readings-button button" ] [ text "Alternate Readings" ]
        , altReadings
            [ "Isaiah 26:3-4"
            , "Isaiah 30:15a"
            , "Matthew 6:31-34"
            , "2 Corinthians 4:6"
            , "1 Thessalonians 5:9-10"
            , "1 Thessalonians 5:23"
            , "Ephesians 4:26-27"
            ]
        , altReadingText "Isaiah 26:3-4" """
      You keep him in perfect peace
        whose mind is stayed on you,
        because he trusts in you.
      Trust in the Lord forever,
        for the Lord God is an everlasting rock.
      """
        , altReadingText "Isaiah 30:15a" """
        For thus said the Lord God, the Holy One of Israel,
        “In returning and rest you shall be saved;
            in quietness and in trust shall be your strength.”
      """
        , altReadingText "Matthew 6:31-34" """
        Therefore do not be anxious, saying, ‘What shall we eat?’ or ‘What shall we drink?’
        or ‘What shall we wear?’ For the Gentiles seek after all these things, and your
        heavenly Father knows that you need them all. But seek first the kingdom of God
        and his righteousness, and all these things will be added to you.
        “Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself.
        Sufficient for the day is its own trouble.
        """
        , altReadingText "2 Corinthians 4:6" """
        For God, who said, “Let light shine out of darkness,” has shone in our hearts to
        give the light of the knowledge of the glory of God in the face of Jesus Christ.
        """
        , altReadingText "1 Thessalonians 5:9-10" """
        For God has not destined us for wrath, but to obtain salvation through our Lord
        Jesus Christ, who died for us so that whether we are awake or asleep we might live with him.
        """
        , altReadingText "1 Thessalonians 5:23" """
        Now may the God of peace himself sanctify you completely, and may your whole spirit
        and soul and body be kept blameless at the coming of our Lord Jesus Christ.
        """
        , altReadingText "Ephesians 4:26-27" """
        Be angry and do not sin; do not let the sun go down on your anger,
        and give no opportunity to the devil.
        """
        ]



-- GOING TO NEED THIS SCRIPT SOMEWHERE!!!
-- <script type="text/javascript">
--   $('button.alt_readings-button').click(function(){
--     $('ul.alt_readings-options').toggle();
--   })
--   $('li.alt_readings-select').click(function(){
--     $('ul.alt_readings-options').toggle();
--   })
-- </script>
--
--   ]
--  ]


confession : Html msg
confession =
    div []
        [ pbSection "Confession of Sin"
        , emptyLine
        , rubric "The Officiant says to the People"
        , justText """
      Dearly beloved, the Scriptures teach us to acknowledge our many sins and offenses,
      not concealing them from our heavenly Father, but confessing them with humble
      and obedient hearts that we may obtain forgiveness by his infinite goodness
      and mercy. We ought at all times humbly to acknowledge our sins before Almighty God,
      but especially when we come together in his presence to give thanks for the great
      benefits we have received at his hands, to declare his most worthy praise, to hear
      his holy Word, and to ask, for ourselves and others, those things necessary for
      our life and our salvation. Therefore, come with me to the throne of heavenly grace.
      """
        , orThis
        , justText "Let us humbly confess our sins to Almighty God."
        , rubric "Silence is kept. All kneeling the Officiant and People say"
        , pbVs "Almighty and most merciful Father,"
        , pbVs "we have erred and strayed from your ways like lost sheep."
        , pbVs "we have followed too much the deceits and desires of our"
        , pbVsIndent "own hearts."
        , pbVs "we have offended against your holy laws."
        , pbVs "we have left undone those things which we ought to have done"
        , pbVs "and we have done those things which we ought not to have done;"
        , pbVs "and apart from your grace, there is no health in us."
        , pbVs "O Lord, have mercy upon us."
        , pbVs "Spare those who confess their faults."
        , pbVs "Restore those who are penitent, according to your promises declared"
        , pbVsIndent "to all people in Christ Jesus our Lord;"
        , pbVs "And grant, O most merciful Father, for his sake,"
        , pbVsIndent "that we may now live a godly, righteous, and sober life,"
        , pbVsIndent "to the glory of your holy Name. Amen."
        , emptyLine
        , rubric "The Priest alone stands and says"
        , justText """
      Almighty God, the Father of our Lord Jesus Christ,desires not the death of sinners,
      but that they may turn from their wickedness and live. He has empowered and
      commanded his ministers to pronounce to his people, being penitent, the absolution
      and remission of their sins. He pardons all who truly repent and genuinely believe
      his holy Gospel. For this reason, we beseech him to grant us true repentance and his
      Holy Spirit, that our present deeds may please him, the rest of our lives may be pure
      and holy, and that at the last we may come to his eternal joy; through Jesus Christ our Lord. Amen.
      """
        , rubric "or this"
        , justText """
      The Almighty and merciful Lord grant you absolution and remission of all your sins,
      true repentance, amendment of life, and the grace and consolation of his Holy Spirit. Amen.
      """
        , rubric "A deacon or layperson remains kneeling and prays"
        , justText """
      Grant your faithful people, merciful Lord, pardon and peace;
      that we may be cleansed from all our sins, and serve you with a
      quiet mind; through Jesus Christ our Lord. Amen.
      """
        , emptyLine
        ]


deusMisereatur : Html msg
deusMisereatur =
    div []
        [ rubric "Suitable for use at any time"
        , canticle "Deus misereatur" "May God be Merciful to us and Bless us"
        , rubricBlack "Psalm 67"
        , pbVs "May God be merciful to us and bless us,"
        , pbVsIndent "show us the light of his countenance and come to us."
        , pbVs "Let your ways be known upon earth,"
        , pbVsIndent "your saving health among all nations."
        , pbVs "Let the peoples praise you, O God;"
        , pbVsIndent "let all the peoples praise you."
        , pbVs "Let the nations be glad and sing for joy,"
        , pbVsIndent "for you judge the peoples with equity and guide all the nations"
        , pbVsIndent "upon earth."
        , pbVs "Let the peoples praise you, O God;"
        , pbVsIndent "let all the peoples praise you."
        , pbVs "The earth has brought forth her increase;"
        , pbVsIndent "may God, our own God, give us his blessing."
        , pbVs "May God give us his blessing,"
        , pbVsIndent "and may all the ends of the earth stand in awe of him."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVsIndent "world without end. Amen."
        ]


dignusEs : Html msg
dignusEs =
    div []
        [ rubric "Especially suitable for use after Ascension and in Easter season"
        , canticle "Dignus es" "A Song to the Lamb"
        , pbVs "Revelation 4:11; 5:9-10, 13"
        , pbVs "Splendor and honor and kingly power"
        , pbVsIndent "are yours by right, O Lord our God,"
        , pbVs "For you created everything that is,"
        , pbVsIndent "and by your will they were created and have their being;"
        , pbVs "And yours by right, O Lamb that was slain,"
        , pbVsIndent "for with your blood you have redeemed for God,"
        , pbVs "From every family, language, people and nation,"
        , pbVsIndent "a kingdom of priests to serve our God."
        , pbVs "And so, to him who sits upon the throne,"
        , pbVsIndent "and to Christ the Lamb,"
        , pbVs "Be worship and praise, dominion and splendor,"
        , pbVsIndent "for ever and for evermore."
        ]


ecceDeus : Html msg
ecceDeus =
    div []
        [ rubric "Suitable for use at any time"
        , canticle "Ecce, Deus" "Surely, it is God who saves me"
        , rubricBlack "Isaiah 12:2-6"
        , pbVs "Surely, it is God who saves me;"
        , pbVsIndent "I will trust in him and not be afraid."
        , pbVs "For the Lord is my stronghold and my sure defense,"
        , pbVsIndent "and he will be my Savior."
        , pbVs "Therefore you shall draw water with rejoicing"
        , pbVsIndent "from the springs of salvation."
        , pbVs "And on that day you shall say,"
        , pbVsIndent "Give thanks to the Lord and call upon his Name;"
        , pbVs "Make his deeds known among the peoples;"
        , pbVsIndent "see that they remember that his Name is exalted."
        , pbVs "Sing the praises of the Lord, for he has done great things,"
        , pbVsIndent "and this is known in all the world."
        , pbVs "Cry aloud, inhabitants of Zion, ring out your joy,"
        , pbVsIndent "for the great one in the midst of you is the Holy One of Israel."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVsIndent "world without end. Amen."
        ]


eoPrayer : Html msg
eoPrayer =
    div []
        [ versicals
            [ ( "&nbsp;", "Let us bless the Lord" )
            , ( "People", "Thanks be to God" )
            ]
        ]


epForMission : Html msg
epForMission =
    div []
        [ emptyLine
        , pbSection "Collect for Mission"

        -- NEED TO PICK ONE OF THE FOLLOWING THREE!!!
        , justText """
          O God and Father of all, whom the whole heavens adore: Let the
          whole earth also worship you, all nations obey you, all tongues
          confess and bless you, and men, women and children everywhere
          love you and serve you in peace; through Jesus Christ our Lord.
          Amen.
          """
        , justText """
          Keep watch, dear Lord, with those who work, or watch, or weep this
          night, and give your angels charge over those who sleep. Tend the
          sick, Lord Christ; give rest to the weary, bless the dying, soothe the
          suffering, pity the afflicted, shield the joyous; and all for your love’s
          sake. Amen.
          """
        , justText """
          O God, you manifest in your servants the signs of your presence:
          Send forth upon us the Spirit of love, that in companionship with
          one another your abounding grace may increase among us; through
          Jesus Christ our Lord. Amen.
          """
        ]


collectOfDay : Date -> MpEp -> Html msg
collectOfDay date mpep =
    case ( mpep, dayOfWeek date ) of
        ( Mp, Date.Sun ) ->
            mpSunday

        ( Mp, Date.Mon ) ->
            mpMonday

        ( Mp, Date.Tue ) ->
            mpTuesday

        ( Mp, Date.Wed ) ->
            mpWednesday

        ( Mp, Date.Thu ) ->
            mpThursday

        ( Mp, Date.Fri ) ->
            mpFriday

        ( Mp, Date.Sat ) ->
            mpSaturday

        ( Ep, Date.Sun ) ->
            epSunday

        ( Ep, Date.Mon ) ->
            epMonday

        ( Ep, Date.Tue ) ->
            epTuesday

        ( Ep, Date.Wed ) ->
            epWednesday

        ( Ep, Date.Thu ) ->
            epThursday

        ( Ep, Date.Fri ) ->
            epFriday

        ( Ep, Date.Sat ) ->
            epSaturday



-- (_, _)      -> div [] []


epFriday : Html msg
epFriday =
    div []
        [ emptyLine
        , pbSection "A Collect for Faith (Friday)"
        , withAmen """
        Lord Jesus Christ, by your death you took away the sting of death:
        Grant to us your servants so to follow in faith where you have led the
        way, that we may at length fall asleep peacefully in you and wake up
        in your likeness; for your tender mercies’ sake.
        """
        ]


epMonday : Html msg
epMonday =
    div []
        [ emptyLine
        , pbSection "A Collect for Peace (Monday)"
        , withAmen """
        O God, the source of all holy desires, all good counsels, and all just
        works: Give to your servants that peace which the world cannot give,
        that our hearts may be set to obey your commandments, and that we,
        being defended from the fear of our enemies, may pass our time in
        rest and quietness, through the merits of Jesus Christ our Savior.
        """
        ]


epSaturday : Html msg
epSaturday =
    div []
        [ emptyLine
        , pbSection "A Collect for the Eve of Worship (Saturday)"
        , withAmen """
      O God, the source of eternal light: Shed forth your unending day
      upon us who watch for you, that our lips may praise you, our lives
      may bless you, and our worship on the morrow give you glory;
      through Jesus Christ our Lord.
      """
        ]


epSunday : Html msg
epSunday =
    div []
        [ emptyLine
        , pbSection "A Collect for Resurrection Hope (Sunday)"
        , withAmen """
      Lord God, whose Son our Savior Jesus Christ triumphed over the
      powers of death and prepared for us our place in the new Jerusalem:
      Grant that we, who have this day given thanks for his resurrection,
      may praise you in that City of which he is the light, and where he
      lives and reigns forever and ever.
      """
        ]


epTuesday : Html msg
epTuesday =
    div []
        [ emptyLine
        , pbSection "A Collect for Aid against Perils (Tuesday)"
        , withAmen """
      Lighten our darkness, we beseech you, O Lord; and by your great
      mercy defend us from all perils and dangers of this night; for the love
      of your only Son, our Savior Jesus Christ.
      """
        ]


epThursday : Html msg
epThursday =
    div []
        [ emptyLine
        , pbSection "A Collect for the Presence of Christ (Thursday)"
        , withAmen """
      Lord Jesus, stay with us, for evening is at hand and the day is past; be
      our companion in the way, kindle our hearts, and awaken hope, that
      we may know you as you are revealed in Scripture and the breaking
      of bread. Grant this for the sake of your love.
      """
        ]


epWednesday : Html msg
epWednesday =
    div []
        [ emptyLine
        , pbSection "A Collect for Protection (Wednesday)"
        , withAmen """
      O God, the life of all who live, the light of the faithful, the strength
      of those who labor, and the repose of the dead: We thank you for the
      blessings of the day that is past, and humbly ask for your protection
      through the coming night. Bring us in safety to the morning hours;
      through him who died and rose again for us, your Son our Savior
      Jesus Christ.
      """
        ]


mpSunday : Html msg
mpSunday =
    div []
        [ emptyLine
        , pbSection "A Collect for Strength to Await Christ’s Return (Sunday)"
        , withAmen
            """
        O God, the King eternal, whose light divides the day from
        the night and turns the shadow of death into the morning:
        Drive far from us all wrong desires, incline our hearts to
        keep your law, and guide our feet into the way of peace;
        that, having done your will with cheerfulness during the day,
        we may, when night comes, rejoice to give you thanks;
        through Jesus Christ our Lord.
      """
        ]


mpMonday : Html msg
mpMonday =
    div []
        [ emptyLine
        , pbSection "A Collect for the Renewal of Life (Monday)"
        , withAmen
            """
        O God, the King eternal, whose light divides the day from the night and turns the shadow of death
        into the morning: Drive far from us all wrong desires, incline our hearts to keep your law, and guide
        our feet into the way of peace; that, having done your will with cheerfulness during the day, we may,
        when night comes, rejoice to give you thanks; through Jesus Christ our Lord.
      """
        ]


mpTuesday : Html msg
mpTuesday =
    div []
        [ emptyLine
        , pbSection "A Collect for Peace (Tuesday)"
        , withAmen
            """
        O God, the author of peace and lover of concord, to know you is eternal life and to serve you is
        perfect freedom: Defend us, your humble servants, in all assaults of our enemies; that we, surely
        trusting in your defense, may not fear the power of any adversaries, through the might of Jesus
        Christ our Lord.
      """
        ]


mpWednesday : Html msg
mpWednesday =
    div []
        [ emptyLine
        , pbSection "A Collect for Grace (Wednesday)"
        , withAmen
            """
        O Lord, our heavenly Father, almighty and everlasting God, you have brought us safely to the
        beginning of this day: Defend us by your mighty power, that we may not fall into sin nor run into
        any danger; and that guided by your Spirit, we may do what is righteous in your sight; through Jesus
        Christ our Lord.
      """
        ]


mpThursday : Html msg
mpThursday =
    div []
        [ emptyLine
        , pbSection "A Collect for Guidance (Thursday)"
        , withAmen
            """
        Heavenly Father, in you we live and move and have our being: We humbly pray you so to guide and
        govern us by your Holy Spirit, that in all the cares and occupations of our life we may not forget
        you, but may remember that we are ever walking in your sight; through Jesus Christ our Lord.
      """
        ]


mpFriday : Html msg
mpFriday =
    div []
        [ emptyLine
        , pbSection "A Collect for Endurance (Friday)"
        , withAmen
            """
        Almighty God, whose most dear Son went not up to joy but first he suffered pain, and entered not
        into glory before he was crucified: Mercifully grant that we, walking in the way of the cross, may find
        it none other than the way of life and peace; through Jesus Christ your Son our Lord.
      """
        ]


mpSaturday : Html msg
mpSaturday =
    div []
        [ emptyLine
        , pbSection "A Collect for Sabbath Rest (Saturday)"
        , withAmen
            """
        Almighty God, who after the creation of the world rested from all your works and sanctified a day
        of rest for all your creatures: Grant that we, putting away all earthly anxieties, may be duly prepared
        for the service of your sanctuary, and that our rest here upon earth may be a preparation for the
        eternal rest promised to your people in heaven; through Jesus Christ our Lord.
      """
        ]


generalThanksgiving : Html msg
generalThanksgiving =
    div []
        [ emptyLine
        , pbSection "The General Thanksgiving"
        , rubric "Officiant and People"
        , pbVs "Almighty God, Father of all mercies,"
        , pbVs "we your unworthy servants give you humble thanks"
        , pbVs "for all your goodness and loving-kindness"
        , pbVsIndent "to us and to all whom you have made."
        , pbVs "We bless you for our creation, preservation,"
        , pbVsIndent "and all the blessings of this life;"
        , pbVs "but above all for your immeasurable love"
        , pbVs "in the redemption of the world by our Lord Jesus Christ;"
        , pbVs "for the means of grace, and for the hope of glory."
        , pbVs "And, we pray, give us such an awareness of your mercies,"
        , pbVs "that with truly thankful hearts we may show forth your praise,"
        , pbVs "not only with our lips, but in our lives,"
        , pbVs "by giving up our selves to your service,"
        , pbVs "and by walking before you"
        , pbVsIndent "in holiness and righteousness all our days;"
        , pbVs "through Jesus Christ our Lord,"
        , pbVs "to whom, with you and the Holy Spirit,"
        , pbVs "be honor and glory throughout all ages. Amen."
        , emptyLine
        ]


gloriaInExcelsis : Html msg
gloriaInExcelsis =
    div []
        [ canticle "Gloria in Excelsis" ""
        , pbVs "Glory to God in the highest,"
        , pbVsIndent "and peace to his people on earth."
        , pbVs "Lord God, heavenly King,"
        , pbVsIndent "almighty God and Father,"
        , pbVsIndent "we worship you, we give you thanks,"
        , pbVsIndent "we praise you for your glory."
        , pbVs "Lord Jesus Christ, only Son of the Father,"
        , pbVs "Lord God, Lamb of God,"
        , pbVsIndent "you take away the sin of the world:"
        , pbVsIndent "have mercy on us;"
        , pbVsIndent "you are seated at the right hand of the Father:"
        , pbVsIndent "receive our prayer."
        , pbVs "For you alone are the Holy One,"
        , pbVsIndent "you alone are the Lord,"
        , pbVsIndent "you alone are the Most High,"
        , pbVs "Jesus Christ,"
        , pbVsIndent "with the Holy Spirit,"
        , pbVsIndent "in the glory of God the Father. Amen."
        ]


gloria : Html msg
gloria =
    div []
        [ pbVs "Glory be to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVsIndent "world without end. Amen."
        ]


graces : Int -> Html msg
graces i =
    let
        thisGrace =
            case i of
                1 ->
                    """ The grace of our Lord Jesus Christ, and the love of God, and the
              fellowship of the Holy Spirit, be with us all evermore. Amen."""

                2 ->
                    """ May the God of hope fill us with all joy and peace in believing
              through the power of the Holy Spirit. Amen. """

                _ ->
                    """ Glory to God whose power, working in us, can do infinitely more
              than we can ask or imagine: Glory to him from generation to
              generation in the Church, and in Christ Jesus forever and ever. Amen. """

        thisRef =
            case i of
                1 ->
                    "2 Corinthians 13:14"

                2 ->
                    "Romans 15:13"

                _ ->
                    "Ephesians 3:20-21"
    in
    div []
        [ emptyLine
        , rubric "The Officiant may invite the People to join in one of the Graces."
        , rubric "Officiant"
        , justText thisGrace
        , bibleRef thisRef
        ]


invitatory : Html msg
invitatory =
    div []
        [ versicals
            [ ( "Officiant", "O Lord, open our lips;" )
            , ( "People", "And our mouth shall proclaim your praise." )
            , ( "Officiant", "O God, make speed to save us;" )
            , ( "People", "O Lord, make haste to help us." )
            , ( "Officiant", "Glory to the Father, and to the Son, and to the Holy Spirit;" )
            , ( "People", "As it was in the beginning, is now, and ever shall be, world without end. Amen." )
            , ( "Officiant", "Praise the Lord." )
            , ( "People", "The Lord’s name be praised." )
            ]
        ]


jubilate : Html msg
jubilate =
    div []
        [ canticle "Jubilate" "Be Joyful"
        , rubricBlack "Psalm 100"
        , emptyLine
        , pbVs "Be joyful in the Lord, all you lands;"
        , pbVsIndent "serve the Lord with gladness"
        , pbVsIndent "and come before his presence with a song."
        , pbVs "Know this: the Lord himself is God;"
        , pbVsIndent "he himself has made us, and we are his;"
        , pbVsIndent "we are his people and the sheep of his pasture."
        , pbVs "Enter his gates with thanksgiving;"
        , pbVsIndent "go into his courts with praise;"
        , pbVsIndent "give thanks to him and call upon his Name."
        , pbVs "For the Lord is good;"
        , pbVsIndent "his mercy is everlasting;"
        , pbVsIndent "and his faithfulness endures from age to age."
        ]


kyriePantokrator : Html msg
kyriePantokrator =
    div []
        [ justText "Especially suitable for use during Lent"
        , canticle "Kyrie Pantokrator" "A Song of Penitence"
        , rubricBlack "Prayer of Manasseh, 1-2, 4, 6-7, 11-15"
        , pbVs "O Lord and Ruler of the hosts of heaven,"
        , pbVsIndent "God of Abraham, Isaac, and Jacob,"
        , pbVsIndent "and of all their righteous offspring:"
        , pbVs "You made the heavens and the earth,"
        , pbVsIndent "with all their vast array."
        , pbVs "All things quake with fear at your presence;"
        , pbVsIndent "they tremble because of your power."
        , pbVs "But your merciful promise is beyond all measure;"
        , pbVsIndent "it surpasses all that our minds can fathom."
        , pbVs "O Lord, you are full of compassion,"
        , pbVsIndent "long-suffering, and abounding in mercy."
        , pbVs "You hold back your hand;"
        , pbVsIndent "you do not punish as we deserve."
        , pbVs "In your great goodness, Lord,"
        , pbVsIndent "you have promised forgiveness to sinners,"
        , pbVsIndent "that they may repent of their sin and be saved."
        , pbVs "And now, O Lord, I bend the knee of my heart,"
        , pbVsIndent "and make my appeal, sure of your gracious goodness."
        , pbVs "I have sinned, O Lord, I have sinned,"
        , pbVsIndent "and I know my wickedness only too well."
        , pbVs "Therefore I make this prayer to you:"
        , pbVs "Forgive me, Lord, forgive me."
        , pbVs "Do not let me perish in my sin,"
        , pbVsIndent "nor condemn me to the depths of the earth."
        , pbVs "For you, O Lord, are the God of those who repent,"
        , pbVsIndent "and in me you will show forth your goodness."
        , pbVs "Unworthy as I am, you will save me,"
        , pbVsIndent "in accordance with your great mercy,"
        , pbVsIndent "and I will praise you without ceasing all the days of my life."
        , pbVs "For all the powers of heaven sing your praises,"
        , pbVsIndent "and yours is the glory to ages of ages. Amen."
        ]


lentVeniteAddOn : Html msg
lentVeniteAddOn =
    div []
        [ emptyLine
        , rubric "In Lent, and on other penitential occasions, the following verses are added."
        , pbVs "Do not harden your hearts, as at Meribah,"
        , pbVsIndent "as on the day at Massah in the wilderness,"
        , pbVsIndent "when your fathers put me to the test"
        , pbVsIndent "and put me to the proof, though they had seen my work."
        , pbVs "For forty years I loathed that generation"
        , pbVsIndent "and said, “They are a people who go astray in their heart,"
        , pbVsIndent "and they have not known my ways.”"
        , pbVs "Therefore I swore in my wrath,"
        , pbVsIndent "“They shall not enter my rest.”"
        , emptyLine
        ]


lordsPrayerTraditional : Bool -> Html msg
lordsPrayerTraditional trad =
    if trad then
        lordsPrayerTrad
    else
        lordsPrayerModern


lordsPrayerModern : Html msg
lordsPrayerModern =
    div []
        [ pbVs "Our Father in heaven, hallowed be your Name."
        , pbVs "Your kingdom come, your will be done, on earth as it is in heaven."
        , pbVs "Give us today our daily bread."
        , pbVs "And forgive us our sins as we forgive those who sin against us."
        , pbVs "Save us from the time of trial, and deliver us from evil."
        , pbVs "For the kingdom, the power, and the glory are yours,"
        , pbVsIndent "now and forever. Amen."
        ]


lordsPrayerTrad : Html msg
lordsPrayerTrad =
    div []
        [ pbVs "Our Father, who art in heaven, hallowed be thy Name."
        , pbVs "Thy kingdom come, thy will be done, on earth as it is in heaven."
        , pbVs "Give us this day our daily bread."
        , pbVs "And forgive us our trespasses, as we forgive those who trespass"
        , pbVsIndent "against us."
        , pbVs "And lead us not into temptation, but deliver us from evil."
        , pbVs "For thine is the kingdom, and the power, and the glory,"
        , pbVs "forever and ever. Amen."
        ]


magnaEtMirabilia : Html msg
magnaEtMirabilia =
    div []
        [ rubric "Especially suitable for use in Advent and Easter"
        , canticle "Magna et mirabilia" "The Song of the Redeemed"
        , rubricBlack "Revelation 15:3-4"
        , pbVs "O ruler of the universe, Lord God,"
        , pbVsIndent "great deeds are they that you have done,"
        , pbVsIndent "surpassing human understanding."
        , pbVs "Your ways are ways of righteousness and truth,"
        , pbVsIndent "O King of all the ages."
        , pbVs "Who can fail to do you homage, Lord,"
        , pbVsIndent "and sing the praises of your Name?"
        , pbVsIndent "for you only are the Holy One."
        , pbVs "All nations will draw near and fall down before you,"
        , pbVsIndent "because your just and holy works have been revealed."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be, world"
        , pbVsIndent "without end. Amen."
        ]


magnificat : Html msg
magnificat =
    div []
        [ canticle "Magnificat" "The Song of Mary"
        , rubricBlack "Luke 1:46-55"
        , pbVs "My soul magnifies the Lord,"
        , pbVsIndent "and my spirit rejoices in God my Savior."
        , pbVs "For he has regarded"
        , pbVsIndent "the lowliness of his handmaiden."
        , pbVs "For behold, from now on,"
        , pbVsIndent "all generations will call me blessed."
        , pbVs "For he that is mighty has magnified me,"
        , pbVsIndent "and holy is his Name."
        , pbVs "And his mercy is on those who fear him,"
        , pbVsIndent "throughout all generations."
        , pbVs "He has shown the strength of his arm;"
        , pbVsIndent "he has scattered the proud in the imagination of their hearts."
        , pbVs "He has brought down the mighty from their thrones,"
        , pbVsIndent "and has exalted the humble and meek."
        , pbVs "He has filled the hungry with good things,"
        , pbVsIndent "and the rich he has sent empty away."
        , pbVs "He, remembering his mercy, has helped his servant Israel,"
        , pbVsIndent "as he promised to our fathers, Abraham and his seed forever."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVsIndent "world without end. Amen."
        ]


mercy3 : Html msg
mercy3 =
    --    div [ style [ ( "margin", "0.7em 0" ) ] ]
    --        [ p [] [ text "Lord, have mercy upon us." ]
    --        , p [] [ italic "Christ, have mercy upon us." ]
    --        , p [] [ text "Lord, have mercy upon us." ]
    --        , p [ style [ ( "margin", "0.7em 0" ) ] ] [ italic "or" ]
    --        , p [] [ text "Lord, have mercy" ]
    --        , p [] [ italic "Christ, have mercy" ]
    --        , p [] [ text "Lord, have mercy" ]
    --        ]
    table [ class "mercy3" ]
        [ tr []
            [ td []
                [ p [] [ text "Lord, have mercy upon us." ]
                , p [] [ italic "Christ, have mercy upon us." ]
                , p [] [ text "Lord, have mercy upon us." ]
                ]
            , td [ class "mercy3-or" ] [ italic "or" ]
            , td []
                [ p [] [ text "Lord, have mercy" ]
                , p [] [ italic "Christ, have mercy" ]
                , p [] [ text "Lord, have mercy" ]
                ]
            ]
        ]


nuncDimittis : Html msg
nuncDimittis =
    div []
        [ canticle "Nunc dimittis" "The Song of Simeon"
        , rubricBlack "Luke 2:29-32"
        , pbVs "Lord, now let your servant depart in peace,"
        , pbVsIndent "according to your word."
        , pbVs "For my eyes have seen your salvation,"
        , pbVsIndent "which you have prepared before the face of all people;"
        , pbVs "to be a light to lighten the Gentiles,"
        , pbVsIndent "and to be the glory of your people Israel."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be, world"
        , pbVsIndent "without end. Amen."
        ]


paschaNostrum : Html msg
paschaNostrum =
    div []
        [ rubric """
      During the first week of Easter, the Pascha Nostrum
      will be used in place of the Invitatory Psalm. It is
      appropriate to use this canticle throughout Eastertide.
      """
        , canticle "Pascha Nostrum" "Christ our Passover"
        , rubricBlack "1 Corinthians 5:7-8; Romans 6:9-11; 1 Corinthians 15:20-22"
        , emptyLine
        , pbVs "Alleluia. Christ our Passover has been sacrificed for us;"
        , pbVsIndent "therefore let us keep the feast,"
        , pbVs "Not with the old leaven, the leaven of malice and evil,"
        , pbVsIndent "but with the unleavened bread of sincerity and truth. Alleluia."
        , pbVs "Christ being raised from the dead will never die again;"
        , pbVsIndent "death no longer has dominion over him."
        , pbVs "The death that he died, he died to sin, once for all;"
        , pbVsIndent "but the life he lives, he lives to God."
        , pbVs "So also consider yourselves dead to sin,"
        , pbVsIndent "and alive to God in Jesus Christ our Lord. Alleluia."
        , pbVs "Christ has been raised from the dead,"
        , pbVsIndent "the first fruits of those who have fallen asleep."
        , pbVs "For since by a man came death,"
        , pbVsIndent "by a man has come also the resurrection of the dead."
        , pbVs "For as in Adam all die,"
        , pbVsIndent "so also in Christ shall all be made alive. Alleluia."
        ]


phosHilaron : Html msg
phosHilaron =
    div []
        [ canticle "Phos hilaron" "O Gladsome Light"
        , pbVs "O gladsome light,"
        , pbVs "pure brightness of the ever-living Father in heaven,"
        , pbVs "O Jesus Christ, holy and blessed!"
        , pbVs "Now as we come to the setting of the sun,"
        , pbVs "and our eyes behold the vesper light,"
        , pbVs "we sing praises to God: the Father, the Son, and the Holy Spirit."
        , pbVs "You are worthy at all times to be praised by happy voices,"
        , pbVs "O Son of God, O Giver of Life,"
        , pbVs "and to be glorified through all the worlds."
        ]


prayerIntro : Html msg
prayerIntro =
    div []
        [ versicals
            [ ( "Officiant", "The Lord be with you." )
            , ( "People", "And with your spirit." )
            , ( "Officiant", "Let us pray." )
            ]
        ]


prayers : Html msg
prayers =
    div []
        [ versicals
            [ ( "Officiant", "O Lord, show us your mercy;" )
            , ( "People", "And grant us your salvation." )
            , ( "Officiant", "O Lord, save our nations;" )
            , ( "People", "And guide us in the way of justice and truth." )
            , ( "Officiant", "Clothe your ministers with righteousness;" )
            , ( "People", "And make your chosen people joyful." )
            , ( "Officiant", "O Lord, save your people;" )
            , ( "People", "And bless your inheritance." )
            , ( "Officiant", "Give peace in our time, O Lord;" )
            , ( "People", "For only in you can we live in safety." )
            , ( "Officiant", "Let not the needy, O Lord, be forgotten;" )
            , ( "People", "Nor the hope of the poor be taken away." )
            , ( "Officiant", "Create in us clean hearts, O God;" )
            , ( "People", "And take not your Holy Spirit from us." )
            ]
        ]


quaeriteDominum : Html msg
quaeriteDominum =
    div []
        [ rubric "Especially suitable for use during Lent"
        , canticle "Quaerite Dominum" "Seek the Lord while he wills to be found"
        , rubricBlack "Isaiah 55:6-11"
        , pbVs "Seek the Lord while he wills to be found;"
        , pbVsIndent "call upon him when he draws near."
        , pbVs "Let the wicked forsake their ways"
        , pbVsIndent "and the evil ones their thoughts;"
        , pbVs "And let them turn to the Lord, and he will have compassion,"
        , pbVsIndent "and to our God, for he will richly pardon."
        , pbVs "For my thoughts are not your thoughts,"
        , pbVsIndent "nor your ways my ways, says the Lord."
        , pbVs "For as the heavens are higher than the earth,"
        , pbVsIndent "so are my ways higher than your ways,"
        , pbVsIndent "and my thoughts than your thoughts."
        , pbVs "For as rain and snow fall from the heavens"
        , pbVsIndent "and return not again, but water the earth,"
        , pbVs "Bringing forth life and giving growth,"
        , pbVsIndent "seed for sowing and bread for eating,"
        , pbVs "So is my word that goes forth from my mouth;"
        , pbVsIndent "it will not return to me empty;"
        , pbVs "But it will accomplish that which I have purposed,"
        , pbVsIndent "and prosper in that for which I sent it."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be, world"
        , pbVsIndent "without end. Amen."
        ]


surgeIlluminare : Html msg
surgeIlluminare =
    div []
        [ rubric "Especially suitable for use during the season after Epiphany"
        , canticle "Surge, illuminare" "Arise, shine, for your light has come"
        , rubricBlack "Isaiah 60:1-3, 11a, 14c, 18-19"
        , pbVs "Arise, shine, for your light has come,"
        , pbVsIndent "and the glory of the Lord has dawned upon you."
        , pbVs "For behold, darkness covers the land;"
        , pbVsIndent "deep gloom enshrouds the peoples."
        , pbVs "But over you the Lord will rise,"
        , pbVsIndent "and his glory will appear upon you."
        , pbVs "Nations will stream to your light,"
        , pbVsIndent "and kings to the brightness of your dawning."
        , pbVs "Your gates will always be open;"
        , pbVsIndent "by day or night they will never be shut."
        , pbVs "They will call you, The City of the Lord,"
        , pbVsIndent "the Zion of the Holy One of Israel."
        , pbVs "Violence will no more be heard in your land,"
        , pbVsIndent "ruin or destruction within your borders."
        , pbVs "You will call your walls, Salvation,"
        , pbVsIndent "and all your portals, Praise."
        , pbVs "The sun will no more be your light by day;"
        , pbVsIndent "by night you will not need the brightness of the moon."
        , pbVs "The Lord will be your everlasting light,"
        , pbVsIndent "and your God will be your glory."
        , pbVs "Glory to the Father, and to the Son, and to the Holy Spirit;"
        , pbVsIndent "as it was in the beginning, is now, and ever shall be,"
        , pbVs "world without end. Amen."
        ]


teDeum : Html msg
teDeum =
    div []
        [ canticle "Te Deum Laudamus" "We Praise You, O God"
        , pbVs "We praise you, O God,"
        , pbVsIndent "we acclaim you as Lord;"
        , pbVsIndent "all creation worships you,"
        , pbVsIndent "the Father everlasting."
        , pbVs "To you all angels, all the powers of heaven,"
        , pbVs "The cherubim and seraphim, sing in endless praise:"
        , pbVsIndent "Holy, Holy, Holy, Lord God of power and might,"
        , pbVsIndent "heaven and earth are full of your glory."
        , pbVs "The glorious company of apostles praise you."
        , pbVs "The noble fellowship of prophets praise you."
        , pbVs "The white-robed army of martyrs praise you."
        , pbVs "Throughout the world the holy Church acclaims you:"
        , pbVsIndent "Father, of majesty unbounded,"
        , pbVsIndent "your true and only Son, worthy of all praise,"
        , pbVsIndent "the Holy Spirit, advocate and guide."
        , pbVs "You, Christ, are the king of glory,"
        , pbVsIndent "the eternal Son of the Father."
        , pbVs "When you took our flesh to set us free"
        , pbVsIndent "you humbly chose the Virgin’s womb."
        , pbVs "You overcame the sting of death"
        , pbVsIndent "and opened the kingdom of heaven to all believers."
        , pbVs "You are seated at God’s right hand in glory."
        , pbVsIndent "We believe that you will come to be our judge."
        , pbVs "Come then, Lord, and help your people,"
        , pbVsIndent "bought with the price of your own blood,"
        , pbVsIndent "and bring us with your saints"
        , pbVsIndent "to glory everlasting."
        , rubric "The following verses may be omitted "
        , pbVs "Save your people, Lord, and bless your inheritance;"
        , pbVsIndent "govern and uphold them now and always."
        , pbVs "Day by day we bless you;"
        , pbVsIndent "we praise your name forever."
        , pbVs "Keep us today, Lord, from all sin;"
        , pbVsIndent "have mercy on us, Lord, have mercy."
        , pbVs "Lord, show us your love and mercy,"
        , pbVsIndent "for we have put our trust in you."
        , pbVs "In you, Lord, is our hope,"
        , pbVsIndent "let us never be put to shame."
        ]


venite : Html msg
venite =
    div []
        [ canticle "Venite" "O Come"
        , rubricBlack "Psalm 95:1-7; 8-11"
        , emptyLine
        , pbVs "O come, let us sing to the Lord;"
        , pbVs "Let us make a joyful noise to the rock of our salvation!"
        , pbVs "Let us come into his presence with thanksgiving;"
        , pbVs "Let us make a joyful noise to him with songs of praise!"
        , pbVs "For the Lord is a great God, and a great King above all gods."
        , pbVs "In his hand are the depths of the earth;"
        , pbVsIndent "the heights of the mountains are his also."
        , pbVs "The sea is his, for he made it,"
        , pbVsIndent "and his hands formed the dry land."
        , pbVs "O come, let us worship and bow down;"
        , pbVsIndent "Let us kneel before the Lord, our Maker!"
        , pbVs "For he is our God, and we are the people of his pasture,"
        , pbVsIndent "and the sheep of his hand."
        , pbVs "O, that today you would hearken to his voice!"
        , emptyLine
        ]
