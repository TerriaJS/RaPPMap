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

    getInitialState() {
        return {
            value: this.getValue()
        };
    },

    getValue() {
        const featureList = this.props.parameter.value;
        if (!defined(featureList)) {
            return '';
        }
        return featureList.map(function(featureData) { return featureData.id; }).join(", ");
    },

    selectExistingPolygonOnMap() {
        const terria = this.props.previewed.terria;
        const that = this;

        // Cancel any feature picking already in progress.
        terria.pickedFeatures = undefined;

        const pickPolygonMode = new MapInteractionMode({
            message: '<div>Select existing polygon<div style="font-size:12px"><p><i>If there are no polygons to select, add a layer that provides polygons.</i></p></div></div>',
            onCancel: function () {
                terria.mapInteractionModeStack.pop();
                that.props.viewState.openAddData();
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
                            var positions = feature.polygon.hierarchy.getValue().positions.map(function(position) {
                                var cartographic = Ellipsoid.WGS84.cartesianToCartographic(position);
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
                    that.props.parameter.value = value;
                    terria.mapInteractionModeStack.pop();
                    that.props.viewState.openAddData();
                }
            });
        });

        that.props.viewState.explorerPanelIsVisible = false;
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

module.exports = SelectAPolygonParameterEditor;
