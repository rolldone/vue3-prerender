import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted } from 'vue';

export const ListMapViewSearchClass = BaseVue.extend({
  data : function(){
    return reactive({
      query : {}
    });
  },
  construct(props,context){
    let self = this;
    onMounted(function(){
      let jsonParseUrl = self.jsonParseUrl();
      self.setUpdate('query',jsonParseUrl.query);
    });
  },
  handleChange : function(action,props,e){
    let self = this;
    switch(action){
      case 'SEARCH_PRODUCT':
        if(self.pendingSearch != null){
          self.pendingSearch.cancel();
        }
        self.pendingSearch = _.debounce(function(text){
          self.setUpdate('query',{
            search : text
          });
          self.updateCurrentState(self.get('query'));
        },200);
        self.pendingSearch(e.target.value);
    }
  },
  setOnChangeListener : function(func){
    let self = this;
    self.onChangeListener = func;
  }
});

export default {
  setup(props,context){
    return ListMapViewSearchClass.create(props,context).setup();
  },
  render(h){
    let { query } = this.get();
    return(<input type="text" value={query.search} onChange={this.handleChange.bind(this,'SEARCH_PRODUCT',{})} placeholder="Rechercher un aliment ou un magasin..."/>);
  }
};