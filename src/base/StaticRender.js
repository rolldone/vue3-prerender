import mustache from 'Mustache';
import staticType from './StaticType';
import Ractive from 'ractive';
import UberProto from 'uberproto';
import { regex } from '../../assets/validatorjs/lang/en';

(function(global){
  var ractives = {};
  /* Static Type check allowed type data */
  const StaticRender = UberProto.extend({
    ractives : ractives,
    init : function(templateString,view){
      this.view = view;
      if(view.model == null) return;
      this.template = templateString;
      this.value = view.model.get('value');
      this.frontScript = view.model.get('frontScript') || function(){};
      console.log('pppppppppppppp',this.value);
    },
    set : function(whatKey,value){
      this.view.model.set('value',{
        ...this.value,
        [whatKey] : value
      });
      // this.value = this.view.model.get('value');
      // this.view.render();
      console.log('this.ractive',this.ractive);
      this.getRactives().set(whatKey,value);
    },
    toHTML : function(){
      return $(this.view.el).html();
      return mustache.render(this.template,{
        ...this.value
      });
    },
    render : function(){
      let self = this;
      if(self.template == null) return self.view;
      setTimeout(function(){
        console.log('this.view.el.innerHTML',self.view.el.innerHTML);
        let idCOmponent = self.view.el.id;
        $(self.view.el).find('[ractive=true]').each(function(i,el){
          console.log('el-ractive',el);
          let ttTemp = $(el).html();
          self.ractives[$(el).attr('id')] = new Ractive({
            template : ttTemp,
            target : $(el),
            data : {
              ...self.value
            },
            oncomplete : function(){
              var oldScript = self.view.el.querySelector('script[data-id='+self.view.el.id+']');
              if(oldScript != null){
                return;
              }
              var script = document.createElement("script");
              script.type = 'text/javascript';
              script.async = true;
              script.setAttribute('data-id',self.view.el.id);
              var theScript = self.frontScript;
              script.innerHTML = `
                var ${idCOmponent} = ${theScript}
                ${idCOmponent}();
              `;
              $(self.view.el).append(script);
            }
          });
        });
      },1000);
    },
    getRactives : function(){
      let self = this;
      return {
        set : function(whatKey,value){
          $(self.view.el).find('[ractive=true]').each(function(i,el){
            self.ractives[$(el).attr('id')].set(whatKey,value);
          });
        }
      };
    }
  });
  if (typeof define === 'function' && define.amd) {
    /* AMD support */
    define(function(){
      return StaticRender;
    });
  } else if (typeof module === 'object' && module.exports) {
    /* CJS support */
    module.exports = StaticRender;
  } else {
    /** @namespace
     * staticType is the root namespace for all staticType.js functionality.
     */
    global.StaticRender = StaticRender;
  }
})(window);
