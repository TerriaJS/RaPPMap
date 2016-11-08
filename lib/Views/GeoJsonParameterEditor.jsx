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
import RegionParameterEditor from 'terriajs/lib/ReactViews/Analytics/RegionParameterEditor';

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
        PointParameterEditor.selectOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
    },

    selectPolygonOnMap() {
        PolygonParameterEditor.selectOnMap(this.props.previewed.terria, this.props.viewState, this.props.parameter);
    },

    selectRegionOnMap() {
        RegionParameterEditor.selectOnMap(this.props.viewState, this.props.parameter, this.props.previewed);
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
                            style={{"marginLeft" : "0.5%",
                                    "marginRight" : "0.5%"
                                  }}
                            onClick={this.selectPolygonOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Polygon</strong>
                    </button>
                    <button type="button"
                            onClick={this.selectRegionOnMap}
                            className={LocalStyles.btnLocationSelector}>
                            <strong>Region</strong>
                    </button>
                </div>
                <input className={Styles.field}
                       type="text"
                       readOnly
                       value={this.props.parameter.displayValue}/>
            </div>
        );
    }
});

module.exports = GeoJsonParameterEditor;
