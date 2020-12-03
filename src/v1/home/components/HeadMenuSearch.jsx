import BaseVue from "../../../base/BaseVue";
import { onMounted, reactive } from 'vue';
import ProductService from "../../services/ProductService";

export const HeadMenuSearchClass = BaseVue.extend({
  data : function(){
    return reactive({
      query : {}
    });
  },
  returnProductService : function(){
    return ProductService.create();
  },
  construct : function(props,context){
    let self = this;
    onMounted(function(){

    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    switch(action){}
  },
  getProductSearch : function(){
    try{
      
    }catch(ex){
      console.error('getProductSearch - ex ',ex);
    }
  },
  setProductSearch : function(props){
    let self = this;
  },
  handleChange : function(action,props,e){
    let self = this;
    switch(action){
      case 'WATCH_SEARCH_TEXT':
        if(self.pendingWatchSearchText != null){
          self.pendingWatchSearchText.cancel();
        }
        self.pendingWatchSearchText = _.debounce(function(parseText){

        },200);
        self.pendingWatchSearchText(e.target.value);
        break;
    }
  }
});
export default {
  setup(props,context){
    return HeadMenuSearchClass.create(props,context).setup();
  },
  render(h){
    return (<div class="headmenu_search">
      <div class="hdm_1">
        <img src="/public/img/map/search.svg" alt=""/>
        <input type="text" onChange={this.handleChange.bind(this,'WATCH_SEARCH_TEXT',{})} placeholder="Saisissez le type d'activité, Exemple “Boulangerie”, “pains ou gateau” au “chocolat”..."/>
      </div>
    </div>);
  }
};