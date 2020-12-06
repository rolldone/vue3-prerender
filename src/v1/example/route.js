const { default: Middleware } = require('../../classes/Middleware.jsx');

/* Async load asset depedency */
var initLeafLet = async (to, from, done, nextMiddleware) => {
  nextMiddleware();
};

module.exports = function(routes){
  routes.push({
    name : 'example.index',
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
};