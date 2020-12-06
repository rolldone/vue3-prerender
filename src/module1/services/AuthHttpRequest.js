import BaseService from "./BaseService";
import config from '@config';

export default BaseService.extend({
  oAuthAuthorize : function(props){
    window.staticType(props,[Object]);
    window.staticType(props.client_id,[String,Number]);
    window.staticType(props.redirect_uri,[String]);
    window.staticType(props.response_type,[String]);
    window.staticType(props.scope,[null,String]);
    window.staticType(props.state,[null,String]);
    try{
      let url = this.jsonToQueryUrl(window.HTTP_REQUEST.AUTH.OAUTH_AUTHORIZE,props);
      window.location.href = url; 
    }catch(ex){
      throw ex;
    }
  },
  oauthValRequest : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.AUTH.OAUTH_VAL_REQUEST;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  oauthToken : async function(props){
    window.staticType(props,[Object]);
    try{
      let formData = this.objectToFormData(props);
      let resData = await this.postData(window.HTTP_REQUEST.AUTH.OAUTH_TOKEN,formData);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  login: async function(props) {
    window.staticType(props, [Object]);
    try {
      console.log("prop", props);
      let formData = this.objectToFormData(props);
      let resData = await this.postData(window.HTTP_REQUEST.AUTH.LOGIN, formData);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      console.error("login - ex ", ex);
      throw ex;
    }
  },
  register: async function(props) {
    window.staticType(props, [Object]);
    try {
      let formData = this.objectToFormData(props);
      let resData = await this.postData(window.HTTP_REQUEST.AUTH.REGISTER, formData);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      console.error("register - ex ", ex);
      throw ex;
    }
  },
  logout: async function() {
    try {
      let resData = await this.getData(window.HTTP_REQUEST.AUTH.LOGOUT, {});
      if (resData.status == "error") throw resData.data.responseJSON;
    } catch (ex) {
      console.error("logout - ex ", ex);
      throw ex;
    }
  },
  getCategories: async function(parent_id) {
    window.staticType(parent_id, [null, Number]);
    try {
      let resData = await this.getData(window.HTTP_REQUEST.AUTH.CATEGORIES, {
        parent_id: parent_id,
      });
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  clearToken: function() {
    window.localStorage.setItem("token", null);
    window.localStorage.setItem("token_type", null);
    window.localStorage.setItem("expired_at", null);
    window.localStorage.setItem("own_business_id", null);
    window.localStorage.setItem('secret',null);
    window.localStorage.setItem('client_id',null);
  },
});
