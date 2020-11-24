import BaseVue from "../../../base/BaseVue";
import { reactive } from 'vue';
import config from '@config';
import BusinessService from "../../services/BusinessService";
import ProductService from "../../services/ProductService";

export const ListMMapViewClass = BaseVue.extend({
  data : function(){
    return reactive({
      action : 'list',
      select_business_id : null,
      business_data : null,
      product_datas : [],
      query : {}
    });
  },
  returnBusinessService : function(){
    return BusinessService.create();
  },
  returnProductService : function(){
    return ProductService.create();
  },
  construct : function(props,context){
    let self = this;
    
  },
  setInitDOMSelection : function(action,props){

  },
  // selectBusiness : async function(id){
  //   let self = this;
  //   window.staticType(id,[Number]);
  //   let { marker_datas } = self.props;
  //   let select_business = (function(parseDatas){
  //     let select_business = null;
  //     for(var a=0;a<parseDatas.length;a++){
  //       if(id == parseDatas[a].id){
  //         select_business = parseDatas[a];
  //         break;
  //       }
  //     }
  //     return select_business;
  //   })(marker_datas);
  //   if(select_business == null) return;
  //   await self.setUpdate('select_business',select_business);
  //   await self.setUpdate('action','detail');
  // },
  getProducts : async function(){
    let self = this;
    try{
      let { query } = this.get();
      let service = this.returnProductService();
      let resData = await service.getProducts(query);
      return resData;
    }catch(ex){
      console.error('getProducts - ex ',ex);
    }
  },
  setProducts : function(props){
    let self = this;
    if(props == null) return;
    let products = (function(parseData){
      return parseData;
    })(props.return);
    self.setUpdate('product_datas',products);
  },
  getBusiness : async function(){
    let self = this;
    try{
      let select_business_id = self.get('select_business_id');
      let service = this.returnBusinessService();
      let resData = await service.getBusiness(select_business_id);
      return resData;
    }catch(ex){
      console.error('getBusiness - ex ',ex);
    }
  },
  setBusiness : function(props){
    let self = this;
    if(props == null) return;
    let business_data = (function(parseData){
      return parseData;
    })(props.return);
    self.setUpdate('business_data',business_data);
  },
  setOnChangeListener : function(func){
    let self = this;
    self.onChangeListener = func;
  },
  handleClick : async function(action,props,e){
    let self = this;
    switch(action){
      case 'BACK':
        self.setUpdate('select_business',null);
        self.setUpdate('action','list');
        break;
      case 'OPEN_DETAIL':
        e.preventDefault();
        window.staticType(props,[Object]);
        window.staticType(props.id,[Number]);
        window.staticType(props.search,[null,String]);
        await self.setUpdate('query',{
          business_id : props.id,
          search : props.search
        });
        await self.setUpdate('select_business_id',props.id);
        self.setBusiness(await self.getBusiness());
        self.setProducts(await self.getProducts());
        self.onChangeListener('BUSINESS_SELECTED',self.get('select_business'),props.index);
        break;
    }
  }
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
    let { action, select_business } = this.get();
    let { marker_datas } = this.props;
    switch(action){
      case 'list':
        return (<div class="app_shop_list on_mobile">
        {(()=>{
          let newMarkers = [];
          for(var a=0; a < marker_datas.length; a++){
            let markerItem = marker_datas[0];
            newMarkers.push(
              <div class="asl_1">
                <div class="asl_a_11 on_mobile">
                  <div class="asl_11 on_mobile">
                    <img style={{ "background-image" : "url("+config.ARTYWIZ_HOST+markerItem.store.icon+")"}} alt=""/>
                  </div>
                  <div class="asl_12">
                    <div class="asl_121 on_mobile">
                      <img style={{ "background-image" : "url("+config.ARTYWIZ_HOST+markerItem.store.icon+")"}} alt=""/>
                      <div class="asl_1211">
                        <h3>{markerItem.store.name.toUpperCase()}</h3>
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
                                <div class="asdl_23">
                                  <span>Ingrédients</span>
                                  <span>{productItem.ingredient}</span>
                                </div>
                              </div>
                            </div>);
                          }
                          return subItem;
                        })()}
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
                  <div class="image" style={{ "background-image":"url("+config.ARTYWIZ_HOST+select_business.store.icon+")"}}></div>
                </div>
                <div class="asd_2_2">
                  <div class="asd_2_2_1">
                    <h4>{select_business.store.name}</h4>
                    <span>
                      {select_business.business_address} {select_business.business_city} {select_business.business_postal_code} {select_business.business_country}
                    </span>
                  </div>
                  <div class="asd_2_2_2">
                    <div class="call active" onCLick={this.handleClick.bind(this,'CALL_STORE')}>
                      <img src="/public/img/map/shop_call_active.svg" alt=""/>
                      <span>{select_business.business_phone}</span>
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
              for(var a=0;a<select_business.products.length;a++){
                let productItem = select_business.products[a];
                products.push(
                  <div class="app_shop_detail_list">
                    <div class="asdl_1">
                      <img style={{ "background-image" : "url("+config.ARTYWIZ_HOST+select_business.products[a].photo+")"}} alt=""/>
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