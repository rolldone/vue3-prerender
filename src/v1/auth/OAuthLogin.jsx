import { onMounted, reactive } from 'vue';
import BaseVue from '../../base/BaseVue';
import RouteActionFunction from '../partials/RouteActionFunction';
import Something from './hooks/Something';
import { useRouter, useRoute } from 'vue-router';
import InputValidation from '../partials/InputValidation';
import AuthHttpRequest from '../services/AuthHttpRequest';
import config from '@config';

const INPUT_TEXT_VALIDATION = {
  id: "auth",
  form_rules: {
    email: "required|email",
    password: "required",
  },
  form_attribute_name: {
    email: gettext("Email"),
    password: gettext("Mot de passe"),
  },
};
const SUBMIT_VALIDATION = {
  ...INPUT_TEXT_VALIDATION,
};

let router = useRouter();
let route = useRoute();

export const Login = BaseVue.extend({
  data : function(){
    return reactive({
      form_data : {},
      query : {},
      notification : null,
      test : 'TEST'
    });
  },
  returnAuthService : function(){
    return AuthHttpRequest.create();
  },
  construct : function(props,context){
    let self = this;
    self.inputValidation = (InputValidation.create(props,self)).setup();
    self.routeActionFunction = (RouteActionFunction.create(props,self,'auth.login')).setup();
    self.sometThing = (Something.create(props,self)).setup(); 
    onMounted(function(){
      self.setInitDOMSelection(self.routeActionFunction.name);
      self.setInitDOMSelection(self.inputValidation.map.INPUT_TEXT_VALIDATION,INPUT_TEXT_VALIDATION);
    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    self.routeActionFunction.join(action,props,function(action,props){
      switch(action){
        case 'POP_STATE':
          debugger;
          break;
      }
    });
    self.inputValidation.join(action,props);
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
    case 'SUBMIT':
        e.preventDefault();
        self.submit();
        break;
      case 'TEST':
        e.preventDefault();
        self.saveQueryUrl(self.get('query'));
        router.go(route.currentRoute);
        break;
    }
  },
  submit : async function(){
    let self = this;
    try {
      let service = self.returnAuthService();
      let resData = await service.oauthValRequest({
      	app_name : config.APP_NAME
      });
      resData = resData.return;
      window.localStorage.setItem('secret',resData.secret);
      window.localStorage.setItem('client_id',resData.id);
      service.oAuthAuthorize({
      	client_id : window.localStorage.getItem('client_id'),
				redirect_uri : resData.redirect,
				response_type : 'code',
				scope : null,
				state : null,
      });
    } catch (ex) {
      console.error('submit - ex ',ex);
    }
  }
});

export default {
  setup(){
    let login = Login.create(this);
    return {
      login : login.setup()
    };
  },
  render(h){
    let { handleClick, sometThing } = this.login;
    let { form_data, notification } = this.login.get();
    return (
      <div class="ui middle aligned center aligned grid base_container" id="auth">
        <div class="column">
        <img src="/public/img/logo-white-dotted.png" alt="" width="128" />
          <h1 class="ui image header">{sometThing.render(h)}{gettext("Connectez-vous à votre compte")}</h1>
          {notification != null ? (
            <div class="base_wr column notification">
              {notification.map((value, index) => {
                return <h5>{value}</h5>;
              })}
            </div>
          ) : null}
          <form action="" id="form-login" method="get" class="ui large form">
            <div class="ui stacked secondary  segment">
              <button class="ui fluid large teal submit button" onClick={handleClick.bind(this.login,"SUBMIT", {})}>
                {gettext("Artywiz Login")}
              </button>
            </div>
            <div class="ui error message"></div>
          </form>
          <div class="ui message">
            {gettext("Nouveau pour nous?")} <a href={config.API_URL+'se-connecter'}>{gettext("S'inscrire")}</a>
          </div>
        </div>
      </div>
    );
  }
};