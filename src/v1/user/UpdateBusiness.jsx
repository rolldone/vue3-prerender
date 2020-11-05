import UserService from '../services/UserService';

import './UpdateCategory.scss';

import { onBeforeMount, onMounted, reactive, watch } from 'vue';

import BaseVue from '../../base/BaseVue';
import InputDropdown from '../components/input/InputDropdown';
import InputText from '../components/input/InputText';
import OwnUserStore from '../store/OwnUserStore';

import { useRouter, useRoute } from 'vue-router';

let router = null;
let route = null;

export const UpdateBusinessClass = BaseVue.extend({
	data : function(){
		return reactive({
			form_data : {},
			business_datas : [],
			user_data : {},
			select_business_data : null
		});
	},
	returnUserService : function(){
		return UserService.create();
	},
	construct : function(props,context){
		let self = this;
		onBeforeMount(function(){
			
		});
		onMounted(function(){
			let user_data = OwnUserStore.state.user;
      let business_datas = OwnUserStore.state.user.businesses;
      self.setBusinessDatas(business_datas);
      watch(()=>OwnUserStore.state.user,function(val){
        self.set('user_data',{
          ...val
        });
        self.setBusinessDatas(val.businesses);
      });
		});
	},
	getCategoryDatas : async function(){
		let self = this;
		try{

		}catch(ex){
			console.error('getCategoryDatas - ex',ex);
		}
	},
	setBusinessDatas : async function(props){
		let self = this;
		if(props == null) return;
		let datas = (function(parseData){
			let datas = [];
			for(var a=0;a<parseData.length;a++){
				datas.push({
					...parseData[a],
					index : a,
					id : parseData[a].id,
					label : parseData[a].business_name_line_1+' '+parseData[a].business_name_line_2
				});
			}
			return datas;
		})(props);
		await self.set('business_datas',datas);
		self.setInitDOMSelection(self.map.SELECT_CATEGORY_ID,(function(datas){
			let id = null;
			for(var a=0;a<datas.length;a++){
				if(datas[a].id == parseInt(window.localStorage.getItem("own_business_id"))){
					id = datas[a].id;
					break;
				}
			}
			return id;
		})(datas));

	},
	setInitDOMSelection : function(action,props){
		let self = this;
		switch(action){
			case self.getMapDOMSelection('SELECT_CATEGORY_ID'):
				let { business_datas } = this.get();
				self.select_category_id = self.getRef('selectCategoryData');
				self.select_category_id.setOnChangeListener(function(val,e){
					self.setUpdate('form_data',business_datas[parseInt(val.key)]);
				});
				if(props == null) return;
				self.select_category_id.setValue(props+'');
				break;
		}
	},
	handleClick : async function(action,props,e){
		let self = this;
		switch(action){
			case 'SUBMIT':
				e.preventDefault();
				try{
					let service = self.returnUserService();
					let resData = await service.updateOwnBusiness(self.get('form_data'));
					window.swalSuccess(gettext("Success"), gettext("Business updated!"), function() {
        		router.go(route.currentRoute);
	        });
				}catch(ex){
					console.error('handleClick - ex ',ex);
					if(ex.return.name == "error.validation"){
						window.swalFailure("Error Exception", ex.return.message, function() {});
					}
				}
			break;
		}
	},
});

export default {
	setup(props,context){
		router = useRouter();
		route = useRoute();
		let updateBusinessClass = UpdateBusinessClass.create(props,context);
		return updateBusinessClass.setup();
	},
	render(h){
		let { form_data, business_datas } = this.get();
		let { handleClick } = this;
		return (
			<div class="base_wr column" id="update-form-category">
        <form class="base_wr column ui form" id="form-update-category">
          <h3 fragment="5e370ee0ff" class="ui dividing header">
            {gettext("Category Business Information")}
          </h3>
          <div class="ui two column grid">
          	<div class="row">
          		<div class="column">
          			<InputDropdown ref={(ref)=>this.setRef('selectCategoryData',ref)} datas={business_datas} label="Select Category" name="category_id" set_id="category_id" dropdown_text="label" other_value_key="index"/>
          		</div>
          		<div class="column">
          		</div>
          	</div>
          </div>
          <div class="ui two column grid">
            <div class="row">
              <div class="column">
                <InputText label={window.gettext("Business Name Line 1")} inputObject={(val)=>this.setUpdate('form_data',val)} name="business_name_line_1" value={form_data.business_name_line_1}></InputText>
              </div>
              <div class="column">
                <InputText label={window.gettext("Business Name Line 2")} inputObject={(val)=>this.setUpdate('form_data',val)} name="business_name_line_2" value={form_data.business_name_line_2}></InputText>
              </div>
            </div>
          </div>
          <div fragment="d21f037cab" class="ui divider"></div>
          <div class="ui two column grid">
            <div class="row">
              <div class="column">
                <InputText label={window.gettext("Business Email")} type="email" name="business_email" value={form_data.business_email}></InputText>
              </div>
              <div class="column">
                <InputText label={window.gettext("Business Phone Number")} name="business_mobile_phone" value={form_data.business_mobile_phone}></InputText>
              </div>
            </div>
          </div>
          {/*<div class="ui two column grid">
            <div class="row">
              <div class="column">
              <InputDropdown ref={(ref)=>this.setRef('typeData',ref)} datas={type_datas} set_class="disabled" label="Type User" name="type_user" set_id="type_user" dropdown_text="label" other_value_key="id" no_divider={true}></InputDropdown>
              </div>
              <div class="column">
              </div>
            </div>
          </div>*/}
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
		);
	}
};