sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, UIComponent, JSONModel) => {
    "use strict";

    return Controller.extend("zcoffee.controller.ViewFormProduct", {
      onInit() {
        const oRouter = UIComponent.getRouterFor(this);

        oRouter
          .getRoute("RouteAddProduct")
          .attachPatternMatched(this._onRouteMatched, this);

        this.getView().setModel(new JSONModel(), "formProduct");
      },

      _onRouteMatched: function (oEvent) {
        const oDataModel = this.getOwnerComponent().getModel();
        const oContext = oDataModel.createEntry("/ZCDS_PRODUTOS");

        this.getView().setBindingContext(oContext);
      },

      onFileChange: function (oEvent) {
        const oFile = oEvent.getParameter("files")[0];
        const oReader = new FileReader();

        oReader.onload = (oLoadEvent) => {
          this.getView().getModel("formProduct").setProperty("/ImagemPreview", oLoadEvent.target.result);
        };

        oReader.readAsDataURL(oFile);
      }
      
    });
  },
);
