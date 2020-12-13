require("moment/locale/fr.js");
const feather = require("feather-icons");
import config from "@config";
/* Set Default moment locale */
moment.locale("fr");
/* Initialize feather icon */
window.feather = feather;

/* Import daterangepicker */
require("@asset/daterangepicker/dist/daterangepicker.css");
require("@asset/daterangepicker/dist/daterangepicker.min.js");

/* Ini Wajib ada untuk trigger load globalnya, kalo ini tidak di set Tidak jalan */
gettext("Salutations");

/* Load moment as global */
window.moment = moment;

/* Share master data */
window.masterData = {
  pending: {},
  vars: {},
  stores: {},
  listeners : {},
  setOnListener: function (listenerName, callback,key="") {
    key = listenerName+key;
    if(this.listeners[key||callback.toString()] != null){
      window.pubsub.removeListener(listenerName,this.listeners[key||callback.toString()]);
    }
    this.listeners[key||callback.toString()] = callback;
    window.pubsub.on(listenerName, this.listeners[key||callback.toString()]);
  },
  removeListener : function(listenerName,key){
    try{
      key = listenerName+key;
      window.pubsub.removeListener(listenerName,this.listeners[key]);
      delete this.listeners[key];
    }catch(ex){
      console.error('removeListener - ex',ex);
    }
  },
  saveData: function (key, props) {
    this.vars[key] = props;
    window.pubsub.emit(key, props);
    // if (this.pending[key] != null) {
    //   this.pending[key].cancel();
    // }
    // this.pending[key] = _.debounce(function (key, props) {
    //   window.pubsub.emit(key, props);
    //   debugger;
    // }, 100);
    // this.pending[key](key, props);
  },
  run: function () {
    for (var key in this.stores) {
      this.saveData(key, this.vars[key]);
    }
  }
};

/* Ini supaya loading spinnernya ilang. Defaultnya false */
NProgress.configure({showSpinner: true});

/* Setup ajax */
document.cookie = "Bearer ";
window.countHttpRequest = 0;
window.resultLoadingHttpRequest = 0.1;
var pendingHttpRequestBounce = null;
$.ajaxSetup({
  headers: {
    /* Defined on baseService js */
  },
  cache: false,
  beforeSend: function (xhr) {
    /* NProgress.done(); */
    window.countHttpRequest += 1;
    console.log("xhr", xhr);
    let hasil = _.cloneDeep(1 / window.countHttpRequest);
    NProgress.set((100 - hasil * 100) / 100);
  },
  complete: function (xhr, status) {
    // window.countHttpRequest -= 1;
    if (pendingHttpRequestBounce != null) {
      pendingHttpRequestBounce.cancel();
    }
    pendingHttpRequestBounce = _.debounce(function () {
      NProgress.done();
    }, 3000);
    pendingHttpRequestBounce();
  }
});

/* Parse local storage to json */
var toJson = function (key) {
  var data = window.localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

/* Get each data on object */
window.eachObject = function (theOBject, callback, timeout) {
  StaticType(theOBject, [Object, Array]);
  StaticType(callback, [Function]);
  StaticType(timeout, [null,Number]);
  var index = 0;
  for (var key in theOBject) {
    setTimeout(function (i, key) {
      callback(i, key, theOBject[key]);
    }.bind(this, index, key), timeout||100);
    index += 1;
  }
};

/* Import css to head */
window.loadStaticCSS = function(pathString){
  if ($("link[href='"+pathString+"']").length > 0) return;
  $('<link>')
		.appendTo('head')
		.attr({
				type: 'text/css', 
				rel: 'stylesheet',
				href: pathString
		});
};

/* Remember is not recursive mode */
window.simpleInitData = function(object,overrides){
  let funcs = {};
  let newObject = {};
  for(var key in object){
    if({}.toString.call(object[key]) == '[object Function]'){
      funcs[key] = object[key];
    }else{
      newObject[key] = object[key];
    }
  }
  newObject = JSON.stringify(newObject);
  newObject = JSON.parse(newObject);
  newObject = {
    ...newObject,
    ...overrides,
  };
  for(var key in funcs){
    newObject[key] = funcs[key].bind(newObject);
  }
  return newObject;
};

window.stackTraceFunction = function(){
  let stack = new Error().stack || '';
  console.log('stack',stack);
};

window.ssrDone = function(){
  setTimeout(() => {
    $("body").append("<div id='headless_done'></div>");
  }, 1000);
};

/* Pusher setup */
// window.pusher = new Pusher("", {
//   cluster: "ap1",
//   forceTLS: true
// });
