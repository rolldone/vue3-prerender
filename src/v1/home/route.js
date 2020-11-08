const { default: Middleware } = require('../../classes/Middleware.jsx');
/* Async load leaflet depedency */
var initLeafLet = async (to, from, done, nextMiddleware) => {
  require.ensure([], function() {
    require("leaflet/dist/leaflet.css");
    window.L = require("leaflet");
    nextMiddleware();
  });
};


module.exports = function(routes){
  routes.push({
    name : 'home.index',
    path : '/',
    component : async function(){
    	try{
    		let component = await import('./Index.jsx');
    		return component;
    	}catch(ex){
    		console.error('ex',ex);
    	}
    },
    beforeEnter: Middleware.bind(this, [initLeafLet]),
  });
  routes.push({
    name : 'home.about',
    path : '/about',
    component : async function(){
    	try{
    		let component = await import('./About.jsx');
    		return component;
    	}catch(ex){
    		console.error('ex',ex);
    	}
    },
  });
};