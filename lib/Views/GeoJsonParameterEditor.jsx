'use strict';

import React from 'react';

import knockout from 'terriajs-cesium/Source/ThirdParty/knockout';

import CesiumMath from 'terriajs-cesium/Source/Core/Math';
import defined from 'terriajs-cesium/Source/Core/defined';
import Ellipsoid from 'terriajs-cesium/Source/Core/Ellipsoid';

import UserDrawing from 'terriajs/lib/Models/UserDrawing';
import ObserveModelMixin from 'terriajs/lib/ReactViews/ObserveModelMixin';
import Styles from 'terriajs/lib/ReactViews/Analytics/parameter-editors.scss';
import LocalStyles from './geojson-parameter-editor.scss';

import PointParameterEditorCore from 'terriajs/lib/ReactViews/Analytics/PointParameterEditorCore';
import PolygonParameterEditorCore from 'terriajs/lib/ReactViews/Analytics/PolygonParameterEditorCore';
import RegionParameterEditorCore from 'terriajs/lib/ReactViews/Analytics/RegionParameterEditorCore';
import SelectAPolygonParameterEditorCore from '../ViewModels/SelectAPolygonParameterEditorCore';

const GeoJsonParameterEditor = React.createClass({
    mixins: [ObserveModelMixin],

    propTypes: {
        previewed: React.PropTypes.object,
        parameter: React.PropTypes.object,
        viewState: React.PropTypes.object
    },

    componentWillMount() {
        var that = this;
        knockout.getObservable(this.props.parameter, '_value').subscribe(that.updateProcessedValue);
    },

    updateProcessedValue() {
        if (defined(this.state.currentEditorCore)) {
            var promiseOrValue = this.state.currentEditorCore.formatValueForUrl(this.props.parameter.value);
            this.props.parameter.processedValue = promiseOrValue;
        }
    },

    getInitialState() {
        var pointEditorCore = new PointParameterEditorCore(this.props.previewed,
                                                           this.props.parameter,
                                                           this.props.viewState);
        var polygonEditorCore = new PolygonParameterEditorCore(this.props.previewed,
                                                               this.props.parameter,
                                                               this.props.viewState);
        var regionEditorCore = new RegionParameterEditorCore(this.props.previewed,
                                                             this.props.parameter,
                                                             this.props.viewState);
        var selectAPolygonEditorCore = new SelectAPolygonParameterEditorCore(this.props.previewed,
                                                                             this.props.parameter,
                                                                             this.props.viewState);

        return {
            pointEditorCore: pointEditorCore,
            polygonEditorCore: polygonEditorCore,
            regionEditorCore: regionEditorCore,
            selectAPolygonEditorCore: selectAPolygonEditorCore
        };
    },

    onTextChange(e) {
        this.state.currentEditorCore.onTextChange(e);
    },

    getValue() {
        return this.state.currentEditorCore.getValue();
    },

    setValue(value) {
        this.state.currentEditorCore.setValue(value);
    },

    onCleanUp() {
        this.props.viewState.openAddData();
    },

    selectPointOnMap() {
        this.setState({
            currentEditorCore: this.state.pointEditorCore
        },
        function() {
            this.state.currentEditorCore.selectOnMap();
        });
    },

    selectPolygonOnMap() {
        this.setState({
            currentEditorCore: this.state.polygonEditorCore
        },
        function() {
            this.state.currentEditorCore.selectOnMap();
        });
    },

    selectRegionOnMap() {
        debugger;
        this.setState({
            currentEditorCore: this.state.regionEditorCore
        },
        function() {
            this.state.currentEditorCore.selectOnMap();
        });
    },

    selectExistingPolygonOnMap() {
        this.setState({
            currentEditorCore: this.state.selectAPolygonEditorCore
        },
        function() {
            this.state.currentEditorCore.selectOnMap();
        });
    },

    render() {
        return (
            <div>
                <div><strong>Select Location</strong></div>
                <div className="container" style={{"marginTop": "10px",
                    "marginBottom":"10px",
                    "display": "table",
                    "width": "100%"
                    }}>
                    <button type="button"
                            onClick={this.selectPointOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Point (lat/lon)</strong>
                    </button>
                    <button type="button"
                            style={{"marginLeft" : "1.3333%",
                                    "marginRight" : "0.66666%"
                                  }}
                            onClick={this.selectPolygonOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Polygon</strong>
                    </button>
                    <button type="button"
                            style={{"marginLeft" : "0.666666%",
                                    "marginRight" : "1.3333%"
                                  }}
                            onClick={this.selectRegionOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Region</strong>
                    </button>
                    <button type="button"
                            onClick={this.selectExistingPolygonOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Existing Polygon</strong>
                    </button>
                </div>
                <input className={Styles.field}
                       type="text"
                       onChange={this.onTextChange}
                       value={this.props.parameter.displayValue}/>
            </div>
        );
    }
});

module.exports = GeoJsonParameterEditor;
