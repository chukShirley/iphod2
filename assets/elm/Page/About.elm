module Elm.Page.About exposing (Model, Msg, init, update, view)

import Html exposing (..)
import Html.Attributes exposing (..)


-- MODEL --

type alias Model =
  { errors : List String
  }


init : Model
init =
  { errors = []
  }


-- VIEW -- 

-- view : Session -> Model -> Html Msg
-- view session model =
--   div []
--       [ text "MORNING PRAYER GOES HERE"]

view : Model -> Html Msg
view model =
  div []
      [ text "About Goes Here"]


-- UPDATE -- 


type Msg
  = NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    NoOp -> (model, Cmd.none)

