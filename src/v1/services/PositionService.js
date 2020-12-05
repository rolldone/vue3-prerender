import BaseService from "./BaseService";

export default BaseService.extend({
  getCurrentIpLocation : function(){
    try{
      let url = window.HTTP_REQUEST.IP_LOCATION.CURRENT_LOCATION;
      let resData = this.getData(url,{});
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getIpLocation : function(ipAddress=""){
    window.staticType(ipAddress,[String]);
    try{
      let url = window.HTTP_REQUEST.IP_LOCATION.CURRENT_LOCATION;
      let resData = this.getData(url,{
        ip : ipAddress
      });
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },  
  getStatusAllowLocation : function(){
    return new Promise(function(resolve){
      navigator.permissions.query({name: 'geolocation'})
        .then(function(PermissionStatus) {
          if (PermissionStatus.state == 'granted') {
            //allowed
            resolve(permissionStatus.state);
          } else if (PermissionStatus.state == 'prompt') {
            // prompt - not yet grated or denied
            resolve(permissionStatus.state);
          } else {
            //denied
            resolve(permissionStatus.state);
          }
        });
    });
  },
  isAllowSelectLocation : function(){
    return new Promise(function(resolve){
      navigator.permissions.query({name: 'geolocation'})
      .then(function(PermissionStatus) {
          if (PermissionStatus.state == 'granted') {
                //allowed
                resolve(true);
          } else if (PermissionStatus.state == 'prompt') {
                // prompt - not yet grated or denied
                resolve(false);
          } else {
              //denied
              resolve(false);
          }
      });
    });
  },
  getCurrentPosition : async function(){
    let self = this;
    return new Promise(function(resolve,reject){
      navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
        console.log('geolocation permission state is ', permissionStatus.state);
        let unWatchNavigation = navigator.geolocation.watchPosition(function(position) {
          navigator.geolocation.clearWatch(unWatchNavigation);
          let coords = self.simpleInitData(position.coords);
          console.log('navigator location',coords);
          resolve(coords);
        },function(error) {
          navigator.geolocation.clearWatch(unWatchNavigation);
          reject(error);
          // if (error.code == error.PERMISSION_DENIED)
          //   console.log("you denied me :-(");
          //   AppStore.commit('SET',{
          //     notif_location : {
          //       type : 'error',
          //       title : "Warning",
          //       message : 'Your location is denied, Please reactivate again!'
          //     }
          //   });
        });
      });
    });
  },
});