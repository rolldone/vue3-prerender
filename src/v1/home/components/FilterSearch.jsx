import BaseVue from "../../../base/BaseVue";
import InputDropdown from "../../components/input/InputDropdown";
import InputText from "../../components/input/InputText";
import ListMenuClick from "../../partials/ListMenuClick";
import { onMounted } from 'vue';

export const FilterSearchClass = BaseVue.extend({
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
      className : '.ui.button'
    },function(action,val){
      self.onClickListener(action,val);
    });
  },
  setOnClickListener : function(func){
    let self = this;
    self.onClickListener = func;
  }
});

export default {
  setup(props,context){
    let filterSearchClass = FilterSearchClass.create(props,context).setup();
    return filterSearchClass;
  },
  render(h){
    return (<div id="filter_search_button">
      <div class="ui button">
        <img src="/public/img/filter_btn_icon.svg" alt=""/>
        &nbsp;&nbsp;
        <span>TRIER</span>
      </div>
      <div class="ui fluid popup">
        <div class="header">
          <i class="tags icon"></i>
          Filter
        </div>
        <div class="item">
          <InputDropdown datas={[]} name="test"></InputDropdown>
        </div>
        <div class="item">
          <InputDropdown datas={[]} name="test2"></InputDropdown>
        </div>
        <div class="item">
          <InputDropdown datas={[]} name="test3"></InputDropdown>
        </div>
        <div class="item">
          <InputText></InputText>
        </div>
      </div>
    </div>);
  }
};