

import { setNavigableClassName } from './ArrowKeyNav';
(function(global){
  /* Static Type check allowed type data */
  let smartAutoComplete = function(props){
    let currentProps = {
      inputSelector : props.inputSelector,
      listSelector : props.listSelector,
      itemSelector : props.itemSelector,
      currentSelectEl : null,
      isOwnArea : false,
      focusOutSearchInput : function(event){
        let self = this;
        this.isOwnArea = false;
        setTimeout(function(){
          if(self.isOwnArea == false){
            self.currentSelectEl.style.display = "none";
          }
        },100);
      },
      currentSelectEl : null,
      startOnTyping : props.startOnTyping || false,
      focusInSearchInput : function(event){
        setNavigableClassName(this.inputSelector+','+this.itemSelector);
        let self = this;
        this.isOwnArea = true;
        // console.log('focusInSearchInput',event.target);
        const dom = event.target;
        const el = dom.nextSibling;
        let i = 1;
        while (el) {
          // console.log(i, '. ', el.nodeName);
          let foundClassName = el.className.match(this.listSelector.replace('.',''))||[];
          if(foundClassName.length > 0){
            self.currentSelectEl = el;
            if(this.startOnTyping == false || typeof this.startOnTyping == 'function'  ){
              el.style.display = null;
              if(typeof this.startOnTyping == 'function'){
                this.startOnTyping(el);
              }
            }
            break;
          }
          el = el.nextSibling;
          i++;
        }
      },
    };
    let inputQuerySelector = document.querySelectorAll(currentProps.inputSelector);
    let domClassItem = null;
    let nextEl = null;
    for(var a=0;a<inputQuerySelector.length;a++){
      domClassItem = inputQuerySelector[a];
      domClassItem.addEventListener('focusin',currentProps.focusInSearchInput.bind(currentProps));
      domClassItem.addEventListener('focusout',currentProps.focusOutSearchInput.bind(currentProps));
      nextEl = domClassItem.nextSibling;
      while(nextEl){
        let foundClassName = nextEl.className.match(currentProps.listSelector.replace('.',''))||[];
        if(foundClassName.length > 0){
          nextEl.className += (' rel_'+currentProps.inputSelector.replace('.',''));
          nextEl.style.display = 'none';
          nextEl.addEventListener('focusin',currentProps.focusInSearchInput.bind(currentProps));
          nextEl.addEventListener('focusout',currentProps.focusOutSearchInput.bind(currentProps));
          break;
        }else{}
        nextEl = nextEl.nextSibling;
      }
    }
  };
  if (typeof define === 'function' && define.amd) {
    /* AMD support */
    define(function(){
      return smartAutoComplete;
    });
  } else if (typeof module === 'object' && module.exports) {
    /* CJS support */
    module.exports = smartAutoComplete;
  } else {
    /** @namespace
     * staticType is the root namespace for all staticType.js functionality.
     */
    global.SmartAutoComplete = smartAutoComplete;
  }
})(window);