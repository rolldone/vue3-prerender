import { useRouter } from 'vue-router';
import AuthHttpRequest from '../services/AuthHttpRequest';
import BaseVue from '../../base/BaseVue';

let router = null;

export const OAuthCallbackClass = BaseVue.extend({
	returnAuthService : function(){
		return AuthHttpRequest.create();
	},
	construct : function(props,context){
		let self = this;
		self.oAuthRequest();
	},
	oAuthRequest : async function(){
		let self = this;
		try{
			let jsonParseUrl = self.jsonParseUrl();
			let service = self.returnAuthService();
			let redirect_uri = window.location.protocol+'//'+window.location.host+router.resolve({name : 'auth.oauth.callback'}).href;
			let form_data = {
				'grant_type' : 'authorization_code',
        'client_id' : window.localStorage.getItem('client_id'),
        'client_secret' : window.localStorage.getItem('secret'),
        'redirect_uri' : redirect_uri.replace(/([^:]\/)\/+/g, "$1"),
        'code' : jsonParseUrl.query.code,
			};
			let resData = await service.oauthToken(form_data);
			window.localStorage.setItem('token',resData.access_token);
			window.localStorage.setItem('refresh_token',resData.refresh_token);
			window.localStorage.setItem('token_type',resData.token_type);
			window.localStorage.setItem('expires_at',resData.expires_in);
			window.location.href = "/";
		}catch(ex){
			console.error('oAuthRequest - ex',ex);
		}
	}
});

export default {
	setup(props,context){
		router = useRouter();
		let oAuthCallbackClass = OAuthCallbackClass.create(props,context);
		return oAuthCallbackClass.setup();
	},
	render(h){
		return (<div>
			<h5 style="margin:20px;">{window.gettext("oAuth Callback...")}</h5>
		</div>);
	}
};