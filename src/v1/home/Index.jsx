import BaseVue from "../../base/BaseVue";
import { reactive, onMounted, onBeforeMount  } from 'vue';
import AppStore from "../store/AppStore";
import DisplayOptionFunction from "./partials/DisplayOptionFunction";
import MapView from "./components/MapView";
import GridDataFunction from "./partials/GridDataFunction";
import ProductService from "../services/ProductService";
import ListDataFunction from "./partials/ListDataFunction";
import PopUpSelectLocation from "./components/PopUpSelectLocation";
import PositionService from "../services/PositionService";

export const IndexClass = BaseVue.extend({
  data : function(){
    return reactive({
      select_view : 'MAP',
      query : {
        lat : null,
        long : null
      },
      datas : [],
      select_position : {}
    });
  },
  returnPositionService : function(){
    return PositionService.create();
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
      let position = self.getLocalStorage('position') || {};
      self.setInitDOMSelection(self.displayOption.map.INITIALIZE);
      self.setInitDOMSelection('FILTER_SEARCH');
      self.setInitDOMSelection('HEAD_SEARCH');
      self.setInitDOMSelection('SORTING_SEARCH');
      if(position == null || Object.keys(position).length == 0){
        self.setInitDOMSelection('POPUP_SELECT_LOCATION');
      }
      await self.set('select_position',position);
      self.setProducts(await self.getProducts());
    });
  },
  isAllowSelectLocation : async function(){
    let self = this;
    try{
      let service = self.returnPositionService();
      let resData = await service.isAllowSelectLocation();
      return resData;
    }catch(ex){
      console.error('isAllowSelectLocation - ex ',ex);
    }
  },
  getCurrentIpLocation : async function(){
    let self = this;
    try{
      let service = self.returnPositionService();
      let resData = await service.getCurrentIpLocation();
      resData = (function(parseData){
        parseData.latitude = parseData.lat;
        parseData.longitude = parseData.lon;
        delete parseData.lat;
        delete parseData.lon;
        return parseData;
      })(resData.return);
      return resData;
    }catch(ex){
      console.error('getCurrentIpLocation - ex ',ex);
    }
  },
  getCurrentPosition : async function(){
    let self = this;
    try{
      let service = self.returnPositionService();
      let resData = await service.getCurrentPosition();
      return resData;
    }catch(ex){
      console.error('getCurrentPosition - ex ',ex);
    }
  },
  getProducts : async function(){
    let self = this;
    try{
      let service = self.returnProductService();
      let select_position = self.get('select_position');
      if(Object.keys(select_position).length == 0){
        if(await self.isAllowSelectLocation() == true){
          select_position = await self.getCurrentPosition();
        }else{
          select_position = await self.getCurrentIpLocation();
        }
      }
      let query = self.get('query');
      query = {
        ...query,
        lat : select_position.latitude,
        long : select_position.longitude
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
        self.popUpSelectLocation.setOnCallbackListener(async function(action,props){
          window.staticType(props,[Object]);
          window.staticType(props.position,[Object]);
          window.staticType(props.form_data,[Object]);
          switch(action){
            case 'SUBMIT':
              self.popUpSelectLocation.setAction('hide',{});
              self.setLocalStorage('position',props.position);
              self.setUpdate('select_position',props.position);
              await self.set('datas',[]);
              self.set('query',{
                search : props.form_data.search
              });
              self.updateCurrentState(self.get('query'));
              return;
            case 'DISPOSE':
              self.popUpSelectLocation.setAction('hide',{});
              self.setLocalStorage('position',props.position);
              self.setUpdate('select_position',props.position);
              await self.set('datas',[]);
              self.set('query',{
                search : props.form_data.search
              });
              self.updateCurrentState(self.get('query'));
              return;
          }
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