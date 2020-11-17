import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted, watch } from 'vue';

export const ListDataClass = BaseVue.extend({
  data : function(){
    return reactive({
      datas : []
    });
  },
  construct : function(props,context){
    let self = this;
    onMounted(function(){
      watch(()=>props.datas,function(val){
        debugger;
      });
    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    switch(action){
    }
  },
  handleClick : function(action,props,e){
    let self = this;

  },
  setDatas : function(props){
    window.staticType(props,[Array]);
    let self = this;
    self.set('datas',props);
  },
  setOnClickListener : function(func){
    let self = this;
    self.onClickListener = func;
  }
});


export default {
  props : {
    datas : {
      type : Array,
      default : []
    }
  },
  setup(props,context){
    let listDataClass = ListDataClass.create(props,context).setup();
    return listDataClass;
  },
  render(h){
    let { datas } = this.get();
    return (<div class="list_data">
      {(()=>{
        let newDats = [];
        for(var a=0;a<datas.length;a++){
          let select_marker = datas[a];
          newDats.push(<div class="ui card">
            <div class="ui grid">
              <div class="image mobile">
                <img style={{"background-image":'url('+select_marker.image+')'}} alt=""/>
              </div>
              <div class="name mobile hidden">
                <h2>{select_marker.product_name}</h2>
                <span>{select_marker.description}</span>
                <span style="">{select_marker.price}€ TTC</span>
              </div>
              <div class="name mobile only">
                <h4>{select_marker.product_name}</h4>
                <span style="">{select_marker.price}€ TTC</span>
              </div>
              <div class="store mobile only">
                <div class="image">
                  <img src={select_marker.store.image} alt=""/>
                </div>
              </div>
              <div class="store mobile hidden tablet hidden computer hidden">
                <div class="image">
                  <img src={select_marker.store.image} alt=""/>
                </div>
                <div class="column mobile tablet computer hidden ">
                  <h5>{select_marker.store.store_name}</h5>
                  <h5>{select_marker.store.address}</h5>
                </div>
              </div>
              <div class="price mobile hidden tablet hidden computer hidden">
                <h3>{select_marker.price}€ TTC</h3>
                <h5>{select_marker.price}€</h5>
              </div>
              <div class="nav mobile hidden">
                <div><img src="/public/img/heart.svg" alt=""/></div>
                <div class="blue"><img src="/public/img/map/call_me.png" alt=""/></div>
              </div>
            </div>
          </div>);
        }
        return newDats;
      })()}
    </div>);
  }
};