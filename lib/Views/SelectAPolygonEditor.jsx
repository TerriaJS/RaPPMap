import React from 'react';

import Cartographic from 'terriajs-cesium/Source/Core/Cartographic';
import CesiumMath from 'terriajs-cesium/Source/Core/Math';
import defined from 'terriajs-cesium/Source/Core/defined';
import Ellipsoid from 'terriajs-cesium/Source/Core/Ellipsoid';
import knockout from 'terriajs-cesium/Source/ThirdParty/knockout';

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

    componentWillMount() {
        if (!defined(this.selectAPolygonParameterEditorCore)) {
            this.selectAPolygonParameterEditorCore = new SelectAPolygonParameterEditorCore(this.props.previewed,
                                                                                           this.props.parameter,
                                                                                           this.props.viewState);
        }
        const value = this.selectAPolygonParameterEditorCore.getValue();
        this.setState({
            value: value
        });
    },

    getInitialState() {
        let value = "";
        if (defined(this.selectAPolygonParameterEditorCore)) {
            value = this.selectAPolygonParameterEditorCore.getInitialState();
        }
        return {
            value: value
        };
    },

    getInitialState() {
        return {
            value: this.getValue()
        };
    },

    getValue() {
        return this.selectAPolygonParameterEditorCore.getValue();
    },

    setValue(value) {
        this.selectAPolygonParameterEditorCore.setValue(value);
    },

    selectExistingPolygonOnMap() {
        this.selectAPolygonParameterEditorCore.selectOnMap();
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
