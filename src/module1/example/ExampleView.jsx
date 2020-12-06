import BaseVue from "../../base/BaseVue";
import { watch, reactive, onBeforeMount } from 'vue';

export const HomeViewClass = BaseVue.extend({
  data : function(){
    return reactive({
      Header : null,
      SideMenu : null,
      Footer : null
    });
  },
  construct : function(props,context){
    let self = this;
    require.ensure([],function(){
      let Header = require('./components/Header').default;
      self.setUpdate('Header',Header);
      let SideMenu = require('./components/SideMenu').default;
      self.setUpdate('SideMenu',SideMenu);
      let Footer = require('./components/Footer').default;
      self.setUpdate('Footer',Footer);
    });
    onBeforeMount(function(){
      
    });
  },
});
export default {
  setup(props,context){
    let view = HomeViewClass.create(props,context);
    return view.setup();
  },
  render(h){
    let { HeadMenu, SideMenu, Footer } = this.get();
    return (<div>
      <HeadMenu></HeadMenu>
      <SideMenu></SideMenu>
      <Footer></Footer>
    </div>)
  }
};