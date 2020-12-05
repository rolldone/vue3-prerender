import BaseService from './BaseService';

export default BaseService.extend({
  isMySystemUserAgent : function(){
    const checkExist = navigator.userAgent.match(/MY_SYSTEM/g)||[];
    if (checkExist.length > 0) {
      return true;
    }
    return false;
  }
});