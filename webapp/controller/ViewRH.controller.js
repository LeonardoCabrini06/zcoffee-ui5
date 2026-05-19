sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "zcoffee/model/formatter"
], (Controller, UIComponent, Filter, FilterOperator, formatter) => {
    "use strict";

    return Controller.extend("zcoffee.controller.ViewRH", {

        formatter: formatter,

        onInit() {

            const oRouter = UIComponent.getRouterFor(this);

            oRouter.getRoute("RouteRH").attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched:function(oEvent){
            this._applyDefaultFilter();
        },

        _applyDefaultFilter: function() {

            const oTable = this.byId("TableRH");
            const oBinding = oTable.getBinding("items");

            const oFilterAtivo = new Filter("Status", FilterOperator.EQ, "A");

            if(oBinding){
                oBinding.filter([oFilterAtivo]);
            }
        },

        onClearFilters: function() {
            this.byId("mcStatus").setSelectedKeys(["A"]);
            this._applyDefaultFilter();
        },

        onDelete:function(oEvent){

            const sId = oEvent
                .getParameter("listItem")
                .getBindingContext()
                .getProperty("ID");

            const oODataModel = this.getView().getModel();

            oODataModel.remove(`/ZIRH_ZCOFFEE('${sId}')`, {

                success:function(oData2,oResponse){

                    sap.m.MessageToast.show(`Funcionário excluído com sucesso! ID: ${sId}`);
                    oODataModel.refresh();
                }.bind(this),

                error:function(oError){

                    sap.m.MessageToast.show("Erro ao excluir funcionário.");
                }

            });

        },

        onNovoFuncionario: function() {
            
            const oRouter = UIComponent.getRouterFor(this);
            
            oRouter.navTo("RouteNewFuncionario");

        },

        onEditFuncionario:function(oEvent){
            console.log("Editando funcionário...");

            const sId = oEvent
                .getSource()
                .getBindingContext()
                .getProperty("ID");

            console.log("ID do funcionário selecionado:", sId);
            
            const oRouter = UIComponent.getRouterFor(this);

            oRouter.navTo("RouteEditFuncionario", {
                funcionarioId: sId
            });
        }


    });
});