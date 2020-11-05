import BaseVue from "BaseVue";
import { reactive, onMounted } from 'vue';

const InputCheckboxClass = BaseVue.extend({
  data: reactive({
    custom_name_text: "",
    random_id:
      "checkbox_" +
      Math.random()
        .toString(36)
        .substring(7),
  }),
  start: function() {
    let self = this;
    onMounted(function(){
      self.current_checkbox = $("#" + (self.$props.id || self.get("random_id"))).checkbox({
        onChange: function() {
          self.onChangeListener(
            {
              name: self.$props.name,
              value: $(this).is(":checked"),
            },
            $(this)
          );
        },
      });
    });
  },
  setOnChangeListener: function(funct) {
    let self = this;
    self.onChangeListener = funct;
    self.start();
  },
  setChecked: function(val) {
    let self = this;
    if (val == true) {
      return self.current_checkbox.checkbox("set checked");
    } else {
      self.current_checkbox.checkbox("set unchecked");
    }
  },
  render(h) {
    let { form_title, id, label, _class } = this.$props;
    let { random_id } = this.get();
    return (
      <>
        {form_title != null ? <h3 class="ui dividing header">{form_title}</h3> : <div class="ui divider"></div>}
        <div class="field">
          <div class={"ui checkbox " + _class} id={id || random_id}>
            <input type="checkbox" name={name} tabindex="0" class="hidden" />
            <label>{label}</label>
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
    label: [String],
    id: [String],
    name: [String],
    _class: [String],
  },
  setup : (props,context)=>(InputCheckboxClass.create(props,context)).setup(),
  render(h){ return this.render(h,{})}
}
