port module Elm.Ports
    exposing
        ( dbSync
        , chatReceived
        , followCompleted
        , logInFail
        , logInSuccess
        , login
        , mpPsalms
        , onSessionChange
--        , post
        , register
        , registrationComplete
        , requestArticle
        , requestCalendar
        , requestFeed
        , requestLessons
        , requestOfficePsalms
        , requestProfile
        , requestPsalms
        , requestTags
        , requestedArticle
        , requestedCalendar
        , requestedFeed
        , requestedLessons
        , requestedProfile
        , requestedPsalms
        , requestedTags
        , storeSession
        , submitArticle
        , updateUser
        , updateUserComplete
        , error
        , profileRequest
        , toggleFollow
        )

import Elm.Data.User as User exposing (User, Username, usernameToString)
import Json.Encode as Encode exposing (Value)

-- SOME HELPERS FOR TOSS
tossEncodedListOfStrings : List (String, String) -> Cmd msg
tossEncodedListOfStrings fields =
    let
        objs (fld, val) =
            (fld, Encode.string val)
    in
    toss (Encode.object (List.map objs fields))
            

profileRequest : Username -> Username -> Cmd msg
profileRequest user author =
    tossEncodedListOfStrings
        [ ("request", "Profile")
        , ("username", (usernameToString user))
        , ("author", (usernameToString author))
        ]

login : String -> String -> Cmd msg
login username password =
    tossEncodedListOfStrings
        [ ("request", "Login")
        , ("email", username)
        , ("password", password)
        ]

register : String -> String -> String -> Cmd msg
register name username password =
    tossEncodedListOfStrings
        [ ("request", "Register")
        , ("email", name)
        , ("whoami", username)
        , ("password", password)
        ]

requestCalendar : Cmd msg
requestCalendar =
    tossEncodedListOfStrings [("request", "Calendar")]

requestLessons : String -> Cmd msg
requestLessons office =
    tossEncodedListOfStrings
        [ ( "request", "Lessons")
        , ( "office", office)
        ]
            
toggleFollow : Username -> Bool -> Cmd msg
toggleFollow username follow =
    toss (Encode.object
        [ ("request", Encode.string "ToggleFollow")
        , ("username", Encode.string (usernameToString username))
        , ("follow", Encode.bool follow)
        ]
        )

requestFeed : Maybe User -> String -> Int -> Int -> Cmd msg
requestFeed user feedSource limit offset =
    let
        username =
            case user of
                (Just u) -> usernameToString u.username
                _ -> ""

    in
            
    tossEncodedListOfStrings
        [ ("request", "Feed")
        , ("username", username)
        , ("feedSource", feedSource)
        , ("limit", toString limit)
        , ("offset", toString offset)
        ]

requestTags : Maybe User -> Cmd msg
requestTags user =
    let
        username =
            case user of
                (Just u) -> usernameToString u.username
                _ -> ""
            
    in

    tossEncodedListOfStrings
        [ ("request", "Tags")
        , ("username", username)
        ]

requestProfile : String -> Cmd msg
requestProfile profile =
    tossEncodedListOfStrings
        [ ("request", "Profie")
        , ("profile", profile)
        ]
            
requestOfficePsalms : String -> Cmd msg
requestOfficePsalms office =
    tossEncodedListOfStrings
        [ ("request", "OfficePsalms")
        , ("office", office)
        ]

-- SESSION

port storeSession : Maybe String -> Cmd msg


port onSessionChange : (Value -> msg) -> Sub msg



-- REQUEST PORTS --

port toss : Value -> Cmd msg


port requestArticle : Value -> Cmd msg


port requestPsalms : List ( Int, Int, Int ) -> Cmd msg


-- port requestTags : Maybe String -> Cmd msg


port submitArticle : Value -> Cmd msg


port updateUser : Value -> Cmd msg



-- SUBSCRIPTIONS --

port error : (Value -> msg) -> Sub msg


port dbSync : (Value -> msg) -> Sub msg

port followCompleted : (Value -> msg) -> Sub msg


port logInFail : (Value -> msg) -> Sub msg


port logInSuccess : (Value -> msg) -> Sub msg


port mpPsalms : (Value -> msg) -> Sub msg

port chatReceived : (Value -> msg) -> Sub msg


port portErrors : (Value -> msg) -> Sub msg


port registrationComplete : (Value -> msg) -> Sub msg


port requestedArticle : (Value -> msg) -> Sub msg


port requestedCalendar : (Value -> msg) -> Sub msg


port requestedFeed : (Value -> msg) -> Sub msg


port requestedLessons : (Value -> msg) -> Sub msg


port requestedProfile : (Value -> msg) -> Sub msg


port requestedPsalms : (Value -> msg) -> Sub msg


port requestedTags : (Value -> msg) -> Sub msg


port updateUserComplete : (Value -> msg) -> Sub msg
