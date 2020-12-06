import OwnUserStore from "../store/OwnUserStore";

const InitCheckBusiness = async (to, from, done, nextMiddleware) => {
  console.log("to", to);
  console.log("from", from);
  if((to.name.match(/order_wizard/g)) != null){
    return nextMiddleware();
  }
  let user = OwnUserStore.state.user;
  let business = user.businesses_one;
  if(business == null){
    return window.router.push({ name : 'order_wizard.intro' });
  }
  nextMiddleware();
};

export default InitCheckBusiness;
