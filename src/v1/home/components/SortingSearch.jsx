import BaseVue from "../../../base/BaseVue";
import ListMenuClick from "../../partials/ListMenuClick";
import { onMounted } from 'vue';
import InputDropdown from "../../components/input/InputDropdown";
import InputText from "../../components/input/InputText";

export const SortingSearchClass = BaseVue.extend({
  construct : function(props,context){
    let self = this;
    self.listMenuClick = ListMenuClick.create(props,self).setup();
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
  }
});
export default {
  setup(props,context){
    let sortingSearchClass = SortingSearchClass.create(props,context);
    return sortingSearchClass.setup();
  },
  render(h){
    return (<div class="head_sorting_search" id="sorting_search">
      <div class="hss_1 on_mobile">
        <div class="hss_1_2">
          <img src="/public/img/map/dropdown_rort.svg" alt=""/>
        </div>
        <span>TRIER PAR</span>
        <img class="hss_1_3" src="/public/img/map/dropdown_arrow_bottom.svg" alt=""/>
      </div>
      <div class="hss_2 ui fluid popup">
        <div class="header" style="margin-bottom:12px;">
          <i class="tags icon"></i>
          <span>Sorting Option</span>
        </div>
        <div class="item">
          <h4>Sort by low price</h4>
        </div>
        <div class="item">
          <h4>Sort by near position</h4>
        </div>
        <div class="item">
          <h4>Sort by populer</h4>
        </div>
      </div>
    </div>);
  }
};