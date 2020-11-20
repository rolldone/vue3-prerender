export default {
  setup(props,context){
    return {};
  },
  render(h){
    return (<div style="width:300px;">
      <div class="app_shop_detail">
        <div class="asd_1">
          <div class="asd_1_2">
            <div class="asd_1_2_1">
              <img src="/public/img/map/back.svg" alt=""/>
            </div>
          </div>
        </div>
        <div class="asd_2">
          <div class="asd_2_1">
            <div class="image" style={{ "background-image":"url("+"/public/img/map/users/user_5.png"+")"}}></div>
          </div>
          <div class="asd_2_2">
            <div class="asd_2_2_1">
              <h4>BOULANGERIE DE LA REINE</h4>
              <span>
                87  rue Descartes
                67000 Alsace STRASBOURG
              </span>
            </div>
            <div class="asd_2_2_2">
              <div class="call active">
                <img src="/public/img/map/shop_call_active.svg" alt=""/>
                <span>03 88 23 23 23 </span>
              </div>
              <div class="shop">
                <img src="/public/img/map/shop.svg" alt=""/>
                <span>Aller à la boutique </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="app_shop_detail_list">
        <div class="asdl_1">
          <img src="" alt=""/>
        </div>
        <div class="asdl_2">
          <div class="asdl_21">
            <h4>Paris-Strasbourg</h4>
            <div class="asdl_211">
              <span>3.00€ TTC</span>
              <span class="divider"></span>
              <span>3.50€ TTC</span>
            </div>
          </div>
          <div class="asdl_22">
            <span>Description</span>
            <span>La ciabatta est un pain blanc originaire d'Italie, dont l'une des...</span>
          </div>
          <div class="asdl_23">
            <span>Ingrédients</span>
            <span>yeast, milk, water, olive oil, biga, unbleached all-purpose flour, ....</span>
          </div>
        </div>
      </div>
    </div>);
  }
};