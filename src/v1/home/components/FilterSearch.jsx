import BaseVue from "../../../base/BaseVue";
import InputDropdown from "../../components/input/InputDropdown";
import InputText from "../../components/input/InputText";
import ListMenuClick from "../../partials/ListMenuClick";
import { onMounted } from 'vue';
import CategoryService from "../../services/CategoryService";
import ProductService from "../../services/ProductService";
import { reactive } from 'vue';

export const FilterSearchClass = BaseVue.extend({
  data : function(){
    return reactive({
      category_datas : [],
      product_cateogry_datas : [],
      product_datas : []
    });
  },
  returnCategoryService : function(){
    return CategoryService.create();
  },
  returnProductService : function(){
    return ProductService.create();
  },
  construct : function(props,context){
    let self = this;
    self.listMenuClick = ListMenuClick.create(props,self).setup();
    onMounted(function(){
      self.setInitDOMSelection(self.listMenuClick.map.LIST_MENU_CLICK);
      self.setInitDOMSelection('DROPDOWN_CATEGORY');
      self.setInitDOMSelection('DROPDOWN_PRODUCT_CATEGORY');
      self.setInitDOMSelection('DROPDOWN_PRODUCT');
      self.setInitDOMSelection('DATE_RANGE');
    });
  },
  setInitDOMSelection : function(action,props){
    let self = this;
    self.listMenuClick.join(action,{
      ...props,
      className : '#filter_search_button .ui.button'
    },function(action,val){
      self.onClickListener(action,val);
    });
    /* Casual defined */
    switch(action){
      case 'DROPDOWN_CATEGORY':
        self.category_dropdown = self.getRef('category_id');
        if(self.category_dropdown == null) return;
        self.category_dropdown.setOnChangeListener(function(props,e){

        });
        self.category_dropdown.setDefaultText('Select Category');
        break;
      case 'DROPDOWN_PRODUCT_CATEGORY':
        self.product_category_dropdown = self.getRef('product_category');
        if(self.product_category_dropdown == null) return;
        self.product_category_dropdown.setOnChangeListener(function(props,e){

        });
        self.product_category_dropdown.setDefaultText('Select Product Category');
        break;
      case 'DROPDOWN_PRODUCT':
        self.product_dropdown = self.getRef('product');
        if(self.product_dropdown == null) return;
        self.product_dropdown.setOnChangeListener(function(props,e){

        });
        self.product_dropdown.setDefaultText('Select Product');
        break;
      case 'DATE_RANGE':
        $('input[name="date_range"]').daterangepicker({
          singleDatePicker: false,
          showDropdowns: true,
          // minYear: 2019,
          // maxYear: parseInt(moment().format('YYYY'),10)
        }, function(start, end, label) {
          console.log('start',start);
          console.log('end',end);
          self.setUpdate('form_data',{
            start : start.format('YYYY-MM-DD'),
            end : end.format('YYYY-MM-DD')
          });
          self.handleClick('SUBMIT_DATE_RANGE',{});
          // var years = moment().diff(start, 'years');
          // alert("You are " + years + " years old!");
        });
        break;
    }
  },
  setOnClickListener : function(func){
    let self = this;
    self.onClickListener = func;
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'SUBMIT_DATE_RANGE':
        break;
    }
  }
});

export default {
  setup(props,context){
    let filterSearchClass = FilterSearchClass.create(props,context).setup();
    return filterSearchClass;
  },
  render(h){
    let { category_datas, product_cateogry_datas, product_datas } = this.get();

    return (<div id="filter_search_button">
      <div class="ui button">
        <img src="/public/img/filter_btn_icon.svg" alt=""/>
        &nbsp;&nbsp;
        <span>TRIER</span>
      </div>
      <div class="ui fluid popup">
        <div class="header" style="margin-bottom:12px;">
          <i class="tags icon"></i>
          Filter
        </div>
        <div class="item">
          <InputDropdown ref={(ref)=>this.setRef('category_id',ref)} datas={category_datas} name="category_id" id="dropdown_category" dropdown_text="name"></InputDropdown>
        </div>
        <div class="item">
          <InputDropdown ref={(ref)=>this.setRef('product_category',ref)} datas={product_cateogry_datas} name="product_category_id" id="product_category_id" dropdown_text="name"></InputDropdown>
        </div>
        <div class="item">
          <InputDropdown ref={(ref)=>this.setRef('product',ref)} datas={product_datas} name="product_id" id="product_id" dropdown_text="name"></InputDropdown>
        </div>
        <div class="item">
          <InputText name="date_range"></InputText>
        </div>
      </div>
    </div>);
  }
};