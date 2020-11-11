import BaseVue from "../../../base/BaseVue";
import GridData from "../components/GridData";

export default BaseVue.extend({
  setInitDOMSelection : function(action,props,callback){
    let self = this;
    switch(action){
      case this.getMapDOMSelection('LOAD'):
        let ownRefData = self.getRef('ownRefData');
        if(ownRefData == null) return;
        ownRefData.setOnClickListener(callback);
        ownRefData.setDatas(props);
        break;
    }
  },
  render(h){
    return (<GridData ref={(ref)=>this.setRef('ownRefData',ref)}></GridData>);
  }
});