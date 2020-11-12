import BaseVue from "../../../base/BaseVue";
import { reactive, onMounted, watch } from 'vue';

export const GridDataClass = BaseVue.extend({
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
    let gridDataClass = GridDataClass.create(props,context).setup();
    return gridDataClass;
  },
  render(h){
    let { datas } = this.get();
    return (<div class="grid_data">
      {(()=>{
        let newDats = [];
        for(var a=0;a<datas.length;a++){
          let select_marker = datas[a];
          newDats.push(<div class="ui card" style="display:block;">
            <div class="content" style="padding:0;">
              <div class="ui grid price" style="margin:0;">
                <div class="image" style={{"background":'url('+select_marker.image+')'}}>
                </div>
                <div class="nav">
                  <div><img src="/public/img/heart.svg" alt=""/></div>
                  <div class="blue"><img src="/public/img/map/call_me.png" alt=""/></div>
                </div>
              </div>
              <div class="ui grid title" style="margin:0;">
                <div class="four wide column"  style="padding:0;">
                  <div class="image">
                    <img style="width:30px;" src={select_marker.store.image}/>
                  </div>
                </div>
                <div class="ten wide column text">
                  <h5>{select_marker.store.store_name}</h5>
                  <span style="">{select_marker.store.address}</span>
                </div>
              </div>
              
              <div class="ten wide column name">
                <h2>{select_marker.product_name}</h2>
                <span>{select_marker.description}</span>
                <span style="">{select_marker.price}€ TTC</span>
              </div>
            </div>  
          </div>);
        }
        return newDats;
      })()}
    </div>);
  }
};