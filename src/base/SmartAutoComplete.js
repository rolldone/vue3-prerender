import { setNavigableClassName } from './ArrowKeyNav';
let SmartAutoCompleteIndex = 0;
let SmartAutoCompleteStore = {};
let isOwnArea = null;
let currentSelectEl = null;
(function(global){
  /* Static Type check allowed type data */
  document.body.onmouseup = function(event){
    if(isOwnArea == null) return;
    if(isOwnArea.isSameNode(event.target.closest('.'+isOwnArea.className.replaceAll(' ','.'))) == false){
      currentSelectEl.style.display = "none";
    }
  };
  document.body.onkeyup = function(event){
    if(isOwnArea == null) return;
    if(isOwnArea.isSameNode(event.target.closest('.'+isOwnArea.className.replaceAll(' ','.'))) == false){
      currentSelectEl.style.display = "none";
    }
  };
  let smartAutoComplete = function(props){
    StaticType(props,[Object]);
    StaticType(props.inputSelector,[HTMLInputElement,String]);
    StaticType(props.listSelector,[String]);
    StaticType(props.itemSelector,[String]);
    StaticType(props.parentSelector,[null,String]);
    let currentProps = {
      indetity : '.'+props.inputSelector.className.replaceAll(' ','.')+','+props.itemSelector,
      areaSelector : '.'+props.inputSelector.className.replaceAll(' ','.')+','+props.listSelector,
      inputSelector : props.inputSelector,
      listSelector : props.listSelector,
      itemSelector : props.itemSelector,
      parentSelector : props.parentSelector,
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
        let el = this.parentSelector == null ?dom.nextSibling : dom.closest(self.parentSelector);
        if(this.parentSelector != null){
          el = el.querySelector(this.listSelector);
          if(el != null){
            self.currentSelectEl = el;
            if(this.startOnTyping == false || typeof this.startOnTyping == 'function'  ){
              el.style.display = null;
              if(typeof this.startOnTyping == 'function'){
                this.startOnTyping(el);
              }
            }
          }
          return;
        }
        let i = 1;
        while (el) {
          let foundClassName = el.className.match(this.listSelector.replaceAll('.',''))||[];
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
    currentProps.parent = currentProps.parentSelector == null ? domClassItem.parentNode : domClassItem.closest(currentProps.parentSelector);
    console.log('currentProps',currentProps.parent);
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

    return {
      hide : function(){
        currentSelectEl.style.display = "none";
      }
    };
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
