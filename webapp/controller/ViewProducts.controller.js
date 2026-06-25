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

      onProductEdit: function (oEvent) {
        const sProductID = oEvent
          .getSource()
          .getBindingContext()
          .getPath()
          .split("'")[1];

        const oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("RouteEditProduct", {
          productId: sProductID,
        });
      },

      onDeleteProduct: function (oEvent) {
        const sProductID = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getPath()
          .split("'")[1];

        this._verificarProduto(sProductID);
      },

      _verificarProduto: function (sProductID) {
        const oModel = this.getView().getModel();

        oModel.read("/ZCDS_PRODUTOS('" + sProductID + "')", {
          success: (oData) => {
            if (oData.Status === "I") {
              MessageBox.error(
                "O produto " + sProductID + " já está inativado.",
              );

              return;
            }

            this._confirmarInativacao(sProductID);
          },

          error: (oError) => {
            console.error(oError);

            MessageBox.error("Erro ao verificar status do produto.");
          },
        });
      },

      _confirmarInativacao: function (sProductID) {
        MessageBox.confirm(
          "Tem certeza que deseja inativar o produto " + sProductID + "?",
          {
            actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],

            onClose: (sAction) => {
              if (sAction !== MessageBox.Action.OK) {
                return;
              }

              this._inativarProduto(sProductID);
            },
          },
        );
      },

      _inativarProduto: function (sProductID) {
        const oModel = this.getView().getModel();

        oModel.remove("/ZCDS_PRODUTOS('" + sProductID + "')", {
          success: () => {
            MessageToast.show(
              "Produto " + sProductID + " inativado com sucesso.",
            );
          },

          error: (oError) => {
            console.error(oError);

            MessageBox.error("Erro ao inativar produto.");
          },
        });
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
