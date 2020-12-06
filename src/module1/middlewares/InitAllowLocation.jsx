import AppStore from "../store/AppStore";

const InitGetUser = async (to, from, done, nextMiddleware) => {
  // 
  let matchUserAgent = navigator.userAgent.match(/MY_SYSTEM/g);
  if(matchUserAgent != null && matchUserAgent.length > 0){
    return nextMiddleware();
  }
  try{
    /* Watching Event Listener */
    navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
      console.log('geolocation permission state is ', permissionStatus.state);
      permissionStatus.onchange = function() {
        console.log('geolocation permission state has changed to ', this.state);
        switch(this.state){
          case 'denied':
            AppStore.commit('SET',{
              notif_location : {
                type : 'error',
                title : "Warning",
                message : 'Your location is denied, Please reactivate again!'
              }
            });
            return;
        }      
      };
    });
    if(navigator.geolocation) {
      /* If Allow it */
      navigator.geolocation.getCurrentPosition(function(position) {
        AppStore.commit('SET',{
          lat : position.coords.latitude,
          long : position.coords.longitude
        });
      });
    } else {
      AppStore.commit('SET',{
        notif_location : {
          type : 'error',
          title : "Warning",
          message : 'Geolocation not detected!'
        }
      });
    }
    /* Watch the position */
    let unWatchNavigatin = navigator.geolocation.watchPosition(function(position) {
      /* Ignore it */
      console.log('posotion',position);
      AppStore.commit('SET',{
        lat : position.coords.latitude,
        long : position.coords.longitude
      });
      navigator.geolocation.clearWatch(unWatchNavigatin);
    },function(error) {
      if (error.code == error.PERMISSION_DENIED)
        console.log("you denied me :-(");
        AppStore.commit('SET',{
          notif_location : {
            type : 'error',
            title : "Warning",
            message : 'Your location is denied, Please reactivate again!'
          }
        });
        navigator.geolocation.clearWatch(unWatchNavigatin);
    });
  }catch(ex){
    console.error('Init Location',ex);
  }
  nextMiddleware();
};

export default InitGetUser;