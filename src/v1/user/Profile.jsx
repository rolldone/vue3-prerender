import { reactive, onMounted, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import BaseVue from '../../base/BaseVue';
import InputDropdown from '../components/input/InputDropdown';
import InputText from '../components/input/InputText';
import InputValidation from '../partials/InputValidation';
import Layout from '../Layout';
import UpdateBusiness from './UpdateBusiness';
import UserService from '../services/UserService';
import AppStore from '../store/AppStore';

let router = null;
let route = null;

const INPUT_TEXT_VALIDATION = {
  id: "form-create",
  form_rules: {
    email: "required|email",
    first_name : 'required',
    phone_number : 'required'
  },
  form_attribute_name: {
    email: window.gettext("Email"),
    password: window.gettext("Mot de passe"),
    first_name : window.gettext("First Name"),
    phone_number : window.gettext("Phone Number")
  },
};

const SUBMIT_VALIDATION = {
  ...INPUT_TEXT_VALIDATION,
};

const INPUT_PASSWORD_TEXT_VALIDATION = {
	...INPUT_TEXT_VALIDATION,
	form_rules : {
    password: "required",
    password_confirm : 'required|same:password'
	},
	form_rules : {
		password : 'required|min:8',
		password_confirm : 'required|same:password'
	},
	form_attribute_name : {
		...INPUT_TEXT_VALIDATION.form_attribute_name,
		password_confirm : window.gettext("Password Confirmation")
	}
};

const SUBMIT_PASSWORD_VALIDATION = {
	...INPUT_PASSWORD_TEXT_VALIDATION,
};

export const Profile = BaseVue.extend({
	data : function(){
		return reactive({
			form_password : {},
			form_data : {},
			type_datas : [{
				id : 1,
				label : window.gettext("Freemium")
			},{
				id : 0,
				label : window.gettext("Premium")
			}],
		});
	},
	returnUserService(){
		return UserService.create();
	},
	construct : function(props,context){
		let self = this;
		self.inputValidation = (InputValidation.create(props,self)).setup();
		onBeforeMount(function(){
			AppStore.commit('SET',{
        title : window.gettext("Manage Profile")
      });
		});
		onMounted(async function(){
			self.setCurrentUser(await self.getCurrentUser());
			self.setInitDOMSelection(self.inputValidation.map.INPUT_TEXT_VALIDATION,{
			...INPUT_TEXT_VALIDATION
			});
			self.setInitDOMSelection(self.inputValidation.map.INPUT_PASSWORD_VALIDATION,{
				...INPUT_PASSWORD_TEXT_VALIDATION,
				form_data : self.get('form_password') 
			});
		});
	},
	setInitDOMSelection : function(action,props){
		let self = this;
		switch(action){
			case self.getMapDOMSelection('TYPE_USER'):
				self.type_data = self.getRef('typeData');
				self.type_data.setOnChangeListener(function(props){
					if(self.get('form_data').type_user == props.value) return;
				});
				if(props == null) return;
				self.type_data.setValue(props+'');
			break;
		}
		self.inputValidation.join(action,props);
	},
	handleClick : function(action,props,e){
		let self = this;
		switch(action){
			case 'SUBMIT':
			e.preventDefault();
			let { form_password, form_data } = self.get();
			let submitTextValidation = function(){
				self.setInitDOMSelection(self.inputValidation.map.SUBMIT_VALIDATION,{
					...SUBMIT_VALIDATION,
					form_data : form_data,
					callback : function(){
						self.submit();
					}
				});
			};
			if(Object.keys(form_password).length > 0 && form_password.password != ""){
				return self.setInitDOMSelection(self.inputValidation.map.SUBMIT_VALIDATION,{
					...SUBMIT_PASSWORD_VALIDATION,
					form_data : form_password,
					callback : function(){
						submitTextValidation();
					}
				});
			}
			submitTextValidation();
			break;
		}
	},
	getCurrentUser : async function(){
		let self = this;
		try{
			let service = self.returnUserService();
			let resData = await service.getCurrentUser();
			return resData;
		}catch(ex){
			console.error('getCurrentUser - ex ',ex);
		}
	},
	setCurrentUser : function(props){
		let self = this;
		if(props == null) return;
		let form_data = (function(data){
			return data;
		})(props.return);
		self.set('form_data',form_data);
		self.setInitDOMSelection(self.map.TYPE_USER,form_data.type_user);
	},
	submit : async function(){
		let self = this;
		try{
			let { form_data, form_password} = this.get();
			let service = self.returnUserService();
			let resData = await service.updateCurrentUser({
				...form_data,
				...form_password
			});
	        window.swalSuccess(gettext("Success"), gettext("User updated!"), function() {
        		router.go(route.currentRoute);
	        });
		}catch(ex){
			console.error('submit - ex ',ex);
			if(ex.return.name == "error.validation"){
				window.swalFailure("Error Exception", ex.return.message, function() {});
			}
		}
	}
});

export default {
	setup(props,context){
		router = useRouter();
		route = useRoute();
		let profile = Profile.create(props,context);
		return profile.setup();
	},
	render(h){
		let { form_data, type_datas, form_password } = this.get();
		let { handleClick } = this;
		return (<Layout>
			<div id="users" class="base_wr column">
        <form class="base_wr column ui form" id="form-create">
          <h3 fragment="5e370ee0ff" class="ui dividing header">
            {gettext("User Business Information")}
          </h3>
          <div class="ui two column grid">
            <div class="row">
              <div class="column">
                <InputText label={window.gettext("First Name")} inputObject={(val)=>this.setUpdate('form_data',val)} name="first_name" value={form_data.first_name}></InputText>
              </div>
              <div class="column">
                <InputText label={window.gettext("Last Name")} inputObject={(val)=>this.setUpdate('form_data',val)} name="last_name" value={form_data.last_name}></InputText>
              </div>
            </div>
          </div>
          <div fragment="d21f037cab" class="ui divider"></div>
          <div class="ui two column grid">
            <div class="row">
              <div class="column">
                <InputText label={window.gettext("Email")} type="email" name="email" value={form_data.email}></InputText>
              </div>
              <div class="column">
                <InputText label={window.gettext("Phone Number")} name="email" value={form_data.phone_number}></InputText>
              </div>
            </div>
          </div>
          <div class="ui two column grid">
            <div class="row">
              <div class="column">
              <InputDropdown ref={(ref)=>this.setRef('typeData',ref)} datas={type_datas} set_class="disabled" label="Type User" name="type_user" set_id="type_user" dropdown_text="label" other_value_key="id" no_divider={true}></InputDropdown>
              </div>
              <div class="column">
              </div>
            </div>
          </div>
          <h3 fragment="5e370ee0ff" class="ui dividing header">
            {gettext("Password Management")}
          </h3>
          <div class="ui two column grid">
            <div class="row">
              <div class="column">
                <InputText label={window.gettext("Password")} inputObject={(val)=>this.setUpdate('form_password',val)} type="password" name="password" value={form_password.password}></InputText>
              </div>
              <div class="column">
                <InputText label={window.gettext("Password Confirm")} inputObject={(val)=>this.setUpdate('form_password',val)} type="password" name="password_confirm" value={form_password.password_confirm}></InputText>
              </div>
            </div>
          </div>
          <div class="ui two column grid">
          	<div class="row">
          		<div class="column">
								<button class="ui large teal submit button" onClick={handleClick.bind(this,"SUBMIT", {})}>
              	{gettext("Update")}
      					</button>
          		</div>
          	</div>
          </div>
        </form>
      </div>
      <UpdateBusiness></UpdateBusiness>
		</Layout>);		
	}
};