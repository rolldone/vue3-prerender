import BaseVue from "../../base/BaseVue";
import HomeLayout from "../layout/HomeLayout";
import HeadMenu from "./components/HeadMenu";
import { reactive, onMounted, onBeforeMount  } from 'vue';
import AppStore from "../store/AppStore";
import DisplayOptionFunction from "./partials/DisplayOptionFunction";
import FilterSearch from "./components/FilterSearch";
import MapView from "./components/MapView";
import GridDataFunction from "./partials/GridDataFunction";
import ProductService from "../services/ProductService";
import ListDataFunction from "./partials/ListDataFunction";
import HeadSearch from "./components/HeadSearch";
import SortingSearch from "./components/SortingSearch";
import PopUpSelectLocation from "./components/PopUpSelectLocation";

export const IndexClass = BaseVue.extend({
  data : function(){
    return reactive({
      select_view : 'MAP',
      query : {
        lat : null,
        long : null
      },
      datas : []
    });
  },
  returnProductService : function(){
    return ProductService.create();
  },
  construct : async function(props,context){
    let self = this;
    self.displayOption = (DisplayOptionFunction.create(props,self)).setup();
    self.gridData = (GridDataFunction.create(props,self)).setup();
    self.listData = (ListDataFunction.create(props,self)).setup();
    onBeforeMount(function(){
      AppStore.commit('SET',{
        title : window.gettext("ArtyPlanet Home")
      });
      let jsonParseUrl = self.jsonParseUrl();
      self.setUpdate('query',jsonParseUrl.query);
    });
    onMounted(async function(){
      self.setProducts(await self.getProducts());
      self.setInitDOMSelection(self.displayOption.map.INITIALIZE);
      self.setInitDOMSelection('FILTER_SEARCH');
      self.setInitDOMSelection('HEAD_SEARCH');
      self.setInitDOMSelection('SORTING_SEARCH');
      self.setInitDOMSelection('POPUP_SELECT_LOCATION');
    });
  },
  getProducts : async function(){
    let self = this;
    try{
      let service = self.returnProductService();
      let position = await service.getCurrentPosition();
      let query = self.get('query');
      query = {
        ...query,
        lat : position.latitude,
        long : position.longitude
      };
      await self.setUpdate('query',query);
      let resData = await service.getProducts(self.get('query'));
      return resData;
    }catch(ex){
      console.error('getProducts - ex ',ex);
    }
  },
  setProducts : async function(props){
    let self = this;
    if(props == null) return;
    let datas = (function(parseDatas){
      for(var a=0;a<parseDatas.length;a++){
        parseDatas[a].store = self.simpleInitData(parseDatas[a].business_product_category);
        delete parseDatas[a].business_product_category;
      }
      return parseDatas;
    })(props.return);
    await self.set('datas',datas);
    self.passDataToComponent();
  },
  passDataToComponent : function(){
    let self = this;
    self.setInitDOMSelection('LOAD_MAP_VIEW');
    self.setInitDOMSelection(self.gridData.map.LOAD,self.get('datas'));
    self.setInitDOMSelection(self.listData.map.LOAD,self.get('datas'));
  },
  setInitDOMSelection : async function(action,props){
    let self = this;
    /* Composition define */
    self.gridData.join(action,props,async function(action,val){});
    self.listData.join(action,props,async function(action,val){});
    self.displayOption.join(action,props,async function(action,val,e){
      /* Need promise for good effect */
      await self.set('select_view',action);
      switch(action){
        case 'GRID':
          self.setInitDOMSelection(self.gridData.map.LOAD,self.get('datas'));
          break;
        case 'LIST':
          self.setInitDOMSelection(self.listData.map.LOAD,self.get('datas'));
          break;
        case 'MAP':
          self.setInitDOMSelection('LOAD_MAP_VIEW');
          break;
      }
    });
    /* Casual define */
    switch(action){
      case 'POPUP_SELECT_LOCATION':
        self.popUpSelectLocation = self.getRef('popUpSelectLocationRef');
        if(self.popUpSelectLocation == null) return;
        self.popUpSelectLocation.setOnCallbackListener(function(action,props){
          
        });
        self.popUpSelectLocation.setAction('show',{});
        break;
      case 'LOAD_MAP_VIEW':
        self.mapView = self.getRef('mapView');
        if(self.mapView == null) return;
        let datas = await self.get('datas');
        let query = self.get('query');
        self.mapView.setOnChangeListener(function(action,val){});
        self.mapView.startMap({
          datas : datas,
          lat : query.lat,
          long : query.long
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
    return (<>
      <PopUpSelectLocation ref={(ref)=>this.setRef('popUpSelectLocationRef',ref)}></PopUpSelectLocation>
      {(()=>{
        switch(select_view){
          case 'MAP':
            return (<MapView ref={(ref)=>this.setRef('mapView',ref)}></MapView>);
          case 'GRID':
            return this.gridData.render(h,{});
          case 'LIST':
            return this.listData.render(h,{});
        }
      })()}
    </>);
  }
};