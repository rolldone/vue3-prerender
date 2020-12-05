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
import UserAgentService from "../services/UserAgentService";

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
  returnUserAgentService : function(){
    return UserAgentService.create();
  },
  returnPositionService : function(){
    return PositionService.create();
  },
  returnProductService : function(){
    return ProductService.create();
  },
  construct : async function(props,context){
    let self = this;
    let query = null;
    let position = null;
    self.displayOption = (DisplayOptionFunction.create(props,self)).setup();
    self.gridData = (GridDataFunction.create(props,self)).setup();
    self.listData = (ListDataFunction.create(props,self)).setup();
    let jsonParseUrl = self.jsonParseUrl();
    self.setUpdate('query',jsonParseUrl.query);
    onBeforeMount(function(){
      AppStore.commit('SET',{
        title : window.gettext("ArtyPlanet Home")
      });
    });
    onMounted(async function(){
      /* Get last position */
      let positionService = self.returnPositionService();
      position = await positionService.getLastPosition();
      
      self.setInitDOMSelection(self.displayOption.map.INITIALIZE);
      self.setInitDOMSelection('FILTER_SEARCH');
      self.setInitDOMSelection('HEAD_SEARCH');
      self.setInitDOMSelection('SORTING_SEARCH');
      if(position == null || Object.keys(position).length == 0){
        let userAgentService = self.returnUserAgentService();
        if(userAgentService.isMySystemUserAgent()==false){
          self.setInitDOMSelection('POPUP_SELECT_LOCATION');
        }
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
          select_position = await AppStore.state.app.ipPosition;
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
              /* Save the last position */
              self.returnPositionService().saveLastPosition(props.position);
              self.setLocalStorage('position',props.position);
              self.setUpdate('select_position',props.position);
              await self.set('datas',[]);
              self.set('query',{
                search : props.form_data.search,
                latlng : props.position.latitude+','+props.position.longitude
              });
              self.updateCurrentState(self.get('query'));
              return;
            case 'DISPOSE':
              self.popUpSelectLocation.setAction('hide',{});
              self.setLocalStorage('position',props.position);
              self.setUpdate('select_position',props.position);
              await self.set('datas',[]);
              self.set('query',{
                search : props.form_data.search,
                latlng : props.position.latitude+','+props.position.longitude
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