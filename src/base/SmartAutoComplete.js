
import { setNavigableClassName } from './ArrowKeyNav';
let SmartAutoCompleteIndex = 0;
let SmartAutoCompleteStore = {};
let isOwnArea = null;
let currentSelectEl = null;
(function(global){
  /* Static Type check allowed type data */
  document.body.onmouseup = function(event){
    if(isOwnArea.isSameNode(event.target.closest('.'+isOwnArea.className.replaceAll(' ','.'))) == false){
      currentSelectEl.style.display = "none";
    }
  };
  document.body.onkeyup = function(event){
    if(isOwnArea.isSameNode(event.target.closest('.'+isOwnArea.className.replaceAll(' ','.'))) == false){
      currentSelectEl.style.display = "none";
    }
  };
  let smartAutoComplete = function(props){
    StaticType(props,[Object]);
    StaticType(props.inputSelector,[Object,String]);
    StaticType(props.listSelector,[String]);
    StaticType(props.itemSelector,[String]);
    let currentProps = {
      indetity : '.'+props.inputSelector.className.replaceAll(' ','.')+','+props.itemSelector,
      areaSelector : '.'+props.inputSelector.className.replaceAll(' ','.')+','+props.listSelector,
      inputSelector : props.inputSelector,
      listSelector : props.listSelector,
      itemSelector : props.itemSelector,
      currentSelectEl : null,
      focusOutSearchInput : function(event){
        let self = this;
        currentSelectEl = self.currentSelectEl;
        isOwnArea = self.parent;
      },
      currentSelectEl : null,
      startOnTyping : props.startOnTyping || false,
      focusInSearchInput : function(event){
        setNavigableClassName(this.indetity);
        let self = this;
        const dom = event.target;
        const el = dom.nextSibling;
        let i = 1;
        while (el) {
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
    let inputQuerySelector = typeof currentProps.inputSelector == 'object' ? currentProps.inputSelector : document.querySelectorAll(currentProps.inputSelector);
    let nextEl = null;
    let domClassItem = null;
    domClassItem = inputQuerySelector;
    currentProps.parent = domClassItem.parentNode;
    domClassItem.setAttribute('smart-auto-complete-index',SmartAutoCompleteIndex);
    domClassItem.addEventListener('focusin',currentProps.focusInSearchInput.bind(currentProps));
    domClassItem.addEventListener('focusout',currentProps.focusOutSearchInput.bind(currentProps));
    SmartAutoCompleteStore[SmartAutoCompleteIndex] = domClassItem;
    nextEl = domClassItem.nextSibling;
    while(nextEl){
      let foundClassName = nextEl.className.match(currentProps.listSelector.replace('.',''))||[];
      if(foundClassName.length > 0){
        nextEl.className += (' rel_'+currentProps.inputSelector.className);
        nextEl.style.display = 'none';
        nextEl.addEventListener('focusin',currentProps.focusInSearchInput.bind(currentProps));
        nextEl.addEventListener('focusout',currentProps.focusOutSearchInput.bind(currentProps));
        break;
      }else{}
      nextEl = nextEl.nextSibling;
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