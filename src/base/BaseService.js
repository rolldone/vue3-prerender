import config from "@config";
import Proto from 'uberproto';

var BaseHttpRequest = Proto.extend({
  __init : 'construct',
  construct: function() {
    console.log("base construct");
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
  jsonToQueryUrl: function(url, whatObject, action) {
    let theArg = new Arg();
    if (action == "hash") {
      theArg.urlUseHash = true;
    }
    let theUrl = theArg.url(url, whatObject);
    return theUrl;
  },
  getData: function(url, queryString) {
    let theArg = new Arg();
    console.log('getData',queryString);
    // let query = theArg.query();
    // console.log('query',queryString,query,theArg.url());
    // query = Object.assign(query, queryString);
    let theUrl = theArg.url(url, queryString);
    return new Promise(function(resolve) {
      $.ajax({
        method: "GET",
        url: theUrl,
        processData: false,
        contentType: false /* what type of data do we expect back from the server */,
      })
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
    return new Promise(function(resolve) {
      $.ajax({
        method: "POST",
        url: url,
        data: formData,
        processData: false,
        contentType: false /* what type of data do we expect back from the server */,
      })
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
    window.staticType(url, [String]);
    window.staticType(queryString, [Object]);
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
  name: "class_" + new Date().getMilliseconds(),
  setApiRoute: function(route) {
    window.staticType(route, [Object]);
    var newRoute = {};
    var baseHttp = config.API_URL;
    for (var a in route) {
      newRoute[a] = baseHttp + route[a];
    }
    window.routeApi = (function(api_store_list) {
      window.staticType(api_store_list, [Object]);
      return function(whatName) {
        window.staticType(whatName, [String]);
        if (api_store_list[whatName] == null) {
          return "";
        }
        return api_store_list[whatName];
      };
    })(newRoute);
    return (route = newRoute);
  },
  setPrivilegeMap: function(privileges) {
    window.staticType(privileges, [Object]);
    window.privilege_store_list = privileges;
    return privileges;
  },
});

export default BaseHttpRequest;
