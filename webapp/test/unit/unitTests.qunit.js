/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"andina/saga_conf_abs/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
