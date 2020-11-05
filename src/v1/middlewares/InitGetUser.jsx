import UserService from "../services/UserService";
import OwnUserStore from "../store/OwnUserStore";


const InitGetUser = async (to, from, done, nextMiddleware) => {
  console.log("to", to);
  console.log("from", from);
  if (Object.keys(OwnUserStore.state.user).length > 0) {
    return nextMiddleware();
  }
  try {
    let service = UserService.create();
    let resData = await service.getCurrentUser({
      business_id : window.localStorage.getItem('own_business_id')
    });
    OwnUserStore.commit(OwnUserStore.map.SET,resData.return);
  } catch (ex) {
    console.error("InitGetUser - ex ", ex);
    window.router.replace({ name: "auth.login" });
    return;
  }
  nextMiddleware();
};

export default InitGetUser;
