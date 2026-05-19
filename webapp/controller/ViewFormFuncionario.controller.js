sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], (Controller, UIComponent, JSONModel) => {
    "use strict";

    return Controller.extend("zcoffee.controller.ViewFormFuncionario", {
        onInit() {

            const oRouter = UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteNewFuncionario").attachPatternMatched(this._onRouteMatchedNewFuncionario, this);
            oRouter.getRoute("RouteEditFuncionario").attachPatternMatched(this._onRouteMatchedEditFuncionario, this);

        },

        _onRouteMatchedNewFuncionario:function(oEvent){

            this.getView().setModel(new JSONModel({
                ID: "",
                Nome: "",
                CPF: "",
                Telefone: "",
                Nascimento: "",
                Admissao: "",
                Cargo: "",
                Salario: "",
                Moeda: "",
                Login: ""
            }), "funcionario");

            this.onClear();
        },

        _onRouteMatchedEditFuncionario:function(oEvent){

            const sId = oEvent.getParameter("arguments").funcionarioId;
            const oODataModel = this.getView().getModel();

            oODataModel.read(`/ZIRH_ZCOFFEE('${sId}')`, {

                success:function(oData){
                    this.getView().setModel(new JSONModel(oData), "funcionario");
                }.bind(this),

                error: function(oError){
                    sap.m.MessageToast.show("Erro ao carregar dados do funcionário.");
                    console.log("Erro ao carregar dados do funcionário:", oError);
                }.bind(this)
            });

        },

        onSalvarFuncionario:function(){

            const oModel = this.getView().getModel("funcionario");
            const oData = oModel.getData();

            const oDatePicker = this.byId("dp1");
            let oDate = oDatePicker.getDateValue(); 

            const oODataModel = this.getView().getModel();

            if(!oData.Nome || !oData.CPF || !oData.Telefone || !oDate || !oData.Cargo || !oData.Salario){
                sap.m.MessageToast.show("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            if(oData.ID){
                oODataModel.update(`/ZIRH_ZCOFFEE('${oData.ID}')`, {
                    Nome: oData.Nome,
                    CPF: oData.CPF,
                    Email: oData.Email,
                    Telefone: oData.Telefone,
                    Nascimento: oDate,
                    Cargo: oData.Cargo,
                    Salario: oData.Salario
                }, {
                    success:function(oData2,oResponse){

                        sap.m.MessageToast.show(`Funcionário atualizado com sucesso! ID: ${oData.ID}`);
                        this.onClear();
                        this.onNavToRH();
                    }.bind(this),

                    error:function(oError){
                        sap.m.MessageToast.show("Erro ao atualizar funcionário.");
                        console.log("Erro ao atualizar funcionário:", oError);
                    }.bind(this)
                })

                return;

            }

           oODataModel.create("/ZIRH_ZCOFFEE", {
                Nome: oData.Nome,
                CPF: oData.CPF,
                Email: oData.Email,
                Telefone: oData.Telefone,
                Nascimento: oDate,
                Cargo: oData.Cargo,
                Salario: oData.Salario
            }, {

                success: (oDataNew) => {

                    sap.m.MessageToast.show(`Funcionário cadastrado com sucesso! ID: ${oDataNew.ID}`);
                    this.onClear();
                    this.onNavToRH();
                },

                error: (oError) => {
                    sap.m.MessageToast.show("Erro ao cadastrar funcionário.");
                }

            });

        },


        onClear:function(){

            this.getView().getModel("funcionario").setData({
                ID: "",
                Nome: "",
                CPF: "",
                Telefone: "",
                Nascimento: "",
                Admissao: "",
                Cargo: "",
                Salario: "",
                Moeda: "",
                Login: ""
            });
        },

        onNavToRH() {

            const oRouter = UIComponent.getRouterFor(this);

            oRouter.navTo("RouteRH");
        }

    });
});