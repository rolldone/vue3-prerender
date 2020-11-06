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
            <div class="ui grid title" style="margin:0;">
              <div class="four wide column" style="padding:0;">
                <div class="image">
                  <img style="width:30px;" src={select_marker.store.image}/>
                </div>
              </div>
              <div class="ten wide column text">
                <h5>{select_marker.store.store_name}</h5>
                <span style="">{select_marker.store.address}</span>
              </div>
            </div>
            <div class="content" style="padding:0;">
              <div class="ui grid price" style="margin:0;">
                <div class="six wide column">
                  <div class="image">
                    <img src={select_marker.image}/>
                  </div>
                </div>
                <div class="ten wide column text">
                  <h5>{select_marker.product_name}</h5>
                  <span style="">{select_marker.price}€ TTC</span>
                </div>
              </div>
              <div class="ui grid description" style="margin:0;">
                <div class="sixteen wide column">
                  <span>{select_marker.description}</span>
                </div>
              </div>
              <div class="ui grid ingredient" style="margin:0;">
                <div class="sixteen wide column title">
                  <span class="text">Ingrédients</span>
                </div>
                <div class="sixteen wide column body">
                  <span class="text">{select_marker.ingredient}</span>
                </div>
              </div>
              <div class="ui grid" style="margin:0;">
                <div class="twelve wide column"></div>
                <div class="four wide column pagination">
                  <div class="wrap">
                    <div>
                      <i class="arrow left icon" onClick={this.handleClick.bind(this,'PAGINATION',{ action : 'LEFT' })}></i>
                    </div>
                    <div>
                      <i class="arrow right icon" onClick={this.handleClick.bind(this,'PAGINATION',{ action : 'RIGHT' })}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="extra content" style="padding:0;">
              <div class="ui grid action" style="margin:0;">
                <div class="twelve wide column">
                  <div class="ui grid">
                    <div class="five wide column">
                      <img src="/public/img/map/call_me.png" alt=""/>
                    </div>
                    <div class="ten wide column phone">
                      <div class="wrap">
                        <h5>Commander au</h5>
                        <h3>03 88 23 23 23 </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="four wide column" style="background: #ECF0F5;">
                  <div class="direct_to">
                    <img src="/public/img/map/direct_to.png" alt=""/>
                  </div>
                </div>
              </div>
            </div>
          </div>);
        }
        return newDats;
      })()}
    </div>);
  }
};