sap.ui.define([], function () {
    "use strict";

    return {
        formatCargo: function (sCargo) {
            switch (sCargo) {
                case "1": return "Barista";
                case "2": return "Caixa";
                case "3": return "Gerente";
                case "4": return "Supervisor";
                case "5": return "Garçom";
                case "6": return "Cozinheiro";
                default: return sCargo;
            }
        },

        formatStatus: function (sStatus) {
            const oStatus = {
                "A": "Ativo",
                "I": "Inativo"
            };
            return oStatus[sStatus] || sStatus;
        },

        formatStatusState: function (sStatus) {
            switch (sStatus) {
                case "A": return "Success"; // Verde
                case "I": return "Error";   // Vermelho
                default: return "None";
            }
        },

        formatCategoria: function (sCategoria) {
            const oCategoria = {
                "1": "Bebida Quente",
                "2": "Bebida Fria",
                "3": "Salgado",
                "4": "Sobremesa",
                "5": "Entrada"
            };
            return oCategoria[sCategoria] || sCategoria;
        }
    };
});