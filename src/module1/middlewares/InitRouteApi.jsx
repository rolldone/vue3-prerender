import BaseService from "../services/BaseService";

const InitRouteApi = async function(to, from, done, nextMiddleware) {
  try {
    let httpRequest = BaseService.create();
    if (window.HTTP_REQUEST != null) {
      return nextMiddleware();
    }
    let resData = await httpRequest.getApiRoute();
    httpRequest.setApiRoute(resData.return);
    nextMiddleware();
  } catch (ex) {
    console.error("InitRouteApi - ex", ex);
  }
};

export default InitRouteApi;
