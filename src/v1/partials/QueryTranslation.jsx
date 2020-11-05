import BaseVue from "../../base/BaseVue";

export default BaseVue.extend({
  name: "QueryTranslation",
  construct : function(props,context){
    let self = this;
    let parseUrl = self.jsonParseUrl();
    /* Parent harus punya data.query */
    context.setUpdate('query',parseUrl.query);
  }
});
