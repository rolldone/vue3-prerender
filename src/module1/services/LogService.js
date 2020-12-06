import BaseService from "./BaseService";

export default BaseService.extend({
  getActivityLogs : async function(props){
    window.staticType(props,[Object]);
    window.staticType(props.business_id,[String,Number]);
    window.staticType(props.select_category,[String,Number]);
    try{
     let url = window.HTTP_REQUEST.ACTIVITY.LOGS;
     let resData = await this.getData(url,props);
     if (resData.status == "error") throw resData.data.responseJSON;
     return resData;
    }catch(ex){
      throw ex;
    }
  },
  getStats : async function(props){
    window.staticType(props,[Object]);
    window.staticType(props.business_id,[String,Number]);
    window.staticType(props.select_category,[String,Number]);
    try{
      let url = window.HTTP_REQUEST.ACTIVITY.STATS;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getActivityUsers : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.ACTIVITY.USERS;
      let resData = await this.getData(url,props);
      if(resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  askUserByEmail : async function(props){
    window.staticType(props,[Object]);
    try{
      let formData = this.objectToFormData(props);
      let url = window.HTTP_REQUEST.ACTIVITY.ASK_USER_BY_EMAIL;
      let resData = await this.postData(url,formData);
      if(resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  }
});