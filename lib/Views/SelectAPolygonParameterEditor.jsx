import React from 'react';

import Cartographic from 'terriajs-cesium/Source/Core/Cartographic';
import CesiumMath from 'terriajs-cesium/Source/Core/Math';
import defined from 'terriajs-cesium/Source/Core/defined';
import Ellipsoid from 'terriajs-cesium/Source/Core/Ellipsoid';
import knockout from 'terriajs-cesium/Source/ThirdParty/knockout';

import MapInteractionMode from 'terriajs/lib/Models/MapInteractionMode';
import ObserveModelMixin from 'terriajs/lib/ReactViews/ObserveModelMixin';
import Styles from 'terriajs/lib/ReactViews/Analytics/parameter-editors.scss';
import when from 'terriajs-cesium/Source/ThirdParty/when';

const SelectAPolygonParameterEditor = React.createClass({
    mixins: [ObserveModelMixin],

    propTypes: {
        previewed: React.PropTypes.object,
        parameter: React.PropTypes.object,
        viewState: React.PropTypes.object
    },

    setDisplayValue(e) {
        SelectAPolygonParameterEditor.setDisplayValue(e, parameter);
    },

    selectExistingPolygonOnMap() {
        this.selectAPolygonParameterEditorCore.selectOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
    },

    render() {
        return (
            <div>
                <input className={Styles.field}
                       type="text"
                       value={this.state.value}/>
                <button type="button" onClick={this.selectExistingPolygonOnMap} className={Styles.btnSelector}>
                    Select existing polygon
                </button>
            </div>
        );
    }
});

/**
 * @param {String} value Value to use to format.
 * @return {String} Stringified JSON that can be used to pass parameter value in URL.
 */
SelectAPolygonParameterEditor.formatValueForUrl = function(value, parameter) {
    if (!defined(value) || value === '') {
            return undefined;
    }
    const featureList = value.map(function(featureData) {
            return {
                    'type': 'Feature',
                    'geometry': featureData.geometry
            };
    });

    return parameter.id + '=' + JSON.stringify({
        'type': 'FeatureCollection',
        'features': featureList
    });
};

/**
 * Prompts the user to select a point on the map.
 */
SelectAPolygonParameterEditor.selectOnMap = function(terria, viewState, parameter) {
    // Cancel any feature picking already in progress.
    terria.pickedFeatures = undefined;

    const pickPolygonMode = new MapInteractionMode({
        message: '<div>Select existing polygon<div style="font-size:12px"><p><i>If there are no polygons to select, add a layer that provides polygons.</i></p></div></div>',
        onCancel: function () {
            terria.mapInteractionModeStack.pop();
            viewState.openAddData();
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
                parameter.value = value;
                parameter.processedValue = SelectAPolygonParameterEditor.formatValueForUrl(value, parameter);
                terria.mapInteractionModeStack.pop();
                viewState.openAddData();
            }
        });
    });

    viewState.explorerPanelIsVisible = false;
};

SelectAPolygonParameterEditor.getDisplayValue = function(value) {
    if (!defined(value)) {
        return '';
    }
    return value.map(function(featureData) { return featureData.id; }).join(", ");
};

module.exports = SelectAPolygonParameterEditor;
