import BaseService from "./BaseService";

export default BaseService.extend({
  getBusinesses : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.BUSINESS.BUSINESSES;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getBusiness : async function(id){
    window.staticType(id,[Number]);
    try{
      let url = this.setUrl(window.HTTP_REQUEST.BUSINESS.BUSINESS,[{"{id}":id}]);
      let resData = await this.getData(url,{});
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  }
});