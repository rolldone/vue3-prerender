import HeadMenu from "../components/HeadMenu";
import { reactive } from 'vue';
import BaseVue from "../../base/BaseVue";

export const HomeLayoutClass = BaseVue.extend({
  data : function(){
    return reactive({
      style : {
        height : 'inherit'
      }
    });
  },
  construct : function(props,context){
    let self = this;
    self.HeaderComponent = props.header || HeadMenu;
    self.ContentComponent = props.content || {};
  }
});
export default {
  props : {
    header : {
      type : Object,
      default : null,
      required : false
    }
  },
  setup(props,context){
    let homeLayoutClass = HomeLayoutClass.create(props,context).setup();
    return homeLayoutClass;
  },
  render(h){
    let { HeaderComponent} = this;
    let { style } = this.get();
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
      <HeaderComponent></HeaderComponent>
      {this.$slots.default()}
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

