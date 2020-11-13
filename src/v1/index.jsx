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

let is_loading_value = ref(null);
/* Check if main content is have SSR content  */
/* If yes dont use loading at the first time */
let existInnerHtml = document.getElementById('main').innerHTML;
if(existInnerHtml != ""){
  is_loading_value.value = existInnerHtml;
}

/* Add onpopstate event listener */
window.onpopstate = function(event){
  if(event.state.current == window.location.pathname){
    window.masterData.saveData('on_pop_state',event);
  }
  window.masterData.saveData('global_on_pop_state',event);
};

const routes = (function(routes){
  require('./auth/route')(routes);
  require('./user/route')(routes);
  require('./home/route')(routes);
  return routes;
})([]);

var beforeEach = Middleware.bind(Middleware, [
  (to, from, done, nextMiddleware) => {
    return nextMiddleware();
  },
  InitPubSub,
  CommonCode,
  InitRouteApi,
  // InitCheckRoute,
  // InitGetUser,
  // NotifRouteChange,
  // InitCheckBusiness,
  (to, from, done, nextMiddleware) => {
    console.log('selesai');
    return nextMiddleware();
  },
]);

/* Only one called when load first time */
var afterEach = Middleware.bind(Middleware, [(to, from) => {
  $("body").append("<div id='headless_done'></div>");
}]);

const router = createRouter({
  history : createWebHistory(),
  routes,
});

router.beforeEach(beforeEach);
/* Nested before each */
/* If previouse beforeEach is done */
router.beforeEach(function(to,from,next){
  is_loading_value.value = true;
  next();
});
router.afterEach(afterEach);

const store = createStore({});

const app = createApp({
  setup(props,context){
    window.router = router;
    window.route = useRoute();
    
    return {
      is_loading_value
    };
  },
  render(){
    if(this.is_loading_value == true){
      return (<App/>);
    }
    /* Using SSR */
    if(this.is_loading_value != ""){
      return <div v-html={this.is_loading_value} style="height:100%;"></div>;
    }
    /* Using boolean value */
    return (<h5 style="margin:20px;">{window.gettext("Charger le contenu ...")}</h5>);
  }
});

app.use(store);
app.use(router);
// .use(store)
app.mount('#main');