sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
  ],
  (
    Controller,
    UIComponent,
    JSONModel,
    MessageToast,
    MessageBox,
    BusyIndicator,
  ) => {
    "use strict";

    return Controller.extend("zcoffee.controller.ViewFormProduct", {
      onInit: function () {
        const oRouter = UIComponent.getRouterFor(this);

        oRouter
          .getRoute("RouteAddProduct")
          .attachPatternMatched(this._onRouteMatchedNew, this);
        oRouter
          .getRoute("RouteEditProduct")
          .attachPatternMatched(this._onRouteMatchedEdit, this);
      },

      _onRouteMatchedNew: function () {
        this._resetForm();
      },

      _onRouteMatchedEdit: function (oEvent) {
        const sProductId = oEvent.getParameter("arguments").productId;
        const oModel = this.getView().getModel();

        oModel.read("/ZCDS_PRODUTOS('" + sProductId + "')", {
          success: function (oData) {
            this.getView().setModel(new JSONModel(oData), "formProduct");
            this.byId("dp_validade").setDateValue(new Date(oData.Validade));
          }.bind(this),

          error: function (oError) {
            console.error("Erro ao carregar dados do produto:", oError);
            MessageBox.error("Erro ao carregar dados do produto.");
          },
        });
      },

      _resetForm: function () {
        this.getView().setModel(
          new JSONModel({
            Categoria: "1",
            Status: "A",
            Moeda: "BRL",
            IdProduto: "",
            Nome: "",
            Descricao: "",
            Preco: "",
            Quantidade: 0,
            ImagemURL: "",
            Validade: null,
          }),
          "formProduct",
        );
      },

      onNavBack: function () {
        const oRouter = UIComponent.getRouterFor(this);
        oRouter.navTo("RouteProducts");
      },

      _validateForm: function () {
        const oData = this.getView().getModel("formProduct").getData();

        if (!oData.Nome) {
          MessageBox.error("Informe o nome do produto.");
          return false;
        }

        if (!oData.Descricao) {
          MessageBox.error("Informe a descrição.");
          return false;
        }

        if (!oData.Preco || Number(oData.Preco) <= 0) {
          MessageBox.error("Informe um preço válido.");
          return false;
        }

        if (Number(oData.Quantidade) < 0) {
          MessageBox.error("Quantidade inválida.");
          return false;
        }

        return true;
      },

      onSave: function () {
        if (!this._validateForm()) {
          return;
        }

        const oModel = this.getView().getModel();
        const oFormModel = this.getView().getModel("formProduct");
        const oDataProduct = oFormModel.getData();

        const oDate = this.byId("dp_validade").getDateValue();

        const oPayload = {
          Nome: oDataProduct.Nome,
          Descricao: oDataProduct.Descricao,
          Categoria: oDataProduct.Categoria,
          Preco: oDataProduct.Preco,
          Moeda: oDataProduct.Moeda,
          Quantidade: oDataProduct.Quantidade,
          ImagemURL: oDataProduct.ImagemURL,
          Validade: oDate,
        };

        if (oDataProduct.IdProduto) {
          oModel.update(
            "/ZCDS_PRODUTOS('" + oDataProduct.IdProduto + "')",
            oPayload,
            {
              success: function (oData) {
                MessageToast.show("Produto atualizado com sucesso!");
                this._resetForm();
                this.onNavBack();
              }.bind(this),

              error: function (oError) {
                console.log("Erro ao atualizar produto:", oError);
                MessageBox.error("Erro ao atualizar produto.");
              },
            },
          );
          return;
        }

        oModel.create("/ZCDS_PRODUTOS", oPayload, {
          success: function (oData) {
            MessageToast.show("Produto criado com sucesso!");

            console.log("Produto criado:", oData);

            this._resetForm();
            this.onNavBack();
          }.bind(this),

          error: function (oError) {
            console.error(oError);

            MessageBox.error(
              "Erro ao criar produto. Verifique os dados informados.",
            );
          },
        });
      },
      onPriceChange: function (oEvent) {
        const oInput = oEvent.getSource();
        const sValue = oEvent.getParameter("value");

        const sDigits = sValue.replace(/\D/g, "");

        if (!sDigits) {
          oInput.setValue("");
          this._atualizarModelo(0);
          return;
        }

        const fAmount = parseFloat(sDigits) / 100;

        const oFloatFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
          groupingEnabled: true,
          groupingSeparator: ".",
          decimalSeparator: ",",
          minFractionDigits: 2,
          maxFractionDigits: 2,
        });

        const sFormattedValue = oFloatFormat.format(fAmount);
        oInput.setValue(sFormattedValue);

        this._atualizarModelo(fAmount.toFixed(2));
      },

      _atualizarModelo: function (sValorFinal) {
        const oModel = this.getView().getModel("formProduct");

        oModel.setProperty("/Preco", sValorFinal);
      },
    });
  },
);
