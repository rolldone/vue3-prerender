import BaseVue from "../../base/BaseVue";
import GoogleGeoCodeService from "../services/GoogleGeoCodeService";
import PositionService from "../services/PositionService";
import AppStore from "../store/AppStore";

let returnGoogleGeocodeService = function(){
  return GoogleGeoCodeService.create();
};

let returnPositionService = function(){
  return PositionService.create();
};

const InitLocation = async (to, from, done, nextMiddleware) => {
  let service = null;
  let position = null;
  let ipPosition = null;

  /* Get last position */
  let positionService = returnPositionService();
  position = await positionService.getLastPosition();
  if(position != null){
    AppStore.commit('SET',{
      position : position
    });
    nextMiddleware();
  }
  

  /* Check the user ip to check information on it via third party service */
  service = returnPositionService();
  ipPosition = await service.getCurrentIpLocation();
  ipPosition = (function(parseData){
    parseData.latitude = parseData.lat;
    parseData.longitude = parseData.lon;
    delete parseData.lat;
    delete parseData.lon;
    return parseData;
  })(ipPosition.return);
  AppStore.commit('SET',{
    ipPosition : ipPosition
  });

  // /* Check user that have allow location on their browser, keep this section if access by curl, bot user agent */
  nextMiddleware();
};

export default InitLocation;