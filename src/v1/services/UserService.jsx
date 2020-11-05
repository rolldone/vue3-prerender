import BaseService from "./BaseService";

export default BaseService.extend({
  getCurrentUser: async function(props={}) {
    try {
      let url = window.HTTP_REQUEST.USER.CURRENT_USER;
      let resData = await this.getData(url, props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateCurrentUser: async function(props) {
    try {
      let url = window.HTTP_REQUEST.USER.UPDATE_CURRENT_USER;
      let form_data = this.objectToFormData(props);
      let resData = await this.postData(url, form_data);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getUsers: async function(props) {
    window.staticType(props, [Object]);
    try {
      let url = window.HTTP_REQUEST.USER.GET_USERS;
      let resData = await this.getData(url, props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getUser: async function(id) {
    window.staticType(id, [Number]);
    try {
      let url = this.setUrl(window.HTTP_REQUEST.USER.GET_USER, [{ "{id}": id }]);
      let resData = await this.getData(url, {});
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  updateUser: async function(props) {
    window.staticType(props, [Object]);
    try {
      let formData = this.objectToFormData(props);
      let url = window.HTTP_REQUEST.USER.UPDATE;
      let resData = await this.postData(url, formData);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  addUser: async function(props) {
    window.staticType(props, [Object]);
    try {
      let formData = this.objectToFormData(props);
      let url = window.HTTP_REQUEST.USER.ADD;
      let resData = await this.postData(url, formData);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  selectCategory: async function(sekectCategoryId) {
    window.staticType(sekectCategoryId, [Number]);
    try {
      let url = window.HTTP_REQUEST.USER.SELECT_CATEGORY;
      let form_data = this.objectToFormData({
        default_business_category_id: sekectCategoryId,
      });
      let resData = await this.postData(url, form_data);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      throw ex;
    }
  },
  getOwnBusinesses : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.USER.GET_OWN_BUSINESSES;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  updateOwnBusiness : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.USER.UPDATE_OWN_BUSINESS;
      let form_data = this.objectToFormData(props);
      let resData = await this.postData(url,form_data);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  updateOwnBusinessLevel : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.USER.UPDATE_OWN_BUSINESS_LEVEL;
      let form_data = this.objectToFormData(props);
      let resData = await this.postData(url,form_data);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  }
});