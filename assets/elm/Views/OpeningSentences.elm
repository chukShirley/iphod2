module Elm.Views.OpeningSentences exposing (epDaysOfThanksgiving, epOpeningSentences, mpOpeningSentences)

import Elm.Page.Office.Format as Format exposing (..)
import Html exposing (..)


mpOpeningSentences : String -> Html msg
mpOpeningSentences season =
    div []
        [ rubric
            """
          The Officiant may begin Morning Prayer by reading an opening sentence of Scripture. One of the following, or a sentence from among those
          provided at the end of the Office, is customary.
        """
        , bibleText
            "Grace to you and peace from God our Father and the Lord Jesus Christ."
            "Philippians 1:2"
        , orThis
        , bibleText
            "I was glad when they said to me, “Let us go to the house of the Lord!”"
            "Psalm 122:1"
        , orThis
        , bibleText
            """
            Let the words of my mouth and the meditation of my heart be acceptable in your sight, O Lord, my
            rock and my redeemer.
          """
            "Psalm 19:14"
        , case season of
            "advent" ->
                openingSentence
                    ( "Advent"
                    , "In the wilderness prepare the way of the Lord; make straight in the desert a highway for our God."
                    , "Isaiah 40:3"
                    )

            "christmas" ->
                openingSentence
                    ( "Christmas"
                    , """Fear not, for behold, I bring you good news of a great joy that will be for all people. For unto you is
                  born this day in the city of David a Savior, who is Christ the Lord."""
                    , "Luke 2:10-11"
                    )

            "epiphany" ->
                openingSentence
                    ( "Epiphany"
                    , """From the rising of the sun to its setting my name will be great among the nations, and in every place
                  incense will be offered to my name, and a pure offering. For my name will be great among the
                  nations, says the Lord of hosts."""
                    , "Malachi 1:11"
                    )

            "lent" ->
                div []
                    [ openingSentence
                        ( "Lent and other Penitential Occasions"
                        , "Repent, for the kingdom of heaven is at hand."
                        , "Matthew 3:2"
                        )
                    , bibleText
                        "Hide your face from my sins, and blot out all my iniquities."
                        "Psalm 51:9"
                    , bibleText
                        "If anyone would come after me, let him deny himself and take up his cross and follow me."
                        "Mark 8:34"
                    ]

            "holyweek" ->
                openingSentence
                    ( "Holy Week"
                    , """Is it nothing to you, all you who pass by? Look and see if there is any sorrow like my sorrow, which
                    was brought upon me, which the Lord inflicted on the day of his fierce anger."""
                    , "Lamentations 1:12"
                    )

            "easter" ->
                div []
                    [ openingSentence
                        ( "Easter"
                        , """If then you have been raised with Christ, seek the things that are above, where Christ is, seated at
                                the right hand of God."""
                        , "Colossians 3:1"
                        )
                    , bibleText
                        "Alleluia. Christ is risen. The Lord is risen indeed. Alleluia."
                        "Mark 16:6 and Luke 24:34"
                    ]

            "ascension" ->
                openingSentence
                    ( "Ascension"
                    , """Since then we have a great high priest who has passed through the heavens, Jesus, the Son of God,
                    let us hold fast our confession. Let us then with confidence draw near to the throne of grace, that
                    we may receive mercy and find grace to help in time of need."""
                    , "Hebrews 4:14, 16"
                    )

            "pentecost" ->
                openingSentence
                    ( "Pentecost"
                    , """You will receive power when the Holy Spirit has come upon you, and you will be my witnesses in
                    Jerusalem and in all Judea and Samaria, and to the end of the earth."""
                    , "Acts 1:8"
                    )

            "trinity" ->
                openingSentence
                    ( "Trinity Sunday"
                    , "Holy, holy, holy, is the Lord God Almighty, who was and is and is to come!"
                    , "Revelation 4:8"
                    )

            _ ->
                div [] []
        , openingSentence
            ( "Days of Thanksgiving"
            , """Honor the Lord with your wealth and with the firstfruits of all your produce; then your barns will be
                        filled with plenty, and your vats will be bursting with wine."""
            , "Proverbs 3:9-10"
            )
        , openingSentence
            ( "At any time"
            , "The Lord is in his holy temple; let all the earth keep silence before him."
            , "Habakkuk 2:20"
            )
        , bibleText
            "Send out your light and your truth; let them lead me; let them bring me to your holy hill and to your dwelling!"
            "Psalm 43:3"
        , bibleText
            """Thus says the One who is high and lifted up, who inhabits eternity, whose name is Holy: “I dwell in
              the high and holy place, and also with him who is of a contrite and lowly spirit, to revive the spirit of
              the lowly, and to revive the heart of the contrite.”"""
            "Isaiah 57:15"
        , bibleText
            """The hour is coming, and is now here, when the true worshipers will worship the Father in spirit and
              truth, for the Father is seeking such people to worship him."""
            "John 4:23"
        ]


epOpeningSentences : String -> Html msg
epOpeningSentences season =
    div []
        [ rubric """The Officiant may begin Evening Prayer by reading an opening sentence of Scripture.
            One of the following, or a sentence from among
            those provided at the end of the Office, is customary.
            """
        , bibleText
            """Jesus spoke to them, saying, “I am the light of the world. Whoever follows me will not walk in
            darkness, but will have the light of life.”"""
            "John 8:12"
        , orThis
        , bibleText
            "O Lord, I love the habitation of your house and the place where your glory dwells."
            "Psalm 26:8"
        , orThis
        , bibleText
            """Let my prayer be set forth in your sight as incense,
            the lifting up of my hands as the evening sacrifice."""
            "Psalm 141:2"
        , case season of
            "advent" ->
                openingSentence
                    ( "Advent"
                    , """
                        Therefore stay awake – for you do not know when the master of the house will come, in the
                        evening, or at midnight, or when the cock crows, or in the morning – lest he come suddenly and
                        find you asleep.
                    """
                    , "Mark 13:35-36"
                    )

            "christmas" ->
                openingSentence
                    ( "Christmas"
                    , """Behold, the dwelling place of God is with man. He will dwell with them, and they will be his people,
                        and God himself will be with them as their God."""
                    , "Revelation 21:3"
                    )

            "epiphany" ->
                openingSentence
                    ( "Epiphany"
                    , "Nations shall come to your light, and kings to the brightness of your rising."
                    , "Isaiah 60:3"
                    )

            "lent" ->
                div []
                    [ openingSentence
                        ( "Lent"
                        , """
                            If we say we have no sin, we deceive ourselves, and the truth is not in us. If we confess our sins, he
                            is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.
                          """
                        , "1 John 1:8-9"
                        )
                    , bibleText
                        "For I know my transgressions, and my sin is ever before me."
                        "Psalm 51:3"
                    , bibleText
                        "To the Lord our God belong mercy and forgiveness, for we have rebelled against him."
                        "Daniel 9:9"
                    ]

            "holyweek" ->
                openingSentence
                    ( "Holy Week"
                    , """All we like sheep have gone astray; we have turned every one to his own way; and the Lord has laid
                        on him the iniquity of us all."""
                    , "Isaiah 53:6"
                    )

            "easter" ->
                openingSentence
                    ( "Easter"
                    , "Thanks be to God, who gives us the victory through our Lord Jesus Christ."
                    , "1 Corinthians 15:57"
                    )

            "ascension" ->
                openingSentence
                    ( "Ascension"
                    , """For Christ has entered, not into holy places made with hands, which are copies of the true things,
                        but into heaven itself, now to appear in the presence of God on our behalf."""
                    , "Hebrews 9:24"
                    )

            "pentecost" ->
                div []
                    [ openingSentence
                        ( "Pentecost"
                        , """The Spirit and the Bride say, “Come.” And let the one who hears say, “Come.” And let the one who
                        is thirsty come; let the one who desires take the water of life without price."""
                        , "Revelation 22:17"
                        )
                    , bibleText
                        "There is a river whose streams make glad the city of God, the holy habitation of the Most High."
                        "Psalm 46:4"
                    ]

            "trinity" ->
                openingSentence
                    ( "Trinity Sunday"
                    , "Holy, holy, holy, is the Lord God of Hosts; the whole earth is full of his glory!"
                    , "Isaiah 6:3"
                    )

            _ ->
                div [] []
        ]


epDaysOfThanksgiving : Html msg
epDaysOfThanksgiving =
    div []
        [ openingSentence
            ( "Days of Thanksgiving"
            , """The Lord by wisdom founded the earth; by understanding he established the heavens; by his
            knowledge the deeps broke open, and the clouds drop down the dew."""
            , "Proverbs 3:19-20"
            )
        , openingSentence
            ( "At any time"
            , "Worship the Lord in the beauty of holiness; let the whole earth tremble before him."
            , "Psalm 96:9"
            )
        , bibleText
            """
            I will bless the Lord who gives me counsel; my heart teaches me, night after night. I have set the
            Lord always before me; because he is at my right hand, I shall not fall.
        """
            "Psalm 16:7-8"
        ]
