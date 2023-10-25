sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ndc/BarcodeScanner",
    'sap/ui/model/json/JSONModel',
],
/**
 * @param {typeof sap.ui.core.mvc.Controller} Controller
 */
function (Controller, BarcodeScanner, JSONModel) {
    "use strict";

    return Controller.extend("andina.sagaconfabs.controller.Main", {
        onInit: async function () {
            let oData = await this.lecturaOrigenDestino();
            this.getOwnerComponent().setModel(new JSONModel(oData), "origenDestino");
        },

        onQRScan: async function (oEvent) {
            var that = this;
            BarcodeScanner.scan(
                async function (mResult) {
                        sap.ui.core.BusyIndicator.show(0);
                        var oData = await that.lecturaQR(mResult);
                        that.getView().byId("rotulo").setValue(oData.idQR)
                        that.getView().byId("rotulo").setEnabled(false)
                        that.getView().byId("butDel").setVisible(true)
                        that.getView().byId("butSearch").setVisible(false)
                        that.getView().byId("matnr").setText(oData.matnr)
                        that.getView().byId("descripcion").setText(oData.descripcion)
                        sap.ui.core.BusyIndicator.hide();
                    },
                    function (Error) {
                        var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
                        //	MessageBox.error(
                        //		"No se Pudo Leer el código de barras " + Error, {
                        //			styleClass: bCompact ? "sapUiSizeCompact" : ""
                        //		}
                        //	);
                    }
            );
        },

        lecturaQR: async function (id) {
            try {

                return new Promise((res, rej) => {
                    this.getOwnerComponent().getModel("abastecimiento").read(`/getMaterialDataSet('${id}')`, {
                        success: res,
                        error: rej
                    });
                });
            } catch (error) {
                if (error.responseText !== undefined) {

                    var err = JSON.parse(err.responseText).error.message.value;
                    sap.m.MessageBox.error(err);
                } else {

                    sap.m.MessageToast.show("Error al consultar oData");
                }
            }
            if (error.responseText !== undefined) {

                var err = JSON.parse(err.responseText).error.message.value;
                sap.m.MessageBox.error(err);
            } else {

                sap.m.MessageToast.show("Error al consultar oData");
            }
        },

        lecturaOrigenDestino: async function (id) {
            try {

                return new Promise((res, rej) => {
                    this.getOwnerComponent().getModel("abastecimiento").read('/getPosicionesDataSet', {
                        success: res,
                        error: rej
                    });
                });
            } catch (error) {
                if (error.responseText !== undefined) {

                    var err = JSON.parse(err.responseText).error.message.value;
                    sap.m.MessageBox.error(err);
                } else {

                    sap.m.MessageToast.show("Error al consultar oData");
                }
            }
            if (error.responseText !== undefined) {

                var err = JSON.parse(err.responseText).error.message.value;
                sap.m.MessageBox.error(err);
            } else {

                sap.m.MessageToast.show("Error al consultar oData");
            }
        },

        deleteId: function (oEvent) {
            var that = this;
            that.getView().byId("rotulo").setValue()
            that.getView().byId("rotulo").setEnabled(true)
            that.getView().byId("butDel").setVisible(false)
            that.getView().byId("butSearch").setVisible(true)
            that.getView().byId("matnr").setText()
            that.getView().byId("descripcion").setText()
        },

        searchId: async function (oEvent) {
            var that = this;
            var id = that.getView().byId("rotulo").getValue()
            sap.ui.core.BusyIndicator.show(0);
            var oData = await that.lecturaQR(id);
            that.getView().byId("rotulo").setEnabled(false)
            that.getView().byId("butDel").setVisible(true)
            that.getView().byId("butSearch").setVisible(false)
            that.getView().byId("matnr").setText(oData.matnr)
            that.getView().byId("descripcion").setText(oData.descripcion)
            sap.ui.core.BusyIndicator.hide();
        }

    });
});
