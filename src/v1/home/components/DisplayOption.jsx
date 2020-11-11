import BaseVue from "../../../base/BaseVue";
import { reactive } from 'vue';

export const MapOptionClass = BaseVue.extend({
  data : function(){
    return reactive({
      select_option : 'MAP'
    });
  },
  handleClick : function(action,props,e){
    let self = this;
    self.set('select_option',action);
    self.onClickListener(action,props,e);
  },
  setOnClickListener : function(func){
    window.staticType(func,[Function]);
    let self = this;
    self.onClickListener = func;
  }
});

export default {
  setup(props,context){
    let mapOptionClass = (MapOptionClass.create(props,context)).setup();
    return mapOptionClass;
  },
  render(h){
    let { handleClick } = this;
    let { select_option } = this.get();
    return (<div class="ui icon buttons" id="display_option_btn">
        <button class="ui button" onClick={handleClick.bind(this,'MAP',{})}> <img src={"public/img/map_btn_icon"+(select_option=="MAP"?'_active':'')+".svg"} alt=""/> </button>
        <button class="ui button" onClick={handleClick.bind(this,'GRID',{})}> <img src={"public/img/grid_btn_icon"+(select_option=="GRID"?'_active':'')+".svg"} alt=""/> </button>
        <button class="ui button" onClick={handleClick.bind(this,'LIST',{})}> <img src={"public/img/list_btn_icon"+(select_option=="LIST"?'_active':'')+".svg"} alt=""/> </button>
      </div>);
  }
};