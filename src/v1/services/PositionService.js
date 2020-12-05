import BaseService from "./BaseService";
import GoogleGeoCodeService from "./GoogleGeoCodeService";

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
  /* Better use only on middleware for reduce request to server */
  getLastPosition : async function(){
    let self = this;
    try{
      /* Get the position on localstorage first */
      let position = self.getLocalStorage('position') || null;
      /* If user have position on their url query override the current position with it. */
      let jsonParseUrl = self.jsonParseUrl();
      let query = jsonParseUrl.query;
      if(query.latlng != null){
        if(window.lastPosition == null){
          window.lastPosition = {};
        }
        if(window.lastPosition[query.latlng] != null){
          return window.lastPosition[query.latlng];
        }
        let latlngArray = query.latlng.split(',');
        let returnGoogleGeoCodeService = GoogleGeoCodeService.create();
        let latlng = parseFloat(latlngArray[0])+','+parseFloat(latlngArray[1]);
        let reverseGeoCode = await returnGoogleGeoCodeService.reverseGeoCode({
          latlng : latlng
        });
        let parseAddressComponent = await returnGoogleGeoCodeService.parseAddressComponents(reverseGeoCode.return.results);
        position = parseAddressComponent;
        position.latitude = parseFloat(latlngArray[0]);
        position.longitude = parseFloat(latlngArray[1]);
        window.lastPosition[latlng] = position;
      }
      return position;
    }catch(ex){
      console.error('getLastPosition - ex ',ex);
      return null;
    }
  },
  saveLastPosition : function(props){
    window.staticType(props,[Object]);
    try{
      if(window.lastPosition == null){
        window.lastPosition = {};
      }
      let latlng = props.latitude+','+props.longitude;
      window.lastPosition[latlng] = props;
      return window.lastPosition[latlng];
    }catch(ex){
      throw ex;
    }
  },
  setLocation : function(position){
    window.staticType(position,[Object]);
    let toCheckString = [position.route,position.city,position.administrative_area_level_1,position.country];
    let newLocation = '';
    for(var a=0;a<toCheckString.length;a++){
      if(a == toCheckString.length-1){
        if(toCheckString[a] != null){
          newLocation +=  toCheckString[a];
        }
      }else{
        if(toCheckString[a] != null){
          newLocation +=  toCheckString[a]+', ';
        }
      }
    }
    return newLocation;
  }
});