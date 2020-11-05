import BaseVue from "../../../base/BaseVue";

export const MapOptionClass = BaseVue.extend({
  handleClick : function(action,props,e){
    let self = this;
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
    return (<div class="ui icon buttons" id="display_option_btn">
        <button class="ui button" onClick={handleClick.bind(this,'MAP',{})}> <img src="/public/img/map_btn_icon.svg" alt=""/> </button>
        <button class="ui button" onClick={handleClick.bind(this,'GRID',{})}> <img src="/public/img/grid_btn_icon.svg" alt=""/> </button>
        <button class="ui button" onClick={handleClick.bind(this,'LIST',{})}> <img src="/public/img/list_btn_icon.svg" alt=""/> </button>
      </div>);
  }
};