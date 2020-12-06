import BaseVue from "../../../base/BaseVue";
import { reactive } from 'vue';

export const SimplePaginationClass = BaseVue.extend({
  data : function(){
    return reactive({
      take : 0,
      page : 0,
      total : 0
    });
  },
  construct : function(context,props){
  },
  handleClick: function(action, props, e) {
    let self = this;
    switch (action) {
      case "PREV":
        self.get('onChangeListener')(action, {
          total: self.get("total"),
          page: self.get("page"),
          take: self.get("take"),
        });
        break;
      case "NEXT":
        self.get('onChangeListener')(action, {
          total: self.get("total"),
          page: self.get("page"),
          take: self.get("take"),
        });
        break;
    }
  },
  setOnChangeListener: function(func) {
    let self = this;
    window.staticType(func, [Function]);
    console.log('self',self);
    self.set('onChangeListener',func);
  },
  setPagination: function(props) {
    let self = this;
    window.staticType(props, [Object]);
    window.staticType(props.take, [Number]);
    window.staticType(props.total, [Number]);
    window.staticType(props.page, [Number]);
    self.set("take", props.take);
    self.set("page", props.page);
    self.set("total", props.total);
  },
});

export default {
  setup(context,props){
    let SimplePagination = SimplePaginationClass.create({},props);
    return SimplePagination.setup();
  },
  render(h){
    let self = this;
    let total = self.get('total');
    let take = self.get('take');
    let page = self.get('page');
    let isDisabled = false;
    if (page == 1) {
      isDisabled = true;
    }
    if (total < take) {
      isDisabled = true;
    } else {
      isDisabled = false;
    }
    return (
      <div class="ui pagination menu">
        <a class={(page == 1 ? "disabled" : "") + " item"} onClick={this.handleClick.bind(this, "PREV")}>
          {gettext("Précédent")}
        </a>
        <a class={(isDisabled ? "disabled" : "") + " item"} onClick={isDisabled ? () => {} : this.handleClick.bind(this, "NEXT")}>
          {gettext("Suivant")}
        </a>
      </div>
    );
  }
};