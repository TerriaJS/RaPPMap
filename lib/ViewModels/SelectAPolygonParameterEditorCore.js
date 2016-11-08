'use strict';

/* global require*/
const Cartographic = require('terriajs-cesium/Source/Core/Cartographic');
const CesiumMath = require('terriajs-cesium/Source/Core/Math');
const defined = require('terriajs-cesium/Source/Core/defined');
const Ellipsoid = require('terriajs-cesium/Source/Core/Ellipsoid');
const knockout = require('terriajs-cesium/Source/ThirdParty/knockout');
const MapInteractionMode = require('terriajs/lib/Models/MapInteractionMode');
const when = require('terriajs-cesium/Source/ThirdParty/when');

/**
 * The guts of what a SelectAPolygonParameter does.
 *
 * @alias SelectAPolygonParameterEditorCore
 * @constructor
 * @abstract
 *
 * @param {React.PropTypes.object} previewed Previewed item from viewState.
 * @param {React.PropTypes.object} parameter Object that inherits from FunctionParameter.
 * @param {React.PropTypes.object} viewState the main viewState.
 */
let SelectAPolygonParameterEditorCore = function(previewed, parameter, viewState) {
    this.previewed = previewed;
    this.parameter = parameter;
    this.viewState = viewState;
};

/**
 * @return {String} the value when editor is first opened.
 */
SelectAPolygonParameterEditorCore.prototype.getInitialState = function() {
    return this.getValue();
};

/**
 * @return {String} stored value.
 */
SelectAPolygonParameterEditorCore.prototype.getValue = function() {
    debugger;
    let featureList = this.parameter.value;
    if (!defined(featureList)) {
        return '';
    }
    return featureList.map(function(featureData) { return featureData.id; }).join(", ");
};

/**
 * @param {String} value Value to store.
 */
SelectAPolygonParameterEditorCore.prototype.setValue = function(value) {
    this.parameter.value = value;
    this.parameter.displayValue = this.getValue();
};

/**
 * @param {String} value Value to use to format.
 * @return {String} Stringified JSON that can be used to pass parameter value in URL.
 */
SelectAPolygonParameterEditorCore.prototype.formatValueForUrl = function(value) {
    if (!defined(value) || value === '') {
            return undefined;
        }
    const featureList = value.map(function(featureData) {
            return {
                    'type': 'Feature',
                    'geometry': featureData.geometry
            };
    });

    return this.parameter.id + '=' + JSON.stringify({
        'type': 'FeatureCollection',
        'features': featureList
    });
};

/**
 * Prompts the user to select a point on the map.
 */
SelectAPolygonParameterEditorCore.prototype.selectOnMap = function() {
    const terria = this.previewed.terria;
    const that = this;

    // Cancel any feature picking already in progress.
    terria.pickedFeatures = undefined;

    const pickPolygonMode = new MapInteractionMode({
        message: '<div>Select existing polygon<div style="font-size:12px"><p><i>If there are no polygons to select, add a layer that provides polygons.</i></p></div></div>',
        onCancel: function () {
            terria.mapInteractionModeStack.pop();
            that.viewState.openAddData();
        }
    });
    terria.mapInteractionModeStack.push(pickPolygonMode);

    knockout.getObservable(pickPolygonMode, 'pickedFeatures').subscribe(function(pickedFeatures) {
        when(pickedFeatures.allFeaturesAvailablePromise, function() {
            if (defined(pickedFeatures.pickPosition)) {
                const value = pickedFeatures.features.map(function(feature) {
                        if (defined(feature.data)) {
                            return feature.data;
                        }
                        const positions = feature.polygon.hierarchy.getValue().positions.map(function(position) {
                            const cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
                            return [CesiumMath.toDegrees(cartographic.longitude), CesiumMath.toDegrees(cartographic.latitude)];
                        });

                        return {
                            id: feature.id,
                            type: "Feature",
                            properties: feature.properties,
                            geometry: {
                                coordinates: [[positions]],
                                type: "MultiPolygon",
                            }
                        };
                    });
                that.setValue(value);
                terria.mapInteractionModeStack.pop();
                that.viewState.openAddData();
            }
        });
    });

    that.viewState.explorerPanelIsVisible = false;
};

module.exports = SelectAPolygonParameterEditorCore;
