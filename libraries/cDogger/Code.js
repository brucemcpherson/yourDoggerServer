"use strict";

/** 
 * used for dependency management
 * @return {LibraryInfo} the info about this library and its dependencies
 */
function getLibraryInfo () {
  return {
    info: {
      name:'cDogger',
      version:'0.0.1',
      key:'MTHTf2i92nJR3buW_ly6xpqi_d-phDA33',
      share:"https://script.google.com/d/1owbLsC_Y6i_J52qXfCL2E98H7i3e3jadAzwWqCwlAeTXa0Oc2QkJmWBb/edit?usp=sharing",
      description:"Logger that uses dbabstraction"
    },
    dependencies:[
      cDbAbstraction.getLibraryInfo(),
      cDriverScratch.getLibraryInfo(),
      cUseful.getLibraryInfo()
    ]
  }; 
}
/** 
 * @param {DbAbstraction} hanlder a dbabstraction handler of any flavor - cDriverScratch is recommended
 * @paran {object] options logging options (defaultstack:1, failsilently:true,clearfirst:true)
 * @return {Dogger} a Dogger object
 */
function Dogger (handle,options) {
  var self = this;
  var handle_ = handle;
  var options_ = cUseful.clone(options) || {};

  options_.defaultstack = cUseful.applyDefault(options_.defaultstack, 1);
  options_.failsilently = cUseful.applyDefault(options_.failsilently, true);
  options_.clearfirst = cUseful.applyDefault(options_.clearfirst, true);
  options_.thread = cUseful.applyDefault(options_.thread, "");
  
  if (!handle_.isHappy() && !options_.failsilently) {
    throw 'Dogger handle failure at ' + whereTrace(0);
  }
  
  /**
   * clear the log file - will only clear matching threads if there is one, otherwise the whole thing.
   */
  self.clear = function () {
    var result = handle_.remove(options_.thread ? {thread:options_.thread} : null);
    if (!options_.failsilently && result.handleCode < 0 ) {
      throw 'Dogger clear failure at ' + whereTrace(0) + ':'+result.handleError;
    }
    return result;
  };
  
  if(options_.clearfirst) {
    self.clear();
  }
  

  /** 
   * create a message
   * @param {*} message message to report
   * @param {number} [stack=0] how far to go back. by default, the location of the .log command is reported but 1 will report the localtion that called the log and so on
   * @return {object} a dbabstraction result of what was written
   */
  self.log = function (message,stack) {
  
    // level for tracing
    stack = cUseful.applyDefault(stack,  options_.defaultstack );
    
    // analyze the message
    var clone = {
      message: cUseful.whatAmI(message),
      dogger: {
        sourceinfo: whereLocate(stack),
        timeStamp: new Date().getTime(),
        thread: options_.thread
      }
    }
    
    // save the result 
    var result = handle_.save ([clone]);
    if (!options_.failsilently && result.handleCode < 0 ) {
      throw 'Dogger failure at ' + whereTrace() + ':'+result.handleError;
    }
  };
  
  function whereLocate (stack) {
    return cUseful.whereAmI(stack ? stack + 2 : 0); 
  };
  
  function whereTrace (stack) {
    return JSON.stringify(cUseful.whereAmI(stack ? stack + 2 : 0)); 
  };
  
  self.getHandler = function () {
    return handle_;
  }

  return self;
  
}
