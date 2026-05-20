sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "zcoffee/model/formatter",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], (Controller, UIComponent, Filter, FilterOperator, formatter, MessageToast, JSONModel) => {
    "use strict";

    return Controller.extend("zcoffee.controller.ViewRH", {

        formatter: formatter,

        onInit() {

            const oFilterModel = new JSONModel({
                Nome: "",
                Cargo: [],
                Status: ["A"], // Inicia com Ativo
                dataInicio: null,
                dataFim: null
            });
            this.getView().setModel(oFilterModel, "filter");

            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteRH").attachPatternMatched(this._onRouteMatched, this);

        },

        _onRouteMatched:function(oEvent){

            this.onFilterToolbar(); // Aplica os filtros ao entrar na rota
        },

        onFilterToolbar:function(oEvent){

            const oFilterData = this.getView().getModel("filter").getData();
            const aFilters = [];

            if (oFilterData.Nome) {
                aFilters.push(new Filter("Nome", FilterOperator.Contains, oFilterData.Nome));
            }

            if (oFilterData.Cargo && oFilterData.Cargo.length > 0) {
                const aCargoFilters = oFilterData.Cargo.map(sKey => new Filter("Cargo", FilterOperator.EQ, sKey));
                aFilters.push(new Filter({ filters: aCargoFilters, and: false }));
            }

            if (oFilterData.Status && oFilterData.Status.length > 0) {
                const aStatusFilters = oFilterData.Status.map(sKey => new Filter("Status", FilterOperator.EQ, sKey));
                aFilters.push(new Filter({ filters: aStatusFilters, and: false }));
            }

            if (oFilterData.dataInicio && oFilterData.dataFim) {
                // A implementar
            }

            // Aplica o array de filtros no binding da tabela
            const oTable = this.byId("TableRH");
            const oBinding = oTable.getBinding("items");
            if (oBinding) {
                oBinding.filter(aFilters);
            }

        },

        onClearFilters: function() {
            // Reseta o JSON Model para o estado inicial
            this.getView().getModel("filter").setData({
                Nome: "",
                Cargo: [],
                Status: ["A"],
                dataInicio: null,
                dataFim: null
            });
            
            // Reaplica os filtros resetados
            this.onFilterToolbar();
        },

        onDelete:function(oEvent){

            const sId = oEvent
                .getParameter("listItem")
                .getBindingContext()
                .getProperty("ID");

            const oODataModel = this.getView().getModel();

            this.getView().setBusy(true);
            oODataModel.remove(`/ZIRH_ZCOFFEE('${sId}')`, {

                success:function(oData2,oResponse){

                    sap.m.MessageToast.show(`Funcionário excluído com sucesso! ID: ${sId}`);
                    oODataModel.refresh()
                    this.getView().setBusy(false);
                }.bind(this),

                error:function(oError){

                    sap.m.MessageToast.show("Erro ao excluir funcionário.");
                    this.getView().setBusy(false);
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
        },

        onRefresh:function(){
            const oODataModel = this.getView().getModel();

            this.getView().setBusy(true);
            oODataModel.read("/ZIRH_ZCOFFEE", {

                success:function(oData,oResponse){
                    sap.m.MessageToast.show("Dados atualizados com sucesso!");
                    oODataModel.refresh();
                    this.getView().setBusy(false);
                }.bind(this),
                error:function(oError){
                    sap.m.MessageToast.show("Erro ao atualizar dados.");
                    this.getView().setBusy(false);
                }
            });
        }
    });
});