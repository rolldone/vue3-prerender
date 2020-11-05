import BaseVue from "../../base/BaseVue";
import { onUnmounted, onBeforeUnmount, onMounted } from 'vue';

export default BaseVue.extend({
  construct : function(props,context,key){
    window.staticType(key,[String]);
    this.key = key;
    onBeforeUnmount(function(){
      window.masterData.removeListener('on_pop_state',key);
      window.masterData.removeListener('url_update',key);
      window.masterData.removeListener('global_on_pop_state',key);
    });
  },
  setInitDOMSelection : function(action,props,callback){
    let self = this;
    let key = self.key;
    switch(action){
      case self.getMapDOMSelection('LOAD'):
        window.staticType(callback,[Function]);
        window.masterData.setOnListener('on_pop_state',function(props){
          callback('POP_STATE',props);
        },key);
        window.masterData.setOnListener('global_on_pop_state',function(props){
          callback('GLOBAL_POP_STATE',props);
        },key);
        window.masterData.setOnListener('url_update',function(props){
          callback('URL_UPDATE',props);
        },key);
        break;
    }
  }
});