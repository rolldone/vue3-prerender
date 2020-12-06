import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted } from 'vue';

export const StickyMessageClass = BaseVue.extend({
  data : function(){
    return reactive({
      style : {
        body : {
          "position" : 'relative',
          'width' : '100%',
          'min-height' : '55px',
          'height' : 'auto',
          "color" : 'white',
          'z-index' : "100",
          "display" : 'flex',
          "flex-direction" : 'row',
          "justify-content" : "center",
          "align-items": "center",
          "top" : 0
        },
        message : {
          "position" : 'absolute',
          'top' : 0,
          'left' : 0,
          'right' : "100px",
          'bottom' : 0,
          "display" : 'flex',
          "flex-direction" : 'row',
          "justify-content" : "flex-start",
          "padding-left" : '12px',
          "align-items": "center",
        }
      }
    });
  },
  async construct(props,context){
    let self = this;
    let body = self.get('style.body');
    await self.setUpdate('style',{
      body : {
        ...body,
        "background-color" : (function(){
          switch(props.type){
            case 'error':
              return '#e74c3c';
            case 'warning':
              return 'yellow';
          }
        })()
      }
    });
  },

});

export default {
  props : {
    handleClick : {
      type : Function,
      default : function(){}
    },
    message : {
      type : String,
      default : ''
    },
    title : {
      type : String,
      default : ''
    },
    message_ok : {
      type : String,
      default : ''
    },
    type : {
      type : String,
      default : 'error'
    }
  },
  setup(props,context){
    let stickyMessageClass = StickyMessageClass.create(props,context);
    return stickyMessageClass.setup();
  },
  render(h){
    let { style } = this.get();
    let { message, title, message_ok, handleClick } = this.props;
    return (<div style={style.body}>
      <div style={style.message}>
        <h4 style="margin:0;margin-right:20px;">{title} - {message}</h4>   &nbsp;
        {message_ok != ''?<button class="ui button green" onClick={handleClick}>{message_ok}</button>:null}
      </div> 
    </div>);
  }
};