import BaseVue from "../../base/BaseVue";
import HomeLayout from "../layout/HomeLayout";
import HeadMenu from "./components/HeadMenu";
import { reactive, onMounted, onBeforeMount } from 'vue';
import AppStore from "../store/AppStore";
import DisplayOptionFunction from "./partials/DisplayOptionFunction";
import FilterSearch from "./components/FilterSearch";
import MapView from "./components/MapView";

export const IndexClass = BaseVue.extend({
  data : function(){
    return reactive({});
  },
  construct : function(props,context){
    let self = this;
    self.displayOption = (DisplayOptionFunction.create(props,self)).setup();
    onBeforeMount(function(){
      AppStore.commit('SET',{
        title : window.gettext("ArtyPlanet Home")
      });
    });
    onMounted(function(){
      self.setInitDOMSelection(self.displayOption.map.INITIALIZE);
      self.setInitDOMSelection('FILTER_SEARCH');
      self.setInitDOMSelection('LOAD_MAP_VIEW');
    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    /* Composition define */
    self.displayOption.join(action,props,function(action,val,e){});
    /* Casual define */
    switch(action){
      case 'FILTER_SEARCH':
        self.filterSearch = self.getRef('filterSearch');
        self.filterSearch.setOnClickListener(function(action,val){
          switch(action){
            case 'SHOW':
              break;
            case 'HIDE':
              break;
          }
        });
        break;
      case 'LOAD_MAP_VIEW':
        self.mapView = self.getRef('mapView');
        if(self.mapView == null) return;
        self.mapView.setOnChangeListener(function(action,val){});
        self.mapView.startMap(props || {});
        break;
    }
  },
  handleClick : function(action,props,e){}
});

export default {
  setup(props,context){
    let indexClass = (IndexClass.create(props,context)).setup();
    return indexClass;
  },
  render : function(h){
    return (<HomeLayout header={HeadMenu}>
      <div class="ui grid" style="width:100%;">
        <div class="four wide column">
          <div id="nav_map">
            {/* Partial display map topion */}
            {this.displayOption.render(h,{})}
            {/* Display filter search */}
            <FilterSearch ref={(ref)=>this.setRef('filterSearch',ref)}></FilterSearch>
          </div>
        </div>
        <div class="four wide column"></div>
        <div class="four wide column"></div>
      </div>
      <MapView ref={(ref)=>this.setRef('mapView',ref)}></MapView>
    </HomeLayout>);
  }
};