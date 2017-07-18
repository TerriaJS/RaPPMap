### GEOGLAM RAPP Change Log

#### 2017-##-##

* Added distance measurement tool below the locate me button.

#### 2017-01-25

* Added layers showing geopolitical areas and labels.
* GEOGLAM logo bigger and by itself in brand bar.
* Disclaimer now has information about the map and contains logos for Data61, NCI, Datacube, NLP, TERN Auscover, GEO and GEOGLAM.
* NDVI absolute replaces contents of Total Vegetation Cover (PV + NPV), and NDVI catalog group removed.
* Added NationalMap to list of related maps.
* Can now return TerriaJS JSON catalog items, which allows the return of charts with attributes such as per column chartLineColor, yAxisMin and yAxisMax. Specifying the units of the chart also allows multiple types of charts to be plotted on same chart with different axes.
* Download as csv button restored for expanded chart.
* New IP and port for Gsky dev server.
* Fixed add existing polygon. Previously, in http://map.geo-rapp.org/#test, Test Data > WPS National Map Tests > Geojson input, select a region and run analysis. Then Add Data > Test Data > WPS National Map Tests > Geojson input > existing polygon, then try to cancel. You couldn't: cancel hung. Now fixed.
* Bug fix for WMTS; this service should now be supported.

#### 2016-11-22

* Change base map back to Positron

#### 2016-11-21

* Only show disclaimer once.
* NDVI layer now global, not restricted to Australia.
* Fix issue with polygon drawing for polygon WPS parameters.
* GeoJsonParameter added for a WPS parameter which provides point, polygon, region, or existing polygon selection.
* Change initial camera to different view
* Show Vegetation Fractional Cover (PV, NPV & BS) rather than Anomaly layer by default

#### 2016-10-28

* Rearranged layers as per Juan's instructions, including removing some and changing URLs
* Legend resize bug fixed upstream, so this now works.

#### 2016-07-26

* NewUI release:
    * anomaly layers now on by default
    * polygon wps added
    * updated to latest TerriaMap which fixes branding icon issue

#### 2016-07-12

* NewUI test release
* Contains WPS test time series

#### 2016-05-03

* Removed temporary Auscover layers
* Timeslider labels now formatted more clearly
* When animated layers are opened, time slider set to latest available data
* Soil moisture layers added

#### 2016-04-05

* Name change for total cover layer
* Added google analytics
* Added google url shortener key
* Added bing maps key
* Made all layers 60% opacity by default
* Using Positron base map
* Start in paused mode

#### 2016-03-21

* Fixed layer display issue with Anomaly
* Layers added, mostly livestock density

#### 2016-03-18

* Layers renamed and rearranged
* Data61 logo replaces NICTA logo on about page
* Start map with 2D view of whole world
* Name of map changed from GEOGLAM Map to GEOGLAM RAPP
* Logo rearranged: GEOGLAM RAPP bigger and to the left, with Data61 on the right
* Added site disclaimer to declare GEOGLAM RAPP as under development
* Start map with Vegetation Dynamics > Vegetation Cover > Total Cover > Anomaly active

#### 2016-03-01

* First release



