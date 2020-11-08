import InitCheckRoute from './middlewares/InitCheckRoute';
import { createApp, ref, onMounted } from 'vue';
import { createRouter, createWebHashHistory, createWebHistory, useRoute } from 'vue-router';
import Middleware from '../classes/Middleware';
import App from './App';
import CommonCode from './middlewares/CommonCode';
import InitGetUser from './middlewares/InitGetUser';
import InitCheckBusiness from './middlewares/InitCheckBusiness';
import InitPubSub from './middlewares/InitPubSub';
import InitRouteApi from './middlewares/InitRouteApi';
import NotifRouteChange from './middlewares/NotifRouteChange';
import { createStore } from 'vuex';

let is_middleware_done = ref(null);

/* Add onpopstate event listener */
window.onpopstate = function(event){
  if(event.state.current == window.location.pathname){
    window.masterData.saveData('on_pop_state',event);
  }
  window.masterData.saveData('global_on_pop_state',event);
};

const routes = (function(routes){
  // require('./auth/route')(routes);
  // require('./user/route')(routes);
  require('./home/route')(routes);
  return routes;
})([]);

var beforeEach = Middleware.bind(Middleware, [
  (to, from, done, nextMiddleware) => {
    return nextMiddleware();
  },
  InitPubSub,
  CommonCode,
  // InitRouteApi,
  // InitCheckRoute,
  // InitGetUser,
  // NotifRouteChange,
  // InitCheckBusiness,
  (to, from, done, nextMiddleware) => {
    return nextMiddleware();
  },
]);

/* Only one called when load first time */
var afterEach = Middleware.bind(Middleware, [(to, from) => {
}]);

const router = createRouter({
  history : createWebHistory(),
  routes,
});

router.beforeEach(beforeEach);
/* Nested before each */
/* If previouse beforeEach is done */
router.beforeEach(function(to,from,next){
  // let current_date = new Date();
  // let cms = current_date.getMilliseconds();
  is_middleware_done.value = true;
  next();
});
router.afterEach(afterEach);

const store = createStore({});

const app = createApp({
  setup(props,context){
    window.router = router;
    window.route = useRoute();
    return {
      is_middleware_done
    };
  },
  render(){
    if(this.is_middleware_done == true){
      return (<App/>);
    }
    return (<h5 style="margin:20px;">{window.gettext("Charger le contenu ...")}</h5>);
  }
});

app.use(store);
app.use(router);
// .use(store)
app.mount('#main');