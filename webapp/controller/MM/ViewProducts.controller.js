sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "zcoffee/model/formatter"
], (Controller, UIComponent, formatter) => {
    "use strict";

    return Controller.extend("zcoffee.controller.MM.ViewProducts", {
        formatter: formatter, 
        onInit() {
          
        },

    });
});