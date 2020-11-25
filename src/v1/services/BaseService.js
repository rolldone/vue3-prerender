import config from "@config";
import BaseService from '../../base/BaseService';

export default BaseService.extend({
  getApiRoute: async function() {
    try {
      let url = config.API_LIST;
      let resData = await this.getData(url, {
        version: "",
      });
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    } catch (ex) {
      console.error("getApiRoute - ex ", ex);
    }
  },
  setApiRoute: function(route) {
    route = this._super(route);
    window.HTTP_REQUEST = Object.freeze({
      AUTH: {
        REGISTER: route["api.member.auth.register"],
        LOGIN: route["api.member.auth.login"],
        LOGOUT: route["api.member.auth.logout"],
        OAUTH_TOKEN : route['passport.token'],
        OAUTH_VAL_REQUEST : route['api.member.auth.oauth_val_request'],
        OAUTH_AUTHORIZE : route['passport.authorizations.authorize']
      },
      ROUTE: {
        LIST: route["api.partner.routes.list"],
      },
      USER: {
        GET_USERS : route['api.partner.user.users'],
        GET_USER : route['api.partner.user.user'],
        CURRENT_USER: route["api.partner.user.current_user"],
        UPDATE_CURRENT_USER: route["api.partner.user.update_current_user"],
      },
      ACTIVITY: {
        LOGS: route["api.partner.activity.logs"],
        USERS: route["api.partner.activity.users"],
        STATS: route["api.partner.activity.stats"],
        EXPORT_LOG: route["api.partner.activity.export_logs"],
        ASK_USER_BY_EMAIL: route["api.partner.activity.ask_user_by_email"],
      },
      CATEGORY: {
        CATEGORIES: route["api.artyplanet.category.categories"],
        CATEGORY: route["api.artyplanet.category.category"],
      },
      BUSINESS : {
        BUSINESSES : route['api.artywiz.artyplanet.store.stores'],
        BUSINESS : route['api.artywiz.artyplanet.store.store'],
      },
      PRODUCT : {
        PRODUCTS : route['api.artywiz.artyplanet.product.products'],
        PRODUCT : route['api.artywiz.artyplanet.product.product'],
        DETAIL_PRODUCTS : route['api.artywiz.artyplanet.product.detail_products']
      }
    });
    console.log("HTTP_REQUEST", window.HTTP_REQUEST);
  },
});
