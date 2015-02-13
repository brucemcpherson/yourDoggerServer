/**
 * web app api - you'll publish this to be able to get at your log file
 * @param {object} doggerProfile the abstraction profile to use as a base
 * @param {object} e parameters (callback, action, cachecommunity, query)
 * @return {ContentService} json/jsonp
 */
function webApp (e,doggerProfile) {
  // do whatever this webapp is for
  var result = doSomething(e,doggerProfile); 
  // prepare the result
  var s = JSON.stringify(result);
  // publish result
  return ContentService
    .createTextOutput(result.params.callback ? result.params.callback + "(" + s + ")" : s )
    .setMimeType(result.params.callback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON); 
}


/**
 * get a handler for the dogger - it'll use the global doggerProfile for defaults
 * @param {object} doggerProfile the abstraction profile to use as a base
 * @param {boolean} optClear whether to clear the logfile first
 * @param {string} optThread the thread id if required to report
 * @param {string} options optional override defaulat handle
 * @return {Dogger} a dogger handle
 */
function getDogger ( doggerProfile, optClear, optThread, optOptions) {
  
  var options_ = optOptions || {};
  
  // override default options with anything coming over
  var options = Object.keys(options_).reduce(function(p,c) {
    p[c] = options_[c];
    return p;
  },doggerProfile.options);
  

  var handler_ = new cDbAbstraction.DbAbstraction ( doggerProfile.driver, options );
  if (!handler_.isHappy()) throw 'Couldnt get handler at ' + cUseful.whereAmI(0);


  // this is the logger interface
  return new Dogger (handler_, {
    clearfirst:optClear,
    thread:optThread
  });

}

/**
 * does the work for the webapp
 * @param {object} doggerProfile the abstraction profile to use as a base
 * @param {object} e the url parameters
 * @return {object} a dbabstraction results object
 */
function doSomething(e,doggerProfile) {
  e = e || {};
  var params_ = e.parameter || {};
 
  // defaults 
  var options_ = {
    action:'query',
    query:'{}',
    callback:"",
    params:'{}',
    after:0,
    thread:''
  };
  
  // what came across as params
  var options = Object.keys(params_).reduce ( function(p,c) {
    p[c] = params_[c];
    return p;
  },options_);
  
  // get the dogger handler
  var dogger = getDogger (doggerProfile, false , options.thread , options);
  var qob = JSON.parse(options.query);
  var pob = JSON.parse(options.params);

  if (options.thread) {
    qob["_thread"] = options.thread;
    options.query = JSON.stringify(qob);
  }
  
  var handler = dogger.getHandler();
  if (options.after) {
    pob.skip = options.after;
    options.params = JSON.stringify(pob);
  }
  var result;

  
  if (options.action === "clear") {
    result = dogger.clear();
  }
  else {
    // these are unconstrained .. but so far only action=query and action = remove are expected
    try {
      result = handler[options.action](qob,pob);
      Logger.log(result.data.length);
      Logger.log(pob);
    }
    catch (err) {
      result = handler.makeResults (handler.getEnums().CODE.OPERATION_UNSUPPORTED,err);
    }
  }
  result.params = options;
  return result;
  
}