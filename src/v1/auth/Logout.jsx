import AuthHttpRequest from '../services/AuthHttpRequest';

import OwnUserStore from '../store/OwnUserStore';

import { onMounted } from 'vue';

export default {
  setup(props,context){
  	let self = {};
  	onMounted(function(){
  		try{
  			OwnUserStore.commit(OwnUserStore.map.CLEAR);
        if(window.localStorage.getItem('token') == null){
          window.location.href = this.$router.resolve({name:'auth.login'}).href;
          return;
        }
        let service = AuthHttpRequest.create();
        // let resData = await service.logout();
        service.clearToken();
      }catch(ex){
        console.error('oncomplete - ex ',ex);
      }
  	});
  	return self;
  },
  render(){
    return (<div class="ui middle aligned center aligned grid base_container" id="auth">
      <div class="column">
        <h2 class="ui image header">
          <div class="content">
            {gettext("Vous êtes déconnecté!")}
          </div>
        </h2>
        <div class="ui message">
          <router-link to={{name:'auth.login'}}>{gettext("Retour connexion")}</router-link>
        </div>
      </div>
    </div>);
  }
};