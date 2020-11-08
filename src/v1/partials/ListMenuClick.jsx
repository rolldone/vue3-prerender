import BaseVue from "../../base/BaseVue";

export default BaseVue.extend({
  setInitDOMSelection: function(action, props = {}, callback) {
    let self = this;
    switch (action) {
      case self.getMapDOMSelection('LIST_MENU_CLICK'):
        if(self.list_menu_click != null){
          self.list_menu_click.popup('hide');
        }
        self.list_menu_click = $(props.className ||".list-menu-click").popup({
          // inline: true,
          on: "click",
          // position: "bottom right",
          delay: {
            show: 300,
            hide: 800,
          },
          onShow: function() {
            window.staticType(callback, [null, Function]);
            if (callback == null) return;
            return callback("SHOW", this);
          },
          onHide: function() {
            window.staticType(callback, [null, Function]);
            if (callback == null) return;
            return callback("HIDE", this);
          },
        });
        break;
      case self.getMapDOMSelection('LIST_MENU_HIDE'):
        if(self.list_menu_click != null){
          self.list_menu_click.popup('hide');
        }
        break;
      case self.getMapDOMSelection('LIST_MENU_HOVER'):
        self.list_menu_click = $(props.className || ".list-menu-hover").popup({
          inline: true,
          on: "hover",
          position: "bottom right",
          delay: {
            show: 300,
            hide: 800,
          },
          onShow: function() {
            window.staticType(callback, [null, Function]);
            if (callback == null) return;
            return callback("SHOW", this);
          },
          onHide: function() {
            window.staticType(callback, [null, Function]);
            if (callback == null) return;
            return callback("HIDE", this);
          },
        });
        break;
    }
  },
});