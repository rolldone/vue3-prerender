import UberProto from 'uberproto';
import { reactive, watch, onMounted } from 'vue';
export default UberProto.extend({
  // __init : 'construct',
  init : function(...params){
    /* 
      - params[0] -> props
      - params[1] -> context
      - params[n] -> optional defined by user
     */
    let self = this;
    try{
      self._contructParams = [...params];
      self.name = "base_composition_" +
      Math.random()
        .toString(36)
        .substring(7);
      this.context = params[1];
      if(params[0] != null){
        this.props = params[0];
        this.$props = params[0];
      };
      /* Important */
      /* Alarm to know you forgot call setup() method */
      setTimeout(function(){
        if(self.is_setup_called == null || self.is_setup_called == false){
          throw new Error("Woops Donny You forgot call setup after create!");
        }
      },1000);
    }catch(ex){
      console.error('construct - ex',ex);
    }
  },
  setup : function(){
    this.is_setup_called = true;
    let resultSetup = this.mergeProtoToPlainObject({},this);
    return resultSetup;
  },
  functionTest : function(){
    alert('BaseComposition');
  },
  mergeProtoToPlainObject : function(origin,nestedClass){
    window.staticType(origin,[Object]);
    if(Object.keys(origin).length == 0){
      origin = Object.assign({},nestedClass);
    }
    if(nestedClass["__proto__"] != null){
      for(var key in nestedClass["__proto__"]){
        if(origin[key] == null){
          origin[key] = nestedClass[key];
        }
      }
      return this.mergeProtoToPlainObject(origin,nestedClass["__proto__"]);
    }
    /* Important */
    /* Need re initialize construct beginning */
    if(origin.construct != null){
      origin.construct = origin.construct.bind(origin,...this._contructParams);
      origin.construct();
      /* We just use only first time loaded */
      delete origin._contructParams;
    }
    /* Important */
    /* Need initialize for the first time to catch map identity of methods */
    if(origin.setInitDOMSelection != null){
      origin.map = Object.create({});
      origin.refs = Object.create({});
      origin.setInitDOMSelection(null,null);
    }
    return origin;
  },
  render : function(h,props){
    var template = this.template.bind(this.context);
    return template(h,props);
  },
  getStackTrace : function () {
    let stack = new Error().stack || '';
    stack = stack.split('\n').map(function (line) { return line.trim(); });
    return stack.splice(stack[0] == 'Error' ? 2 : 1);
  },
  join : function(...props){
    let self = this;
    let strk = this.getStackTrace();
    let str = strk[1];
    console.log('ssssssssss',str);
    /* Important */
    /* Disesuaikan dengan kondisi stacktrace */
    /* Dont define inside anonymous function */
    switch(true){
      /* If on firefox */
      case str.match(/@/g)!=null && str.match(/@/g).length > 0:
        str = str.split('@')[0];
        break;
      /* If on chrome or same kind of it */
      case str.match(/\(/g)!=null && str.match(/\(/g).length > 0:
        str = str.split(' ')[1].split('(')[0];
        break;
      
    }
    str = str.replace(/\s/g, '');
    str = str.split('.').pop().split(str.lastIndexOf(''))[0];
    if(self[str] != null){
      return self[str](...props);
    }
    console.warn('Donny!. You dont have function with this name -> '+str+', Check your composition!!');
    return null;
  },
  /* InitDOMSelection perfect how to manage feature methods */
  // setInitDOMSelection : function(action,props){},
  getMapDOMSelection : function(what_prefix){
    let self = this;
    let theName = self.name + '_' +what_prefix;
    self.map[what_prefix] = theName;     
    return theName;
  },
});