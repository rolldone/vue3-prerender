import BaseVue from "../../../base/BaseVue";
import InputValidation from "../../partials/InputValidation";

export default InputValidation.extend({
  aku : function(){
    return 'aku';
  },
  setInitDOMSelection : function(action,props){
    
  },
  render(h){
    let { test } = this.context.data;
    return (<h1>{test}</h1>);
  }
});