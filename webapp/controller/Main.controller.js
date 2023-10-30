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
                //Tools Model
                let oToolsModel = new sap.ui.model.json.JSONModel();

                oToolsModel.setData({
                    sOrigen: "",
                    sDestino: "",
                });
                this.getOwnerComponent().setModel(oToolsModel, "ToolsModel");
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

            onConfirmar: async function (oEvent) {
                var oModel = new JSONModel;
                var origen = this.getOwnerComponent().getModel("ToolsModel").getData().sOrigen
                // var destino = this.getOwnerComponent().getModel("ToolsModel").getData().sDestino
                var array = this.getOwnerComponent().getModel("origenDestino").getData().results
                let arrayOrigen = array.filter(function (el) {
                    return el.denominacion === origen
                });
                var werksOrigen = "", lgortOrigen = "";
                if (arrayOrigen[0] != undefined) {
                    werksOrigen = arrayOrigen[0].werks;
                    lgortOrigen = arrayOrigen[0].lgort;
                }

                oModel.setData({
                    "paso": "2",
                    "matnr": this.byId("matnr").getText(),
                    "werksOrigen": werksOrigen,
                    "lgortOrigen": lgortOrigen,
                    "werksDestino": "",
                    "lgortDestino": "",
                    "oP": "",
                    "idQR": this.byId("rotulo").getValue(),
                })

                let oData = await this._setData(oModel.getData())
                sap.m.MessageToast.show(oData.return);

            },

            _setData: async function (oModel) {
                try {
                    var modelo = this.getOwnerComponent().getModel("abastecimiento")
                    modelo.setUseBatch(false);
                    return new Promise((res, rej) => {
                        modelo.create(`/setMovementSet`, oModel, {
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