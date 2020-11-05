import BaseVue from "../../base/BaseVue";

export default BaseVue.extend({
  aku : function(){
    return 'dia';
  },
  setInitDOMSelection: function(action, props) {
    let context = this.context;
    let self = this;
    switch (action) {
      case self.getMapDOMSelection("INPUT_TEXT_VALIDATION"):
        window.staticType(props, [Object]);
        window.staticType(props.form_attribute_name, [null, Object]);
        window.staticType(props.form_data, [null, Object]);
        window.staticType(props.form_rules, [null, Object]);
        window.staticType(props.element_target, [null, String]);
        window.staticType(props.id, [String]);
        self.inputTextValidation(
          "#" + props.id,
          {
            form_data: props.form_data || context.get('form_data'),
            form_rules: props.form_rules || context.get('form_rules'),
            form_attribute_name: props.form_attribute_name || context('form_attribute_name'),
            element_target: props.element_target || "input[type=email],input[type=text],input[type=number]",
          },
          function(res, e) {
            console.log('res',res);
            let parent = $(e.target)
              .parents(".field")
              .first();
            switch (res.status) {
              case "error":
                return parent.find("span.error").text(res.message);
              case "valid":
              case "complete":
                return parent.find("span.error").text("");
            }
          }
        );
        break;
      case self.getMapDOMSelection("INPUT_PASSWORD_VALIDATION"):
        window.staticType(props, [Object]);
        window.staticType(props.form_attribute_name, [null, Object]);
        window.staticType(props.form_data, [null, Object]);
        window.staticType(props.form_rules, [null, Object]);
        window.staticType(props.id, [String]);
        context.inputTextValidation(
          "#" + props.id,
          {
            form_data: props.form_data || context.get('form_data'),
            form_rules: props.form_rules || context.get('form_rules'),
            form_attribute_name: props.form_attribute_name || context.get('form_attribute_name'),
            element_target: "input[type=password]",
          },
          function(res, e) {
            console.log('INPUT_PASSWORD_VALIDATION',res);
            let parent = $(e.target)
              .parents(".field")
              .first();
            switch (res.status) {
              case "error":
                return parent.find("span.error").text(res.message);
              case "valid":
              case "complete":
                return parent.find("span.error").text("");
            }
          }
        );
        break;
      case self.getMapDOMSelection("SUBMIT_VALIDATION"):
        window.staticType(props, [Object]);
        window.staticType(props.form_attribute_name, [null, Object]);
        window.staticType(props.form_data, [null, Object]);
        window.staticType(props.form_rules, [null, Object]);
        window.staticType(props.id, [String]);
        window.staticType(props.callback, [null, Function]);
        context.submitValidation(
          {
            form_data: props.form_data || context.get('form_data'),
            form_rules: props.form_rules || context.get('form_rules'),
            form_attribute_name: props.form_attribute_name || context.get('form_attribute_name'),
          },
          function(res) {
            console.log("res", res);
            let parent = $("#" + props.id);
            window.eachObject(res.error, function(i, key, val) {
              switch (key) {
                default:
                  var message = parent
                    .find(`input[name=${key}]`)
                    .parents(".field")
                    .first();
                  message.find("span.error").text(val);
                  break;
              }
            });
            window.eachObject(res.form_data, function(i, key, vak) {
              switch (key) {
                default:
                  var message = parent
                    .find(`input[name=${key}]`)
                    .parents(".field")
                    .first();
                  message.find("span.error").text("");
                  break;
              }
            });
            if (res.status == "complete") {
              if (props.callback == null) return;
              props.callback();
            }
          }
        );
        break;
    }
  },
  render : function(props){
    return (<div><h1>{props.test}</h1></div>);
  }
});