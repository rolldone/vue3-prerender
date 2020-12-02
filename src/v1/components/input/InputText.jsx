import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted, onBeforeMount, watch } from 'vue';

export const InputTextClass = BaseVue.extend({
  data : function(){
    return reactive({
      form_data: {},
    });
  },
  construct : function(props,context){
    let self = this;
    onMounted(function(){
      self.setUpdate("form_data", {
        value: self.$props.value,
      });  
    });
    watch(()=>props.value,function(val){
      self.setUpdate("form_data", {
        value: val,
      });
    });
    watch(()=>self.get('form_data').value,function(val){
      if (self.$props.input != null) {
        self.$props.input(val);
      }
      if (self.$props.inputObject != null) {
        self.$props.inputObject({
          [self.$props.name]: val,
        });
      }
    });
  },
  render(h){
    let { label, form_title, placeholder, disabled, readonly, name, type, id } = this.$props;
    let { form_data } = this.get();
    if (type == "hidden") {
      return (
        <>
          <div class="field">
            <input type={type} id={id} placeholder={placeholder} name={name} disabled={disabled} v-model={form_data.value} readonly={readonly} />
            <div class="base_wr row">
              <span class="base_info error bold small"></span>
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        {form_title != null ? <h3 class="ui dividing header">{form_title}</h3> : <div class="ui divider"></div>}
        <div class="field">
          <label for="">{label}</label>
          <div class="ui left icon input">
            <i class="angle right icon"></i>
            <input type={type} id={id} placeholder={placeholder} name={name} disabled={disabled} v-model={form_data.value} readonly={readonly} />
          </div>
          <div class="base_wr row">
            <span class="base_info error bold small"></span>
          </div>
        </div>
      </>
    );
  },
});

export default {
  props: {
    id:[null,String],
    input: [null, Function],
    inputObject: [null, Function],
    label: [String],
    form_title: [String],
    placeholder: [String],
    value: [String],
    disabled: {
      type: [null, Boolean],
      default: false,
    },
    readonly: {
      type: [null, Boolean],
      default: false,
    },
    name: [String],
    type: {
      type: [String],
      default : "text"
    },
  },
  setup(context,props){ return (InputTextClass.create(context,props)).setup();},
  render(h){ return this.render(h,{}); }
};