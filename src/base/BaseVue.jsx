import BaseComposition from "./BaseComposition";
import { ref,reactive } from 'vue';
export default BaseComposition.extend({
  data : function(){
    return {};
  },
  resetData : function(){
    this._data = reactive(this.simpleInitData(this.data()));
  },
  init : function(...props){
    this._data = reactive(this.simpleInitData(this.data()));
    this._super(...props);
  },
  onrouterupdate: function(to, from) {},
  setUpdate: async function(whatString, props) {
    let self = this;
    let currentData = self.get(whatString) || {};
    console.log("currentData -> ", currentData);
    let theValue = self.get(whatString);
    switch(true){
      case theValue == null:
      case typeof theValue != 'object':
        return self.set(whatString,props);
    }
    await self.set(whatString, {
      ...currentData,
      ...props,
    });
  },
  set: function(whatString, props) {
    let self = this;
    window.staticType(self._data,[Object]);
    return new Promise(function(resolve) {
      self._data[whatString] = props;
      resolve();
    });
  },
  get: function(whatString) {
    let self = this;
    window.staticType(self._data,[Object]);
    if (whatString == null) {
      return self._data;
    }
    // return self._data[whatString];
    return self.safeJSON(self._data,whatString,null);
  },
  setRef : function(theRef,whatObject){
    this.refs[theRef] = ref(whatObject);
  },
  getRef : function(ref){
    try{
      window.staticType(ref,[String]);
      let test = this.refs[ref];
      return test.value._.setupState;
    }catch(ex){
      /* Its ok just keep it */
      // console.log('From getRef - Keep it!');
      return null;
    }
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
  getRef2 : function(whatObject){
    try{
      window.staticType(whatObject,[Object]);
      window.staticType(whatObject.value,[Object]);
      window.staticType(whatObject.value._,[Object]);
      window.staticType(whatObject.value._.setupState,[Object]);
      return whatObject.value._.setupState;
    }catch(ex){
      /* Its ok just keep it */
      console.log('From getRef - Keep it!');
      return whatObject;
    }
  },
  functionTest : function(){
    alert('BaseVue');
    this._super();
  },
  parseException: function(props) {
    window.staticType(props, [null, String]);
    if (props == null) return "";
    try {
      return JSON.parse(props);
    } catch (ex) {
      return props;
    }
  },
  submitValidation: function(props, callback) {
    let self = this;
    self.isPending = _.debounce(function(form_data) {
      let validation = new Validator(form_data, props.form_rules);
      let attributeName = props.form_attribute_name || self.get("form_attribute_name");
      if (Object.keys(attributeName).length > 0) {
        validation.setAttributeNames(attributeName);
      }
      validation.passes(function() {
        callback({
          status: "complete",
          form_data: form_data,
          error: {},
        });
      });
      validation.fails(function() {
        let newError = {};
        for (var aa in form_data) {
          switch (form_data[aa]) {
            case "":
            case null:
              delete form_data[aa];
              break;
          }
        }
        if (validation.errors.errors != null) {
          for (let key in validation.errors.errors) {
            newError[key] = validation.errors.errors[key][0];
            delete form_data[key];
          }
          callback({
            status: "error",
            form_data: form_data,
            error: newError,
          });
        } else {
          callback({
            status: "valid",
            form_data: form_data,
            error: newError,
          });
        }
      });
    }, 500);
    self.isPending(props.form_data);
  },
  inputTextValidation: function(wrapperTarget, props, callback) {
    let self = this;
    console.log("props.form_data", props.form_data);
    let theDomParent = $(wrapperTarget);
    let theDom = theDomParent.find(props.element_target);
    theDom.each(function(index, dom) {
      $(dom).on("focus change keyup blur keydown", function(e) {
        if (self.isPending != null) {
          if (e.type != "blur") {
            self.isPending.cancel();
          }
        }
        self.isPending = _.debounce(function(key, value) {
          let newObject = {};
          newObject[key] = value;
          props.form_data = _.assign({}, props.form_data, newObject);
          for (var aa in props.form_data) {
            if (props.form_data[aa] == null || props.form_data[aa] == "") {
              delete props.form_data[aa];
            }
            if (aa == "") {
              delete props.form_data[aa];
            }
          }
          let validation = new Validator(props.form_data, props.form_rules);
          let attributeName = props.form_attribute_name || self.get("form_attribute_name");
          if (Object.keys(attributeName).length > 0) {
            validation.setAttributeNames(attributeName);
          }
          validation.passes(function() {
            callback(
              {
                status: "complete",
                form_data: props.form_data,
                error: {},
                message: "",
              },
              e
            );
          });
          validation.fails(function() {
            let newError = {};
            if (validation.errors.errors[key]) {
              newError[key] = validation.errors.errors[key][0];
              callback(
                {
                  status: "error",
                  form_data: props.form_data,
                  error: newError,
                  message: validation.errors.errors[key][0],
                },
                e
              );
            } else {
              callback(
                {
                  status: "valid",
                  form_data: props.form_data,
                  error: newError,
                  message: "",
                },
                e
              );
            }
          });
        }, 300);
        self.isPending(e.target.name, e.target.value);
      });
    });
  },
  waitingTimeout: function(whatSecondTime) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, whatSecondTime);
    });
  },
  safeJSON: function(props, endpoint, index) {
    endpoint = endpoint.split(".");
    if (endpoint.length == 0) {
      return "";
    }
    if (index == null) {
      index = 0;
    }
    if (props == null) {
      return "";
    }
    if (props[endpoint[index]] == null) {
      return "";
    }
    props = props[endpoint[index]];
    index += 1;
    if (index == endpoint.length) {
      return props;
    }
    return this.safeJSON(props, endpoint.join("."), index);
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
  routeToPathString: function(object) {
    window.staticType(object, [Object]);
    /* Example {name:'auth.login'} */
    return this.$router.resolve(object).href;
  },
  takeArrayFromFirstIndex: function(array, takeCount) {
    return array.slice(0, takeCount);
  },
  takeArrayFromLastIndex: function(array, takeCount) {
    return array.slice(array.length - takeCount, array.length);
  },
  getRandomText: function(combineString, stringLength, substringLenght) {
    window.staticType(combineString, [String]);
    window.staticType(stringLength, [null, Number]);
    window.staticType(substringLenght, [null, Number]);
    return (
      combineString +
      Math.random()
        .toString(stringLength || 36)
        .substring(substringLenght || 7)
    );
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
  updateUrlState: function(curUrl, action) {
    // console.log(window.location.href,' - '+curUrl);
    switch (action) {
      case "PUSH_STATE":
        if (window.location.href == curUrl) {
          return;
        }
        return window.history.pushState("", "", curUrl);
        // return window.masterData.saveData('pushstate',window.history);
    }
    return window.history.replaceState("", "", curUrl);
    // window.router.update(curUrl,false,{});
  },
  saveQueryUrl: function(query, url = null, option = null) {
    let self = this;
    let newQuery = self.jsonToQueryUrl(url || window.location.href, query, null);
    self.updateUrlState(newQuery, option || "PUSH_STATE");
    return newQuery;
  },
  updateCurrentState(query){
    window.masterData.saveData('global_on_pop_state',null);
    window.router.push({ name : window.route.name, query : query });
  },
  resolveRouteToUrl: function(string) {
    return window.router.resolve({ name: string }).href;
  },
  recursiveFunction: function(index, done, middlewares, props = null) {
    console.log(index, "length", middlewares.length);
    if (index == middlewares.length) {
      return done();
    }
    var next = index + 1;
    console.log("next", next);
    console.log("index", index);
    return middlewares[index](props, done, recursive.bind(this, next, done, middlewares));
  },
});