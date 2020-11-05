import QueryTranslation from "../partials/QueryTranslation";
import { reactive, onBeforeMount, onMounted } from 'vue';
import BaseVue from "../../base/BaseVue";

export const MenuComplexFilterClass = BaseVue.extend({
  data : function(){
    return reactive({
      query : {
        take : 100,
        page : 1,
        total : 0
      }
    });
  },
  construct : function(props,context){
    let self = this;
    self.QueryTranslation = (QueryTranslation.create(props,self)).setup();
    onMounted(function(){
      let query = self.get("query");
      let parent = $("#filter-menu");
      self.dropdown = parent.find(".ui.dropdown.item.bar").dropdown({
        onChange: function(val, text, $e) {
          let action = $($e)
            .parents(".ui.dropdown.item.bar")
            .attr("action");
          if (self.onChangeListener != null) {
            self.onChangeListener(action, {
              value: val,
              text: text,
              e: $e,
            });
          }
        },
      });
      self.dropdown.each(function(i, e) {
        let action = $(e)
          .attr("action")
          .toLowerCase();
        switch (action) {
          default:
            if (query[action] != null) {
              $(e).dropdown("set selected", query[action] + "");
            }
            break;
        }
      });
      self.dropdown_checkbox = parent.find(".ui.dropdown-checkbox").dropdown({
        action: "nothing",
      });
      self.checkbox_items = parent.find(".ui.checkbox-items").checkbox({
        onChange: function() {
          let selectValue = [];
          self.checkbox_items.each(function(i, e) {
            if (
              $(e)
                .find("input[type=checkbox]")
                .is(":checked")
            ) {
              selectValue.push(
                $(e)
                  .find("input")
                  .attr("data-value")
              );
            }
          });
          if (self.onChangeListener == null) return;
          self.onChangeListener("MULTIPLE_FILTER", selectValue);
        },
      });

      let multiple_filter = (function(datas) {
        let multiple_filter = {};
        for (var a = 0; a < datas.length; a++) {
          multiple_filter[datas[a]] = a;
        }
        return multiple_filter;
      })(JSON.parse(query.multiple_filter || "[]"));
      self.checkbox_items.each(function(i, e) {
        let action = $(e)
          .children()
          .attr("data-value")
          .toLowerCase();
        if (multiple_filter[action] != null) {
          $(e)
            .first("input[type=checkbox]")
            .trigger("click");
        }
      });

      self.search = parent.find("input[action=SEARCH]");
      self.search.off("input");
      self.search.on("input", function(e) {
        if (self.pendingsearch != null) {
          self.pendingsearch.cancel();
        }
        self.pendingsearch = _.debounce(function(val) {
          if (self.onChangeListener == null) return;
          self.onChangeListener($(e.target).attr("ACTION"), val);
        }, 1000);
        self.pendingsearch($(this).val());
      });
      self.search.each(function(i, e) {
        let action = $(e)
          .attr("action")
          .toLowerCase();
        switch (action) {
          default:
            if (query[action] != null) {
              $(e).val(query[action]);
            }
            break;
        }
      });
      self.datePciker = $("input[name=date_range]");
      self.datePciker.daterangepicker({
        locale: {
          format: "MM/DD/YYYY",
          separator: " - ",
          applyLabel: "Appliquer",
          cancelLabel: "Annuler",
          fromLabel: "De",
          toLabel: "À",
          customRangeLabel: "Douane",
          daysOfWeek: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
          monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
          firstDay: 1,
        },
      });
      self.datePciker.val("");
      self.datePciker.on("apply.daterangepicker", function(ev, picker) {
        self.onChangeListener("DATE", {
          date_start: picker.startDate.format("YYYY-MM-DD"),
          date_end: picker.endDate.format("YYYY-MM-DD"),
        });
      });
    });
  },
  // onChangeListener : null,
  setOnChangeListener : function(func){
    this.onChangeListener = func;
  },
  handleClick : function(action,props,e){
    let self = this;
    switch(action){
      case 'ADD':
        if(self.onChangeListener == null) return;
        self.onChangeListener('ADD',{});
        break;
    }
  }
});

export default {
  setup : (props,context)=>(MenuComplexFilterClass.create({},context)).setup(),
  render(h) {
    return (
      <div class="ui mini menu" id="filter-menu">
        <div class="item nopadding">
          <a class="base_wr row link" onClick={this.handleClick.bind(this, "ADD")}>
              <i class="ion ion-md-add"></i>
          </a>
          <div class="ui basic right labeled dropdown-checkbox icon button">
            <i class="dropdown icon"></i>
            <span class="ui tiny header">Filter</span>
            <div class="menu">
              <div class="scrolling menu">
                <div class="ui item checkbox-items" data-value="item1">
                  <input type="checkbox" data-value="auth" name="item1" />
                  <label>{gettext("Connections")}</label>
                </div>
                <div class="ui item checkbox-items" data-value="item2">
                  <input type="checkbox" data-value="logo" name="item2" />
                  <label>{gettext("Création logo")}</label>
                </div>
                <div class="ui item checkbox-items" data-value="item3">
                  <input type="checkbox" data-value="doc" name="item3" />
                  <label>{gettext("Création doc")}</label>
                </div>
                <div class="ui item checkbox-items" data-value="item3">
                  <input type="checkbox" data-value="open_email" name="item3" />
                  <label>{gettext("Emailing lu")}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="ui dropdown item bar" action="USER_TYPE">
            {gettext("Utilisateurs")}&nbsp;<label></label> <i class="dropdown icon"></i>
            <div class="menu">
              <a class="item active selected" data-value="all">
                {gettext("Tous")}
              </a>
              <a class="item" data-value="0">
                {gettext("Premium")}
              </a>
              <a class="item" data-value="1">
                {gettext("Freemium")}
              </a>
            </div>
          </div>
          <div class="ui dropdown item bar" action="TAKE">
            {gettext("Affichage")}&nbsp;<label></label> <i class="dropdown icon"></i>
            <div class="menu">
              <a class="item active selected" data-value="5">
                {gettext("5")}
              </a>
              <a class="item" data-value="20">
                {gettext("20")}
              </a>
              <a class="item" data-value="50">
                {gettext("50")}
              </a>
              <a class="item" data-value="100">
                {gettext("100")}
              </a>
              <a class="item" data-value="200">
                {gettext("200")}
              </a>
            </div>
          </div>
        </div>
        <div class="right item">
          <div class="item">
            <div class="ui icon input">
              <input type="text" name="date_range" data-type="date_range" placeholder="Sélectionner une date" />
              <i class="search icon"></i>
            </div>
          </div>
          <div class="item">
            <div class="ui action input">
              <input type="text" placeholder="Rechercher" action="SEARCH" />
              <div class="ui mini button">Ok</div>
            </div>
          </div>
          <div class="ui dropdown item bar" action="ACTION">
            {gettext("Option")}
            <i class="dropdown icon"></i>
            <div class="menu">
              <a class="item" data-value="reset">
                {gettext("Réinitialiser")}
              </a>
              <a class="item" data-value="export">
                {gettext("Télécharger")}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  },
};