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
        REGISTER: route["api.partner.auth.register"],
        LOGIN: route["api.partner.auth.login"],
        LOGOUT: route["api.partner.auth.logout"],
        OAUTH_TOKEN : route['passport.token'],
        OAUTH_VAL_REQUEST : route['api.partner.auth.oauth_val_request'],
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
        GET_OWN_BUSINESSES : route["api.partner.user.get_own_business"],
        UPDATE_OWN_BUSINESS : route['api.partner.user.update_own_business'],
        UPDATE_OWN_BUSINESS_LEVEL : route['api.partner.user.update_own_business_level']
      },
      ARTYWIZ_USER: {
        GET_USERS: route["api.admin.artywiz_user.users"],
        GET_USER: route["api.admin.artywiz_user.user"],
        UPDATE_USER: route["api.admin.artywiz_user.update"],
        ADD_USER: route["api.admin.artywiz_user.new"],
        DELETE_BACKUP: route["api.admin.artywiz_user.delete_backup"],
        NOTIF_RESET_PASSWORD: route["api.admin.artywiz_user.notif_reset_password"],
      },
      ACTIVITY: {
        LOGS: route["api.partner.activity.logs"],
        USERS: route["api.partner.activity.users"],
        STATS: route["api.partner.activity.stats"],
        EXPORT_LOG: route["api.partner.activity.export_logs"],
        ASK_USER_BY_EMAIL: route["api.partner.activity.ask_user_by_email"],
      },
      CATEGORY: {
        CATEGORIES: route["api.admin.category.categories"],
        CATEGORY: route["api.admin.category.category"],
        ADD: route["api.admin.category.add"],
        UPDATE: route["api.admin.category.update"],
        DELETE: route["api.admin.category.delete"],
      },
      USER_BUSINESS: {
        USER_BUSINESSES : route['api.partner.user_business.user_businesses'],
        USER_BUSINESS : route['api.partner.user_business.user_business'],
        UPDATE_USER_BUSINESS : route['api.partner.user_business.update_user_business'],
        ADD_USER_BUSINESS : route['api.partner.user_business.add_user_business'],
        DELETE_USER_BUSINESS : route['api.partner.user_business.delete_user_business'],
        ASK_USER_TO_JOIN : route['api.partner.user_business.ask_user_to_join']
      },
      GROUP_BUSINESS: {
        ADD_CHILD_GROUP : route['api.partner.group_business.add_child_group'],
        DELETE_CHILD_GROUP : route['api.partner.group_business.delete_child_group'],
        UPDATE_CHILD_GROUP : route['api.partner.group_business.update_child_group'],
        GET_CHILD_GROUPS : route['api.partner.group_business.get_child_groups'],
        GET_CHILD_GROUP : route['api.partner.group_business.get_child_group']
      }
    });
    console.log("HTTP_REQUEST", window.HTTP_REQUEST);
  },
});
