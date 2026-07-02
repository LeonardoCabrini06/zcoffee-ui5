sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "zcoffee/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  (
    Controller,
    formatter,
    Filter,
    FilterOperator,
    History,
    Fragment,
    JSONModel,
    MessageToast,
    MessageBox,
  ) => {
    "use strict";

    return Controller.extend("zcoffee.controller.MM.ViewProducts", {
      formatter: formatter,

      onInit() {
        this._oCustomStatus = this.byId("mcb_status");
        this._oCustomCategory = this.byId("mcb_category");
        this._oSmartTableProducts = this.byId("ProductsSmartTable");

        this.getView().setModel(
          new JSONModel(this._getCreateProductInitialData()),
          "createProduct",
        );

        this.getOwnerComponent()
          .getRouter()
          .getRoute("RouteProducts")
          .attachPatternMatched(this.onMatched.bind(this));
      },

      onMatched: function () {
        const dir = History.getInstance().getDirection();
        if (dir === "Backwards") {
          this._oSmartTableProducts.rebindTable();
        }
      },

      onResetFilter: function () {
        this._oCustomStatus.setSelectedKeys(["A"]);
        this._oCustomCategory.setSelectedKeys([]);

        this._oSmartTableProducts.rebindTable();
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

      onAddProduct: function () {
        this.onOpenCreateDialog();
      },

      onOpenCreateDialog: function () {
        this._resetCreateProductModel();

        if (!this._pCreateDialog) {
          this._pCreateDialog = Fragment.load({
            id: this.getView().getId(),
            name: "zcoffee.view.fragments.AddProduct",
            controller: this,
          }).then((oDialog) => {
            this.getView().addDependent(oDialog);
            return oDialog;
          });
        }

        this._pCreateDialog.then((oDialog) => {
          oDialog.open();
        });
      },

      onSaveProduct: function () {
        const oDataModel = this.getView().getModel();
        const oPayload = this._montaPayload();

        if (!this._validarCampos(oPayload)) {
          return;
        }

        console.log(oPayload);

        oDataModel.create("/ZCDS_PRODUTOS", oPayload, {
          success: function (oDataNew) {
            MessageBox.success(
              `Produto ${oDataNew.IdProduto} criado com sucesso!`,
            );

            this._resetCreateProductModel();
            this.byId("createProductDialog").close();
            this._oSmartTableProducts.rebindTable();
          }.bind(this),

          error: function (oError) {
            console.log(oError);
            MessageBox.error("Falha ao criar Produto!");
          },
        });
      },

      _montaPayload: function () {
        const oData = this.getView().getModel("createProduct").getData();
        const oDatePicker = this.byId("dp2").getDateValue();

        return {
          Nome: oData.Nome,
          Descricao: oData.Descricao,
          Categoria: oData.Categoria,
          Preco: parseFloat(oData.Preco).toFixed(3),
          Moeda: oData.Moeda,
          Quantidade: oData.Quantidade,
          Status: oData.Status,
          Validade: oDatePicker,
          ImagemURL: oData.ImagemURL,
        };
      },

      _validarCampos: function (oData) {
        if (!oData.Nome) {
          MessageToast.show("Preencha o corretamente o Nome!");
          return false;
        }

        if (!oData.Preco || oData.Preco <= 0) {
          MessageToast.show("Preencha corretamente o Preço!");
          return false;
        }

        if (oData.Quantidade < 0) {
          MessageBox.error("Quantidade inválida.");
          return false;
        }

        if (!oData.Validade) {
          MessageBox.error("Data de Validade inválida.");
          return false;
        }

        return true;
      },

      onCloseDialog: function () {
        this._resetCreateProductModel();
        this.byId("createProductDialog").close();
      },

      _getCreateProductInitialData: function () {
        return {
          Categoria: "1",
          Status: "A",
          Moeda: "BRL",
          Quantidade: 1,
        };
      },

      _resetCreateProductModel: function () {
        this.getView()
          .getModel("createProduct")
          .setData(this._getCreateProductInitialData());
      },

      onPrecoChange: function (oEvent) {
        const oInput = oEvent.getSource();
        let sValue = oInput.getValue();

        sValue = parseFloat(sValue.replace(",", "."));

        if (!isNaN(sValue)) {
          oInput.setValue(sValue.toFixed(2));
        }
      },

      onDelete: function (oEvent) {
        const sId = oEvent
          .getParameter("listItem")
          .getBindingContext()
          .getPath()
          .split("'")[1];

        const oModel = this.getView().getModel();

        oModel.read(`/ZCDS_PRODUTOS('${sId}')`, {

          success: (oData) => {

            if (oData.Status !== "A") {

              MessageBox.error(`Produto ${sId} já está inativado.`);
              return;
            }

            oModel.remove(`/ZCDS_PRODUTOS('${sId}')`, {

              success: () => {

                MessageBox.success(`Produto ${sId} inativado com sucesso!`);
                this._oSmartTableProducts.rebindTable();
              },

              error: (oError) => {

                console.log(oError);
                MessageBox.error(`Falha ao inativar produto ${sId}.`);
              },
            });
          },

          error: (oError) => {
            
            console.log(oError);
            MessageBox.error("Erro ao consultar o produto.");
          },
        });
      },
    });
  },
);
