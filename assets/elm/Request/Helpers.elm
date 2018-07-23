module Elm.Request.Helpers exposing (apiUrl, articleUrl, iphodUrl, tagsUrl, userUrl)


apiUrl : String -> String
apiUrl str =
    "https://conduit.productionready.io/api" ++ str


iphodUrl : String -> String
iphodUrl str =
    "http://legereme.com:5984/iphod" ++ str


tagsUrl : String -> String
tagsUrl str =
    "http://legereme.com:5984" ++ str


userUrl : String -> String
userUrl str =
    "http://legereme.com:5984/_user" ++ str


articleUrl : String -> String
articleUrl str =
    "http://legereme.com:5984" ++ str
