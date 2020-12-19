
import { setNavigableClassName } from './ArrowKeyNav';
(function(global){

  if(window.sessionStorage.getItem('smart_state_history') == null){
    window.sessionStorage.setItem('smart_state_history','{}');
  }

  var state = JSON.parse(window.sessionStorage.getItem('smart_state_history'));
  
  var stateHistory = {
    state : state,
    takeArrayFromFirstIndex: function(array, takeCount) {
      return array.slice(0, takeCount);
    },
    save : function(whatstate){
      var n = window.history.state._index;
      if(this.state[whatstate] == null){
        this.state[whatstate] = [];
      }
      if(this.state[whatstate].length > 0){
        let indexFound = null;
        var takeArray=0;
        for(var a=0;a<this.state[whatstate].length;a++){
          takeArray+=1;
          if(this.state[whatstate][a] == n){
            indexFound = a;
            break;
          }
        }
        if(indexFound != null){
          this.state[whatstate] = this.takeArrayFromFirstIndex(this.state[whatstate],takeArray);
        }else{
          this.state[whatstate].push(n);
        }
        window.sessionStorage.setItem('smart_state_history',JSON.stringify(this.state));
      }else{
       //  alert(whatstate+'- else = '+n);
        this.state[whatstate].push(n);
      }
      console.log('total state',this.state);
      console.log('state',whatstate,this.state[whatstate]);
    },
    back : function(whatstate){
      let n = window.history.state._index;
      let stateN = 0;
      for(var a=this.state[whatstate].length-1;a>=0;a--){
        if(n > this.state[whatstate][a]){
          stateN = this.state[whatstate][a];
          break;
        }
      }
      let total = (n - stateN)*-1;
      if(total == 1){
        total = -1;
      }
      window.history.go(total);
      var indexFound = null;
      var takeArray=0;
      for(var a=0;a<this.state[whatstate].length;a++){
        takeArray+=1;
        if(this.state[whatstate][a] == n){
          indexFound = a;
          break;
        }
      }
      if(indexFound != null){
        this.state[whatstate] = this.takeArrayFromFirstIndex(this.state[whatstate],takeArray);
      }else{
        this.state[whatstate].slice(this.state[whatstate].length-1, 1);
      }
      window.sessionStorage.setItem('smart_state_history',JSON.stringify(this.state));
    }
  };
    
  if (typeof define === 'function' && define.amd) {
    /* AMD support */
    define(function(){
      return stateHistory;
    });
  } else if (typeof module === 'object' && module.exports) {
    /* CJS support */
    module.exports = stateHistory;
  } else {
    /** @namespace
     * staticType is the root namespace for all staticType.js functionality.
     */
    global.SmartBackHistory = stateHistory;
  }
})(window);