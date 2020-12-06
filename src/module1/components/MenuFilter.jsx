import BaseVue from "../../base/BaseVue";
import { reactive, watch } from 'vue';

export const MenuFilterObject = BaseVue.extend({
  data : function(){
    return reactive({
      form_data : {}
    });
  },
  construct : function(context,props){
    this._super(context,props);
    let self = this;
    
    let parseUrl = self.jsonParseUrl();
    self.set('form_data',parseUrl.query);

    watch(()=>self.get('form_data'),function(val){
      if (self.pendingFormData != null) {
        self.pendingFormData.cancel();
      }
      self.pendingFormData = _.debounce(function(props) {
        if(Object.keys(oldVal).length != 0){
          self.get('onChangeListener')("ALL", props);
        }
      }, 1000);
      self.pendingFormData(val);
    });
  },
  handleClick: function(action, props, e) {
    let self = this;
    console.log('this',this);
    self.get('onChangeListener')(action, props);
  },
  setOnChangeListener: function(func) {
    let self = this;
    window.staticType(func, [Function]);
    self.set('onChangeListener',func);
  },
});

export default {
  setOnChangeListener : 'aaaaaaaaaaaaaaaaaa',
  setup(context,props){ 
    let menuFilter = MenuFilterObject.create(context,props);
    return menuFilter.join();
  },
  render(h){
    let { form_data } = this.get();
    return (
      <>
        <div class="ui menu" id="filter-menu">
          <div class="item nopadding">
            <a class="base_wr row link" onClick={this.handleClick.bind(this, "ADD")}>
              <i class="ion ion-md-add"></i>
            </a>
            {/* 
              <a href="#" class="base_wr row link" on-click="@this.handleClick('DELETE',{},@event)">
                <i class="ion ion-md-close"></i>
              </a>
            */}
          </div>
          <div class="right item">
            <div class="mobile only">
              <a href="#" class="base_wr row link" id="show-more">
                <i class="ion ion-md-more"></i>
              </a>
              <div class="filter-menus mobile only">
                <div class="header base_wr">
                  <i class="ion ion-md-close" id="remove_open"></i>
                  <h3>Filter</h3>
                </div>
                <form action="">
                  <div class="ui action input" id="search">
                    <input type="text" placeholder={gettext("rechercher ")} action="SEARCH" />
                    <div class="ui button">Ok</div>
                  </div>
                  <ul class="list-menus">
                    <li class="has_submenu">
                      <a href="#">
                        <span>Menu 1</span>
                        <i class="ion ion-ios-arrow-down"></i>
                      </a>
                      <ul class="submenu">
                        <li>
                          <div class="ui checkbox">
                            <input type="checkbox" name="submenu_1" id="submenu_1" />
                            <label for="submenu_1">Submenu 1</label>
                          </div>
                        </li>
                        <li>
                          <div class="ui checkbox">
                            <input type="checkbox" name="submenu_2" id="submenu_2" />
                            <label for="submenu_2">Submenu 2</label>
                          </div>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">
                        <span>Menu 2</span>
                        <i class="ion ion-ios-arrow-down"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span>Menu 3</span>
                        <i class="ion ion-ios-arrow-down"></i>
                      </a>
                    </li>
                  </ul>
                  <div class="footer base_wr">
                    <button type="submit" class="btn btn-primary">
                      Filter
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div class="desktop only"></div>
            <div class="ui action input mobile hidden" id="search">
              <input type="text" placeholder={gettext("rechercher ")} v-model={form_data.search} action="SEARCH" />
              <div class="ui button">Ok</div>
            </div>
          </div>
        </div>

        <div class="ui fluid popup bottom left transition hidden">
          <div class="ui four column relaxed equal height divided grid">
            <div class="column">
              <h4 class="ui header">Fabrics</h4>
              <div class="ui link list">
                <a class="item">Cashmere</a>
                <a class="item">Linen</a>
                <a class="item">Cotton</a>
                <a class="item">Viscose</a>
              </div>
            </div>
            <div class="column">
              <h4 class="ui header">Size</h4>
              <div class="ui link list">
                <a class="item">Small</a>
                <a class="item">Medium</a>
                <a class="item">Large</a>
                <a class="item">Plus Sizes</a>
              </div>
            </div>
            <div class="column">
              <h4 class="ui header">Colored</h4>
              <div class="ui link list">
                <a class="item">Neutrals</a>
                <a class="item">Brights</a>
                <a class="item">Pastels</a>
              </div>
            </div>
            <div class="column">
              <h4 class="ui header">Types</h4>
              <div class="ui link list">
                <a class="item">Knitwear</a>
                <a class="item">Outerwear</a>
                <a class="item">Pants</a>
                <a class="item">Shoes</a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};