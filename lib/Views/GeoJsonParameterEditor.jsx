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

import PointParameterEditor from 'terriajs/lib/ReactViews/Analytics/PointParameterEditor';
import PolygonParameterEditor from 'terriajs/lib/ReactViews/Analytics/PolygonParameterEditor';
import SelectAPolygonParameterEditor from './SelectAPolygonParameterEditor';
import RegionParameterEditor from 'terriajs/lib/ReactViews/Analytics/RegionParameterEditor';
import RegionPicker from 'terriajs/lib/ReactViews/Analytics/RegionPicker';

import GeoJsonParameter from '../Models/GeoJsonParameter';

const GeoJsonParameterEditor = React.createClass({
    mixins: [ObserveModelMixin],

    propTypes: {
        previewed: React.PropTypes.object,
        parameter: React.PropTypes.object,
        viewState: React.PropTypes.object
    },

    componentWillMount() {
        var that = this;
    },

    onCleanUp() {
       this.props.viewState.openAddData();
    },

    selectPointOnMap() {
        this.props.parameter.value = undefined;
        PointParameterEditor.selectOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
        this.props.parameter.subtype = GeoJsonParameter.PointType;
    },

    selectPolygonOnMap() {
        this.props.parameter.value = undefined;
        PolygonParameterEditor.selectOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
        this.props.parameter.subtype = GeoJsonParameter.PolygonType;
    },

    selectExistingPolygonOnMap() {
        this.props.parameter.value = undefined;
        SelectAPolygonParameterEditor.selectOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
        this.props.parameter.subtype = GeoJsonParameter.SelectAPolygonType;
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
                            style={{"marginLeft" : "2%",
                                    "marginRight" : "2%"
                                  }}
                            onClick={this.selectPolygonOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Polygon</strong>
                    </button>
                    <button type="button"
                            onClick={this.selectExistingPolygonOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Existing Polygon</strong>
                    </button>
                </div>
                <input className={Styles.field}
                       type="text"
                       readOnly
                       value={GeoJsonParameterEditor.getDisplayValue(this.props.parameter.value, this.props.parameter)}/>
            </div>
        );
    }
});

GeoJsonParameterEditor.getDisplayValue = function(value, parameter) {
    if (!defined(parameter.subtype)) {
        return '';
    }
    if (parameter.subtype === GeoJsonParameter.PointType) {
        return PointParameterEditor.getDisplayValue(value);
    }
    if (parameter.subtype === GeoJsonParameter.SelectAPolygonType) {
        return SelectAPolygonParameterEditor.getDisplayValue(value);
    }
    if (parameter.subtype === GeoJsonParameter.PolygonType) {
        return PolygonParameterEditor.getDisplayValue(value);
    }
    return RegionPicker.getDisplayValue(value, parameter);
};

module.exports = GeoJsonParameterEditor;
