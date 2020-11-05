import HeadMenu from "./components/HeadMenu";


export default {
  props : {
    header : {
      type : Object,
      default : null,
      required : false
    }
  },
  setup(props,context){
    const HeaderComponent = props.header || HeadMenu;
    let ContentComponent = props.content || {};
    console.log('HeaderComponent',HeaderComponent);
    /* 
      Delete jika ada 
      Karena ada masalah di runtime-core.esm-bundler.js bagian selfHooks
    */
    delete HeaderComponent.beforeCreate;
    delete HeaderComponent.beforeDestroy;
    delete ContentComponent.beforeCreate;
    delete ContentComponent.beforeDestroy;
    return {
      HeaderComponent,
      ContentComponent
    };
  },
  render(h){
    let { HeaderComponent} = this;
    return (<>
      <HeaderComponent></HeaderComponent>
      {this.$slots.default()}
    </>);
  }
};

