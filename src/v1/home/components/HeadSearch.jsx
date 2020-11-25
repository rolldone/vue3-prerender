import BaseVue from "../../../base/BaseVue";
import { reactive } from 'vue';

export const HeadSearchClass = BaseVue.extend({
  data : function(){
    return reactive({
      search_text : null
    });
  },
  construct : function(props,context){
    let self = this;
    let jsonParseUrl = self.jsonParseUrl();
    self.setUpdate('search_text',jsonParseUrl.query.search);
  },
  handleChange : function(action,props,e){
    let self = this;
    switch(action){
      case 'SEARCH_TEXT':
        if(self.pendingTyping != null){
          self.pendingTyping.cancel();
        }
        self.pendingTyping = _.debounce(function(parseData){
          self.onChangeListener('ON_TYPING',parseData);
        },1000);
        self.pendingTyping($(e.target).val());
        break;
    }
  },
  setOnChangeListener : function(func){
    let self = this;
    self.onChangeListener = func;
  }
});

export default {
  setup(props,context){
    let headSearchClass = HeadSearchClass.create(props,context);
    return headSearchClass.setup();
  },
  render(h){
    let { search_text } = this.get();
    return (<div class="home_search on_mobile">
      <div class="hm_1 on_mobile">
        <input type="text" placeholder="Researcher" v-model={search_text} onChange={this.handleChange.bind(this,'SEARCH_TEXT',{})}/>
        <img src="/public/img/map/search.svg" alt=""/>
      </div>
    </div>);
  }
};