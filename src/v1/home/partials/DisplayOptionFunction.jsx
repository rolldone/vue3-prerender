import BaseVue from "../../../base/BaseVue";
import DisplayOption from "../components/DisplayOption";

export default BaseVue.extend({
  setInitDOMSelection : function(action,props,callback){
    let self = this;
    switch(action){
      case self.getMapDOMSelection('INITIALIZE'):
        self.mapOptionRef = self.getRef('mapOptionRef');
        if(self.mapOptionRef == null) return;
        self.mapOptionRef.setOnClickListener(callback);
        break;
    }
  },
  render(h,props){
    return (<DisplayOption ref={(ref)=>this.setRef('mapOptionRef',ref)}></DisplayOption>);
  }
});