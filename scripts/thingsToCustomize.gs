"use strict";

/* globals
 * set up the kind of back end you want your logging to go to
 * This example uses a scratch DB with a lifetime of 2 hours
 * your client will need to know the siloid, dbid and cachecommunity to be able to access this
 * I'm using the cache associated with this script (not the library)
 * anyone who knows the keys above can access
 */
var doggerProfile = {
  driver:cDriverScratch , 
  options : {
    siloid:'doggerlogger',
    dbid:'mcphercom',
    cachecommunity:'jesuischarlie',
    specificcache:yourCacheBucket.getScriptCache(),
    scratchexpiry:60*60*2,
    disablecache:true
  }
};

/**
 * web app api - you'll publish this to be able to get at your log file
 * @param {object} e parameters (callback, action, cachecommunity, query)
 * @return {ContentService} json/jsonp
 */
function doGet(e) {
  // do whatever this webapp is for
  return cDogger.webApp(e, doggerProfile);
}


/** 
 * used for dependency management - update this to match proj properties etc for reporting (optional)
 * @return {LibraryInfo} the info about this library and its dependencies
 */
function getLibraryInfo () {
  return {
    info: {
      name:'yourDoggerServer',
      version:'0.0.1',
      key:'MEGLjTi8U0A6f6YU6uLgWiyz3TLx7pV4j',
      share:"https://script.google.com/d/1n4FMjgP3lW5Y7R4Ru6jtfLcgbxzShXQEJvGt4ZGPmsyBOGBYk66sp2l9/edit?usp=sharing",
      description:"create one of these to make a single Dogger data point"
    },
    dependencies:[     
      cDogger.getLibraryInfo(),
      cDbAbstraction.getLibraryInfo(),
      cDriverScratch.getLibraryInfo(),
      cUseful.getLibraryInfo(),
      yourCacheBucket.getLibraryInfo()
    ]
  }; 
}

/**
 * get a handler for the dogger - it'll use the global doggerProfile for defaults
 * @param {boolean} optClear whether to clear the logfile first
 * @param {string} optThread the thread id if required to report
 * @param {string} options optional override defaulat handle
 * @return {Dogger} a dogger handle
 */

function getDogger( optClear, optThread, optOptions) {
  return cDogger.getDogger(doggerProfile, optClear, optThread, optOptions);
}

function show() {
  var dogger = getDogger( false);
  Logger.log(dogger.getHandler().count());
}

function test() {
    var dogger = getDogger( false);
    dogger.log('h1');
    dogger.log('h2');
    dogger.log({some:'thing',someother:'otherthing'});
 
    var thread = getDogger( false,'somethread');
    thread.log('a thread');
    thread.log({some:'other',someother:'thing',thread:'somethread'});
    
 Logger.log(dogger.getHandler().count());
}
