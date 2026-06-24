sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "zcoffee/model/formatter",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    Controller,
    UIComponent,
    formatter,
    MessageToast,
    MessageBox,
    Filter,
    FilterOperator,
  ) {
    "use strict";

    return Controller.extend("zcoffee.controller.ViewProducts", {
      formatter: formatter,

      onInit: function () {
        const oRouter = UIComponent.getRouterFor(this);

        oRouter
          .getRoute("RouteProducts")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {},

      onNavBack: function () {
        const oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("RouteView1");
      },

      onAddProduct: function () {
        const oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("RouteAddProduct");
      },

      onEditButton: function () {},

      onProductEdit: function (oEvent) {
        const sProductID = oEvent
          .getSource()
          .getBindingContext()
          .getPath()
          .split("'")[1];

        MessageToast.show("Abrindo detalhes do produto: " + sProductID);
      },

      onDeleteProduct: function (oEvent) {
        const sProductID = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getPath()
          .split("'")[1];

        MessageBox.confirm(
          "Tem certeza que deseja deletar o produto " + sProductID + "?",
          {
            // Ações possíveis
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],

            onClose: function (sAction) {
              if (sAction === MessageBox.Action.OK) {
                MessageToast.show(
                  "Produto " + sProductID + " deletado com sucesso!",
                );
              }
            },
          },
        );
      },

      onItemPress: function (oEvent) {
        const sProductID = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getPath()
          .split("'")[1];

        MessageToast.show("Produto selecionado: " + sProductID);
      },
    });
  },
);
