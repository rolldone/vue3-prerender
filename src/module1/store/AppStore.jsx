import {createStore } from "vuex";
import { createApp } from "vue";


const mutations = {
  SET: function(state, val) {
    window.staticType(val, [Object]);
    state.app = {
      ...state.app,
      ...val,
    };
  },
  CLEAR: function(state) {
    state.app = {};
  },
};

const actions = {};
const AppStore = createStore({
  state: function(){
    return  {
      app : {}
    };
  },
  mutations,
  actions,
});

var map = [];

for (var key in mutations) {
  map[key] = key;
}
for (var key in actions) {
  map[key] = key;
}

AppStore.map = map;
const app = createApp({ /* your root component */ });
app.use(AppStore);

export default AppStore;
