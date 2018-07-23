// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"
import $ from 'jquery';

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".


import socket from "./socket"

// Narthex Client Code...

var channel = socket.channel('narthex:lobby', {}); // connect to the chat room

channel.on('shout', function (payload){
  port.chatReceived.send(payload);
  var li = document.createElement("li");
  var name = payload.name || 'guest';
  li.innerHTML = '<b>' + name + '</b>: ' + payload.message;
  ul.appendChild(li);
});

channel.join();



var ul = document.getElementById('msg-list')
  , name = document.getElementById('name')
  , msg = document.getElementById('msg')
  ;

// listen for the [Enter] keypress to send a message
// msg.addEventListener('keypress', function(event){
//   if (event.keyCode == 13 && msg.value.length > 0) { // no empty msgs!
//     channel.push('shout', 
//       { name: name.value
//       , message: msg.value
//       });
//     msg.value = '';
//   }
// });

// END OF NARTHEX CLIENT CODE

// ALL THE ELMPHOD STUFF

import PouchDB from "pouchdb";
// import PouchAuth from "pouchdb-authentication";
import PouchFind from "pouchdb-find";
PouchDB.plugin(PouchFind);
// PouchDB.plugin(PouchAuth);

// import { Elm } from '../elm/Main.elm';
import registerServiceWorker from './registerServiceWorker';

import Elm from './main'
const elmContainer = document.getElementById("elm-container");
var elmMain = Elm.Main.embed(elmContainer);
var port = elmMain.ports;

// import Ports from './ports'
// const portsContainer = document.getElementById("ports-container");




var LitYear = require( "./lityear.js");

var slugify = require('slugify');
var Bible = require('./bibleRef.js');

var moment = require('moment')
  , markdown = require('markdown').markdown
  , path = window.location.pathname
  , path_parts = path.split("/").filter( function(el) {return el.length > 0})
  , page = (path_parts.length > 0) ? path_parts[0] : 'office'
  , isOffice = ["mp", "morningPrayer", "midday", "ep", "eveningPrayer"].indexOf(page) >= 0
  , preferenceList = undefined // set in initElmHeader
  , preferenceObj = {ot: "ESV", ps: "BCP", nt: "ESV", gs: "ESV"} // defaults
  , now = moment()
  , date_today = now.format("dddd MMMM D, YYYY")
  , date_today_short = now.format("ddd MMM DD, YYYY")
  , tz = now.format("ZZ")
  , am = now.format("A")
  , localDb = new PouchDB('iphod') // to be synced with main couchDB
  , db = new PouchDB('http://admin:nettlesomewordprocessor@legereme.com:5984/iphod', {skip_setup: true})
  , userDb = new PouchDB('http://admin:nettlesomewordprocessor@legereme.com:5984/_users', {skip_setup: true})
  , session = null
  , articleDb = new PouchDB("http://legereme.com:5984/articles")
  , tagDb = new PouchDB("http://legereme.com:5984/tags")
  ;



// userDb.hashAdminPasswords({'admin':'lefthandpizzaboy'}).then(function(hashed){
//   console.log("HASHED: ", hashed)
// })

// userDb.useAsAuthenticationDB().then(function(resp){
//   console.log("USE AS AUTHENTICATION DB", resp)
// })


// test for on/off line
// (function($){ })(jQuery);
// window.addEventListener('load', function() {
$(document).ready(function() {
  var status = document.getElementById("status")
    , log = document.getElementById("log")
    //, navButton = document.getElementById("navButton")
    //, navMenu = document.getElementById("navMenu")
    , pageLinks = $(".pageLink")
    ;

  $("body").on('click', '#navButton', function() { toggleNavMenu() });
  $("body").on('click', '.pageLink', function() { toggleNavMenu() });


  function toggleNavMenu() {
    if ($("#navMenu").hasClass("dn") ) 
      { $("#navMenu").removeClass("dn").addClass("db") }
    else
      { $("#navMenu").removeClass("db").addClass("dn") }    
  }

  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline"

    $("#status").addClass(condition);
    $("#status").html(condition.toUpperCase());

//    elmCalApp.ports.portOnline.send(condition == "online");
//    log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status " + condition);
  }

//  window.addEventListener('online', updateOnlineStatus);
//  window.addEventListener('offline', updateOnlineStatus);
});


//  , isOffice = !!(path == "/" || path.match(/office|midday|^\/mp\/|morningPrayer|mp_cutrad|mp_cusimp|晨禱傳統|晨禱簡化|^\/ep\/|eveningPrayer|ep_cutrad|ep_cusimp|晚報傳統祈禱|晚祷简化/))
// if (page == "office") { 
//   // redirect to correct office based on local time
//   var mid = moment().local().hour(11).minute(30).second(0)
//     , ep = moment().local().hour(15).minute(0).second(0)
//     , versions = "/" + preferenceObj.ps + "/" + preferenceObj.ot
//     ;
//   if ( now.isBefore(mid)) { window.location.replace("/mp" + versions) }
//   else if ( now.isBefore(ep) ) { window.location.replace("/midday")}
//   else { window.location.replace("/ep" + versions)}
// }



var dailyPsalms = [ undefined // 0th day of month
  , { mp: [[1,1,999],  [2,1,999], [3,1,999], [4,1,999], [5,1,999]]
    , ep: [[6,1,999],  [7,1,999], [8,1,999]]} // 1
  , { mp: [[9,1,999],  [10,1,999], [11,1,999]]
    , ep: [[12,1,999], [13,1,999], [14,1,999]]} // 2
  , { mp: [[15,1,999], [16,1,999], [17,1,999]]
    , ep: [[18,1,999]]} // 3
  , { mp: [[19,1,999], [20,1,999], [21,1,999]]
    , ep: [[22,1,999], [23,1,999]]} // 4
  , { mp: [[24,1,999], [25,1,999], [26,1,999]]
    , ep: [[27,1,999], [28,1,999], [29,1,999]]} // 5
  , { mp: [[30,1,999], [31,1,999]]
    , ep: [[32,1,999], [33,1,999], [34,1,999]]} // 6
  , { mp: [[35,1,999], [36,1,999]]
    , ep: [[37,1,999]]} // 7
  , { mp: [[38,1,999], [39,1,999], [40,1,999]]
    , ep: [[41,1,999], [42,1,999], [43,1,999]]} // 8
  , { mp: [[44,1,999], [45,1,999], [46,1,999]]
    , ep: [[47,1,999], [48,1,999], [49,1,999]]} // 9
  , { mp: [[50,1,999], [51,1,999], [52,1,999]]
    , ep: [[53,1,999], [54,1,999], [55,1,999]]} // 10
  , { mp: [[56,1,999], [57,1,999], [58,1,999]]
    , ep: [[59,1,999], [60,1,999], [61,1,999]]} // 11
  , { mp: [[62,1,999], [63,1,999], [64,1,999]]
    , ep: [[65,1,999], [66,1,999], [67,1,999]]} // 12
  , { mp: [[68,1,999]]
    , ep: [[69,1,999], [70,1,999]]} // 13
  , { mp: [[71,1,999], [72,1,999]]
    , ep: [[73,1,999], [74,1,999]]} // 14
  , { mp: [[75,1,999], [76,1,999], [77,1,999]]
    , ep: [[78,1,999]]} // 15
  , { mp: [[79,1,999], [80,1,999], [81,1,999]]
    , ep: [[82,1,999], [83,1,999], [84,1,999], [85,1,999]]} // 16
  , { mp: [[86,1,999], [87,1,999], [88,1,999]]
    , ep: [[89,1,999]]} // 17
  , { mp: [[90,1,999], [91,1,999], [92,1,999]]
    , ep: [[93,1,999], [94,1,999]]} // 18
  , { mp: [[95,1,999], [96,1,999], [97,1,999]]
    , ep: [[98,1,999], [99,1,999], [100,1,999], [101,1,999]]} // 19
  , { mp: [[102,1,999], [103,1,999]]
    , ep: [[104,1,999]]} // 20
  , { mp: [[105,1,999]]
    , ep: [[106,1,999]]} // 21
  , { mp: [[107,1,999]]
    , ep: [[108,1,999], [109,1,999]]} // 22
  , { mp: [[110,1,999], [111,1,999], [112,1,999], [113,1,999]]
    , ep: [[114,1,999], [115,1,999]]} // 23
  , { mp: [[116,1,999], [117,1,999], [118,1,999]]
    , ep: [[119,1,32]]} // 24
  , { mp: [[119,33,72]]
    , ep: [[119,73,104]]} // 25
  , { mp: [[119,105,144]]
    , ep: [[119,145,176]]} // 26
  , { mp: [[120,1,999], [121,1,999], [122,1,999], [123,1,999], [124,1,999], [125,1,999]]
    , ep: [[126,1,999], [127,1,999], [128,1,999], [129,1,999], [130,1,999], [131,1,999]]} // 27
  , { mp: [[132,1,999], [133,1,999], [134,1,999], [135,1,999]]
    , ep: [[136,1,999], [137,1,999], [138,1,999]]} // 28
  , { mp: [[139,1,999], [140,1,999]]
    , ep: [[141,1,999], [142,1,999], [143,1,999]]} // 29
  , { mp: [[144,1,999], [145,1,999], [146,1,999]]
    , ep: [[147,1,999], [148,1,999], [149,1,999], [150,1,999]]} // 30
  , { mp: [[120,1,999], [121,1,999], [122,1,999], [123,1,999], [124,1,999], [125,1,999],[126,1,999], [127,1,999]]
    , ep: [[127,1,999], [128,1,999], [129,1,999], [130,1,999], [131,1,999],[132,1,999], [133,1,999], [134,1,999]]} // 31
]

function dailyPsalmsToObjects(pss) {
  return pss.map(function(ps) {
    var [ps, vsFrom, vsTo] = ps;
    return {ps: ps, vsFrom: vsFrom, vsTo: vsTo}
  })
}

// PouchDB ..................................
var prefDB = new PouchDB('preferences')
  , dbOpts = {live: true, retry: true}
  , default_prefs = {
      _id: 'preferences'
    , ot: 'ESV'
    , ps: 'BCP'
    , nt: 'ESV'
    , gs: 'ESV'
    , fnotes: "True"
    , vers: ["ESV"]
    , current: "ESV"
    };

function sync() {
  //syncDom.setAttribute('data-sync-state', 'syncing');
  port.dbSync.send("busy");
  PouchDB.sync(localDb, db, {live: true, retry: true})
    .on('change', function(info) {
      console.log("SYNC CHANGE: ", info)
    })
    .on('paused', function(err) {
      if (err === undefined) { port.dbSync.send("idle"); }
      console.log("SYNC PAUSED", err)
    })
    .on('active', function(){
      console.log("SYNC RESTARTED")
    })
    .on('denied', function(err){
      console.log("SYNC DENIED: ", err)
    })
    .on('complete', function(info) {
      console.log("SYNC COMPLETE", info)
      port.dbSync.send("idle");
    })
    .on('error', function(err){
      console.log("SYNC FAILED WITH: ", err)
    })
    .catch(function(err) {
        console.log("COULD NOT SYNC: ", err);
      }) 
    };

localDb.info().then( function(resp) {
  console.log("DB INFO: ", resp)
})

db.info().then( function(resp) {
  console.log("REMOTE COUCH INFO: ", resp)
})

function syncError() {console.log("SYNC ERROR")};

sync();

// END OF SYNC

// TOSS
port.toss.subscribe(function(obj) {
  switch(obj.request) {
    case undefined:
    case null:
      port.error.send("Unnamed request");
      break;
    case "Calendar": 
      calendar();
      break;
    case "Feed":
      feed(obj.feedSource, obj.limit, obj.offset);
      break;
    case "Login": 
      login(obj.email, obj.password, port.logInSuccess.send);
      break;
    case "Lessons": 
      lessons(obj.office);
      break;
    case "OfficePsalms":
      var pss = requestBCPPsalms(todaysPsalms(obj.office));
      port.requestedPsalms.send(pss);
      break;
    case "Profile":
      port.requestedProfile.send(profile(obj));
      break;
    case "Register":
      register(obj);
      break;

  }

});

function getTags(limit) {
  // this returns the first limit number of tags
  // do this for the most popular tags instead
  return tagDb.find(
    { selector: {popular: {$gte: 1}}
    , limit: 20
    , sort: [{popular: 'desc'}]
    }
  )};

function getFeed(feedSource, limit, offset) {
  console.log(">>>>> FEED SOURCE: ", feedSource)
  if (feedSource === "global") { return articleDb.find(
      { selector: {type: 'post'}
      , limit: limit
      , skip: offset * limit
      }
    )}
  else {
     return tagDb.get(feedSource).then(function (resp){
       return articleDb.allDocs({include_docs: true, keys: resp.tags})
    })
    .catch(function(err){
      console.log("TAG GET ERROR: ", err)
    })

  }
}

function feed(feedSource, limit, offset) {
  limit = parseInt( limit);
  offset = parseInt( offset);
  var allPromises = [getTags(20), getFeed(feedSource, limit, offset)];
  // getTags(20);
  Promise.all( allPromises )
  .then( function(vals) {
    var tags = vals[0].docs
      , articles = (feedSource === "global") ? vals[1].docs : vals[1].rows.map( function(x){return x.doc;}).filter(function(x){return !!x})
      ;
    var authors = Array.from(new Set(articles.map( function(el) {return el.author} )));
    articleDb.allDocs({keys: authors, include_docs: true })
    .then( function(authors) {
      var docs = addAuthorsToArticles(articles, authors.rows);
      var thisFeed = {
        errors: []
        , feed: {rows: docs, total_rows: articles.length, tags: tags}
        , feedSource: feedSource
        , activePage: offset + 1
        , isLoading: false
      }
      port.requestedFeed.send({rows: docs, total_rows: articles.length, tags: tags})
    })

  }).catch( function(err) {
    console.log("FEED ERROR: ", err);
  })
}


function addAuthorsToArticles(articles, authors) {
  var articlesWithAuthors = articles.map(function(art){
    var thisAuthor = authors.find(function(el){
      return el.id == art.author
    })
    art.authorBio = thisAuthor.doc
    return art
  })
  return articlesWithAuthors
}
 
function profile(obj) {
  console.log("FN PROFILE: ", obj)
  console.log("PROFILE SESSION: ", session);
}

// PORTS ERROR.....
function portError(errs) {
  port.portErrors.send(errs)
}

// PORTS POST.....
// port.post.subscribe( function(body) {
//   console.log("POST: ", body)
// })

// AUTHENTICATION.....

// LOGIN

function login(email, password, callback) {
  userDb.logIn(email, password)
  .then(function(resp){
    // port.logInSuccess.send(resp);
    if (resp.ok) {
      userDb.getUser(resp.name)
      .then(function(user) {
        // port.logInSuccess.send(user)
        session = user;
        callback(user);
      })
    }
  })
  .catch(function(err){
    port.logInFail.send(err);
  })
}

// port.login.subscribe( function([email, password]) {
//   login(email, password, port.logInSuccess.send);
// }); 

// REGISTER
function register( obj ) {
  var now = moment().unix();
  userDb.signUp(obj.email, obj.password, {
    metadata: { whoami: obj.whoami
              , token: ""
              , bio: null
              , image: null
              , createdAt: now
              , updatedAt: now
              }
  }).then(function(resp){
    login(email, password, port.registrationComplete.send)
  })
   .catch(function(err){
    port.registrationComplete.send(
        { errors: err
        , name: email //-- the DB name of the user is the email address
        , whoami: whoami
        }
      )
  })
}

port.updateUser.subscribe( function(user) {
//  userDb.putUser(user.name, {
  userDb.putUser(user.name, {
    metadata: 
      { whoami: user.username
      , bio: user.bio
      , image: user.image
      , updatedAt: moment().unix()
      }
  }).then(function(resp){
    userDb.getUser(user.name).then(function(user){
      port.updateUserComplete.send(user)
    })
  }).catch(function(err){
    console.log("UPDATE USER RESPONSE ERROR: ", err)
  })
})

// SESSION STORE
port.storeSession.subscribe( function(newSession) {

  var sessObj = JSON.parse(newSession);
  port.onSessionChange.send(sessObj);
})

function get_preferences(do_this_too) {
  prefDB.get('preferences').then(function(resp){
    return do_this_too(resp)
  }).catch(function(err){
    return do_this_too(initialize_translations());
  });
}

function initialize_translations() {
  prefDB.put( default_prefs ).then(function (resp) {
    return resp
  }).catch(function (err) {
    return prefs;
  });
}

// PREFERENCES.....

function save_preferences(prefs) {
  prefs._id = "preferences";
  prefDB.put(prefs).then(function(resp) {
    preferenceObj = {ot: prefs.ot, ps: prefs.ps, nt: prefs.nt, gs: prefs.gs};
    preferenceList = [prefs.ot, prefs.ps, prefs.nt, prefs.gs];
    return resp;
  }).catch(function(err){
    return prefs;
  })
}

function getPreferenceObj() {
  get_preferences(function(resp) {
    return {ot: resp.ot, ps: resp.ps, nt: resp.nt, gs: resp.gs}
  })
}

function getPreferenceList() {
  get_preferences(function(resp) {
    return [resp.ot, resp.ps, resp.nt, resp.gs]
  })
}

function preference_for(key) { return preferenceObj[key] }


function initElmHeader() { 
  get_preferences(function(resp) {
    preferenceList = [resp.ot, resp.ps, resp.nt, resp.gs];
    preferenceObj = resp
    elmHeaderApp.ports.portConfig.send(preferenceObj); 
  })
}

function requestBCPPsalms(request) {
  // request is an array of arrays
  // each inner array contain 3 ints - psalm number, vs from, vs to
  var keys = request.map(ps => "bcp" + ps[0])
    , slicesFrom = request.map(ps => ps[1] - 1 )
    , slicesTo = request.map(ps => ps[2] )
    ;
  localDb.allDocs({
      include_docs: true
    , keys: keys
  }).then( function(resp) {
    var rows = resp.rows;

    var pss = rows.map( function(r, i) { 
      // return just the vss requested using .slice
      r.doc.vss = r.doc.vss.slice(slicesFrom[i], slicesTo[i])
      return r.doc
    });
    return pss;
  }).catch( function(err) {
    console.log("COULD NOT FIND KEY(S): ", err)
  })
} 



// sometimes we want specific psalms
// and sometimes psalms by office

// THE FEED...
// port.requestFeed.subscribe(function(feed){
//   console.log("JS FEED REQUEST: ", feed)
// })
// 
// // THE TAGS...
// port.requestTags.subscribe(function(tags){
//   console.log("JS REQUEST TAGS: ", tags)
// })

// ARTICLES...
port.submitArticle.subscribe(function(art){
  var now = moment().toISOString();
  var id = art.author + now;
  var slug = slugify(art.title + " " + art.description);
  articleDb.put(
    { _id: id
    , type: "post"
    , latest: -now // for sorting latest first
    , description: art.description
    , title: art.title
    , tagList: art.tagList
    , body: art.body.replace(/\n/g, "\\n")
    , author: art.author
    , createdAt: now
    , updatedAt: now
    , favorited: art.favorited
    , favoritedCount: art.favoritedCount
    , slug: slug
    }
  )
  .then(function(resp){
    art.tagList.forEach(function(tag){
      var newTag = tag.replace(/\W/, "");
      tagDb.get(newTag).then(resp => {
        resp.tags.unshift(id);
        tagDb.put(
          { _id: newTag
          , popular: resp.popular + 1 
          , _rev: resp._rev
          , tags: resp.tags
          }
        ).catch(err => console.log("UPDATE TAGS FAILED: ", err))
      }).catch(err => {
        if (err.error === "not_found") {
          tagDb.put(
            { _id: newTag
            , popular: 1
            , tags: [id]
            }
          )
        }
        else console.log("SUBMIT ARTICLE ERROR: ", err)
      })
    })
  })
  .catch(function(err){
    console.log("SUMBIT ARTICLE ERR: ", err);
  })
})

port.requestArticle.subscribe(function(art){
  console.log("REQUESTED ARTICLE: ", art)
})

// REQUEST PSALMS.....

port.requestPsalms.subscribe( function (request) {
  var keys = request.map(ps => "bcp" + ps[0])
    , slicesFrom = request.map(ps => ps[1] - 1 )
    , slicesTo = request.map(ps => ps[2] )
    ;
  localDb.allDocs({
      include_docs: true
    , keys: keys
  }).then( function(resp) {
    var rows = resp.rows;

    var pss = rows.map( function(r, i) { 
      // return just the vss requested using .slice
      r.doc.vss = r.doc.vss.slice(slicesFrom[i], slicesTo[i])
      return r.doc
    });
    port.requestedPsalms.send(pss);
  }).catch( function(err) {
    console.log("COULD NOT FIND KEY(S): ", err)
  }) 
});

// port.requestOfficePsalms.subscribe( function (office) {
//   var pss = requestBCPPsalms(todaysPsalms(office));
//   port.requestedPsalms.send(pss);
// });

function todaysPsalms(office) {
  // this won't work unless office is ["mp"|"ep"]
  office = (office == "mp" || office == "ep") ? office : "mp";
  var dayOfMonth = moment().date();
  return dailyPsalms[dayOfMonth][office];
}

function dateToMpepKey(date) {
  return "mpep" + padWithZeros(date.month() + 1, 2) + padWithZeros(date.date(), 2) 
}

function lessons(office) { 
  office = (office == "mp" || office == "ep") ? office : "mp"
  var thePsalms = todaysPsalms(office)
  var date = moment()
    , dayOfMonth = padWithZeros(date.date(), 2)
    , month = padWithZeros(date.month() + 1, 2)
    , key = "mpep" + month + dayOfMonth;
    // , key = dateToMpepKey(date)
    ;
  // initialize the return model
  var lessons = 
    { office: office
    , season: LitYear.getCollectKey(date) // might not be necessary
    , date: date.format("dddd, MMMM Do YYYY")
    , dayOfWeek: date.day()
    , lesson1: []
    , lesson2: []
    , psalms: []
    , collects: []
    }

  var collectKey = LitYear.getCollectKey(date);
  // get the references for todays readings for either MP or EP
  localDb.get(key).then(function(resp) {
    var [l1, l2] = (office == "mp") ? [resp.mp1, resp.mp2] : [resp.ep1, resp.ep2];

    // generate the keys
    var keys1 = Bible.dbKeys(l1)
      , keys2 = Bible.dbKeys(l2)
      ;
    return [keys1, keys2];

  }).then( function(keys) {
    var psalmKeys = thePsalms.map(ps => "bcp" + ps[0])
      , allPromises = []
      ;
    keys[0].forEach( function(k) { allPromises.push(localDb.allDocs({include_docs: true, startkey: k.from, endkey: k.to}))});
    keys[1].forEach( function(k) { allPromises.push(localDb.allDocs({include_docs: true, startkey: k.from, endkey: k.to}))});
    allPromises.push( localDb.get(collectKey) );
    allPromises.push( localDb.allDocs({include_docs: true, keys: psalmKeys}));

    return Promise.all( allPromises )
  }).then( function(vals){
    var collects = vals[vals.length - 2];
    var psalms = vals[vals.length - 1].rows;

    // just the rows from the lessons, excluding the psalms
    var respLessons = vals.slice(0, vals.length - 2).map( function(el) { return el.rows } );
    var thisBook = lessonBook(respLessons[0]);
    var thisLesson = lessons.lesson1;
    respLessons.forEach( function(l) {
      if (lessonBook(l) !== thisBook) { 
        thisLesson = lessons.lesson2;
        thisBook = lessonBook(l);
      }
      thisLesson.push(
        { title: lessonTitle(l)
        , vss: l.map( function(r) { return r.doc } )
        }
      )

    })

    // psalms is always the last list in vals
    lessons.psalms = psalms.map( function(r, i) { return r.doc; });
    lessons.collects = collects;

    port.requestedLessons.send(lessons);
  }).catch( function(err) {
    console.log("COULD NOT FIND KEY(S): ", err);
  })
}


// end of PouchDB......................

// Calendar ...........................

function calendar() {
  var now = moment()
    , firstOfMonth = moment(now).date(1)
    , firstSundayOfCalendar = firstOfMonth.day === 0 ? moment(firstOfMonth) : moment(firstOfMonth).day("Sunday")
    , lastSaturdayOfCalendar = moment(now).endOf('month').day("Saturday")
    , thisDay = moment(firstSundayOfCalendar)
    , month = []
    ;
  while (thisDay.isSameOrBefore(lastSaturdayOfCalendar)) {
    var doMonth = thisDay.date();
    month.push(
      { year: thisDay.format("YYYY")
      , month: thisDay.format("MMMM")
      , date: thisDay.format("D")
      , day: thisDay.format("dddd")
      , mppss: dailyPsalmsToObjects(dailyPsalms[doMonth].mp)
      , eppss: dailyPsalmsToObjects(dailyPsalms[doMonth].ep)
      , mpepKey: dateToMpepKey(thisDay)
      , seasonKey: LitYear.dateToSeasonKey(thisDay)
      }
    );
    thisDay.add(1, 'day');
  }
  var mpepLessons = [];
  month.forEach(function(d){
    mpepLessons.push( localDb.get(d.mpepKey) )
  })
  month.forEach(function(d) {
    mpepLessons.push( localDb.get(d.seasonKey) )
  })
  Promise.all(mpepLessons)
  .then(function (resp){
    resp.forEach( function(r, i){
      if (i < 35 ){
        month[i].mpep = r;
      }
      else { month[i - 35].eu = r}
    })
    
    var cal = { weeks: [], month: now.format("MMMM"), year: now.format("YYYY")}
    cal.weeks.push({days: month.slice(0,7)})
    cal.weeks.push({days: month.slice(7,14)})
    cal.weeks.push({days: month.slice(14,21)})
    cal.weeks.push({days: month.slice(21,28)})
    cal.weeks.push({days: month.slice(28,35)})
    port.requestedCalendar.send( cal )
  })
  .catch(function(err) {
    console.log("COULDNT GET THE LESSONS: ", err)
  })

} // end of calendar

function createCalendar() {
  var now = moment()
    , firstOfMonth = moment(now).date(1)
    , firstSundayOfCalendar = firstOfMonth.day === 0 ? moment(firstOfMonth) : moment(firstOfMonth).day("Sunday")
    , lastSaturdayOfCalendar = moment(now).endOf('month').day("Saturday")
    , thisDay = moment(firstSundayOfCalendar)
    , month = []
    ;
  while (thisDay.isSameOrBefore(lastSaturdayOfCalendar)) {
    var doMonth = thisDay.date();
    month.push(
      { year: thisDay.format("YYYY")
      , month: thisDay.format("MMMM")
      , date: thisDay.format("D")
      , day: thisDay.format("dddd")
      , mppss: dailyPsalms[doMonth].mp
      , eppss: dailyPsalms[doMonth].ep
      , mpepKey: dateToMpepKey(thisDay)
      , seasonKey: LitYear.dateToSeasonKey(thisDay)
      }
    );
    thisDay.add(1, 'day');
  }
  var mpepLessons = [];
  month.forEach(function(d){
    mpepLessons.push( localDb.get(d.mpepKey) )
  })
  month.forEach(function(d) {
    mpepLessons.push( localDb.get(d.seasonKey) )
  })
  Promise.all(mpepLessons)
  .then(function (resp){
    resp.forEach( function(r, i){
      if (i < 35 ){
        month[i].mpep = r;
      }
      else { month[i - 35].eu = r}
    })
    return month;
  })
  .catch(function(err) {
    console.log("COULDNT GET THE LESSONS: ", err)
  })

} // end of createCalendar

// // PROFILE ------------------------
// port.requestProfile.subscribe(function(username) {
//   console.log("REQUEST PROFILE: ", username)
// })

// HELPERS ------------------------

function padWithZeros(num, size) {
  var s = num + ""
  while (s.length < size) s = "0" + s;
  return s;
} 

function lessonTitle(rows) {
  if (rows.length < 1) return "";
  var book = rows[0].doc.book
    , chap = rows[0].doc.chap
    , from = rows[0].doc.vs
    , to   = rows[rows.length - 1].doc.vs
    ;
  return Bible.lessonTitle(book, chap, from, to)
}

function lessonBook(rows) {
  return rows[0].doc.book;
}

// registerServiceWorker();
