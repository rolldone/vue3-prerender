import BaseService from "./BaseService";

export default BaseService.extend({
  getDetailProducts : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.PRODUCT.DETAIL_PRODUCTS;
      let resData = await this.getData(url,props);
      if(resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getProducts : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.PRODUCT.PRODUCTS;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getProductsSearch : async function(props){
    window.staticType(props,[String]);
    try{
      let url = window.HTTP_REQUEST.PRODUCT.PRODUCTS_SEARCH;
      let resData = await this.getData(url,{
        search : props
      });
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getProduct : async function(id){
    window.staticType(id,[Number]);
    try{
      let url = this.setUrl(window.HTTP_REQUEST.PRODUCT.PRODUCT,[{"{id}":id}]);
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getProductCategories : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.PRODUCT.PRODUCT_CATEGORIES;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  }
});