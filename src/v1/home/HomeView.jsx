import BaseVue from "../../base/BaseVue";
import { watch, reactive, onBeforeMount } from 'vue';
import StickyMessage from "../components/notification/StickyMessage";
import AppStore from "../store/AppStore";

export const HomeViewClass = BaseVue.extend({
  data : function(){
    return reactive({
      HeadMenu : null,
    });
  },
  construct : function(props,context){
    let self = this;
    require.ensure([],function(){
      let HeadMenu = require('./components/HeadMenu').default;
      self.setUpdate('HeadMenu',HeadMenu);
    });
    onBeforeMount(function(){
      watch(()=>AppStore.state.app.notif_location,function(val){
        self.setUpdate('notif_location',val||{});
      });
      let notif_location = AppStore.state.app.notif_location;
      self.setUpdate('notif_location',notif_location||{});
    });
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'STICKY_MESSAGE_OK':
        let a= document.createElement('a');
        a.target= '_blank';
        a.href= 'https://docs.buddypunch.com/en/articles/919258-how-to-enable-location-services-for-chrome-safari-edge-and-android-ios-devices-gps-setting';
        a.click();
        break;
      case 'STICKY_MESSAGE_IGNORE':
        break;
    }
  }
});
export default {
  setup(props,context){
    let view = HomeViewClass.create(props,context);
    return view.setup();
  },
  render(h){
    let { handleClick } = this;
    let { HeadMenu, style, notif_location } = this.get();
    let content = (<>
      <div class="four wide column">
        <div class="foot_item">
          <img src="/public/img/fb_icon.svg" alt=""/>
          &nbsp;&nbsp;
          <span>Aide |  Conditions générales d’utilisation</span>
        </div>
      </div>
      <div class="eight wide column">
        <div class="foot_item" style="justify-content:center;">
          <span>Artisans, commerçants, créez gratuitement votre compte sur Artywiz.io</span>
        </div>
      </div>
      <div class="four wide column">
        <div class="foot_item" style="justify-content:flex-end;">
          <span>Copyright © 2019 artyplanet.io / Tous droits réservés</span>
        </div>
      </div>
    </>);
    return (<div style={style}>
      {notif_location.message != null?<StickyMessage message={notif_location.message} type={notif_location.type} title={notif_location.title} message_ok="How to Activate?" handleClick={handleClick.bind(this,'STICKY_MESSAGE_OK')}></StickyMessage>:null}
      <HeadMenu></HeadMenu>
      <router-view></router-view>
      <div id="footer">
        <div class="ui stackable three column grid mobile hidden lower hidden tablet computer large screen widescreen" >
          {content}
        </div>
        <div class="ui stackable three column grid mobile only">
          {content}
        </div>
      </div>
    </div>);
  }
};