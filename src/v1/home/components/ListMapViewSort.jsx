import BaseVue from "../../../base/BaseVue";
import ListMenuClick from "../../partials/ListMenuClick";
import { onMounted, reactive } from 'vue';

export const SortingSearchClass = BaseVue.extend({
  data : function(){
    return reactive({
      sort_option : null,
      sort_field : null,
    });
  },
  construct : function(props,context){
    let self = this;
    self.listMenuClick = ListMenuClick.create(props,self).setup();
    let jsonParseUrl = self.jsonParseUrl();
    self.setUpdate('sort_option',jsonParseUrl.query.sort_option);
    self.setUpdate('sort_field',jsonParseUrl.query.sort_field);
    onMounted(function(){
      self.setInitDOMSelection(self.listMenuClick.map.LIST_MENU_CLICK);
    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    self.listMenuClick.join(action,{
      ...props,
      className : '#sorting_search .hss_1'
    },function(action,val){
      
      // self.onClickListener(action,val);
    });
  },
  setOnChangeListener : function(func){
    let self = this;
    self.onChangeListener = func;
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'SORT_ACTION':
        self.setUpdate('sort_option',props.sort_option);
        self.setUpdate('sort_field',props.sort_field);
        self.onChangeListener(action,props);
        break;
    }
  }
});
export default {
  setup(props,context){
    let sortingSearchClass = SortingSearchClass.create(props,context);
    return sortingSearchClass.setup();
  },
  render(h){
    let { handleClick } = this;
    let { sort_field } = this.get();
    return (<div class="head_sorting_search" id="sorting_search">
      <div class="hss_1 on_mobile">
        <div class="hss_1_2">
          <img src="/public/img/map/sort_icon.svg" alt=""/>
        </div>
        <span>TRIER PAR</span>
        <img class="hss_1_3" src="/public/img/map/dropdown_arrow_bottom.svg" alt=""/>
      </div>
      <div class="hss_2 ui fluid popup">
        <div class="header" style="margin-bottom:12px;">
          <i class="tags icon"></i>
          <span>Sorting Option</span>
        </div>
        <div class={"item "+(sort_field == "price"?"active":"")} onClick={handleClick.bind(this,'SORT_ACTION',{ sort_field : 'price', sort_option : 'ASC'})}>
          <h4>Sort by low price</h4>
        </div>
        <div class={"item "+(sort_field == "position"?"active":"")} onClick={handleClick.bind(this,'SORT_ACTION',{ sort_field : 'position', sort_option : 'ASC'})}>
          <h4>Sort by near position</h4>
        </div>
        <div class={"item "+(sort_field == "populer"?"active":"")} onClick={handleClick.bind(this,'SORT_ACTION',{ sort_field : 'populer', sort_option : 'DESC'})}>
          <h4>Sort by populer</h4>
        </div>
      </div>
    </div>);
  }
};