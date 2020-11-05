const { default: Middleware } = require("../../classes/Middleware");


var initAuth = async (to, from, done, nextMiddleware) => {
  require.ensure([], function() {
    require("@asset/v1/css/backend_auth.scss");
    nextMiddleware();
  });
};
module.exports = function(routes){
  routes.push({
    name : 'auth.oauth.callback',
    path : '/auth/callback',
    component : async function(){
      try{
        let Component = await import('./OAuthCallback');
        return Component;
      }catch(ex){
        console.error('ex',ex);
      }
    }
  });
  routes.push({
    name : 'auth.login',
    path : '/auth/login',
    component : async function(){
      try{
        let Component = await import('./OAuthLogin');
        return Component;
      }catch(ex){
        console.error('ex',ex);
      }
    },
    beforeEnter: Middleware.bind(this, [initAuth]),
  });
  routes.push({
    name : 'auth.register',
    path : '/auth/register',
    component : ()=>import('./Register'),
    beforeEnter: Middleware.bind(this, [initAuth]),
  });
  routes.push({
    name : 'auth.logout',
    path : '/auth/logout',
    component : ()=>import('./Logout'),
    beforeEnter: Middleware.bind(this, [initAuth]),
  });
};