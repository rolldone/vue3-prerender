import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted } from 'vue';
import InputText from "../../components/input/InputText";
import PositionService from "../../services/PositionService";
import GoogleGeoCodeService from "../../services/GoogleGeoCodeService";
import InputAutoCompleteFunction from "../partials/InputAutoCompleteFunction";
import GooglePlaceHttpRequest from "../../services/GooglePlaceHttpRequest";
import './PopUpSelectLocation.scss';
import InputValidation from "../../partials/InputValidation";

const ExtendInputText = {
  ...InputText,
  props : {
    ...InputText.props,
    icon_first : {
      type : String,
      default : null
    },
    icon_last : {
      type : String,
      default : null
    }
  },
  render(h){
    let { label, form_title, placeholder, disabled, readonly, name, type, icon_first, icon_last, id } = this.$props;
    let { form_data } = this.get();
    return (
      <>
        {form_title != null ? <h3 class="ui dividing header">{form_title}</h3> : <div class="ui divider"></div>}
        <div class="field ipsl">
          <label for="">{label}</label>
          <div class="ui left icon input ipsl_1">
            <img src={icon_first} class="right icon" alt=""/>
            <input type={type} id={id} placeholder={placeholder} name={name} disabled={disabled} v-model={form_data.value} readonly={readonly} autocomplete="off" />
            {icon_last != null?<img src={icon_last} alt=""/>:null}
          </div>
          <div class="base_wr row">
            <span class="base_info error bold small"></span>
          </div>
        </div>
      </>
    );
  }
};

const INPUT_TEXT_VALIDATION = {
  form_attribute_name : {
    search : window.gettext("Input Search"),
    location : window.gettext("Location")
  },
  form_rules : {
    search : 'required',
  },
  element_target : "input[type=text]",
  id : "form-define-location"
};

const SUBMIT_VALIDATION = {
  ...INPUT_TEXT_VALIDATION,
  form_rules : {
    ...INPUT_TEXT_VALIDATION.form_rules,
    location : 'required'
  }
};

export const PopUpSelectLocationClass = BaseVue.extend({
  data : function(){
    return reactive({
      random_id:
      "ui_modal_" +
      Math.random()
        .toString(36)
        .substring(7),
      position : {},
      newLocation : {},
      is_own_location : false,
      form_data : {}
    });
  },
  returnPositionService : function(){
    return PositionService.create();
  },
  returnGoogleGeoCodeService : function(){
    return GoogleGeoCodeService.create();
  },
  returnGooglePlaceService : function(){
    return GooglePlaceHttpRequest.create();
  },
  construct : function(props,context){
    let self = this;
    self.autoCompleteLocation = InputAutoCompleteFunction.create(props,self).setup();
    self.inputValidation = InputValidation.create(props,self).setup();
    onMounted(function(){
      self.current_modal = $("#" + self.get("random_id")).modal({
        detachable: false,
        closable: false
      });
      self.setInitDOMSelection(self.inputValidation.map.INPUT_TEXT_VALIDATION,{
        ...INPUT_TEXT_VALIDATION,
        form_data : self.get('form_data')
      });
    });
  },
  getGoogleLocations : async function(searchString){
    window.staticType(searchString,[null,String]);
    let self = this;
    try{
      let service = self.returnGooglePlaceService();
      let resData = await service.getAutoComplete({
        input : searchString,
        language : 'en',
        types : ''
      });
      resData = (function(parseData){
        let newDatas = [];
        for(var a=0;a<parseData.length;a++){
          newDatas.push({
            place_id : parseData[a].place_id,
            location : parseData[a].description,
            reference : parseData[a].reference
          });
        }
        return newDatas;
      })(resData.return.predictions);
      return resData;
    }catch(ex){
      console.error('getGoogleLocations - ex ',ex);
    }
  },
  getCurrentPosition : async function(){
    try{
      let service = this.returnPositionService();
      let resData = await service.getCurrentPosition();
      return resData;
    }catch(ex){
      console.error('getCurrentPosition - ex ',ex);
    }
  },
  getCurrentIpLocation : async function(){
    try{
      let service = this.returnPositionService();
      let resData = await service.getCurrentIpLocation();
      resData = (function(parseData){
        parseData.latitude = parseData.lat;
        parseData.longitude = parseData.lon;
        delete parseData.lat;
        delete parseData.lon;
        return parseData;
      })(resData.return);
      return resData;
    }catch(ex){
      console.error('getIpLocation - ex' ,ex);
    }
  },
  pendingInputSearch : function(input){
    let self = this;
    return new Promise(function(resolve){
      if(self.locationPendingSearch != null){
        self.locationPendingSearch.cancel();
      }
      self.locationPendingSearch = _.debounce(function(parseData){
        resolve(parseData);
      },300);
      self.locationPendingSearch(input);
    });
  },
  getReverseGeoCode : async function(){
    let self = this;
    try{
      let is_own_location = self.get('is_own_location');
      let position = await self.get('position');
      window.staticType(position.latitude,[Number,String]);
      window.staticType(position.longitude,[Number,String]);
      let latlng = position.latitude +','+ position.longitude;
      let service = this.returnGoogleGeoCodeService();
      let resData = await service.reverseGeoCode({
        latlng
      });
      resData = await service.parseAddressComponents(resData.return.results);
      if(is_own_location == true){
        resData.location = resData.formatted_address;
      }else{
        resData.location = resData.administrative_area_level_2+", "+resData.administrative_area_level_1;
      }
      return resData;
    }catch(ex){
      console.error('getReverseGeoCode - ex ',ex);
    }
  },
  getDetailPlaces : async function(props){
    window.staticType(props,[Object]);
    window.staticType(props.place_id,[String]);
    window.staticType(props.location,[String]);
    let self = this;
    try{
      let service = self.returnGooglePlaceService();
      let resData = await service.getDetails({
        placeid : props.place_id,
        language : 'en',
        input : props.location
      });
      let addressComponents = await service.parseAddressComponents(resData.return.result.address_components);
      /* Override result detail place */
      resData = {
        latitude : resData.return.result.geometry.location.lat,
        longitude : resData.return.result.geometry.location.lng,
        ...addressComponents
      };
      return resData;
    }catch(ex){
      console.error('getDetailPlaces - ex ',ex);
    }
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    self.inputValidation.join(action,props);
    self.autoCompleteLocation.join(action,{
      selector : "#autoComplete",
      placeholder : 'Search Location',
      key : ["place_id", "location", "reference"],
      onHttpRequest : function(){
        return new Promise(function(resolve){
          // Loading placeholder text
          document
            .querySelector("#autoComplete")
            .setAttribute("placeholder", "Loading...");
          // Fetch External Data Source
          const query = document.querySelector("#autoComplete").value;
          
          if(self.locationPendingSearch != null){
            self.locationPendingSearch.cancel();
          }
          self.locationPendingSearch = _.debounce(async function(parseData){
            let resData = await self.getGoogleLocations(parseData);
            // Post loading placeholder text
            document
              .querySelector("#autoComplete")
              .setAttribute("placeholder", "Search Location");
            // Returns Fetched data
            resolve(resData);
          },300);
          self.locationPendingSearch(query);
        });
      },
      onResult : function(feedback){
        const selection = feedback.selection.value.location;
        /* Save newLocation */
        self.set('newLocation',feedback.selection.value);
        self.setUpdate('form_data',{
          location : feedback.selection.value.location
        });
        // Render selected choice to selection div
        document.querySelector(".selection").innerHTML = selection;
        // Clear Input
        document.querySelector("#autoComplete").value = "";
        // Change placeholder with the selected value
        document
          .querySelector("#autoComplete")
          .setAttribute("placeholder", selection);
      }
    });
  },
  handleClick : async function(action,props,e){
    let self = this;
    switch(action){
      case 'SUBMIT':
        self.setInitDOMSelection(self.inputValidation.map.SUBMIT_VALIDATION,{
          ...SUBMIT_VALIDATION,
          form_data : self.get('form_data'),
          callback : async function(){
            var position = self.get('position');
            var newLocation = self.get('newLocation');
            if(Object.keys(newLocation).length == 0){
              /* User have allow location */
              self.onCallBackListener(action,{
                form_data : self.get('form_data'),
                position : position
              });
              return;
            }
            /* If user select another location */
            var detailPlaces = await self.getDetailPlaces(newLocation);
            self.onCallBackListener(action,{
              form_data : self.get('form_data'),
              position : detailPlaces
            });
          }
        });
        break;
      case 'DISPOSE':
        var position = self.get('position');
        self.onCallBackListener(action,{
          form_data : self.get('form_data'),
          position : position
        });
        break;
    }
  },
  setOnCallbackListener: function(func) {
    let self = this;
    self.onCallBackListener = func;
  },
  setAction: async function(action, props) {
    let self = this;
    window.staticType(action, [String]);
    window.staticType(props, [Object]);
    self.setUpdate("form_data", props);
    self.current_modal.modal(action);
    switch(action){
      case 'show':
        let position = await self.getCurrentPosition();
        if(position == null){
          position = await self.getCurrentIpLocation();
        }else{
          await self.setUpdate('is_own_location',true);
          /* Change color if user allow own location */
          $('#autoComplete').next().attr('src',"/public/img/map/own_location_active.svg");
        }
        await self.setUpdate('position',position);
        let reverseGeoCode = await self.getReverseGeoCode();
        await self.setUpdate('position',reverseGeoCode);
        await self.setUpdate('form_data',{
          location : reverseGeoCode.location
        });
        await self.setInitDOMSelection(self.autoCompleteLocation.map.LOAD);
        break;
    }
  },
  handleInputObject : async function(action,val){
    let self = this;
    switch(action){
      /* Watching typing location input text */
      case 'LOCATION_TYPING':
        if(self.pendingHandleLocationTyping != null){
          self.pendingHandleLocationTyping.cancel();
        }
        self.pendingHandleLocationTyping = _.debounce(async function(parseString){
          if(parseString == ""){
            await self.set('position',{});
            await self.set('newLocation',{});
            self.setUpdate('form_data',{
              location : parseString
            });
          }
        },200);
        self.pendingHandleLocationTyping(val.location);
        break;
    }
  }
});

export default {
  setup(props,context){
    return PopUpSelectLocationClass.create(props,context).setup();
  },
  render(h){
    let { random_id, position, form_data } = this.get();
    return (<div class="ui modal ppsl" id={random_id} style="position: fixed;margin: 0 auto; top: 35%;left: 0px;right: 0px; background: transparent; width:500px;">
      <div class="ui modal ppsl_1" style="display:block;">
        <i class="close icon" onClick={this.handleClick.bind(this, "DISPOSE", {})}></i>
        <div class="header ppsl_11">{gettext("Bienvenue sur artyplanet")}</div>
        <h1>{gettext("QUE CHERCHEZ-VOUS?")}</h1>
        <form class="base_wr column ui form ppsl_12" id="form-define-location">
          <ExtendInputText placeholder={window.gettext("Exemple “Boulangerie”, “pains ou gateau” au “chocolat”")} icon_first="/public/img/map/shop_dark.svg" type="text" inputObject={(val)=>this.setUpdate('form_data',val)} name="search"></ExtendInputText>
          <ExtendInputText id="autoComplete" value={form_data.location||""}  icon_first="/public/img/map/marker.svg" icon_last="/public/img/map/own_location.svg" inputObject={this.handleInputObject.bind(this,'LOCATION_TYPING')} type="text" name="location"></ExtendInputText>
          {/* <div class="ppsl_121"><span class="ppsl_1211"><img src="/public/img/map/calendar.svg" alt=""/> 03 Novembre 2020</span></div> */}
        </form>
        <div class="actions ppsl_13">
          <button class="ppsl_131" onClick={this.handleClick.bind(this,'SUBMIT')}>RECHERCHER</button>
        </div>
      </div>
    </div>);
  }
};