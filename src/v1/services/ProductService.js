import BaseService from "./BaseService";

export default BaseService.extend({
  getDetailProducts : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.PRODUCT.DETAIL_PRODUCTS;
      let resData = await this.getData(url,props);
      if(resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getProducts : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.PRODUCT.PRODUCTS;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getProduct : async function(id){
    window.staticType(id,[Number]);
    try{
      let url = this.setUrl(window.HTTP_REQUEST.PRODUCT.PRODUCT,[{"{id}":id}]);
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getProductCategories : async function(props){
    window.staticType(props,[Object]);
    try{
      let url = window.HTTP_REQUEST.PRODUCT.PRODUCT_CATEGORIES;
      let resData = await this.getData(url,props);
      if (resData.status == "error") throw resData.data.responseJSON;
      return resData;
    }catch(ex){
      throw ex;
    }
  },
  getCurrentPosition : async function(props){
    return new Promise(function(resolve,reject){
      navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
        console.log('geolocation permission state is ', permissionStatus.state);
        let unWatchNavigation = navigator.geolocation.watchPosition(function(position) {
          navigator.geolocation.clearWatch(unWatchNavigation);
          console.log('navigator location',position.coords);
          resolve(position.coords);
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
  }
});