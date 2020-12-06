import {createStore } from "vuex";
import { createApp } from "vue";


const mutations = {
  SET: function(state, val) {
    window.staticType(val, [Object]);
    state.user = {
      ...state.user,
      ...val,
    };
  },
  CLEAR: function(state) {
    state.user = {};
  },
};

const actions = {};
const OwnUserStore = createStore({
  state: {
    user : {}
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

OwnUserStore.map = map;
const app = createApp({ /* your root component */ });
app.use(OwnUserStore);

export default OwnUserStore;
