import BaseVue from "../../../base/BaseVue";
import { reactive } from 'vue';
import config from '@config';

export const ListMMapViewClass = BaseVue.extend({
  data : function(){
    return reactive({
      action : 'list',
      select_business : null
    });
  },
  construct : function(props,context){
    let self = this;
    
  },
  setInitDOMSelection : function(action,props){

  },
  selectBusiness : async function(id){
    let self = this;
    window.staticType(id,[Number]);
    let { marker_datas } = self.props;
    let select_business = (function(parseDatas){
      let select_business = null;
      for(var a=0;a<parseDatas.length;a++){
        if(id == parseDatas[a].id){
          select_business = parseDatas[a];
          break;
        }
      }
      return select_business;
    })(marker_datas);
    if(select_business == null) return;
    await self.setUpdate('select_business',select_business);
    await self.setUpdate('action','detail');
  },
  setOnChangeListener : function(func){
    let self = this;
    self.onChangeListener = func;
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'BACK':
        self.setUpdate('select_business',null);
        self.setUpdate('action','list');
        break;
      case 'OPEN_DETAIL':
        self.selectBusiness(props.id);
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
        return (<div class="app_shop_list">
        {(()=>{
          let newMarkers = [];
          for(var a=0; a < marker_datas.length; a++){
            let markerItem = marker_datas[0];
            newMarkers.push(
              <div class="v228_105">
                <div class="v228_105_wrapper on_mobile">
                  <div class="v228_106 on_mobile on_computer on_large_screen on_wide_screen">
                    <div class="v228_107"></div>
                    <div class="v228_108" style={{ "background-image" : "url("+config.ARTYWIZ_HOST+markerItem.products[0].photo+")"}}></div>
                  </div>
                  <div class="v228_109_container on_mobile on_tablet">
                    <div class="v228_109 on_mobile on_tablet">
                      <div class="v228_110" style={{ "background-image" : "url("+config.ARTYWIZ_HOST+markerItem.store.icon+")"}}></div>
                    </div>
                    <div class="v228_118_container on_mobile on_tablet">
                      <span class="v228_118">{markerItem.store.name.toUpperCase()}</span>
                      <span class="v228_119">{markerItem.business_address} {markerItem.business_city} {markerItem.business_postal_code} {markerItem.business_country} {markerItem.business_phone}</span>
                    </div>
                    
                    <div class="v228_120_container on_mobile on_tablet">
                      <div class="v228_120 on_mobile" onCLick={this.handleClick.bind(this,'OPEN_DETAIL',{ id : markerItem.id, index : a })}>
                        <div class="v228_122 on_mobile">
                          Voir sur la carte
                        </div>
                        <div class="v228_121">
                        </div>
                      </div>
                      <div class="v228_123 on_mobile">
                        <span class="v228_126 on_mobile">Aller à la boutique</span>
                        <div class="v228_124"></div>
                      </div>
                    </div>
                    
                  </div>
                </div>
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