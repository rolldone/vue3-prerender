import config from "@config";
import Proto from 'uberproto';
import StaticType from './StaticType';

const rememberRequest = {};

var BaseHttpRequest = Proto.extend({
  __init : 'construct',
  construct: function() {
    console.log("base construct");
  },
  headers : {
    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    Authorization: (window.localStorage.getItem("token_type")||"Bearer")+' '+ window.localStorage.getItem("token")
  },
  /* Aditional function */
  objectToFormData: function(props) {
    let formData = null;
    formData = new FormData();
    for (var a in props) {
      if (props[a] != null) {
        formData.append(a, props[a]);
      }
    }
    return formData;
  },
  setUrl: function(urlString, array) {
    for (var a = 0; a < array.length; a++) {
      for (var key in array[a]) {
        if (urlString.match(key)) {
          var re = new RegExp(key, "g");
          urlString = urlString.replace(re, array[a][key]);
        }
      }
    }
    return urlString;
  },
  simpleInitData : function(object,overrides){
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
  },
  jsonParseUrl: function(whatUrl = window.location.href) {
    let theUrl = new Arg(whatUrl);
    let theJSON = {};
    theJSON["query"] = theUrl.query();
    theJSON["hash"] = theUrl.hash();
    return theJSON;
  },
  jsonToQueryUrl: function(url, whatObject, action) {
    let theArg = new Arg();
    if (action == "hash") {
      theArg.urlUseHash = true;
    }
    let theUrl = theArg.url(url, whatObject);
    return theUrl;
  },
  getHeaders : function(){
    if(this.headers == undefined) return null;
    return this.headers;
  },
  setNewHeaders : function(props){
    StaticType(props,[Object]);
    this.newHeaders = props;
  },
  getNewHeaders : function(){
    if(this.newHeaders == undefined) return null;
    return this.newHeaders;
  },
  setPreventDuplicate : function(prevent=false){
    this.preventDuplicateRequest = prevent;
  },
  isPreventDuplicate : function(){
    return this.preventDuplicateRequest || false;
  },
  getData: function(url, queryString) {
    let self = this;
    let theArg = new Arg();
    console.log('getData',queryString);
    // let query = theArg.query();
    // console.log('query',queryString,query,theArg.url());
    // query = Object.assign(query, queryString);
    let theUrl = theArg.url(url, queryString);
    return new Promise(function(resolve) {
      var xhr = new window.XMLHttpRequest();
      let ajaxVar = {
        xhr : function(){
          return xhr;
        },
        headers : self.getHeaders(),
        method: "GET",
        url: theUrl,
        processData: false,
        contentType: false /* what type of data do we expect back from the server */,
      };
      let newHeaders = self.getNewHeaders();
      if(newHeaders != null){
        /* Replace with new headers */
        ajaxVar.headers = newHeaders;
      }
      /* Cancel if get duplicate request like debounce */
      if(self.isPreventDuplicate() == true){
        if(rememberRequest[url] != null){
          rememberRequest[url].xhr.abort();
          rememberRequest[url].resolve({
            status : 'error',
            data : {
              responseJSON : null
            }
          });
        }
      }
      rememberRequest[url] = {
        xhr : xhr,
        resolve : resolve
      };  
      $.ajax(ajaxVar)
        .then(function(res) {
          resolve(res);
        })
        .fail(function(data, status) {
          resolve({
            status: "error",
            data: data,
          });
        });
    });
  },
  postData: function(url, formData) {
    let self = this;
    return new Promise(function(resolve) {
      let ajaxVar = {
        headers : self.getHeaders(),
        method: "POST",
        url: url,
        data: formData,
        processData: false,
        contentType: false /* what type of data do we expect back from the server */,
      };
      let newHeaders = self.getNewHeaders();
      if(newHeaders != null){
        /* Replace with new headers */
        ajaxVar.headers = newHeaders;
      }
      $.ajax(ajaxVar)
        .then(function(res) {
          resolve(res);
        })
        .fail(function(data, status) {
          resolve({
            status: "error",
            data: data,
          });
        });
    });
  },
  putData : function(url,formData){
    let self = this;
    return new Promise(function(resolve) {
      let ajaxVar = {
        headers : {
          ...self.getHeaders(),
          'Content-Type' : 'application/json'
        },
        method: "PUT",
        url: url,
        data: formData,
        processData: false,
        contentType: false /* what type of data do we expect back from the server */,
      };
      let newHeaders = self.getNewHeaders();
      if(newHeaders != null){
        /* Replace with new headers */
        ajaxVar.headers = newHeaders;
      }
      $.ajax(ajaxVar)
        .then(function(res) {
          resolve(res);
        })
        .fail(function(data, status) {
          resolve({
            status: "error",
            data: data,
          });
        });
    });
  },
  deleteData : function(url,formData){
    let self = this;
    return new Promise(function(resolve) {
      let ajaxVar = {
        headers : {
          ...self.getHeaders(),
          'Content-Type' : 'application/json'
        },
        method: "DELETE",
        url: url,
        data: formData,
        processData: false,
        contentType: false /* what type of data do we expect back from the server */,
      };
      let newHeaders = self.getNewHeaders();
      if(newHeaders != null){
        /* Replace with new headers */
        ajaxVar.headers = newHeaders;
      }
      $.ajax(ajaxVar)
        .then(function(res) {
          resolve(res);
        })
        .fail(function(data, status) {
          resolve({
            status: "error",
            data: data,
          });
        });
    });
  },
  getScript: function(url, queryString) {
    StaticType(url, [String]);
    StaticType(queryString, [Object]);
    return new Promise(function(resolve, reject) {
      let theArg = new Arg(url);
      let query = theArg.query();
      query = Object.assign(query, queryString);
      let theUrl = theArg.url(url, query);
      console.log("theUrl", theUrl);
      $.ajax({
        method: "GET",
        url: theUrl,
        dataType: "script",
        cache: false,
      })
        .done(function(res) {
          console.log("res", res);
          resolve(res);
        })
        .fail(function(err) {
          reject(err);
        });
    });
  },
  test: function() {
    console.log("original");
  },
  validURL : function(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  },
  existDomain : function(str){
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'); // OR ip (v4) address
    return !!pattern.test(str);
  },
  name: "class_" + new Date().getMilliseconds(),
  setApiRoute: function(route) {
    StaticType(route, [Object]);
    var newRoute = {};
    var baseHttp = config.API_URL;
    for (var a in route) {
      if(this.existDomain(route[a]) == true){
        newRoute[a] = route[a];
      }else{
        newRoute[a] = baseHttp + route[a];
      }
    }
    window.routeApi = (function(api_store_list) {
      StaticType(api_store_list, [Object]);
      return function(whatName) {
        StaticType(whatName, [String]);
        if (api_store_list[whatName] == null) {
          return "";
        }
        return api_store_list[whatName];
      };
    })(newRoute);
    return (route = newRoute);
  },
  setPrivilegeMap: function(privileges) {
    StaticType(privileges, [Object]);
    window.privilege_store_list = privileges;
    return privileges;
  },
  setLocalStorage : function(whatString,props){
    let self = this;
    let currentData = window.localStorage.getItem(whatString);
    console.log("currentData -> ", currentData);
    let theValue = window.localStorage.getItem(whatString);
    switch(true){
      case theValue == null:
      case typeof theValue != 'object':
        return window.localStorage.setItem(whatString,JSON.stringify(props));
    }
    currentData = JSON.parse(currentData);
    if(Object.keys(currentData).length == 0){
      window.localStorage.setItem(whatString,JSON.stringify(props));
      return;
    }
    window.localStorage.setItem(whatString,{
      ...currentData,
      ...props,
    });
  },
  getLocalStorage : function(whatString){
    let theValue = window.localStorage.getItem(whatString);
    try{
      return JSON.parse(theValue);
    }catch(ex){
      switch(true){
        case theValue == null:
        case typeof theValue != 'object':
          return theValue;
      }
    }
    
  }
});

export default BaseHttpRequest;
