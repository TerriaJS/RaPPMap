'use strict';

/*global require*/
var defineProperties = require('terriajs-cesium/Source/Core/defineProperties');
var defined = require('terriajs-cesium/Source/Core/defined');
var FunctionParameter = require('terriajs/lib/Models/FunctionParameter');
var inherit = require('terriajs/lib/Core/inherit');
var PointParameter = require('terriajs/lib/Models/PointParameter');
var PolygonParameter = require('terriajs/lib/Models/PolygonParameter');
var RegionParameter = require('terriajs/lib/Models/RegionParameter');
var SelectAPolygonParameter = require('./SelectAPolygonParameter');

/**
 * A parameter that specifies an arbitrary polygon on the globe.
 *
 * @alias GeoJsonParameter
 * @constructor
 * @extends FunctionParameter
 *
 * @param {Object} options Object with the following properties:
 * @param {Terria} options.terria The Terria instance.
 * @param {String} options.id The unique ID of this parameter.
 * @param {String} [options.name] The name of this parameter. If not specified, the ID is used as the name.
 * @param {String} [options.description] The description of the parameter.
 * @param {Boolean} [options.defaultValue] The default value.
 */
var GeoJsonParameter = function(options) {
    FunctionParameter.call(this, options);
    this.regionParameter = options.regionParameter;
    this.value = "";
    this.processedValue = "";
};

inherit(FunctionParameter, GeoJsonParameter);

defineProperties(GeoJsonParameter.prototype, {
    /**
     * Gets the type of this parameter.
     * @memberof GeoJsonParameter.prototype
     * @type {String}
     */
    type: {
        get: function() {
            return 'geojson';
        }
    },

    regionTypeParameter: {
        get: function() {
            return this.regionParameter.regionTypeParameter;
        }
    }
});

GeoJsonParameter.prototype.findRegionByID = function(regionId) {
    return this.regionParameter.findRegionByID(regionId);
};

GeoJsonParameter.prototype._load = function() {
    return this.regionParameter.regionTypeParameter._load();
};

GeoJsonParameter.prototype.havePointParameter = function(value) {
    return value instanceof Object && defined(value.longitude) && defined(value.latitude);
};

GeoJsonParameter.prototype.havePolygonParameter = function(value) {
    return value instanceof Array;
};

GeoJsonParameter.prototype.haveSelectAPolygonParameter = function(value) {
    return value instanceof Array && value.length > 0 && defined(value[0].type) && value[0].type === "Feature";
};

GeoJsonParameter.prototype.formatValueAsString = function(value) {
    debugger;
    if (!defined(value) || value === '') {
        return '-';
    }
    if (this.havePointParameter(value)) {
        return PointParameter.prototype.formatValueAsString(value);
    }
    if (this.haveSelectAPolygonParameter(value)) {
        return SelectAPolygonParameter.prototype.formatValueAsString(value);
    }
    if (this.havePolygonParameter(value)) {
        return PolygonParameter.prototype.formatValueAsString(value);
    }
    var index = this.regionParameter.regionProvider.regions.indexOf(value);

    if (index >= 0 && this.regionParameter.regionProvider.regionNames[index]) {
        value = this.regionParameter.regionProvider.regionNames[index];
    } else {
        value = value.id;
    }
    return this.regionParameter.regionProvider.regionType + ": " + value;
};

GeoJsonParameter.prototype.getGeoJsonFeature = function(value) {
    debugger;
    // TODO stop referencing prototype.
    if (this.havePointParameter(value)) {
        return PointParameter.prototype.getGeoJsonFeature(value);
    }
    if (this.haveSelectAPolygonParameter(value)) {
        return SelectAPolygonParameter.prototype.getGeoJsonFeature(value);
    }
    if (this.havePolygonParameter(value)) {
        return PolygonParameter.prototype.getGeoJsonFeature(value);
    }
    return this.regionParameter.regionProvider.getRegionFeature(this._terria, value, undefined).then(function(feature) {
        var geojson = {
            type: 'Feature',
            geometry: feature.geometry
        };
        return geojson;
    });
};

module.exports = GeoJsonParameter;
