"use strict";
  var moment = require('moment')
  , leapDay = 60
  , sunday = 0
  , monday = 1
  , thursday = 4
  , oneDay = 60 * 60 * 24 * 1000
  , oneWeek = oneDay * 7
  , litYearNames = ["c", "a", "b"]
  , January = 0,    February = 1,   March = 2,      April = 3
  , May = 4,        June = 5,       July = 6,       August = 7
  , September = 8,  October = 9,    November = 10,  December = 11
  , mdFormat = "MM-DD"
  ;
// weak assumption: Object.keys(rlds) will return keys in the order below
var rlds =
  { '01-18': 'confessionOfStPeter'
  , '01-25': 'conversionOfStPaul'
  , '02-02': 'presentation'
  , '02-24': 'stMatthias'
  , '03-19': 'stJoseph'
  , '03-25': 'annunciation'
  , '04-25': 'stMark'
  , '05-01': 'stsPhilipAndJames'
  , '05-31': 'visitation'
  , '06-11': 'stBarnabas'
  , '06-24': 'nativityOfJohnTheBaptist'
  , '06-29': 'stPeterAndPaul'
  , '07-01': 'dominion'
  , '07-04': 'independence'
  , '07-22': 'stMaryMagdalene'
  , '07-25': 'stJames'
  , '08-06': 'transfiguration'
  , '08-15': 'bvm'
  , '08-24': 'stBartholomew'
  , '09-14': 'holyCross'
  , '09-21': 'stMatthew'
  , '09-29': 'michaelAllAngels'
  , '10-18': 'stLuke'
  , '10-23': 'stJamesOfJerusalem'
  , '10-28': 'stsSimonAndJude'
  , '11-11': 'remembrance'
  , '11-30': 'stAndrew'
  , '12-21': 'stThomas'
  , '12-26': 'stStephen'
  , '12-27': 'stJohn'
  , '12-28': 'holyInnocents'
  };

module.exports = {

thisYear: function (date) { return moment(date).year(); },
inRange: function (n, min, max) { return n >= Math.min(min, max) && n <= Math.max(min, max); },
listContains: function (list, obj) { return list.indexOf(obj) >= 0; },
// function advDays(d, days) { return new Date( d.valueOf() + oneDay * days ) },
// function advWeeks(d, weeks) { return advDays(d, weeks * 7) },
daysTill: function (d1, d2) { return Math.floor( (d2 - d1)/oneDay ); },
weeksTill: function (d1, d2) { return Math.floor( (d2 - d1)/oneWeek ); },
litYear: function (date) {
  var yr = this.thisYear(date);
  return date.isSameOrAfter(this.advent(date, 1)) ? yr + 1 : yr;
},
litYearName: function (date) { return litYearNames[ this.litYear(date) % 3 ]; },
isSunday: function (date) { return date.day() == sunday; },
isMonday: function (date) { return date.day() == monday; },
daysTillSunday: function (date) { return 7 - date.day(); },
dateNextSunday: function (date) { return date.day(7); },
dateLastSunday: function (date) { return date.day(0); },
firstCalendarSunday: function (date) {
  return moment([date.year(), date.month()]).day(0);
}, 
// algorithm from http://en.wikipedia.org/wiki/Computus#cite_note-otheralgs-47
// presumes `d` is either int or date
easter: function (thisDate) {
  var year = this.thisYear(thisDate) 
    , a = year % 19
    , b = Math.floor(year / 100)
    , c = year % 100
    , d = Math.floor(b / 4)
    , e = b % 4
    , f = Math.floor((b + 8) / 25)
    , g = Math.floor((b - f + 1) / 3)
    , h = (19 * a + b - d - g + 15) % 30
    , i = Math.floor(c / 4)
    , k = c % 4
    , l = (32 + 2 * e + 2 * i - h - k) % 7
    , m = Math.floor((a + 11 * h + 22 * l) / 451)
    , n0 = (h + l + 7 * m + 114)
    , n = Math.floor(n0 / 31) - 1
    , p = n0 % 31 + 1
    , date = moment({'year': year, 'month': n, 'day': p});
  return date; 
},
sundayInEaster: function (date, n) { 
  return this.easter(date).add(n - 1, 'weeks');
},
secondMondayAfterEaster: function (date) {
  return this.easter(date).add(8, 'days');
},
ascension: function (date) { 
  return this.easter(date).add(39, 'days');
},
rightAfterAscension: function (date) {
  var a = this.ascension(date)
    , ascen = date.isSameOrAfter(a)
    , beforeSaad = date.isBefore(this.sundayAfterAscension(date)) // saad - sunday after ascension day
    ;
    return ascen && beforeSaad;
},
sundayAfterAscension: function (date) { 
  return this.sundayInEaster(date, 7) ;
},
pentecost: function (date, n) { 
  return this.easter(date).add(n + 6, 'weeks') ;
},
trinity: function (date) { 
  return this.pentecost(date, 2) ;
},
proper: function (date, n) { 
  return this.advent(date, n - 29) ;
},
christmasDay: function (date) { 
  return moment(this.thisYear(date) + '-12-25') ;
},
christmasSeason: function (date, n) { 
  var y = this.thisYear(date)
    , sundayAfter = this.dateNextSunday( this.christmasDay(y) )
    ;
  return (n == 2) ? sundayAfter.add(1, 'weeks') : sundayAfter;
},
christmas: function (date = moment()) {
  var christmasMoment = NaN;
  switch (true) {
    case Number.isInteger(date):
      switch (date) {
        case date < 0:
          console.log("There is no Christmas before year 0");
          break;
        case date == 1: // presume it's the week in Christmas Season
        case date == 2: // presume it's the week in Christmas Season
          let ns = this.date_next_sunday(this.christmas());
          christmasMoment = ns.add(date - 1, 'w');
          break;
        default:
          christmasMoment = moment([date, 11, 25]); // try to remember, js months are 0 - 11
          break;
      }
      break;
    default: // presume it's a moment Object
      christmasMoment = moment([date.year(), 11, 25]); // try to remember, js months are 0 - 11
  }
  return christmasMoment;
  
},
/*
  def christmas(),      do: Timex.to_date {Timex.now(@tz).year, 12, 25},
  def christmas(n) when n < 1, do: {:error, "There is no Christmas before year 0"},
  def christmas(n) when n > 2, do: Timex.to_date {n, 12, 25} # presume n is a year
  def christmas(n) do # n is 1 or 2, presume sunday after christmas
    christmas |> date_next_sunday |> date_shift( weeks: n - 1)
  end

*/
advent: function (date, n) { 
  var sundayBefore = this.dateLastSunday(this.christmasDay(date));
  return sundayBefore.add(n - 4, 'weeks'); 
},
epiphanyDay: function (date) { return moment(this.thisYear(date) + '-01-06'); },
epiphanyBeforeSunday: function (date) { 
  return date.isSameOrAfter(this.epiphanyDay(date)) && date.isBefore(this.weekOfEpiphany(date, 1)) ;
},
sundayAfterEpiphany: function (date) { 
  return dateNextSunday( this.epiphanyDay(date) ) ;
},
weekOfEpiphany: function (date, n) { 
  return this.sundayAfterEpiphany(date).add(n - 1, 'weeks');
},
ashWednesday: function (date) { 
  return this.easter(date).add( -46, 'days');
},
rightAfterAshWednesday: function (date) { 
  return date.isSameOrAfter(this.ashWednesday(date)) && date.isBefore(this.lent(date, 1)); 
},
lent: function (date, n) { 
  return this.easter(date).add( n - 7, 'weeks') ;
},
palmSunday: function (date) { 
  return this.easter(date).add( -1, 'weeks') ;
},
goodFriday: function (date) { 
  return this.easter(date).add( -2, 'days') ;
},
isGoodFriday: function (date) { 
  return date.isSame(this.goodFriday(date)) ;
},
toSeason: function (date) {
  var sunday = this.isSunday(date) ? date : this.dateLastSunday(moment(date))
    , y = this.litYear(sunday)
    , yrABC = this.litYearName(sunday)
    , dOfMonth = (sunday.month() + 1) + "/" + sunday.date()
    , weeksTillAdvent = this.weeksTill(sunday, this.advent(sunday, 1))
    , daysTillEpiphany = this.daysTill(date, this.epiphanyDay(date))
    , weeksFromEpiphany = this.weeksTill(this.epiphanyDay(sunday), sunday)
    , weeksFromChristmas = this.weeksTill(sunday, this.christmasDay(date))
    , isChristmas = this.isSunday(date) && dOfMonth == "12/25"
    , isHolyName = this.isSunday(date) && dOfMonth == "1/1"
    , isChristmas2 = (this.listContains(["1/1", "1/2", "1/3", "1/4", "1/5"], dOfMonth)  && (this.inRange(daysTillEpiphany, 1, 5)))
    , weeksFromEaster = this.weeksTill(this.easter(date), sunday)
    , daysTillEaster = this.daysTill(date, this.easter(date))
    ;
  // The following needs a "christmasEve"
  if      (this.rightAfterAshWednesday(date)) { return {season: "ashWednesday", week: "1", year: yrABC, date: date}; }
  else if (this.rightAfterAscension(date))    { return {season: "ascension",    week: "1", year: yrABC, date: date}; }
  else if (isChristmas)                         { return {season: "christmasDay", week: "1", year: yrABC, date: date}; }
  else if (isHolyName)                          { return {season: "holyName",     week: "1", year: yrABC, date: date}; }
  else if (this.christmas(y-1) == date)       { return {season: "christmas",    week: "1", year: yrABC, date: date}; }
  else if (isChristmas2)                        { return {season: "christmas",    week: "2", year: yrABC, date: date}; }
  else if (this.inRange(daysTillEpiphany, 6, 11))    { return {season: "christmas",    week: "1", year: yrABC, date: date}; }
  // else if (daysTillEaster == 2)                 { return {season: "goodFriday",   week: "1", year: yrABC, date: date}; }
  else if (this.inRange(daysTillEaster, 1, 6))       { return {season: "holyWeek",     week: (7 - daysTillEaster).toString(), year: yrABC, date: date}; }
  else if (this.inRange(daysTillEaster, -1, -6))     { return {season: "easterWeek",   week: (0 - daysTillEaster).toString(), year: yrABC, date: date}; }
  else if (this.inRange(weeksFromEaster, -2, -6))    { return {season: "lent",         week: (7 + weeksFromEaster).toString(), year: yrABC, date: date}; }
  else if (weeksFromEaster == -1)               { return {season: "palmSunday",   week: "1", year: yrABC, date: date}; }
  else if (weeksFromEaster == -7)               { return {season: "epiphany",     week: "9", year: yrABC, date: date}; }
  else if (weeksFromEaster == -8)               { return {season: "epiphany",     week: "8", year: yrABC, date: date}; }
  else if (weeksFromEaster === 0)               { return {season: "easterDay",    week: "1", year: yrABC, date: date}; }
  else if (this.inRange(weeksFromEaster, 0, 6))      { return {season: "easter",       week: (1 + weeksFromEaster).toString(), year: yrABC, date: date}; }
  else if (weeksFromEaster == 7)                { return {season: "pentecost",    week: "1", year: yrABC, date: date}; }
  else if (weeksFromEaster == 8)                { return {season: "trinity",      week: "1", year: yrABC, date: date}; }
  else if (this.inRange(weeksTillAdvent, 1, 27))     { return {season: "proper",       week: (29 - weeksTillAdvent).toString(), year: yrABC, date: date}; }
  else if (this.inRange(weeksTillAdvent, 0, -3))     { return {season: "advent",       week: (1 - weeksTillAdvent).toString(), year: yrABC, date: date}; }
  else if (this.inRange(weeksFromChristmas, 0, 1))   { return {season: "christmas",    week: (weeksFromChristmas + 1).toString(), year: yrABC, date: date}; }
  else if (this.epiphanyBeforeSunday(date))   { return {season: "epiphany",     week: "0", year: yrABC, date: date}; }
  else if (this.inRange(weeksFromEpiphany, 0, 8))    { return {season: "epiphany",     week: (weeksFromEpiphany + 1).toString(), year: yrABC, date: date}; }
  else                                          { return {season: "unknown",      week: "unknown", year: "unknown",date: date}; }
  
},

dateToSeasonKey: function(date) {
  var thisDate = moment(date); // clone date
  var season = this.toSeason(thisDate);
  var [isRLD, rld] = this.holyDay(thisDate);
  return isRLD ? rld : season.season + season.week + season.year
},

getCollectKey: function (date) {
  var thisDate = moment(date); // clone date
  var season = this.toSeason(thisDate);
  var [isRLD, rld] = this.holyDay(thisDate);
  return isRLD ? "collect_" + rld : "collect_" + season.season + season.week
},

getSeasonName: function (season) {
return {
    advent: 'Advent'
  , christmas: 'Christmas'
  , christmasDay: 'Christmas Day'
  , holyName: 'Holy Name'
  , epiphany: 'Epiphany'
  , ashWednesday: 'Ash Wednesday'
  , lent: 'Lent'
  , palmSunday: 'Palm Sunday'
  , holyWeek: 'Holy Week'
  , goodFriday: 'Good Friday'
  , easter: 'Easter'
  , easterDay: 'Easter Day'
  , easterWeek: 'Easter Week'
  , ascension: 'Ascension'
  , pentecost: 'Pentecost'
  , trinity: 'Trinity Sunday'
  , proper: 'Season after Pentecost'
  }[season];
},

getCanticle: function (office, season, day, reading) {
  switch(office) {
    case 'mp':
      switch(reading) {
        case 'ot':
          switch(day){
            case 'Sunday':
              switch(season) {
                case 'advent': return "surge_illuminare";
                case 'easter': return "cantemus_domino";
                case 'lent': return "kyrie_pantokrator";
                default: return "benedictus";
              }
              break;
            case 'Monday':
              switch(season) {
                case 'lent': return "quaerite_dominum";
                default: return "ecce_deus";
              }
              break;
            case 'Tuesday':
              switch(season){
                case 'lent': return "quaerite_dominum";
                default: return "benedictis_es_domine";
              }
              break;
            case 'Wednesday':
              switch(season){
                case 'lent': return "kyrie_pantokrator";
                default: return "surge_illuminare";
              }
              break;
            case 'Thursday':
              switch(season){
                case 'lent': return "quaerite_dominum";
                default: return "cantemus_domino";
              }
              break;
            case 'Friday':
              switch(season){
                case 'lent': return "kyrie_pantokrator";
                case 'easter': return "te_deum";
                case 'easterWeek': return "te_deum";
                default: return "quaerite_dominum";
              }
              break;
            case 'Saturday':
              switch(season){
                case 'lent': return "quaerite_dominum";
                default: return "benedicite_omnia_opera_domini";
              }
              break;
          }
          break;
        case 'nt':
          switch(day){
            case 'Sunday':
              switch(season) {
                case 'advent': return "benedictus";
                case 'easter': return "cantemus_domino";
                case 'lent': return "benedictus";
                default: return "benedictus";
              }
              break;
            case 'Thursday':
              switch(season){
                case 'advent': return "magna_et_mirabilia";
                case 'lent': return "magna_et_mirabilia";
                default: return "cantemus_domino";
              }
              break;
            default: return "benedictus";
          }
        break;
      }
      break;
    case 'ep':
      switch(reading) {
        case 'ot': 
          switch('day'){
            case 'Sunday':return  "magnificat";
            case 'Monday':
              switch(season) {
                case 'lent': return "kyrie_pantokrator";
                default: return "cantemus_domino";
              }
              break;
            case 'Tuesday': return "quaerite_dominum";
            case 'Wednesday': return "benedicite_omnia_opera_domini";
            case 'Thursday': return "surge_illuminare";
            case 'Friday': return "benedictis_es_domine";
            case 'Saturday': return "ecce_deus";
          }
          break;
        case 'nt': 
          switch('day'){
            case 'Sunday': return "nunc_dimittis";
            case 'Monday': return "nunc_dimittis";
            case 'Tuesday': return "magnificat";
            case 'Wednesday': return "nunc_dimittis";
            case 'Thursday': return "magnificat";
            case 'Friday': return "nunc_dimittis";
            case 'Saturday': return "magnificat";
          }
          break;
      }
      break;
  }
},

holyDay: function (date) {
  var m_d = date.format(mdFormat)
    , rld = rlds[m_d]
    ;
  if (rld == 'presentation') {return [true, rld]; }
  else if ( this.isSunday(date)) {return [false, ""]; }
  else if ( this.isMonday(date)) { 
    // go back and check for translated RLD
    m_d = date.add(-1, 'days').format(mdFormat);
    rld = rlds[m_d];
  }
  return (rld === undefined) ? [false, ""] : [true, rld];

},

nextHolyDay: function (date) {
  var keys = Object.keys(rlds)
    , last_key = keys[keys.length - 1]
    , yr = date.year()
    , m_d = date.format(mdFormat) // month_day
    ;
  if (m_d >= last_key) {
    yr = yr + 1;
    m_d = last_key;
  }
  keys.forEach(function(el) {
    if (m_d < el) {
      return [moment(yr + "-" + el), rlds[el]];
    }
  });
  return [date, "unknown"]; // this should'ought'a never happen
},

// function nextHolyDay(date) {
//   let yr = date.year()
//     , day = date.day()
//     , doy = dayOfYear(date)
//     , holy_doy = hd_doy[doy]
//     , advance = (holy_doy > 365) ? holy_doy + 1 : holy_doy
//     , newDate = advDate( moment(yr + '-01-01'), advance)
//   return [newDate, hd_index[holy_doy]]
// },
// function isLeapYear(date) {
//   let yr = thisYear(date);
//   return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
// },
// function dayOfYear(date) {
//   let newYear = moment(date.year() + '-01-01 ', )
//     , doy = Math.floor( (date - newYear) / oneDay )
//   return (isLeapYear(date) && doy > leapDay) ? doy - 1 : doy;
// },
// 
namedDayDate: function (name, date, wk) {
  var yr = this.thisYear(date);
  switch (name) {
    case "christmasDay":    return moment(yr + '-12-25');
    case "holyName":        return moment(yr + 1 + '-01-01');
    case "palmSunday":      return this.palmSunday(date);
    case "holyWeek":        return this.palmSunday(date).add( wk, 'days');
    case "easterDayVigil":  return this.easter(date).add( 1, 'days');
    case "easterDay":       return this.easter(date);
    case "easterWeek":      return this.easter(date).add( wk, 'days');
    default:                return date;
  }
},

translateFromSunday: function (date) { 
  return this.isSunday(date) ? date.add( 1, 'days') : date; 
},
thanksgiving: function (date) {
  var yr = this.thisYear(date)
    , tgd = { 0: 26, 1: 25, 2: 24, 3: 23, 4: 22, 5: 28, 6: 27 }
    , dow = moment(yr + '-11-01').day() // day() is 0 indexed on sunday
    ;
  return moment({'year': yr, 'month': November, 'date': tgd[dow]});
},
memorial: function (date) {
  var yr = this.thisYear(date)
    , md = { 0: 30, 1: 29, 2: 28, 3: 27, 4: 26, 5: 25, 6: 31 }
    , dow = moment(yr + '-05-01').day() // day() is 0 indexed on sunday
    ;
  return moment({'year': yr, 'month': May, 'date': md[dow]});
},

// dear confused programmer - for reasons for ever to remain a mystery
// javascript indexs months off 0 (jan = 0, dec = 11)
// and indexs days off of 1 (the first of the month is lo (and behold) 1)
stAndrew: function (date)                 { return (this.thisYear(date) + '-11-30 ' ); },
stThomas: function (date)                 { return (this.thisYear(date) + '-12-21 ' ); },
stStephen: function (date)                { return (this.thisYear(date) + '-12-26 ' ); },
stJohn: function (date)                   { return (this.thisYear(date) + '-12-27 ' ); },
holyInnocents: function (date)            { return (this.thisYear(date) + '-12-28 ' ); },
confessionOfStPeter: function (date)      { return (this.thisYear(date) + '-01-18 ' ); },
conversionOfStPaul: function (date)       { return (this.thisYear(date) + '-01-25 ' ); },
presentation: function (date)             { return (this.thisYear(date) + '-02-2 ' ); },
stMatthias: function (date)               { return (this.thisYear(date) + '-02-24 ' ); },
stJoseph: function (date)                 { return (this.thisYear(date) + '-03-19 ' ); },
annunciation: function (date)             { return (this.thisYear(date) + '-03-25 ' ); },
stMark: function (date)                   { return (this.thisYear(date) + '-04-25 ' ); },
stsPhilipAndJames: function (date)        { return (this.thisYear(date) + '-05-1 ' ); },
visitation: function (date)               { return (this.thisYear(date) + '-05-31 ' ); },
stBarnabas: function (date)               { return (this.thisYear(date) + '-06-11 ' ); },
nativityOfJohnTheBaptist: function (date) { return (this.thisYear(date) + '-06-24 ' ); },
stPeterAndPaul: function (date)           { return (this.thisYear(date) + '-06-29 ' ); },
dominion: function (date)                 { return (this.thisYear(date) + '-07-1 ' ); },
independence: function (date)             { return (this.thisYear(date) + '-07-4 ' ); },
stMaryMagdalene: function (date)          { return (this.thisYear(date) + '-07-22 ' ); },
stJames: function (date)                  { return (this.thisYear(date) + '-07-25 ' ); },
transfiguration: function (date)          { return (this.thisYear(date) + '-08-6 ' ); },
bvm: function (date)                      { return (this.thisYear(date) + '-08-15 ' ); },
stBartholomew: function (date)            { return (this.thisYear(date) + '-08-24 ' ); },
holyCross: function (date)                { return (this.thisYear(date) + '-09-14 ' ); },
stMatthew: function (date)                { return (this.thisYear(date) + '-09-21 ' ); },
michaelAllAngels: function (date)         { return (this.thisYear(date) + '-09-29 ' ); },
stLuke: function (date)                   { return (this.thisYear(date) + '-10-18 ' ); },
stJamesOfJerusalem: function (date)       { return (this.thisYear(date) + '-10-23 ' ); },
stsSimonAndJude: function (date)          { return (this.thisYear(date) + '-10-28 ' ); },
remembrance: function (date)              { return (this.thisYear(date) + '-11-11 ' ); },

translateFromSunday: function (date) { return this.isSunday(date) ? date.add(1, 'day') : date; },

} // end of LitYear
