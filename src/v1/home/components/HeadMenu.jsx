import HeadMenu, { BaseHeadMenu } from "../../components/HeadMenu";
import HeadMenuSearch from "./HeadMenuSearch";

export const HomeHeadMenu = BaseHeadMenu.extend({});
export default {
  setup(props,context){
    let homeHeadMenu = (HomeHeadMenu.create(props,context)).setup();
    return homeHeadMenu;
  }, 
  render(h){
    let { title, user_data, app_data, select_business_text, business_datas } = this.get();
    let { handleClick } = this;
    return (<>
      <div class="header-menu ui massive menu table tablet computer large screen widescreen only" style="margin-bottom:0; margin:0;">
        <div class="item">
          <img src="/public/img/icon_head_menu_white.svg" class="ui icon_head_menu" alt="" on-click="@this.handleClick('OPEN_SIDE_MENU',{},@event)" />
        </div>
        <div class="item">
          <h5 class="base_info">{gettext("Commandez autour de chez vous")}</h5>
        </div>
        <HeadMenuSearch></HeadMenuSearch>
        <div class="menus-header"></div>
        <div class="right item">
          <div class="item">
            <div class="box_icon circle">
              <img src="/public/img/mail_icon.svg" class="icon_head_menu" alt="" on-click="@this.handleClick('OPEN_SIDE_MENU',{},@event)" />
            </div>
            <h5 class="base_info" style="margin:0;margin-left:12px;">{gettext("Commandez autour de chez vous")}</h5>
          </div>
          <div class="ui fluid popup bottom right transition hidden" style="top: auto; left: auto; bottom: 69px; right: 7px;">
            <div class="ui four column relaxed divided grid">
              <div class="column">
                <div class="ui link list">
                  <router-link class="item" to={{ name: "user.current_user" }}>
                    {gettext("My Profile")}
                  </router-link>
                  <a class="item" href="/auth/logout">
                    {gettext("Se déconnecter")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui massive menu  header-menu mobile only" style="margin-bottom:0;">
        <div class="item">
          <img src="/public/img/icon_head_menu.png" class="icon_head_menu" alt="" on-click="@this.handleClick('OPEN_SIDE_MENU',{},@event)" />
          <span class="base_info">{gettext("Commandez autour de chez vous")}</span>
        </div>
        <div class="menus-header"></div>
        <div class="main-title mobile hidden">
          <h5 class="base_info page_name">{gettext("Artywiz - Admin")}</h5>
        </div>
        <div class="right item">
          <div class="item">
            <div class="box_icon circle">
              <img src="/public/img/mail_icon.svg" class="icon_head_menu" alt="" on-click="@this.handleClick('OPEN_SIDE_MENU',{},@event)" />
            </div>
          </div>
          <div class="ui fluid popup bottom right transition hidden" style="top: auto; left: auto; bottom: 69px; right: 7px;">
            <div class="ui four column relaxed divided grid">
              <div class="column">
                <div class="ui link list">
                  <router-link class="item" to={{ name: "user.current_user" }}>
                    {gettext("My Profile")}
                  </router-link>
                  <a class="item" href="/auth/logout">
                    {gettext("Se déconnecter")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>);
  }
};