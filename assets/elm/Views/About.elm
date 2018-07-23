module Elm.Views.About exposing (about)

import Html exposing (div)
-- import Html.Attributes exposing (class, style)
-- import Elm.Util as Util exposing ((=>))
import Markdown


view : Html msg
view =
  div [] [ Markdown.toHtml [] """
#### About Iphod
* It is a work in progress
* Inerrancy is not gauranteed, so don't expect it
* Facebook group at https://www.facebook.com/groups/471879323003692/
  * report errors
  * make suggestions
  * ask questions
* So far this is a work of my (aka: Paul Sutcliffe+) own doing
* shows assigned readings and ESV text for the ACNA Red Letter, Sunday Lectionary, and Daily Prayer. Current fails include...
  * partial verses mean nothing to the ESV API, so in this app only complete verses are shown

#### Want to help?
* this is an open source project
* you can fork the project at https://github.com/frpaulas/iphod

#### Tech stuff
* Written mostly in Elm (http://http://elm-lang.org/)
* Uses CouchDb as it's database
* Uses PouchDb as it's localdatabase - in order to work off line
* It's open source
  * https://github.com/frpaulas/iphod
* Other project
  * open source donation/donor tracking at https://github.com/frpaulas/saints
  * fun run at elmsaints.heroku.com
  * log in with user name: guest, password: password

* About Me
  * for lack of a better word, I'm a retired-from-day-job-for-lack-of-employment-bi-vocational-priest
  * (hyphenation was the only way I could do it in one word)
  * Rector at a completely unsuccessful (from a worldly POV), tiny ACNA church near Pittsburgh.
  * Let it be said however, to the best of my knowledge, the first ever planted inside a retirement community
  * no roof to worry about, etc.
  * we give all our money away



"""
]