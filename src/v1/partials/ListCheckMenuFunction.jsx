import BaseVue from "../../base/BaseVue";
import { ref } from 'vue';

export default BaseVue.extend({
  construct : function(props,context){
    let self = this;
    window.staticType(props,[Object]);
    window.staticType(props.className,[String]);
    self.input_checkbox = ref(null);
    self.className = props.className;
    self.ids = {};
  },
  setInitDOMSelection : function(action,props,callback){
    let self = this;
    let name = self.name;
    switch(action){
      case self.getMapDOMSelection('LOAD'):
        window.staticType(callback,[Function]);
        self.list_check_box = $('.'+this.className);
        self.list_check_box.off('change');
        self.list_check_box.on('change',function(e){
          let id = $(e.target).attr('data-value');
          if(self.ids[id]!= null){
            delete self.ids[id];
          }else{
            self.ids[id] = id;
          }
          callback('CLICKED',self.ids);
        });
        self.list_check_box.each(function(i,e){
          $(e).prop('checked',self.ids[$(e).attr('data-value')]==null?false:true);
        });
        break;
      case self.getMapDOMSelection('CLEAR'):
        if(self.list_check_box == null) return;
        self.list_check_box.prop('checked',false);
        break;
    }
  },
  render(h,props){
    let { value } = props; 
    return (
      <input type="checkbox" class={this.className} tabindex="0" data-value={value} />
    );
  }
});