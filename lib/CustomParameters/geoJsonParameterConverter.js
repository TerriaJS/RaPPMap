'use strict';

var GeoJsonParameter = require('../Models/GeoJsonParameter');
var RegionTypeParameter = require('terriajs/lib/Models/RegionTypeParameter');
var RegionParameter = require('terriajs/lib/Models/RegionParameter');
var defined = require('terriajs-cesium/Source/Core/defined');

/**
 * TODO
 */
function geoJsonParameterConverter() {
    return {
         id: 'GeoJsonGeometry',
         inputToFunctionParameter: function(catalogFunction, input) {
             if (!defined(input.ComplexData) || !defined(input.ComplexData.Default) || !defined(input.ComplexData.Default.Format) || !defined(input.ComplexData.Default.Format.Schema)) {
                 return undefined;
             }

             var schema = input.ComplexData.Default.Format.Schema;
             if (schema.indexOf('http://geojson.org/geojson-spec.html#') === 0 && schema.indexOf('http://geojson.org/geojson-spec.html') !== 0) {
                 return undefined;
             }

             var regionTypeParameter = new RegionTypeParameter({
                terria: catalogFunction.terria,
                catalogFunction: catalogFunction,
                id: 'regionType',
                name: 'Region Type',
                description: 'The type of region to analyze.'
             });

             var regionParameter = new RegionParameter({
                terria: catalogFunction.terria,
                catalogFunction: catalogFunction,
                id: 'regionParameter',
                name: 'Region Parameter',
                regionProvider: regionTypeParameter
             });

             return new GeoJsonParameter({
                 terria: catalogFunction.terria,
                 catalogFunction: catalogFunction,
                 id: input.Identifier,
                 name: input.Title,
                 description: input.Abstract,
                 isRequired: (input.minOccurs | 0) > 0,
                 regionParameter: regionParameter
             });
         },
         functionParameterToInput: function(catalogFunction, parameter, value) {
             if (!defined(parameter.processedValue) || parameter.processedValue  === '') {
                 return undefined;
             }
             return parameter.processedValue;
         }
    };
}

module.exports = geoJsonParameterConverter;
