import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted } from 'vue';
import InputText, { InputTextClass } from "../../components/input/InputText";

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
    let { label, form_title, placeholder, disabled, readonly, name, type, icon_first, icon_last } = this.$props;
    let { form_data } = this.get();
    return (
      <>
        {form_title != null ? <h3 class="ui dividing header">{form_title}</h3> : <div class="ui divider"></div>}
        <div class="field ipsl">
          <label for="">{label}</label>
          <div class="ui left icon input ipsl_1">
            <img src={icon_first} class="right icon" alt=""/>
            <input type={type} placeholder={placeholder} name={name} disabled={disabled} v-model={form_data.value} readonly={readonly} />
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

export const PopUpSelectLocationClass = BaseVue.extend({
  data : function(){
    return reactive({
      random_id:
      "ui_modal_" +
      Math.random()
        .toString(36)
        .substring(7),

    });
  },
  construct : function(props,context){
    let self = this;
    onMounted(function(){
      self.current_modal = $("#" + self.get("random_id")).modal({
        detachable: false,
      });
    });
  },
  setIniDOMSelection : function(action,props){
    let self = this;
    switch(action){}
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'SUBMIT':
        break;
      case 'DISPOSE':
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
        // self.setUsers(await self.getUsers());
        break;
    }
  },

});

export default {
  setup(props,context){
    return PopUpSelectLocationClass.create(props,context).setup();
  },
  render(h){
    let { random_id } = this.get();
    return (<div class="ui modal ppsl" id={random_id} style="position: fixed;margin: 0 auto; top: 35%;left: 0px;right: 0px; background: transparent; width:400px;">
      <div class="ui modal ppsl_1" style="display:block;">
        <i class="close icon" onClick={this.handleClick.bind(this, "DISPOSE", {})}></i>
        <div class="header ppsl_11">{gettext("Bienvenue sur artyplanet")}</div>
        <h1>{gettext("QUE CHERCHEZ-VOUS?")}</h1>
        <form class="base_wr column ui form ppsl_12" id="form-email">
          <ExtendInputText icon_first="/public/img/map/shop_dark.svg" type="text" inputObject={(val)=>this.setUpdate('form_data',val)} name="search"></ExtendInputText>
          <ExtendInputText icon_first="/public/img/map/marker.svg" icon_last="/public/img/map/own_location.svg" type="text" inputObject={(val)=>this.setUpdate('form_data',val)} name="location"></ExtendInputText>
          <div class="ppsl_121"><span class="ppsl_1211"><img src="/public/img/map/calendar.svg" alt=""/> 03 Novembre 2020</span></div>
        </form>
        <div class="actions ppsl_13">
          <button class="ppsl_131" onClick={this.handleClick.bind(this,'SUBMIT')}>RECHERCHER</button>
        </div>
      </div>
    </div>
);
  }
};