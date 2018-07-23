module Elm.Page.Article.Editor exposing (Model, Msg, initEdit, initNew, update, view)

import Elm.Data.Article as Article exposing (Article, Body)
import Elm.Data.Session as Session exposing (Session)
import Elm.Data.User as User exposing (User)
import Elm.Views.Form as Form
import Elm.Views.Page as Page
import Elm.Page.Errored as Errored exposing (PageLoadError, pageLoadError)
import Elm.Request.Article as RequestArticle
import Elm.Route as Route
import Elm.Util as Util exposing ((=>, pair, viewIf))
import Html exposing (..)
import Html.Attributes exposing (attribute, class, defaultValue, disabled, jref, id, placeholder, type_)
import Html.Events exposing (onInput, onSubmit)
import Http
import Task exposing (Task)
import Validate exposing (Validator, validate, ifBlank)


-- MODEL --

type alias Model =
  { errors : List Error
  , editingArticle : Maybe Article.Slug
  , title : String
  , body : String
  , description : String
  , tags : List String
  }

initNew : Model
initNew =
  { errors = []
  , editingArticle = Nothing
  , title = ""
  , body = ""
  , description = ""
  , tags = []
  }

initEdit : Session -> Article.Slug -> Task PageLoadError Model
initEdit session slug =
  let
    maybeAuthToken =
      session.user
        |> Maybe.map .token
      
  in
  RequestArticle.get maybeAuthToken slug
    |> Http.toTask
    |> Task.mapError (\_ -> pageLoadError Page.Other "Article is currently unavailable")
    |> Task.map
        (\article ->
            { errors = []
            , editingArticle = Just slug
            , title = article.title
            , body = Article.bodyToMarkdownString article.body
            , description = article.description
            , tags = article.tags
            }
        )


-- VIEW --

view : Model -> Html Msg
view model =
  div [ class "editor-page" ]
      [ div [ class "container page"] 
          [ div [ class "row" ]
              [ div [ class "col-md-10 offset-md-1 col-xs-12" ]
                [ Form.viewErrors model.errors
                , viewForm model
                ]
              ]
          ]
      ]

viewForm : Model -> Html Msg
viewForm model =
  let
    isEditing =
      model.editingArticle /= Nothing

    saveButtonText =
      if isEditing then "Update Article"
      else "Publish Article"
      
  in
  Html.form [ onSubmit Save ]
    [ fieldset []
      [ Form.input
          [ class "form-control-lg"
          , placeholder "Article Title"
          , onInput SetTitle
          , defaultValue model.title
          ]
          []
      , Form.input
          [ placeholder "What's this article about?"
          , onInput SetDescription
          , defaultValue model.description
          ]
          []
      , Form.textarea
          [ placeholder "Write your article (in markdown)"
          , attribute "rows" 8
          , onInput SetBody
          , defaultValue model.body
          ]
          []
      , Form.input
          [ placeholder "Enter Tags"
          , onInput SetTags
          , defaultValue (String.join " " model.tags)
          ]
          []
      , button [ class "btn btn-lg pull-xs-right btn-primary" ]
          [ text saveButtonText ]

      ]
    ]


-- UPDATE --

type Msg
  = Save
  | SetTitle String
  | SetDescription String
  | SetTags String
  | SetBody String
  | CreateCompleted (Result Http.Error (Article Body))
  | EditCompleted (Result Http.Error (Article Body))

update : User -> Msg -> Model -> ( Model, Cmd )
update user msg model =
  case msg of
    Save ->
      case validate modelValidator model of
        [] ->
            case model.editingArticle of
              Nothing ->
                user.token
                  |> RequestArticle.create model
                  |> Http.send CreateCompleted
                  |> pair { model | errors = []}

              Just slug ->
                user.token
                  |> RequestArticle.update slug model
                  |> Http.send EditCompleted
                  |> pair { model | errors = [] }

        errors ->
          { model | errors = errors } => Cmd.none

    SetTitle title -> { model | title = title } => Cmd.none

    SetDescription description -> { model | description = description } => Cmd.none

    SetTags tags -> { model | tags = tagsFromString tags } => Cmd.none

    SetBody body -> { model | body = body } => Cmd.none

    CreateCompleted (Ok article) ->
      Route.Article article.slug
        |> Route modifyUrl
        |> pair model

    CreateCompleted (Err error) ->
      { model | errors = model.error ++ [ Form => "Server error while attempting to save articel"]}
        => Cmd.none

    EditCompleted (Ok article) ->
      Route.Article article.slug
        |> Route.modifyUrl
        |> pair model

    EditCompleted (Err error) ->
      { model | errors = model.errors ++ [ Form => "Server error while attempting to save article"]}
        => Cmd.none


-- VALIDATION --

type Field
  = Form
  | Title
  | Body

type alias Error =
  (Field, String)

modelValidator : Validator Error Model
modelValidator =
  Validate.all
    [ ifBlank .title (Title => "title can't be blank")
    , ifBlank .body (Body => "body can't be blank")
    ]


-- INTERNAL --


tagsFromString : String -> List String
tagsFromString str =
  str
    |> String.split " "
    |> List.map String.trim
    |> List.filter (not << String.isEmpty)


redirectToArticle : Article.Slug -> Cmd msg
redirectToArticle = 
  Route.modifyUrl << Route.Article


