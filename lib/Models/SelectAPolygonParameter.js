'use strict';

/*global require*/
var defineProperties = require('terriajs-cesium/Source/Core/defineProperties');
var defined = require('terriajs-cesium/Source/Core/defined');
var FunctionParameter = require('terriajs/lib/Models/FunctionParameter');
var inherit = require('terriajs/lib/Core/inherit');

/**
 * A parameter that specifies an arbitrary polygon on the globe, which has been selected from a different layer.
 *
 * @alias SelectAPolygonParameter
 * @constructor
 * @extends FunctionParameter
 *
 * @param {Object} options Object with the following properties:
 * @param {Terria} options.terria The Terria instance.
 * @param {String} options.id The unique ID of this parameter.
 * @param {String} [options.name] The name of this parameter.  If not specified, the ID is used as the name.
 * @param {String} [options.description] The description of the parameter.
 * @param {Boolean} [options.defaultValue] The default value.
 */
var SelectAPolygonParameter = function(options) {
    FunctionParameter.call(this, options);
};

inherit(FunctionParameter, SelectAPolygonParameter);

defineProperties(SelectAPolygonParameter.prototype, {
    /**
     * Gets the type of this parameter.
     * @memberof SelectAPolygonParameter.prototype
     * @type {String}
     */
    type: {
        get: function() {
            return 'polygon';
        }
    }

    /**
     * Gets or sets the value of this parameter.
     * @memberof SelectAPolygonParameter.prototype
     * @member {Number[][][]} value
     */
});

SelectAPolygonParameter.formatValueAsString = function(value) {
    if (!defined(value)) {
        return '-';
    }
    return value.map(function(featureData) { return featureData.id; }).join(", ");
};

SelectAPolygonParameter.getGeoJsonFeature = function(value) {
    return value.map(function(featureData) {
        return {
            type: 'Feature',
            geometry: featureData.geometry
        };
    });
};

module.exports = SelectAPolygonParameter;
