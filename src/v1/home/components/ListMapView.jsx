import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted } from 'vue';
import config from '@config';
import BusinessService from "../../services/BusinessService";
import ProductService from "../../services/ProductService";
import ListMapViewFilter from "./ListMapViewFilter";
import ListMapViewSort from "./ListMapViewSort";
import PositionService from "../../services/PositionService";

export const ListMMapViewClass = BaseVue.extend({
  data : function(){
    return reactive({
      action : 'list',
      business_data_id : null,
      business_data : {},
      product_datas : [],
      query : {},
      position : {}
    });
  },
  returnBusinessService : function(){
    return BusinessService.create();
  },
  returnProductService : function(){
    return ProductService.create();
  },
  returnPositionService : function(){
    return PositionService.create();
  },
  construct : function(props,context){
    let self = this;
    onMounted(function(){
      self.setInitDOMSelection('FILTER_SEARCH');
      self.setInitDOMSelection('SORTING_SEARCH');
      let jsonParseUrl = self.jsonParseUrl();
      self.setUpdate('query',jsonParseUrl.query);
    });
  },
  setInitDOMSelection : async function(action,props){
    let self = this;
    /* Casual define */
    switch(action){
      case 'SEARCH_PRODUCT':
        self.listMapsearch = self.getRef('listMapViewRef');
        if(self.listMapsearch == null) return;
        self.listMapsearch.setOnChangeListener(function(action){

        });
        break;
      case 'SORTING_SEARCH':
        self.sortingSearch = self.getRef('sortingSearchRef');
        if(self.sortingSearch == null) return;
        self.sortingSearch.setOnChangeListener(async function(action,val){
            switch(action){
              case 'SORT_ACTION':
                await self.setUpdate('query',val);
                self.updateCurrentState(self.get('query'));
                break;
            }
        });
        break;
      case 'FILTER_SEARCH':
        self.filterSearch = self.getRef('filterSearch');
        if(self.filterSearch == null) return;
        self.filterSearch.setOnClickListener(function(action,val){
          switch(action){
            case 'SHOW':
              break;
            case 'HIDE':
              break;
          }
        });
        break;
    }
  },
  getDetailProducts : async function(){
    let self = this;
    try{
      let { query } = this.get();
      let service = this.returnProductService();
      let resData = await service.getDetailProducts(query);
      return resData;
    }catch(ex){
      console.error('getDetailProducts - ex ',ex);
    }
  },
  setDetailProducts : function(props){
    let self = this;
    if(props == null) return;
    let product_datas = (function(parseDatas){
      return parseDatas;
    })(props.return);
    self.set('product_datas',product_datas);
  },
  getBusiness : async function(){
    let self = this;
    try{
      let business_data_id = self.get('business_data_id');
      let service = this.returnBusinessService();
      let resData = await service.getBusiness(business_data_id);
      return resData;
    }catch(ex){
      console.error('getBusiness - ex ',ex);
    }
  },
  setBusiness : function(props){
    let self = this;
    if(props == null) return;
    let business_data = (function(parseData){
      parseData.store = self.simpleInitData(parseData.business_product_category);
      delete parseData.business_product_category;
      return parseData;
    })(props.return);
    self.setUpdate('business_data',business_data);
  },
  setOnChangeListener : function(func){
    let self = this;
    self.onChangeListener = func;
  },
  selectBusiness : function(props){
    let self = this;
    self.handleClick('OPEN_DETAIL',props,null);
  },
  handleClick : async function(action,props,e){
    let self = this;
    switch(action){
      case 'BACK':
        self.setUpdate('business_data',{});
        self.set('product_datas',[]);
        self.setUpdate('action','list');
        self.onChangeListener('BACK');
        break;
      case 'OPEN_DETAIL':
        if(e!=null){
          e.preventDefault();
        }
        window.staticType(props,[Object]);
        window.staticType(props.id,[Number]);
        window.staticType(props.index,[Number]);
        window.staticType(props.search,[null,String]);
        await self.set('business_data',{});
        await self.setUpdate('action','detail');
        self.onChangeListener('BUSINESS_SELECTED',self.get('business_data'),props.index);
        let position = await self.returnPositionService().getLastPosition();
        await self.setUpdate('query',{
          business_id : props.id,
          search : props.search,
          long : position.longitude,
          lat : position.latitude
        });
        await self.setUpdate('business_data_id',props.id);
        self.setBusiness(await self.getBusiness());
        self.setDetailProducts(await self.getDetailProducts());
        break;
    }
  },
});

export default {
  props : {
    marker_datas : {
      type : Array,
      default : []
    }
  },
  setup(props,context){
    let listMapView = ListMMapViewClass.create(props,context);
    return listMapView.setup();
  },
  render(h){
    let { action, business_data, product_datas, query } = this.get();
    let { marker_datas } = this.props;
    switch(action){
      case 'list':
        return (<div class="app_shop_list on_mobile">
          <div class="shop_filter">
            <div class="sf_1">
              <div class="sf_11">
                <span>{window.gettext("Trouvé 10 articles sur Strasbourg")}</span>
              </div>
              <div class="sf_12" style="margin-left:auto;">
                <ListMapViewFilter ref={(ref)=>this.setRef('filterSearch',ref)}></ListMapViewFilter>
                <ListMapViewSort ref={(ref)=>this.setRef('sortingSearchRef',ref)}></ListMapViewSort>
              </div>
            </div>
          </div>
        {(()=>{
          let newMarkers = [];
          for(var a=0; a < marker_datas.length; a++){
            let markerItem = marker_datas[a];
            newMarkers.push(
              <div class="asl_1">
                <div class="asl_a_11 on_mobile">
                  <div class="asl_11 on_mobile">
                    <img style={{ "background-image" : "url("+config.ARTYWIZ_HOST+'/'+markerItem.business_cover_1+")"}} alt=""/>
                  </div>
                  <div class="asl_12">
                    <div class="asl_121 on_mobile">
                      <img style={{ "background-image" : "url("+config.ARTYWIZ_HOST+'/'+markerItem.business_logo+")"}} alt=""/>
                      <div class="asl_1211">
                        <h3>{markerItem.business_name_line_1.toUpperCase()}&nbsp;{markerItem.business_name_line_2.toUpperCase()}</h3>
                        <span>{markerItem.business_address} {markerItem.business_city} {markerItem.business_postal_code} {markerItem.business_country} {markerItem.business_phone}</span>
                      </div>
                    </div>
                    <div class="asl_122 on_mobile">
                      <a href="" onCLick={this.handleClick.bind(this,'OPEN_DETAIL',{ id : markerItem.id, index : a })}><span>Voir sur la carte</span>&nbsp;&nbsp; <img src="/public/img/map/detail_map.svg" alt=""/></a>
                      <a href=""><span>Aller à la boutique</span>&nbsp;&nbsp; <img src="/public/img/map/shop.svg" alt=""/></a>
                    </div>
                  </div>
                </div>
                {(()=>{
                  if(markerItem.products != null){
                    if(markerItem.products.length > 0){
                      return (<div class="asl_13">
                        {(()=>{
                          let subItem = [];
                          for(var b=0; b < markerItem.products.length;b++){
                            let productItem = markerItem.products[b];
                            subItem.push(<div class="app_shop_detail_list">
                              <div class="asdl_1">
                                <img style={{ "background-image" : "url("+config.ARTYWIZ_HOST+productItem.photo+")"}} alt=""/>
                              </div>
                              <div class="asdl_2">
                                <div class="asdl_21">
                                  <h4>{productItem.name}</h4>
                                  <div class="asdl_211">
                                    <span>{productItem.price}€ TTC</span>
                                    <span class="divider"></span>
                                    <span>{productItem.price_promotion}€ TTC</span>
                                  </div>
                                </div>
                                <div class="asdl_22">
                                  <span>Description</span>
                                  <span>{productItem.description}</span>
                                </div>
                              </div>
                            </div>);
                          }
                          return subItem;
                        })()}
                        <div class="asl_131">
                          <div class="asl_1311">
                            <a href="" onCLick={this.handleClick.bind(this,'OPEN_DETAIL',{ id : markerItem.id, index : a })}><span>Voir tout le menu sur la boutique</span>&nbsp;&nbsp; <img src="/public/img/map/store.svg" alt=""/></a>
                          </div>
                        </div>
                      </div>);
                    }else{
                      return null;
                    }
                  }
                })()}
              </div>
            );
          }
          return newMarkers;
        })()}
      </div>);
      case 'detail':
        if(Object.keys(business_data).length == 0) return (<div style="padding:12px"><h4>Load Content...</h4></div>);
        return (
          <div style="width:100%;height:100%;overflow-y:auto;">
            <div class="app_shop_detail">
              <div class="asd_1">
                <div class="asd_1_2">
                  <div class="asd_1_2_1" onCLick={this.handleClick.bind(this,'BACK')}>
                    <img src="/public/img/map/back.svg" alt=""/>
                  </div>
                </div>
              </div>
              <div class="asd_2">
                <div class="asd_2_1">
                  <div class="image" style={{ "background-image":"url("+config.ARTYWIZ_HOST+'/'+business_data.business_logo+")"}}></div>
                </div>
                <div class="asd_2_2">
                  <div class="asd_2_2_1">
                    <h4>{business_data.business_name_line_1.toUpperCase()}&nbsp;{business_data.business_name_line_2.toUpperCase()}</h4>
                    <span>
                      {business_data.business_address} {business_data.business_city} {business_data.business_postal_code} {business_data.business_country}
                    </span>
                  </div>
                  <div class="asd_2_2_2">
                    <div class="call active" onCLick={this.handleClick.bind(this,'CALL_STORE')}>
                      <img src="/public/img/map/shop_call_active.svg" alt=""/>
                      <span>{business_data.business_phone}</span>
                    </div>
                    <div class="shop" onCLick={this.handleClick.bind(this,'GO_SHOP')}>
                      <span>Aller à la boutique </span>
                      <img src="/public/img/map/shop.svg" alt=""/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(()=>{
              let products = [];
              for(var a=0;a<product_datas.length;a++){
                let productItem = product_datas[a];
                products.push(
                  <div class="app_shop_detail_list detail">
                    <div class="asdl_1">
                      <img style={{ "background-image" : "url("+config.ARTYWIZ_HOST+productItem.photo+")"}} alt=""/>
                    </div>
                    <div class="asdl_2">
                      <div class="asdl_21">
                        <h4>{productItem.name}</h4>
                        <div class="asdl_211">
                          <span>{productItem.price}€ TTC</span>
                          <span class="divider"></span>
                          <span>{productItem.price_promotion}€ TTC</span>
                        </div>
                      </div>
                      <div class="asdl_22">
                        <span>Description</span>
                        <span>{productItem.description}</span>
                      </div>
                      <div class="asdl_23">
                        <span>Ingrédients</span>
                        <span>{productItem.ingredient}</span>
                      </div>
                    </div>
                  </div>);
              }
              return products;
            })()}
          </div>
        );
    }
  }
};