module Elm.Page.Narthex exposing (Model, Msg, subscriptions, view, init)

import Html exposing(..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Elm.Ports as Ports exposing(chatReceived)
import Elm.Data.Session as Session exposing (Session)

import Json.Encode as Encode
import Json.Decode as Decode exposing (Decoder)
import Json.Decode.Pipeline as Pipeline exposing (decode, hardcoded, required, optional)
import Elm.Util as Util exposing ((=>))


type alias Chat =
  { name: String
  , message: String
  }

type alias Model =
  { newMessage : String
  , messages : List Chat 
  }

init : Model
init =
  { newMessage = ""
  , messages = [{name = "TEst", message = "Test Message"}]
  }

chatDecoder : Decoder Chat
chatDecoder =
    decode Chat
        |> Pipeline.required "name" Decode.string
        |> Pipeline.required "message" Decode.string
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
    [ Sub.map ReceiveChat receiveChat
    ]


receiveChat : Sub (Maybe Chat)
receiveChat =
    Ports.chatReceived (Decode.decodeValue chatDecoder >> Result.toMaybe)

type Msg
  = ReceiveChat (Maybe Chat)

update : Session -> Msg -> Model -> (Model, Cmd Msg)
update session msg model =
  case msg of
    ReceiveChat (Just chat) ->
      {model | messages = (chat :: model.messages)} => Cmd.none

    ReceiveChat Maybe.Nothing ->
      let
          _ =
              Debug.log "RECEIVE CHAT: " "ERROR"
      in
      model => Cmd.none    



-- VIEW

view : Model -> Html Msg
view model =
  let
    drawMessages messages =
      messages |> List.map viewMessage
  in
  div [] 
  [ Html.form [] 
    [ input [] []
    , button [] [ text "Submit" ]
    ]
  , ul [class "list"] (model.messages |> drawMessages)
  ]      



viewMessage : Chat -> Html Msg
viewMessage chat =
    li [] [ text (chat.name ++ "sez:" ++ chat.message)]
