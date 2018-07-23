module Elm.Request.User exposing (storeSession)

-- module Request.User exposing (edit, login, register, storeSession)
-- import Http
-- import Json.Decode as Decode

import Elm.Data.AuthToken as AuthToken exposing (AuthToken, withAuthorization)
import Elm.Data.User as User exposing (User)
import Elm.Request.Helpers exposing (apiUrl)
import Elm.Ports as Ports
import Elm.Util as Util exposing ((=>))

import HttpBuilder exposing (RequestBuilder, withExpect, withQueryParams)
import Json.Encode as Encode
import Json.Encode.Extra as EncodeExtra


storeSession : User -> Cmd msg
storeSession user =
    User.encode user
        |> Encode.encode 0
        |> Just
        |> Ports.storeSession



-- login : { r | name : String, password : String } -> Cmd msg
-- login { name, password } =
--     let
--         user =
--             Encode.object
--                 [ "name" => Encode.string name
--                 , "password" => Encode.string password
--                 ]
--
--         body =
--             Encode.object [ "user" => user ]
--
--         --    |> Http.jsonBody
--     in
--     -- Decode.field "user" User.decoder
--     --        |> Http.post (apiUrl "/users/login") body
--     Ports.post [ apiUrl "/users/login", toString body ]
--
--
-- register : { r | username : String, name : String, password : String } -> Cmd msg
-- register { username, name, password } =
--     let
--         user =
--             Encode.object
--                 [ "username" => Encode.string username
--                 , "name" => Encode.string name
--                 , "password" => Encode.string password
--                 ]
--
--         body =
--             Encode.object [ "user" => user ]
--
--         --    |> Http.jsonBody
--     in
--     -- Decode.field "user" User.decoder
--     --     |> Http.post (apiUrl "/users") body
--     Ports.post [ apiUrl "/users", toString body ]
-- edit :
--     { r
--         | username : String
--         , name : String
--         , bio : String
--         , password : Maybe String
--         , image : Maybe String
--     }
--     -> Maybe AuthToken
--     -> Cmd msg
-- -> Http.Request User
-- edit { username, name, bio, password, image } maybeToken =
--     let
--         -- updates =
--         --     [ ( "username", Encode.string username )
--         --     , ( "name", Encode.string name )
--         --     , ( "bio", Encode.string bio )
--         --     , ( "image", Encode.string EncodeExtra.maybe Encode.string image )
--         --     , ( "password", Encode.string password )
--         --     ]
--         updates =
--             [ Just ("username" => Encode.string username)
--             , Just ("name" => Encode.string name)
--             , Just ("bio" => Encode.string bio)
--             , Just ("image" => EncodeExtra.maybe Encode.string image)
--             , Maybe.map (\pass -> "password" => Encode.string pass) password
--             ]
--                 |> List.filterMap identity
--
--         _ =
--             Debug.log "USER UPDATES" updates
--
--         fake =
--             Encode.object [ ( "fake", Encode.string username ) ]
--
--         --                body =
--         --                    ("User" => Encode.object updates)
--         --                        |> List.singleton
--         --                        |> Encode.object
--         --
--         --                --|> Http.jsonBody
--         --                expect =
--         --                    User.decoder
--         --                        |> Decode.field "user"
--         --
--         --                --|> Http.expectJson
--         --                url =
--         --                    apiUrl "/user"
--         --                        |> HttpBuilder.put
--         --                        |> HttpBuilder.withExpect expect
--         --                        |> HttpBuilder.withBody body
--         --                        |> withAuthorization maybeToken
--         --                        |> HttpBuilder.toRequest
--     in
--     Ports.updateUser fake
