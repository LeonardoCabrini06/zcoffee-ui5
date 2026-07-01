sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "zcoffee/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
  ],
  (Controller, UIComponent, formatter, Filter, FilterOperator, History) => {
    "use strict";

    return Controller.extend("zcoffee.controller.MM.ViewProducts", {
      formatter: formatter,

      onInit() {
        this._oCustomStatus = this.byId("mcb_status");
        this._oCustomCategory = this.byId("mcb_category");

        this.getOwnerComponent()
          .getRouter()
          .getRoute("RouteProducts")
          .attachPatternMatched(this.onMatched.bind(this));
      },

      onMatched: function () {
        const dir = History.getInstance().getDirection();
        if (dir === "Backwards") {
          this.byId("ProductsSmartTable").rebindTable();
        }
      },

      onNavBack: function () {
        const sPreviousHash = History.getInstance().getPreviousHash();

        if (sPreviousHash) {
          window.history.go(-1);
        } else {
          this.getOwnerComponent().getRouter().navTo("RouteView1", {}, true);
        }
      },

      onSmartFilterBarInitialise: function () {
        this._oCustomStatus.setSelectedKeys(["A"]);
      },

      onBeforeRebindTable: function (oEvent) {
        const mBindingParams = oEvent.getParameter("bindingParams");
        const aStatus = this._oCustomStatus.getSelectedKeys();
        const aCategory = this._oCustomCategory.getSelectedKeys();

        if (aStatus.length > 0) {
          const aFilters = [];

          aStatus.forEach(function (sStatus) {
            aFilters.push(
              new Filter({
                path: "Status",
                operator: FilterOperator.EQ,
                value1: sStatus,
              }),
            );
          });

          mBindingParams.filters.push(
            new Filter({
              filters: aFilters,
              and: false,
            }),
          );
        }

        if (aCategory.length > 0) {
          const aFilters = [];

          aCategory.forEach(function (sCategory) {
            aFilters.push(
              new Filter({
                path: "Categoria",
                operator: FilterOperator.EQ,
                value1: sCategory,
              }),
            );
          });

          mBindingParams.filters.push(
            new Filter({
              filters: aFilters,
              and: false,
            }),
          );
        }
      },
    });
  },
);
