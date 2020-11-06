import BaseVue from "../../../base/BaseVue";
import GridData from "../components/GridData";

export default BaseVue.extend({
  setInitDOMSelection : function(action,props,callback){
    let self = this;
    switch(action){
      case this.getMapDOMSelection('LOAD'):
        let gridData = self.getRef('gridData');
        if(gridData == null) return;
        gridData.setOnClickListener(callback);
        gridData.setDatas(props);
        break;
    }
  },
  render(h){
    return (<GridData ref={(ref)=>this.setRef('gridData',ref)}></GridData>);
  }
});