module Elm.Views.Collects exposing (..)

import Elm.Page.Office.Format exposing (emptyLine, orThis, pbSection, rubric, withAmen)
import Html exposing (..)


collects : List String -> Html msg
collects texts =
    let
        multipleText =
            List.intersperse "orthis" texts

        display str =
            if str == "orthis" then
                orThis
            else
                text str
    in
    div [] (List.map display multipleText)


epCollectOfDay : Int -> Html msg
epCollectOfDay dayOfWeek =
    let
        thisCollect =
            case dayOfWeek of
                0 ->
                    epSunday

                1 ->
                    epMonday

                2 ->
                    epTuesday

                3 ->
                    epWednesday

                4 ->
                    epThursday

                5 ->
                    epFriday

                6 ->
                    epSaturday

                _ ->
                    div [] []
    in
    div []
        [ thisCollect
        , epMission
        ]


mpCollectOfDay : Int -> Html msg
mpCollectOfDay dayOfWeek =
    let
        thisCollect =
            case dayOfWeek of
                0 ->
                    mpSunday

                1 ->
                    mpMonday

                2 ->
                    mpTuesday

                3 ->
                    mpWednesday

                4 ->
                    mpThursday

                5 ->
                    mpFriday

                6 ->
                    mpSaturday

                _ ->
                    div [] []
    in
    div []
        [ thisCollect
        , mpMission
        ]


epSunday : Html msg
epSunday =
    div []
        [ pbSection "A Collect for Resurrection Hope (Sunday)"
        , withAmen """
        Lord God, whose Son our Savior Jesus Christ triumphed over the powers of death and prepared for
        us our place in the new Jerusalem: Grant that we, who have this day given thanks for his
        resurrection, may praise you in that City of which he is the light, and where he lives and reigns
        forever and ever.
        """
        ]


epMonday : Html msg
epMonday =
    div []
        [ pbSection "A Collect for Peace (Monday)"
        , withAmen """
        O God, the source of all holy desires, all good counsels, and all just works: Give to your servants
        that peace which the world cannot give, that our hearts may be set to obey your commandments,
        and that we, being defended from the fear of our enemies, may pass our time in rest and quietness,
        through the merits of Jesus Christ our Savior.
        """
        ]


epTuesday : Html msg
epTuesday =
    div []
        [ pbSection "A Collect for Aid against Perils (Tuesday)"
        , withAmen """
        Lighten our darkness, we beseech you, O Lord; and by your great mercy defend us from all perils
        and dangers of this night; for the love of your only Son, our Savior Jesus Christ.
        """
        ]


epWednesday : Html msg
epWednesday =
    div []
        [ pbSection "A Collect for Protection (Wednesday)"
        , withAmen """
        O God, the life of all who live, the light of the faithful, the strength of those who labor, and the
        repose of the dead: We thank you for the blessings of the day that is past, and humbly ask for your
        protection through the coming night. Bring us in safety to the morning hours; through him who
        died and rose again for us, your Son our Savior Jesus Christ.
        """
        ]


epThursday : Html msg
epThursday =
    div []
        [ pbSection "A Collect for the Presence of Christ (Thursday)"
        , withAmen """
        Lord Jesus, stay with us, for evening is at hand and the day is past; be our companion in the way,
        kindle our hearts, and awaken hope, that we may know you as you are revealed in Scripture and the
        breaking of bread. Grant this for the sake of your love.
        """
        ]


epFriday : Html msg
epFriday =
    div []
        [ pbSection "A Collect for Faith (Friday)"
        , withAmen """
        Lord Jesus Christ, by your death you took away the sting of death: Grant to us your servants so to
        follow in faith where you have led the way, that we may at length fall asleep peacefully in you and
        wake up in your likeness; for your tender mercies’ sake.
        """
        ]


epSaturday : Html msg
epSaturday =
    div []
        [ pbSection "A Collect for the Eve of Worship (Saturday)"
        , withAmen """
        O God, the source of eternal light: Shed forth your unending day
        upon us who watch for you, that our lips may praise you, our lives
        may bless you, and our worship on the morrow give you glory; through Jesus Christ our Lord.
        """
        ]


epMission : Html msg
epMission =
    div []
        [ rubric "Unless the Eucharist is to follow, one of the following prayers for mission is added."
        , withAmen """
        O God and Father of all, whom the whole heavens adore: Let the whole earth also worship you, all
        nations obey you, all tongues confess and bless you, and men, women and children everywhere love
        you and serve you in peace; through Jesus Christ our Lord.
        """
        , emptyLine
        , withAmen """
        Keep watch, dear Lord, with those who work, or watch, or weep this night, and give your angels
        charge over those who sleep. Tend the sick, Lord Christ; give rest to the weary, bless the dying,
        soothe the suffering, pity the afflicted, shield the joyous; and all for your love’s sake.
        """
        , emptyLine
        , withAmen """
        O God, you manifest in your servants the signs of your presence: Send forth upon us the Spirit of
        love, that in companionship with one another your abounding grace may increase among us;
        through Jesus Christ our Lord.
        """
        ]


mpSunday : Html msg
mpSunday =
    div []
        [ pbSection "A Collect for Strength to Await Christ’s Return (Sunday)"
        , withAmen """
        O God our King, by the resurrection of your Son Jesus Christ on the first day of the week, you
        conquered sin, put death to flight, and gave us the hope of everlasting life: Redeem all our days by
        this victory; forgive our sins, banish our fears, make us bold to praise you and to do your will; and
        steel us to wait for the consummation of your kingdom on the last great Day; through the same
        Jesus Christ our Lord.
        """
        ]


mpMonday : Html msg
mpMonday =
    div []
        [ pbSection "A Collect for the Renewal of Life (Monday)"
        , withAmen """
        O God, the King eternal, whose light divides the day from the night and turns the shadow of death
        into the morning: Drive far from us all wrong desires, incline our hearts to keep your law, and guide
        our feet into the way of peace; that, having done your will with cheerfulness during the day, we may,
        when night comes, rejoice to give you thanks; through Jesus Christ our Lord.
        """
        ]


mpTuesday : Html msg
mpTuesday =
    div []
        [ pbSection "A Collect for Peace (Tuesday)"
        , withAmen """
            O God, the author of peace and lover of concord, to know you is eternal life and to serve you is
            perfect freedom: Defend us, your humble servants, in all assaults of our enemies; that we, surely
            trusting in your defense, may not fear the power of any adversaries, through the might of Jesus
            Christ our Lord.
                """
        ]


mpWednesday : Html msg
mpWednesday =
    div []
        [ pbSection "A Collect for Grace (Wednesday)"
        , withAmen """
            O Lord, our heavenly Father, almighty and everlasting God, you have brought us safely to the
            beginning of this day: Defend us by your mighty power, that we may not fall into sin nor run into
            any danger; and that guided by your Spirit, we may do what is righteous in your sight; through Jesus
            Christ our Lord.
                """
        ]


mpThursday : Html msg
mpThursday =
    div []
        [ pbSection "A Collect for Guidance (Thursday)"
        , withAmen """
            Heavenly Father, in you we live and move and have our being: We humbly pray you so to guide and
            govern us by your Holy Spirit, that in all the cares and occupations of our life we may not forget
            you, but may remember that we are ever walking in your sight; through Jesus Christ our Lord.
            """
        ]


mpFriday : Html msg
mpFriday =
    div []
        [ pbSection "A Collect for Endurance (Friday)"
        , withAmen """
            Almighty God, whose most dear Son went not up to joy but first he suffered pain, and entered not
            into glory before he was crucified: Mercifully grant that we, walking in the way of the cross, may find
            it none other than the way of life and peace; through Jesus Christ your Son our Lord.
                """
        ]


mpSaturday : Html msg
mpSaturday =
    div []
        [ pbSection "A Collect for Sabbath Rest (Saturday)"
        , withAmen """
            Almighty God, who after the creation of the world rested from all your works and sanctified a day
            of rest for all your creatures: Grant that we, putting away all earthly anxieties, may be duly prepared
            for the service of your sanctuary, and that our rest here upon earth may be a preparation for the
            eternal rest promised to your people in heaven; through Jesus Christ our Lord.
                """
        ]


mpMission : Html msg
mpMission =
    div []
        [ rubric "Unless The Great Litany or the Eucharist is to follow, one of the following prayers for mission is added."
        , emptyLine
        , withAmen """
            Almighty and everlasting God, who alone works great marvels: Send down upon our clergy and the
            congregations committed to their charge the life-giving Spirit of your grace, shower them with the
            continual dew of your blessing, and ignite in them a zealous love of your Gospel, through Jesus
            Christ our Lord.
                """
        , emptyLine
        , withAmen """
            O God, you have made of one blood all the peoples of the earth, and sent your blessed Son to
            preach peace to those who are far off and to those who are near: Grant that people everywhere may
            seek after you and find you; bring the nations into your fold; pour out your Spirit upon all flesh; and
            hasten the coming of your kingdom; through Jesus Christ our Lord.
                """
        , emptyLine
        , withAmen
            """
            Lord Jesus Christ, you stretched out your arms of love on the hard wood of the cross that everyone
            might come within the reach of your saving embrace: So clothe us in your Spirit that we, reaching
            forth our hands in love, may bring those who do not know you to the knowledge and love of you;
            for the honor of your Name.
                """
        ]
