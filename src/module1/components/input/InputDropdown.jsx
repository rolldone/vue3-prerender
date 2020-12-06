import BaseVue from "../../../base/BaseVue";
import { onMounted, onBeforeMount, reactive, ref, watch } from 'vue';

export const InputDropdownClass = BaseVue.extend({
  data : function(){
    return reactive({
      _datas: [],
      default_text: null,
      saved_text: null,
      on_change_listener: null,
      random_id:
        "dropdown_" +
        Math.random()
          .toString(36)
          .substring(7),
    });
  },
  construct : function(props,context){
    let self = this;
    onBeforeMount(function(){
      if (self.$props.select_value != null) {
        self.setValue(self.$props.select_value);
      }
      if (self.$props.inputChangeListener != null) {
        setTimeout(() => {
          self.setOnChangeListener(self.$props.inputChangeListener, null);
        }, 1000);
      }
    });
    onMounted(async function(){
      await self.parseDatas(self.$props.datas);
    });
    watch(()=>self.props.datas, function(newValue, oldVal) {
      self.parseDatas(newValue);
    });
    watch(()=>self.props.select_value,function(newValue) {
      self.setValue(newValue);
    });
  },
  parseDatas: async function(newValue) {
    let self = this;
    var tempDatas = Object.assign([], newValue);
    var dropdown_text = self.$props.dropdown_text;
    var other_value_key = self.$props.other_value_key;
    for (var a = 0; a < tempDatas.length; a++) {
      tempDatas[a].label = tempDatas[a][dropdown_text];
      tempDatas[a].key = tempDatas[a][other_value_key];
      if (tempDatas[a].id == null) {
        tempDatas[a].id = tempDatas[a][other_value_key];
      }
    }
    await self.set("_datas", tempDatas);
  },
  loadDropdown: function() {
    let self = this;
    if (self.onChangeListener == null) {
      return;
    }
    //if(self.inputDropdown == null){
    let dropdownCOnfig = {
      selectOnKeydown: false,
      forceSelection: false,
      onChange: function(value, text, $selected) {
        let hidden = $($selected).parent();
        self.set("saved_text", $($selected).text());
        hidden = hidden.siblings("input[type=hidden]");
        let name = hidden.attr("name");
        let dataKey = $($selected).attr("data-key");
        if (value == "") {
          self.onChangeListener(
            {
              value: null,
              key: null,
              name: name,
            },
            $selected
          );
          return;
        }
        // console.log('value',value);
        // console.log('text',text);
        // console.log('key',$($selected).attr('data-key'));
        if (self.onChangeListener != null) {
          self.onChangeListener(
            {
              value: value,
              key: dataKey,
              name: name,
              text: text,
            },
            $selected
          );
        }
      },
    };
    /* Jika menggunakan http request async */
    if (self.apiSettings != null) {
      dropdownCOnfig.apiSettings = self.apiSettings;
    }
    console.log("inputdropdwon", self.apiSettings);
    self.inputDropdown = $("#" + (self.props.set_id || self.get("random_id"))).dropdown(dropdownCOnfig);
    //}
  },
  setDefaultText: function(text) {
    let self = this;
    self.set("default_text", text);
  },
  setValue: function(value) {
    let self = this;
    console.log("inputDropdown", self.inputDropdown);
    if (self.onChangeListener == null) alert("Need defined onChangeListener!");
    if (value == null) return self.inputDropdown.dropdown("clear");
    self.inputDropdown.dropdown("set selected", value + "");
  },
  setEnable: function(isEnable) {
    let self = this;
    self.inputDropdown.addClass(isEnable == true ? "" : "disabled");
  },
  setOnChangeListener: function(theFunction, apiSettingFunc) {
    window.staticType(apiSettingFunc, [null, Function]);
    window.staticType(theFunction, [Function]);
    let self = this;
    // self.set('on_change_listener',theFunction);
    self.onChangeListener = theFunction;
    if (apiSettingFunc != null) {
      self.apiSettings = {
        responseAsync: apiSettingFunc,
      };
    }
    self.loadDropdown();
  },
  
});

export default {
  props: {
    select_value: [null, String],
    datas: Array,
    dropdown_text: [null, String],
    other_value_key: [null, String],
    set_id: [null, String],
    name: [null, String],
    form_title: [null, String],
    label: [null, String],
    no_divider: {
      type: Boolean,
      default: false,
    },
    set_class: [null, String],
    inputChangeListener: [null, Function],
  },
  setup(props,context){
    let inputDropdown = (InputDropdownClass.create(props,context)).setup();
    return inputDropdown;
  },
  render(h){
    let { set_id, name, form_title, label, set_class, no_divider } = this.$props;
    let { random_id, _datas, saved_text, default_text } = this.get();
    return (
      <>
        {form_title != null ? <h3 class="ui dividing header">{form_title}</h3> : no_divider == true ? null : <div class="ui divider"></div>}
        <div class="field">
          <label for="">{label}</label>
          <div class="ui left icon input">
            {/* <i class="user icon"></i> */}
            <div class={"ui selection dropdown " + set_class} id={set_id || random_id}>
              <input type="hidden" name={name} />
              <i class="dropdown icon"></i>
              <div class="default text">{saved_text || default_text || "--"}</div>
              <div class="menu">
                {/* <div class="item" data-key="" data-value="" data-symbol="1">
                  {default_text == null ? "--" : default_text}
                </div> */}
                {_datas.map(function(value, index) {
                  return (
                    <div class="item" data-key={value.key} data-value={value.id} data-symbol="1">
                      {value.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div class="base_wr row">
            <span class="base_info error bold small"></span>
          </div>
        </div>
      </>
    );
  }
};