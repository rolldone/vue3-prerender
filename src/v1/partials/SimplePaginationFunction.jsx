import BaseVue from "../../base/BaseVue";
import SimplePagination from "../components/pagination/SimplePagination";
import { ref } from 'vue';

export default BaseVue.extend({
  name: "SimplePaginationFunction",
  construct : function(props,context){
    let self = this;
  },
  setInitDOMSelection: function(action, props, callback) {
    let self = this;
    let context = this.context;
    switch (action) {
      case self.getMapDOMSelection('SIMPLE_PAGINATION'):
        self.simple_pagination = self.getRef("simple_pagination");
        self.simple_pagination.setOnChangeListener(async function(action, props) {
          console.log("action", action);
          console.log("props", props);
          switch (action) {
            case "PREV":
              var query = context.get("query");
              if (query.page == 1) return;
              query.page -= 1;
              context.setUpdate("query", query);
              callback();
              break;
            case "NEXT":
              var query = context.get("query");
              query.page += 1;
              context.setUpdate("query", query);
              callback();
              break;
          }
        });
        if (props == null) return;
        window.staticType(props.total, [Number]);
        window.staticType(props.page, [Number]);
        window.staticType(props.take, [Number]);
        self.simple_pagination.setPagination({
          total: props.total,
          page: props.page,
          take: props.take,
        });
        break;
    }
  },
  render : function(h,props) {
    return <SimplePagination ref={(ref)=>this.setRef('simple_pagination',ref)}></SimplePagination>;
  },
});
