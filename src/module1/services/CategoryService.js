import BaseService from "./BaseService";

export default BaseService.extend({
  getCategories : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.CATEGORY.CATEGORIES;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData; 
    }catch(ex){
      throw ex;
    }
  },
  getCategory : async function(id){
    window.staticType(id,[Number]);
    try{
      let url = this.setUrl(window.HTTP_REQUEST.CATEGORY.CATEGORY,[{"{id}":id}]);
      let resData = await this.getData(url,{});
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  }
});