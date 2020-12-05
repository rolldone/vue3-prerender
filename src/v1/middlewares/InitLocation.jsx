import BaseVue from "../../base/BaseVue";
import GoogleGeoCodeService from "../services/GoogleGeoCodeService";
import PositionService from "../services/PositionService";
import AppStore from "../store/AppStore";

let googleGeocodeService = function(){
  return GoogleGeoCodeService.create();
};

let positionService = function(){
  return PositionService.create();
};

const InitLocation = async (to, from, done, nextMiddleware) => {
  let service = null;
  let position = null;
  let ipPosition = null;

  /* Check query have lat long or not */
  let baseVue = BaseVue.create();
  let jsonParseUrl = baseVue.jsonParseUrl();
  let query = jsonParseUrl.query;
  if(query.latlng != null){
    service = googleGeocodeService();
    let reverseGeoCode = await service.reverseGeoCode({
      latlng : query.latlng
    });
    position = await service.parseAddressComponents(reverseGeoCode.return.results);
    AppStore.commit('SET',{
      position : position
    });
    nextMiddleware();
    return;
  }

  /* Check the user ip to check information on it via third party service */
  service = positionService();
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