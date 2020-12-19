import 'url-change-event';
import Arg from '../../assets/arg/dist/arg.min.js';

(function(global){
  var stateAction = null;
  window.addEventListener('urlchangeevent', async function(e) {
    // your code here
    stateAction = e.action;
    setTimeout(() => {
      stateAction = null;
    }, 2000);
  });
  
  var smartPushState = {
    jsonToQueryUrl: function(url, whatObject, action) {
      let theArg = new Arg();
      if (action == "hash") {
        theArg.urlUseHash = true;
      }
      let theUrl = theArg.url(url, whatObject);
      return theUrl;
    },
    updateUrlState: function(curUrl, action) {
      if(stateAction == null){
        switch (action) {
          case "PUSH_STATE":
            window.history.pushState("", "", curUrl);
            // window.router.options.history.state.current = curUrl;
            window.history.state.current = curUrl;
            return;
        }
        return window.history.replaceState("", "", curUrl);
      }
      return null;
    },
    updateState: async function(query, url = null, option = null) {
      let self = this;
      query._ = new Date().getTime();
      let newQuery = self.jsonToQueryUrl("?", query, null);
      self.updateUrlState(newQuery, option || "PUSH_STATE");
      return newQuery;
    },
  };

  if (typeof define === 'function' && define.amd) {
    /* AMD support */
    define(function(){
      return smartPushState;
    });
  } else if (typeof module === 'object' && module.exports) {
    /* CJS support */
    module.exports = smartPushState;
  } else {
    /** @namespace
     * SmartPushState is the root namespace for all SmartPushState.js functionality.
     */
    global.SmartPushState = smartPushState;
  }
})(window);