import BaseVue from "../../base/BaseVue";
import MenuFilter from "../components/MenuFilter";
import { ref, onMounted } from 'vue';

export default BaseVue.extend({
  name: "FilterBarFunction",
  construct : function(context,props){},
  setInitDOMSelection: function(action, props, callback) {
    let self = this;
    switch (action) {
      case self.getMapDOMSelection('FILTER_BAR'):
        self.filterBar = self.getRef("filterBar");
        self.filterBar.setOnChangeListener(function(action, props) {
          switch (action) {
            case "ADD":
              break;
          }
          window.staticType(callback, [Function]);
          callback(action, props);
        });
        break;
    }
  },
  render(h) {
    return <MenuFilter ref={(ref)=>this.setRef('filterBar',ref)}></MenuFilter>;
  },
});
