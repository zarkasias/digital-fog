sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.electron.DigitalFog.controller.App", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.attachBypassed(function (oEvent) {
				var sHash = oEvent.getParameter("hash");
				// do something here, i.e. send logging data to the back end for analysis
				// telling what resource the user tried to access...
				jQuery.sap.log.info("Sorry, but the hash '" + sHash + "' is invalid.", "The resource was not found.");
			});
		},

		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}
	});

});
