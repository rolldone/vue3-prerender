import BaseVue from "../../base/BaseVue";
import HomeLayout from "../layout/HomeLayout";
import HeadMenu from "./components/HeadMenu";
import { reactive, onMounted, onBeforeMount } from 'vue';
import AppStore from "../store/AppStore";
import DisplayOptionFunction from "./partials/DisplayOptionFunction";
import FilterSearch from "./components/FilterSearch";
import MapView from "./components/MapView";
import GridDataFunction from "./partials/GridDataFunction";

const artywiz_users = [{
  id : 1,
  lat : 48.583782,
  long : 7.746497,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_1.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE 1',
    phone : '03 88 23 23 23'
  },
  
},{
  id : 2,
  lat : 48.583718,
  long : 7.744763,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_2.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE 2',
    phone : '03 88 23 23 23'
  },
},{
  id : 3,
  lat : 48.583125,
  long : 7.748121,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_3.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE 3',
    phone : '03 88 23 23 23'
  },
},{
  id : 4,
  lat : 48.584520,
  long : 7.747375,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_4.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE 4',
    phone : '03 88 23 23 23'
  },
},{
  id : 5,
  lat : 48.584772,
  long : 7.745106,
  product_name : 'Ciabatta',
  price : 3,
  unit : 'EUR',
  description : "La ciabatta est un pain blanc originaire d'Italie, dont l'une des...",
  ingredient : "yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....",
  image : '/public/img/map/sample_product.png',
  store : {
    image : "/public/img/map/users/user_5.png",
    address : '0,2 km | 15-3 Rue des Pucelles 67000 Strasbourg',
    store_name : 'BOULANGERIE DE LA REINE 5',
    phone : '03 88 23 23 23'
  },
}];

export const IndexClass = BaseVue.extend({
  data : function(){
    return reactive({
      select_view : 'MAP'
    });
  },
  construct : function(props,context){
    let self = this;
    self.displayOption = (DisplayOptionFunction.create(props,self)).setup();
    self.gridData = (GridDataFunction.create(props,self)).setup();
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
    self.gridData.join(action,props,async function(action,val){

    });
    self.displayOption.join(action,props,async function(action,val,e){
      /* Need promise for good effect */
      await self.set('select_view',action);
      switch(action){
        case 'GRID':
          self.setInitDOMSelection(self.gridData.map.LOAD,artywiz_users);
          break;
        case 'LIST':
          break;
        case 'MAP':
          self.setInitDOMSelection('LOAD_MAP_VIEW',artywiz_users);
          break;
      }
    });
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
        self.mapView.startMap({
          datas : artywiz_users,
          lat : null,
          long : null
        });
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
    let { select_view } = this.get();
    return (<HomeLayout header={HeadMenu}>
      <div class="ui grid" style="width:100%;">
        <div class="sixteen wide column">
          <div id="nav_map">
            {/* Partial display map topion */}
            {this.displayOption.render(h,{})}
            {/* Display filter search */}
            <FilterSearch ref={(ref)=>this.setRef('filterSearch',ref)}></FilterSearch>
          </div>
        </div>
      </div>
      {(()=>{
        switch(select_view){
          case 'MAP':
            return (<MapView ref={(ref)=>this.setRef('mapView',ref)}></MapView>);
          case 'GRID':
            return this.gridData.render(h,{});
          case 'LIST':
            return null;
        }
      })()}
      
    </HomeLayout>);
  }
};