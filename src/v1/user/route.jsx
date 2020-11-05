module.exports = function(routes){
  routes.push({
    name : 'user.current_user',
    path : '/user/profile',
    component : async function(){
    	try{
    		let component = await import('./Profile.jsx');
    		return component;
    	}catch(ex){
    		console.error('ex',ex);
    	}
    },
  });
};