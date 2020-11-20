import BaseVue from "../../../base/BaseVue";

export const SortingSearchClass = BaseVue.extend({
  construct : function(props,context){
    let self = this;

  },

});
export default {
  setup(props,context){
    let sortingSearchClass = SortingSearchClass.create(props,context);
    return sortingSearchClass.setup();
  },
  render(h){
    return (<div class="head_sorting_search">
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
          
        </div>
        <div class="item">
          
        </div>
      </div>
    </div>);
  }
};