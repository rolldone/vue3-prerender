import BaseVue from "BaseVue";

const SimplePagination = BaseVue.extend({
  data: function() {
    return {
      total: 0,
      page: 1,
      take: 20,
    };
  },
  methods: {
    handleClick: function(action, props, e) {
      let self = this;
      switch (action) {
        case "PREV":
          self.onChangeListener(action, {
            total: self.get("total"),
            page: self.get("page"),
            take: self.get("take"),
          });
          break;
        case "NEXT":
          self.onChangeListener(action, {
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
      self.onChangeListener = func;
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
  },
  render() {
    let total = this.get("total");
    let take = this.get("take");
    let page = this.get("page");
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
  },
});

export default SimplePagination;
