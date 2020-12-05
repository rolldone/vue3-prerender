import BaseVue from "../../../base/BaseVue";
import { onMounted, reactive, watch } from 'vue';
import ProductService from "../../services/ProductService";
import {setNavigableClassName} from '../../../base/ArrowKeyNav';

export const HeadMenuSearchClass = BaseVue.extend({
  data : function(){
    return reactive({
      query : {},
      form_data : {},
      product_datas : [],
      category_datas : [],
      other_datas : []
    });
  },
  returnProductService : function(){
    return ProductService.create();
  },
  construct : function(props,context){
    let self = this;
    let jsonParseUrl = self.jsonParseUrl();
    let position = self.getLocalStorage('position')||{};
    let toCheckString = [position.route,position.city,position.administrative_area_level_1,position.country];
    let newLocation = '';
    for(var a=0;a<toCheckString.length;a++){
      if(a == toCheckString.length-1){
        if(toCheckString[a] != null){
          newLocation +=  toCheckString[a];
        }
      }else{
        if(toCheckString[a] != null){
          newLocation +=  toCheckString[a]+', ';
        }
      }
    }
    self.set('form_data',{
      search : jsonParseUrl.query.search,
      location : newLocation
    });
    onMounted(function(){
      watch(()=>self.get('form_data').search,function(val){
        if(self.pendingWatchSearchText != null){
          self.pendingWatchSearchText.cancel();
        }
        self.pendingWatchSearchText = _.debounce(async function(parseText){
          setNavigableClassName('.hdm_11_a_12,.hdm_11_a_132_link');
          if(parseText == ""){
            self.set('product_datas',[]);
            self.set('category_datas',[]);
            self.set('other_datas',[{
              name : 'Reset Search',
              key : 'RESET'
            }]);
            return;
          }
          self.set('other_datas',[]);
          self.setUpdate('form_data',{
            search : parseText
          });
          self.setProductsSearch(await self.getProductsSearch(parseText));
        },500);
        self.pendingWatchSearchText(val);
      });
    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    switch(action){
      case 'LI_MOVE_FOCUS':
        break;
    }
  },
  getProductsSearch : async function(whatSearch){
    window.staticType(whatSearch,[String]);
    try{
      let service = this.returnProductService();
      let resData = await service.getProductsSearch(whatSearch);
      return resData;
    }catch(ex){
      console.error('getProductSearch - ex ',ex);
    }
  },
  setProductsSearch : async function(props){
    let self = this;
    if(props == null) return;
    let datas = (function(parseDatas){
      let categories=[],products = [];
      for(var a=0;a<parseDatas.categories.length;a++){
        categories.push(parseDatas.categories[a]);
      }
      for(var a=0;a<parseDatas.products.length;a++){
        products.push(parseDatas.products[a]);
      }
      return {
        categories,
        products,
      };
    })(props.return);
    await self.set('product_datas',datas.products);
    await self.set('category_datas',datas.categories);
    // arrowKeyNavigation.setFocusTrapTest(element => {
    //   return element.classList.contains('hdm_11_a_132_link');
    // });
    // self.setInitDOMSelection('LI_MOVE_FOCUS');
  },
  handleChange : function(action,props,e){
    let self = this;
    switch(action){
      case 'WATCH_SEARCH_TEXT':
        if(self.pendingWatchSearchText != null){
          self.pendingWatchSearchText.cancel();
        }
        self.pendingWatchSearchText = _.debounce(async function(parseText){
          self.setUpdate('form_data',{
            search : parseText
          });
          self.setProductsSearch(await self.getProductsSearch(parseText));
        },200);
        self.pendingWatchSearchText(e.target.value);
        break;
    }
  },
  handleClick : async function(action,props,e){
    let self = this;
    switch(action){
      case 'SELECT_OTHER_ITEM':
        e.preventDefault();
        switch(props.value){
          case 'RESET':
            var jsonParseUrl = self.jsonParseUrl();
            var query = jsonParseUrl.query;
            delete query.search;
            await self.set('query',query);
            self.updateCurrentState(self.get('query'));
            break;
        }
        break;
      case 'SELECT_SEARCH_ITEM':
        e.preventDefault();
        self.set('query',{
          search : props.value,
          state : new Date().getTime()
        });
        self.updateCurrentState(self.get('query'));
        break;
      case 'CHANGE_LOCATION':
        window.masterData.saveData('popup_selection_location.load',function(el){
          el.setOnCallbackListener(async function(action,props){
            switch(action){
              case 'SUBMIT':
                el.setAction('hide',{});
                self.setLocalStorage('position',props.position);
                self.setUpdate('select_position',props.position);
                self.set('query',{
                  search : props.form_data.search,
                  latlng : props.position.latitude+','+props.position.longitude
                });
                self.updateCurrentState(self.get('query'));
                break;
              case 'DISPOSE':
                el.setAction('hide',{});
                self.setLocalStorage('position',props.position);
                self.setUpdate('select_position',props.position);
                await self.set('datas',[]);
                self.set('query',{
                  search : props.form_data.search,
                  latlng : props.position.latitude+','+props.position.longitude
                });
                self.updateCurrentState(self.get('query'));
                break;
            }
          });
          el.setRedefineLocation('show',self.get('form_data'));
        });
        break;
    }
  },
});
export default {
  setup(props,context){
    return HeadMenuSearchClass.create(props,context).setup();
  },
  render(h){
    let { form_data, category_datas, product_datas, other_datas } = this.get();
    return (<div class="headmenu_search">
      <div class="hdm_1">
        <img src="/public/img/map/search.svg" alt=""/>
        <div class="hdm_11_a_1" id="head_searc_1223">
          <input class="hdm_11_a_12" type="text" v-model={form_data.search}  placeholder="Saisissez le type d'activité, Exemple “Boulangerie”..."/>
          <ul class="hdm_11_a_13">
            {(()=>{
              let put_category_datas = [];
              for(var a=0;a<category_datas.length;a++){
                let categoryItem = category_datas[a];
                if(a==0){
                  put_category_datas.push(
                    <li class="hdm_11_a_131"><h4>Category</h4></li>
                  );
                }
                put_category_datas.push(
                  <li class="hdm_11_a_132">
                    <a href="#" onClick={this.handleClick.bind(this,'SELECT_SEARCH_ITEM',{ value : categoryItem.name })} class="hdm_11_a_132_link">{categoryItem.name}</a>
                  </li>
                );
              }
              return put_category_datas;
            })()}
            {(()=>{
              let put_product_datas = [];
              for(var a=0;a<product_datas.length;a++){
                let productDataItem = product_datas[a];
                if(a==0){
                  put_product_datas.push(
                    <li class="hdm_11_a_131"><h4>Products</h4></li>
                  );
                }
                put_product_datas.push(
                  <li class="hdm_11_a_132">
                    <a href="#" onClick={this.handleClick.bind(this,'SELECT_SEARCH_ITEM',{ value : productDataItem.name})} class="hdm_11_a_132_link">{productDataItem.name}</a>
                  </li>
                );
              }
              return put_product_datas;
            })()}
            {(()=>{
              let other_put_datas = [];
              for(var a=0;a<other_datas.length;a++){
                let otherDataItem = other_datas[a];
                other_put_datas.push(
                  <li class="hdm_11_a_132">
                    <a href="#" onClick={this.handleClick.bind(this,'SELECT_OTHER_ITEM',{ value : otherDataItem.key})} class="hdm_11_a_132_link">{otherDataItem.name}</a>
                  </li>
                );
              }
              return other_put_datas;
            })()}
          </ul>
        </div>
        <span class="hdm_11"></span>
        <img width="10" style="margin-left:12px;" src="/public/img/map/marker.svg" alt=""/>
        {/* <input class="hdm_a_12" type="text" onChange={this.handleChange.bind(this,'WATCH_SEARCH_TEXT',{})} placeholder="Strasbourg, France"/> */}
        <span class="hdm_12" onClick={this.handleClick.bind(this,'CHANGE_LOCATION',{})}>{form_data.location}</span>
      </div>
    </div>);
  }
};