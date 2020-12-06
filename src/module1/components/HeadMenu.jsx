import { reactive, onMounted, watch, onBeforeMount } from "vue";

import AppStore from "../store/AppStore";
import BaseVue from "../../base/BaseVue";
import ListMenuClick from '../partials/ListMenuClick';
import OwnUserStore from "../store/OwnUserStore";
import UserService from "../services/UserService";

export const BaseHeadMenu = BaseVue.extend({
  data : function(){
    return reactive({
      form_data : {},
      title : window.gettext("No Title"),
      user_data : {},
      business_datas : [],
      app_data : {},
      select_business_text : '',
      default_business_data : {}
    });
  },
  returnUserService : function(){
    return UserService.create();
  },
  construct : function(props,context){
    let self = this;
    self.listMenuClick = (ListMenuClick.create(props,self)).setup();
    onBeforeMount(async function(){
      watch(()=>OwnUserStore.state.user,function(val){
        self.set('user_data',{
          ...val
        });
        self.set('business_datas',val.businesses);
      });
      self.set('app_data',AppStore.state.app);
      watch(()=>AppStore.state.app,function(val){
        self.set('app_data',{
          ...val
        });
      });
    });
    onMounted(async function(){
      await self.set('user_data',OwnUserStore.state.user);
      await self.set('business_datas',OwnUserStore.state.user.businesses || []);
      await self.set('default_business_data',OwnUserStore.state.user.businesses_one);
      if(window.localStorage.getItem('own_business_id')==null){
        let default_business_data = self.get('default_business_data');
        window.localStorage.setItem('own_business_id',default_business_data.id);
      }
      self.setInitDOMSelection('SELECT_CATEGORY',window.localStorage.getItem('own_business_id'));
      self.setInitDOMSelection(self.listMenuClick.map.LIST_MENU_CLICK,{
        className : '.right-head-pop-menu'
      });
    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    switch(action){
      case 'SELECT_CATEGORY':
        self.dropdown_select_category = $('#dropdown_select_category');
        self.dropdown_select_category.dropdown({
          onChange : async function(value, text, $selectedItem){
            self.set('select_business_text',text);
            if(value == window.localStorage.getItem("own_business_id")) return;
            window.localStorage.setItem('own_business_id',value);
            window.location.reload();
          }
        });
        if(props == null) return;
        self.dropdown_select_category.dropdown('set selected',props+'');
        break;
    }
    self.listMenuClick.join(action,props);
  },
  handleClick : function(action,props,e){}
});

export default {
  setup : (context,props)=>(BaseHeadMenu.create(context,props)).setup(),
  render(h){
    let { title, user_data, app_data, select_business_text, business_datas } = this.get();
    let { handleClick } = this;
    return (
      <div class="ui menu" id="header-menu">
        <div class="item burger-menu">
          <a href="base_wr row " href="#">
            <img src="/public/img/menu-icon.svg" alt="" on-click="@this.handleClick('OPEN_SIDE_MENU',{},@event)" />
          </a>
        </div>
        <div class="item">
          <h5 class="base_info page_name">{app_data.title || gettext("No have title")}</h5>
        </div>
        <div class="menus-header"></div>
        <div class="main-title mobile hidden">
          <h5 class="base_info page_name">{gettext("Artywiz - Admin")}</h5>
        </div>
        <div class="menus-header">
          <div class="ui dropdown item bar" action="SELECT_CATEGORY" tabindex="0" id="dropdown_select_category">
            {select_business_text||gettext("Select Business")}
            <label></label>
            <i class="dropdown icon"></i> 
            <div class="menu transition hidden" tabindex="-1">
              {business_datas.map((value,index)=>{
                return <a class="item" data-value={value.id}>{value.business_name_line_1+' '+value.business_name_line_2}</a>;
              })}
            </div>
          </div>
        </div>
        {/* <div class="ui dropdown" id="list-cuisine">
          <div class="text">List Vendor</div>
          <i class="dropdown icon"></i>
          <div class="menu">
            <div class="item">New</div>
            <div class="item">Latest</div>
          </div>
        </div> */}
        <div class="right item">
          <a class="browse item right-head-pop-menu" id="right-head-pop-menu">
            {user_data.photo != null ? (
              <img src="{{@this.assetApiUrl('/storage/user/'+user_data.photo)}}" style="height:32px" alt="" onClick={this.handleClick.bind(this, "RIGHT_USER_MENU", {})} />
            ) : (
              <img src="/public/img/user-icon.png" alt="" onClick={this.handleClick.bind(this, "RIGHT_USER_MENU", {})} />
            )}
          </a>
          <div class="ui fluid popup bottom right transition hidden" style="top: auto; left: auto; bottom: 69px; right: 7px;">
            <div class="ui four column relaxed divided grid">
              <div class="column">
                <div class="ui link list">
                  <router-link class="item" to={{ name: "user.current_user" }}>
                    {gettext("My Profile")}
                  </router-link>
                  <a class="item" href="/auth/logout">
                    {gettext("Se déconnecter")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};