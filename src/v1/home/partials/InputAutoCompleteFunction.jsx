import BaseComposition from "../../../base/BaseComposition";
const autoComplete = require("@tarekraafat/autocomplete.js/dist/js/autoComplete");

export default BaseComposition.extend({
  setInitDOMSelection : function(action,props,callback){
    let self = this;
    let context = this.context;
    switch(action){
      case self.getMapDOMSelection('LOAD'):
        window.staticType(props,[Object]);
        window.staticType(props.placeholder,[null,String]);
        window.staticType(props.selector,[String]);
        window.staticType(props.onHttpRequest,[Function]);
        window.staticType(props.onResult,[Function]);
        window.staticType(props.key,[Array]);
        const autoCompletejs = new autoComplete({
          data: {
            src: props.onHttpRequest,
            key: props.key,
            cache: false
          },
          sort: (a, b) => {
            if (a.match < b.match) return -1;
            if (a.match > b.match) return 1;
            return 0;
          },
          placeHolder: props.placeholder||'Search Something',
          selector: props.selector,
          threshold: 0,
          debounce: 0,
          searchEngine: function(query, record){
            let tt = query.split(" ");
            let found = null;
            for(var a=0;a<tt.length;a++){
              if(record.toLowerCase().includes(tt[a])){
                found = record;
                break;
              }
            }
            if(found != null){
              return found;
            }
          },
          highlight: true,
          maxResults: 5,
          resultsList: {
            render: true,
            container: source => {
              source.setAttribute("id", "autoComplete_list");
              source.setAttribute("class", "autoComplete_list");
            },
            destination: document.querySelector(props.selector),
            position: "afterend",
            element: "ul"
          },
          resultItem: {
            content: (data, source) => {
              source.innerHTML = data.match;
            },
            element: "li"
          },
          noResults: () => {
            const result = document.createElement("li");
            result.setAttribute("class", "no_result");
            result.setAttribute("tabindex", "1");
            result.innerHTML = "No Results";
            document.querySelector("#autoComplete_list").appendChild(result);
          },
          onSelection: props.onResult
        });
        break;
    }
  }
});