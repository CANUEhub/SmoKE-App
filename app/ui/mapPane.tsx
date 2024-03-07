"use client";
import { useRef, useEffect, useState, useCallback, useId, lazy, Suspense } from "react";
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import Overlay from 'ol/Overlay.js';
import LayerGroup from 'ol/layer/Group.js';
import Point from 'ol/geom/Point.js';
import { toStringXY } from 'ol/coordinate';
import { fromLonLat, toLonLat, transformExtent } from 'ol/proj';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Icon from 'ol/style/Icon.js';
import CircleStyle from 'ol/style/Circle.js';
import { getAirSurfaceTemp, getClosestAqhi, getClosestAqhiNow, getClosestAqhiToday, getWeatherAlerts } from "./testapi";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector.js';
import Feature from 'ol/Feature.js';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import { useTranslation } from "react-i18next";
import Zoom from 'ol/control/Zoom.js';
import Attribution from 'ol/control/Attribution.js';
import { defaults as defaultControls } from 'ol/control/defaults';
import {MapboxVectorLayer} from 'ol-mapbox-style';
import {applyStyle} from 'ol-mapbox-style';
import VectorTileLayer from 'ol/layer/VectorTile.js'

const WeatherMapInfo = ({ radarTime }) => {
    
  return (
      <div className='px-2 flex items-center py-3 content-evenly'>
          <div className='text-sm md:text-base px-3'>
              <p className='dark:text-slate-400'><span className='font-semibold'>Local Time: </span> {radarTime.local}</p>
          </div>
          <div className='text-sm md:text-base px-3'>
              <p className='dark:text-slate-400'><span className='font-semibold'>UTC: </span> {radarTime.iso}</p>
          </div>
      </div>
  )
}

const delaySkeleton = async (promise, time) => {
  return new Promise((resolve) => {
      setTimeout(resolve, time !== undefined ? time : 1000);
  }).then(() => promise);
}

const LoadingLayerLegend = () => {
  return (
      <div className="w-52 h-16 p-2 border rounded-lg animate-pulse border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div role="status">
              <div className="flex flex-row gap-3 mt-1">
                  <div className="w-full">
                      <div className="h-3 w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div className="w-full">
                      <div className="h-3 w-5/12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
              </div>
              <div className="flex flex-col mt-4">
                  <div className="w-full">
                      <div className="h-3 w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
              </div>
          </div>
      </div>
  )
}

const LoadingLayerList = () => {
  return (
      <div className="w-52 h-44 px-2 border rounded-lg animate-pulse border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div role="status">
              <div className="flex flex-row gap-3 mt-3">
                  <div className="w-full">
                      <div className="h-3 w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div className="w-full">
                      <div className="h-3 w-5/12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
              </div>
              <div className="flex mt-4">
                  <div className="w-full flex justify-end items-end">
                      <div className="h-2 w-4/5 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
              </div>
              {
                  [0, 1].map((item) => {
                      return (
                          <div key={item}>
                              <div className="flex flex-row gap-3 mt-5">
                                  <div className="w-full">
                                      <div className="h-3 w-full bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                  </div>
                                  <div className="w-full">
                                      <div className="h-3 w-8/12 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                  </div>
                              </div>
                              <div className="flex mt-4">
                                  <div className="w-full flex justify-end items-end">
                                      <div className="h-2 w-4/5 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                  </div>
                              </div>
                          </div>
                      )
                  })
              }

          </div>
      </div>
  )
}

const LoadingWidgetChart = () => {
  return (
      <div className="w-80 px-2 border rounded-lg animate-pulse border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div role="status">
              <div className="flex mt-5">
                  <div className="w-full">
                      <div className="h-3 w-1/5 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
              </div>
              <div className="flex flex-col mt-10">
                  <div className="w-full">
                      <div className="h-2 w-2/4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div className="w-full">
                      <div className="h-3 w-1/3 mt-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
              </div>
              <div className="flex flex-col my-5">
                  <div className="w-full">
                      <div className="h-2 mt-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div className="w-full">
                      <div className="h-2 mt-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div className="w-full">
                      <div className="h-2 mt-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div className="w-full">
                      <div className="h-2 mt-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                  <div className="w-full">
                      <div className="h-2 mt-4 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
              </div>
          </div>
      </div>
  )
}

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
};

const dateOptions_1 = {
  year: '2-digit',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short'
}

const layerSourceInfo = [
  { name: 'Air Surface Temperature', layer: 'GDPS.ETA_TT', url: 'https://geo.weather.gc.ca/geomet' },
  { name: 'RAQDPS - FireWork', layer: 'RAQDPS-FW.SFC_PM2.5', url: 'https://geo.weather.gc.ca/geomet' },
  { name: 'Air Quality Health Index', layer: '', url: 'https://api.weather.gc.ca/collections/aqhi-forecasts-realtime/items?f=json' },
  { name: 'Climate Hourly', layer: '', url: 'https://api.weather.gc.ca/collections/climate-hourly/items' },
  { name: 'Weather Condition', layer: 'CURRENT_CONDITIONS', url: 'https://geo.weather.gc.ca/geomet' },
  { name: 'Weather Alerts', layer: 'ALERTS', url: 'https://geo.weather.gc.ca/geomet' }
];


const MapPane = () => {

    const map = useRef(null);
    const mapRef = useRef(null);
    const popupDiv = useRef(null);
    const airTempLayerId = useId();
    const airQualityLayerId = useId();
    const weatherAlertsLayerId = useId();
    const [isLoading, setIsLoading] = useState(true);
    const [airTableData, setAirTableData] = useState({});
    const [radarTime, setRadarTime] = useState({ start: null, end: null, current: null, iso: null, local: null });
    const [isClickPlayBtn, setIsClickPlayBtn] = useState(false);
    const [isClickLegendBtn, setIsClickLegendBtn] = useState(false);
    const [isClickLayerBtn, setIsClickLayerBtn] = useState(false);
    const [isClickChartBtn, setIsClickChartBtn] = useState(false);
    const [showChartBtn, setShowChartBtn] = useState(false);
    const [isNewTimeVal, setIsNewTimeVal] = useState();
    const [layerGroupList, setLayerGroupList] = useState([]);
    const [layerLegendList, setLayerLegendList] = useState([]);
    const [aqhiChartData, setAqhiChartData] = useState([]);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const { t, i18n } = useTranslation();


    const _alertsPopup = t('alerts', { returnObjects: true });
    const _aqhiPopup = t('aqhi', { returnObjects: true });
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const closePopup = (e) => {
        e.target.parentElement.setAttribute('class', 'invisible');
        return false;
    }

    const handlePlayBtn = () => {
        setIsClickPlayBtn(!isClickPlayBtn);
    }

    const handleLegendBtn = (e) => {
        setIsClickLegendBtn(!isClickLegendBtn);
        if (!isClickLegendBtn) {
            setIsClickLayerBtn(false);
            setIsClickChartBtn(false);
        }
    }

    const handleLayerBtn = (e) => {
        setIsClickLayerBtn(!isClickLayerBtn);
        if (!isClickLayerBtn) {
            setIsClickLegendBtn(false);
            setIsClickChartBtn(false);
        }
    }

    const handleChartBtn = (e) => {
        setIsClickChartBtn(!isClickChartBtn);
        if (!isClickChartBtn) {
            setIsClickLegendBtn(false);
            setIsClickLayerBtn(false);
        }
    }

    const initMap = useCallback(() => {

        if (mapRef.current) {

            const overlay = new Overlay({
                element: popupDiv.current,
                autoPan: true
            });

            const basemapLightLayer = new TileLayer({
                source: new OSM(),
                visible: false,
                title: 'OSM_Map',
                id: 'basemap_light'
            });

            const mapBoxLayer = new VectorTileLayer({declutter: true, id: 'mapbox'});
            applyStyle(mapBoxLayer, 'mapbox://styles/mapbox/light-v9', {accessToken: mapboxToken});

            const airSurfaceTempWMS = new TileWMS({
                url: layerSourceInfo[0].url,
                params: { 'LAYERS': layerSourceInfo[0].layer },
                transition: 0
            });

            const raqdpsWMS = new TileWMS({
                url: layerSourceInfo[1].url,
                params: { 'LAYERS': layerSourceInfo[1].layer, 't': new Date(Math.round(Date.now())).toISOString().split('.')[0] + "Z" },

            });
            const weatherAlertsWMS = new TileWMS({
                url: layerSourceInfo[5].url,
                params: { 'LAYERS': layerSourceInfo[5].layer },
            });

            const airSurfaceTempLayer = new TileLayer({
                id: airTempLayerId,
                title: layerSourceInfo[0].name,
                source: airSurfaceTempWMS,
                opacity: 0.4,
                zIndex: 0,
                visible: false
            });

            const raqdpsLayer = new TileLayer({
                id: airQualityLayerId,
                title: layerSourceInfo[1].name,
                source: raqdpsWMS,
                opacity: 0.4,
                zIndex: 1
            });

            const weatherAlertsLayer = new TileLayer({
                id: weatherAlertsLayerId,
                title: layerSourceInfo[5].name,
                source: weatherAlertsWMS,
                opacity: 0.7
            });

            // const aqhiVector = new VectorSource({
            //     url: layerSourceInfo[2].url,
            //     format: new GeoJSON()
            // });

            // const aqhiVectorLayer = new VectorLayer({
            //     source: aqhiVector,
            //     opacity: 1
            // });

            // aqhiVectorLayer.setStyle(
            //     new Style({
            //         image: new Icon({
            //             crossOrigin: 'anonymous',
            //             src: 'https://img.icons8.com/nolan/64/map-pin.png',
            //             scale: 0.3,
            //         }),
            //     })
            // );

            const pinLocLayer = new VectorLayer({
                source: new VectorSource()
            });

            const view = new View({
                center: fromLonLat([-97, 57]),
                zoom: 3,
                minZoom: 3,
                maxZoom: 7,
                constrainOnlyCenter: true,
            });

            const layerGroup = new LayerGroup({
                layers: [airSurfaceTempLayer, raqdpsLayer, weatherAlertsLayer]
            });

            const attribution = new Attribution({
                collapsed: true,
                collapsible: true,
                className: 'ol-attribution ol-attribution-new',
                label: 'i',
                expandClassName: '-expand',
                collapseClassName: '-collapse'
            });

            const _zoom = new Zoom({
                className: 'ol-zoom',
            });

            map.current = new Map({
                layers: [mapBoxLayer, layerGroup, pinLocLayer],
                view: view,
                overlays: [overlay],
                controls: defaultControls({ attribution: false, zoom: true }).extend([attribution, _zoom]),

            });

            map.current.setTarget(mapRef.current);

            map?.current.on('moveend', function (event) {
                const mapExtent = event.map.getView().calculateExtent(event.map.getSize());
                const transExt = transformExtent(mapExtent, 'EPSG:3857', 'EPSG:4326');
                const newBbox = '&bbox=' + transExt[0] + ',' + transExt[1] + ',' + transExt[2] + ',' + transExt[3];
                // aqhiVector.setUrl(layerSourceInfo[2].url + newBbox);
                // aqhiVector.refresh();
            });

            map.current.on('loadstart', function () {
                setIsMapLoading(true);
            });

            map.current.on('loadend', function () {
                setIsMapLoading(false);
            });

            map?.current.on('singleclick', function (event) {

                const coordinate = event.coordinate;
                const toStringCoordinate = toStringXY(toLonLat(coordinate), 4);

                const pinLocCircle = new CircleStyle({
                    radius: 5,
                    fill: new Fill({
                        color: '#16a34a',
                    }),
                    stroke: new Stroke({ color: '#22d3ee', width: 1 }),
                });
                const pinLocStyle = new Style({
                    image: pinLocCircle,
                });

                const pinFeature = new Feature({
                    geometry: new Point(event.coordinate),
                });

                const pinLayerSource = new VectorSource({
                    features: [pinFeature]
                });

                pinLocLayer.getSource().clear();
                pinLocLayer.setSource(pinLayerSource);
                pinLocLayer.setStyle(pinLocStyle);

                overlay.setPosition(coordinate);
                setIsLoading(true);

                //findAqhiFeatures(coordinate);
                findAstFeatures(coordinate);
                findAlertsFeatures(coordinate);

                setAirTableData(data => {
                    return { ...data, coordinate: toStringCoordinate }
                });

            });

            async function findAlertsFeatures(coordinate) {

                const viewResolution = map.current.getView().getResolution();
                const alertsUrl = weatherAlertsWMS.getFeatureInfoUrl(
                    coordinate,
                    viewResolution,
                    "EPSG:3857",
                    { INFO_FORMAT: "application/json" }
                );

                getWeatherAlerts(alertsUrl).then(response => {

                    if (response?.features.length > 0) {

                        const features = response.features;

                        for (let index = 0; index < features.length; index++) {
                            const element = features[index];

                            i18n.addResourceBundle('en', 'translation', {
                                "alerts": {
                                    "data": [
                                        {
                                            "id": element.properties.identifier,
                                            "type": element.properties.alert_type,
                                            "headline": element.properties.headline,
                                            "description": element.properties.descrip_en,
                                            "area": element.properties.area,
                                            "status": element.properties.status,
                                            "expires": new Date(element.properties.expires).toLocaleDateString(navigator.local, dateOptions_1),
                                            "effective": new Date(element.properties.effective).toLocaleDateString(navigator.local, dateOptions_1)
                                        }
                                    ]
                                },
                            }, true, true);

                            i18n.addResourceBundle('fr', 'translation', {
                                "alerts": {
                                    "data": [
                                        {
                                            "id": element.properties.identifier,
                                            "type": element.properties.alert_type,
                                            "headline": element.properties.titre,
                                            "description": element.properties.descrip_fr,
                                            "area": element.properties.zone,
                                            "status": element.properties.status,
                                            "expires": new Date(element.properties.expires).toLocaleDateString('fr-CA', dateOptions_1),
                                            "effective": new Date(element.properties.effective).toLocaleDateString('fr-CA', dateOptions_1)
                                        }
                                    ]
                                },
                            }, true, true);

                        }

                    } else {
                        i18n.addResourceBundle('en', 'translation', {
                            "alerts": {
                                "data": []
                            }
                        });
                        i18n.addResourceBundle('fr', 'translation', {
                            "alerts": {
                                "data": []
                            }
                        });
                    }

                });

            }

            async function findAstFeatures(coordinate) {

                const viewResolution = map.current.getView().getResolution();
                const astUrl = airSurfaceTempWMS.getFeatureInfoUrl(
                    coordinate,
                    viewResolution,
                    "EPSG:3857",
                    { INFO_FORMAT: "application/json" }
                );

                getAirSurfaceTemp(astUrl).then(response => {
                    if (response.features.length > 0) {
                        const temperature = response.features[0].properties.value;
                        setAirTableData(data => {
                            return { ...data, airsurftemp: temperature }
                        });
                    }
                    setIsLoading(false);
                });

            }

            async function findAqhiFeatures(coordinate) {

                const closestFeatures = await getClosestAqhi(aqhiVector, coordinate);
                var aqhiFeaturesToday = [];
                if (closestFeatures !== null) {
                    aqhiFeaturesToday = await getClosestAqhiToday(closestFeatures);
                    aqhiFeaturesToday.sort((a, b) => new Date(a.properties.forecast_datetime) - new Date(b.properties.forecast_datetime));
                }

                var aqhiData = [];

                aqhiFeaturesToday.forEach((element) => {

                    if (aqhiData.length > 0) {

                        const findNewElement = aqhiData.find((item) => item.properties.forecast_datetime_text_en === element.properties.forecast_datetime_text_en);

                        if (findNewElement !== undefined) {

                            const pubDate = new Date(findNewElement.properties.publication_datetime);
                            const newPubDate = new Date(element.properties.publication_datetime);

                            if (newPubDate > pubDate) {

                                const aqhiDataIndex = aqhiData.findIndex((item) => item.properties.forecast_datetime_text_en === findNewElement.properties.forecast_datetime_text_en);
                                aqhiData[aqhiDataIndex] = element;
                            }

                        } else {

                            aqhiData.push(element);
                        }

                    } else {

                        aqhiData.push(element);

                    }

                });

                if (aqhiData.length > 0) {
                    getClosestAqhiNow(aqhiData).then(response => {

                        i18n.addResourceBundle('en', 'translation', {
                            "aqhi": {
                                "data": [
                                    {
                                        "id": response.properties.id,
                                        "value": response.properties.aqhi,
                                        "forecastLoc": response.properties.location_name_en,
                                        "forecastDate": new Date(response.properties.forecast_datetime).toLocaleDateString(navigator.local, dateOptions_1)
                                    }
                                ]
                            },
                        }, true, true);

                        i18n.addResourceBundle('fr', 'translation', {
                            "aqhi": {
                                "data": [
                                    {
                                        "id": response.properties.id,
                                        "value": response.properties.aqhi,
                                        "forecastLoc": response.properties.location_name_fr,
                                        "forecastDate": new Date(response.properties.forecast_datetime).toLocaleDateString('fr-CA', dateOptions_1)
                                    }
                                ]
                            },
                        }, true, true);

                    });
                }

                setAqhiChartData(aqhiData);
                setShowChartBtn(true);
            }

            setLayerGroupList(layerGroup.getLayers());
            setLayerLegendList(layerGroup.getLayers());
        }
        const layers = map?.current.getLayers().array_;
        const findMapboxLayer = layers.find((item) => item.values_.id === 'mapbox');
        const findLightLayer = layers.find((item) => item.values_.id === 'basemap_light');
        const findDarkLayer = layers.find((item) => item.values_.id === 'basemap_dark');

            findMapboxLayer.setVisible(true);
            //findLightLayer.setVisible(true)
            // findDarkLayer.setVisible(false);
        

    }, [airQualityLayerId, airTempLayerId, weatherAlertsLayerId, i18n]);

    useEffect(() => {


        initMap();

        const getRadarStartEndTime = async () => {

            try {
                const response = await fetch('https://geo.weather.gc.ca/geomet/?lang=en&service=WMS&request=GetCapabilities&version=1.3.0&LAYERS=RAQDPS-FW.EATM_PM2.5-DIFF&t=' + new Date().getTime());

                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`);
                } else {
                    const result = await response.text();
                    const xmlDoc = new DOMParser().parseFromString(result, "text/xml");
                    const [startTime, endTime] = xmlDoc.getElementsByTagName('Dimension')[0].innerHTML.split('/')
                    const defaultTime = xmlDoc.getElementsByTagName('Dimension')[0].getAttribute('default')
                    const utcTime = new Date(defaultTime);
                    const localTime = utcTime.toLocaleString(navigator.local, dateOptions);
                    const isoTime = utcTime.toISOString().substring(0, 16) + "Z";

                    if (isNewTimeVal !== localTime) {
                        setRadarTime((data) => ({
                            ...data,
                            start: startTime,
                            end: endTime,
                            current: defaultTime,
                            local: localTime,
                            iso: isoTime
                        }));
                    }
                    setIsNewTimeVal(localTime);
                }

            } catch (error) {
                console.log(error)
            }
        };

        getRadarStartEndTime();

        const allLayers = map?.current.getAllLayers();
        const getSmokeLayer = allLayers.find((item) => item.values_.title === layerSourceInfo[1].name);
        var _radarInterval;
        if (isClickPlayBtn) {

            _radarInterval = setInterval(() => {
                setRadarTime(radarTime => {
                    var radarCurrTime = new Date(radarTime.current);
                        radarCurrTime.setUTCMinutes(radarCurrTime.getUTCMinutes() + 60);
                    var localTime = radarCurrTime.toLocaleString(navigator.local, dateOptions);
                    var newRadarCurrTime = new Date(radarCurrTime).toISOString().split('.')[0] + 'Z';
                        getSmokeLayer.getSource().updateParams({ 'TIME': newRadarCurrTime });
                    var isoTime = radarCurrTime.toISOString().substring(0, 16) + "Z";

                    if (isoTime >= radarTime.end) {
                        return {
                            ...radarTime,
                            current: radarTime.start,
                            local: localTime,
                            iso: isoTime
                        }
                    }
                    return {
                        ...radarTime,
                        current: newRadarCurrTime,
                        local: localTime,
                        iso: isoTime
                    }
                });
            }, 1000 / 1.0);

        }

        return () => {
            if (!!mapRef) {
                mapRef.current = null;
            }
            clearInterval(_radarInterval)
        };

    }, [initMap, isClickPlayBtn, isNewTimeVal]);

    const sectionRef = useRef(null);

    return (
        <section ref={sectionRef}>

                    <div className="max-sm:col-start-1 max-sm:col-span-1">
                        <div className="mapRef" id='mapRef' ref={mapRef} style={{height: '600px'}}>
                            <div>
                                {
                                    isMapLoading && isMapLoading ?
                                        <div role="status" className=" px-0.5">
                                            <span className="sr-only"></span>
                                        </div>
                                        : null
                                }
                            </div>
                        </div>

                        {isLoading ?
                            <div ref={popupDiv}>
                                <div className="text-center">
                                    <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                                        <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>
                            :
                            <div ref={popupDiv}>
                                <div data-popover role="tooltip" className="ol-popup absolute rounded-lg bottom-3 pb-1 min-w-max border border-solid border-slate-400 -left-12 transition-opacity duration-300 bg-white max-[w-56] dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800 shadow-lg shadow-blue-400/50 dark:shadow-lg dark:shadow-blue-800/80">
                                    <span id="popup-closer" className="ol-popup-closer hover:cursor-pointer" onClick={closePopup}></span>
                                    <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                                        <h4 className="font-medium text-sm text-gray-900 dark:text-slate-300">({t('common:lonlat')}): <span className="font-normal text-gray-900 dark:text-slate-300">{airTableData.coordinate}</span></h4>
                                    </div>
                                    <div className="grid grid-cols-2 border-b border-b-slate-300 dark:border-b-gray-600 gap-3 p-1 max-w-xs">
                                        <div className="text-right self-center">
                                            <p className="text-xs text-gray-900 dark:text-slate-400">{t('common:airSurfaceTemperature')} : </p>
                                        </div>
                                        <div className="self-center text-xs">
                                            <p>{Math.round(airTableData.airsurftemp)} °C</p>
                                        </div>
                                    </div>
                                    {
                                        Array.isArray(_aqhiPopup?.data) ?
                                            _aqhiPopup?.data?.length > 0 ?
                                                _aqhiPopup?.data.map((item) => (
                                                    <div key={item.id} className="px-1">
                                                        <div className="grid grid-cols-2 gap-3 py-1 max-w-xs">
                                                            <div className="text-right self-center">
                                                                <p className="text-xs text-gray-900 dark:text-slate-400">{i18n.t('common:forecastAQHI')} : </p>
                                                            </div>
                                                            <div className="self-center text-xs">
                                                                <p>{item.value}</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3 pb-1 max-w-xs">
                                                            <div className="text-right self-center">
                                                                <p className="text-xs text-gray-900 dark:text-slate-400">{i18n.t('common:forecastDateTime')} : </p>
                                                            </div>
                                                            <div className="self-center text-xs">
                                                                <p className="text-xs text-gray-900 dark:text-slate-400">{item.forecastDate}</p>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3 pb-1 max-w-xs">
                                                            <div className="text-right self-center">
                                                                <p className="text-xs text-gray-900 dark:text-slate-400">{i18n.t('common:forecastClosestLoc')} : </p>
                                                            </div>
                                                            <div className="self-center">
                                                                <p className="text-xs text-gray-900 dark:text-slate-400">{item.forecastLoc}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                                : null
                                            : null
                                    }
                                    {
                                        _alertsPopup?.data?.length > 0 ?
                                            _alertsPopup?.data.map((item) => (
                                                <div key={item.id}>
                                                    <div className="grid grid-flow-row p-1">
                                                        <div className={`text-center self-center py-1 ${item.type === 'warning' ? 'bg-[#FF0000] text-white dark:text-slate-200' : item.type === 'watch' ? ' bg-[#FFFF00] text-slate-600' : item.type === 'statement' ? 'bg-[#7F7F7F] text-slate-100' : item.type === 'advisory' ? 'bg-[#7F7F7F] text-slate-100' : null}`}>
                                                            <p className='text-xs whitespace-pre-line capitalize font-medium'>{item.headline} </p>
                                                        </div>
                                                        <div className="text-center self-center max-w-xs">
                                                            <p className="text-xs font-medium text-gray-900 dark:text-slate-400">{item.area} </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 pb-1 max-w-xs">
                                                        <div className="text-right self-center">
                                                            <p className="text-xs text-gray-900 dark:text-slate-400">{i18n.t('common:effective')} : </p>
                                                        </div>
                                                        <div className="self-center text-xs">
                                                            <p>{item.effective}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3 pb-1 max-w-xs">
                                                        <div className="text-right self-center">
                                                            <p className="text-xs text-gray-900 dark:text-slate-400">{i18n.t('common:expires')} : </p>
                                                        </div>
                                                        <div className="self-center text-xs">
                                                            <p>{item.expires}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid pb-1 px-1 max-w-xs">
                                                        <div className="mb-1">
                                                            <p className="text-xs text-center text-gray-900 dark:text-slate-400">Description </p>
                                                        </div>
                                                        <div className=" max-w-xs overflow-y-auto max-h-20 border-t dark:border-t-gray-600">
                                                            <p className="text-xs whitespace-normal p-2 text-justify text-gray-900 dark:text-slate-400">{item.description} </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            : null
                                    }
                                </div>
                            </div>
                        }
                        <div>
                            <div className="px-3">
                                {
                                    !isClickPlayBtn ?
                                        <>
                                            <button type="button" className="px-3 py-2 text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80" onClick={handlePlayBtn}>
                                                <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1.984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L2.506 1.139A1 1 0 0 0 1 1.984Z" />
                                                </svg>
                                                <span className="sr-only">Play</span>
                                            </button>
                                        </>
                                        :
                                        <>
                                            <button type="button" className="px-3 py-2 text-white bg-gradient-to-br from-orange-400 to-pink-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-orange-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm shadow-lg shadow-orange-500/50 dark:shadow-lg dark:shadow-orange-800/80" onClick={handlePlayBtn}>
                                                <svg className="w-3 h-3 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                                                    <path fillRule="evenodd" d="M0 .8C0 .358.32 0 .714 0h1.429c.394 0 .714.358.714.8v14.4c0 .442-.32.8-.714.8H.714a.678.678 0 0 1-.505-.234A.851.851 0 0 1 0 15.2V.8Zm7.143 0c0-.442.32-.8.714-.8h1.429c.19 0 .37.084.505.234.134.15.209.354.209.566v14.4c0 .442-.32.8-.714.8H7.857c-.394 0-.714-.358-.714-.8V.8Z" clipRule="evenodd" />
                                                </svg>
                                                <span className="sr-only">Pause</span>
                                            </button>
                                            <span id="info"></span>
                                        </>
                                }
                            </div>
                            <div className=" flex-auto">
                                <WeatherMapInfo radarTime={radarTime} isClickPlayBtn={isClickPlayBtn} />
                            </div>
                        </div>
                    </div>
        </section>
    )
}

export default MapPane;


