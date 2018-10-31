/**
 * the purpose of this is simply to provide a common cache object for collaborating scripts
 */
 
function getUserCache() {
  return CacheService.getUserCache();
}

function getDocumentCache() {
  return CacheService.getDocumentCache();
}

function getScriptCache() {
  return CacheService.getScriptCache();
}

/** 
 * used for dependency management - update this to match proj properties etc for reporting (optional)
 * @return {LibraryInfo} the info about this library and its dependencies
 */
function getLibraryInfo () {
  return {
    info: {
      name:'yourCacheBucket',
      version:'0.0.1',
      key:'MveRagx_AESQYZ7d3DtGFtiz3TLx7pV4j',
      share:"https://script.google.com/d/1y4e_wxqNjMiq5DggWa1iunHW4YZU7pg97NlAuwWK50CXVxkRKATuX9kb/edit?usp=sharing",
      description:"Bruces cachebucket - clone and make your own"
    },
    dependencies:[
    ]
  }; 
}