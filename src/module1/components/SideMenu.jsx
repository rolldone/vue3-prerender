import BaseVue from "../../base/BaseVue";

export const BaseSideMenu = BaseVue.extend({
  construct : function(props,context){},
  setInitDOMSelection : function(action,props){}
});

export default {
  setup(props,context){
    let sidemenu = BaseSideMenu.create(props,context);
    return sidemenu.setup();// sidemenu.join();
  },
  render(h){
    return (<div id="sidemenu">
      <div class="ui visible sidebar inverted vertical menu" id="wr-sidebar">
        <div class="base_wr column sidemenu" id="side-menu">
          <div style="text-align: center; padding-top: 10px; padding-bottom: 10px;">
            <a href="/v1/dashboard">
              <img src="/public/img/favicon.png" alt="" style="width: 128px;" />
            </a>
          </div>
          <ul class="base_list menu">
            <li class="mobile only">
              <h3 class="base_wr row item">{gettext("Artywiz - Administration")}</h3>
            </li>
            {/* <li>
              <router-link class="base_wr row item has_submenu" to={{name : 'dashboard'}}>
                  <img src="/public/img/sidemenu/commandess.png" alt=""/>
                  <span class="base_info medium bold">{gettext("Dashboard")}</span>
              </router-link>
            </li> */}
            <li>
              <router-link class="base_wr row item has_submenu" to={{ name: "dashboard.dashboard" }}>
                <img src="/public/img/sidemenu/commandess.png" alt="" />
                <span class="base_info medium bold">{gettext("Activities")}</span>
                {/* <i class="icon angle right"></i> */}
              </router-link>

              {/* <ul class="base_list submenu">
                  <li>
                      <router-link class="base_wr row item" to={{name : 'dashboard'}}>
                          <span class="base_info medium bold">{gettext("Liste De Commandes")}</span>
                      </router-link>
                  </li>
              </ul> */}
            </li>
            <li>
              <router-link class="base_wr row item has_submenu" to={{ name: "user_business.user_businesses" }}>
                <img src="/public/img/sidemenu/commandess.png" alt="" />
                <span class="base_info medium bold">{gettext("User Businesses")}</span>
                {/* <i class="icon angle right"></i> */}
              </router-link>

              {/* <ul class="base_list submenu">
                  <li>
                      <router-link class="base_wr row item" to={{name : 'dashboard'}}>
                          <span class="base_info medium bold">{gettext("Liste De Commandes")}</span>
                      </router-link>
                  </li>
              </ul> */}
            </li>
            <li>
              <router-link class="base_wr row item has_submenu" to={{ name: "group.groups" }}>
                <img src="/public/img/sidemenu/commandess.png" alt="" />
                <span class="base_info medium bold">{gettext("Manage Groups")}</span>
                {/* <i class="icon angle right"></i> */}
              </router-link>

              {/* <ul class="base_list submenu">
                  <li>
                      <router-link class="base_wr row item" to={{name : 'dashboard'}}>
                          <span class="base_info medium bold">{gettext("Liste De Commandes")}</span>
                      </router-link>
                  </li>
              </ul> */}
            </li>
            {/* <li>
              <router-link class="base_wr row item has_submenu" to={{name : 'order.orders'}}>
                  <img src="/public/img/sidemenu/commandess.png" alt=""/>
                  <span class="base_info medium bold">{gettext("Orders")}</span>
              </router-link>
            </li> */}


            {/* <li>
              <router-link class="base_wr row item has_submenu" to={{ name: "order.orders" }}>
                <img src="/public/img/sidemenu/commandess.png" alt="" />
                <span class="base_info medium bold">{gettext("Orders")}</span>
                <i class="icon angle right"></i>
              </router-link>
              <ul class="base_list submenu">
                <li>
                  <router-link class="base_wr row item" to={{ name: "order.orders" }}>
                    <span class="base_info medium bold">{gettext("Orders")}</span>
                  </router-link>
                </li>
              </ul>
            </li>
              <router-link class="base_wr row item has_submenu" to={{ name: "mockup.mockup_user_documents" }}>
                <img src="/public/img/sidemenu/commandess.png" alt="" />
                <span class="base_info medium bold">{gettext("Mockup")}</span>
                <i class="icon angle right"></i>
              </router-link>
              <ul class="base_list submenu">
                <li>
                  <router-link class="base_wr row item" to={{ name: "artywiz_user.users" }}>
                    <span class="base_info medium bold">{gettext("Mockup User Documents")}</span>
                  </router-link>
                </li>
              </ul>
            <li>
              <router-link class="base_wr row item has_submenu" to={{ name: "artywiz_user.users" }}>
                <img src="/public/img/sidemenu/commandess.png" alt="" />
                <span class="base_info medium bold">{gettext("Manage Users")}</span>
                <i class="icon angle right"></i>
              </router-link>
              <ul class="base_list submenu">
                <li>
                  <router-link class="base_wr row item" to={{ name: "artywiz_user.users" }}>
                    <span class="base_info medium bold">{gettext("Users")}</span>
                  </router-link>
                </li>
                <li>
                  <router-link class="base_wr row item" to={{ name: "category.categories" }}>
                    <span class="base_info medium bold">{gettext("Categories")}</span>
                  </router-link>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </div>
    </div>);
  }
};