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
import Player from "../ui/current/player";
import { format, startOfHour, subHours, addHours, isAfter, setHours, getHours, toDate } from "date-fns";

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
    const [isClickPlayBtn, setIsClickPlayBtn] = useState(true);
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
    const [seconds, setSeconds] = useState(0);
    const [isTimestampLoaded, setIsTimestampLoaded] = useState(false);
    //const [timestampsArray, setTimestampsArray] = useState([]);

    const totalSeconds = 71;
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

    const handleTimeChange = (evt) => {

        console.log("handle time change", evt.target.value);
        setSeconds(evt.target.value);

        const allLayers = map?.current.getAllLayers();
        const getSmokeLayer = allLayers.find((item) => item.values_.title === layerSourceInfo[1].name);
        console.log('getSmokeLayer', getSmokeLayer);

        setRadarTime(radarTime => {
            var radarCurrTime = new Date(radarTime.current);
                radarCurrTime.setUTCMinutes(radarCurrTime.getUTCMinutes() + 60);
            var localTime = radarCurrTime.toLocaleString(navigator.local, dateOptions);
            var newRadarCurrTime = timestampsArray[evt.target.value];
            getSmokeLayer.getSource().updateParams({ 'TIME': newRadarCurrTime });
            console.log('getSmokeLayer.getSource()', getSmokeLayer.getSource());
            var isoTime = radarCurrTime.toISOString().substring(0, 16) + "Z";

            console.log('handleTimeChange isoTime', isoTime);
            console.log('radarTime', radarTime);

            return {
                ...radarTime,
                current: newRadarCurrTime,
                local: localTime,
                iso: isoTime
            }
        });
        setIsClickPlayBtn(true);
        setIsClickPlayBtn(false);
      }
    
      const handleStepTimeChange = (time) => {
    
        console.log("handle step time change", time);
        setSeconds(time);
        setIsClickPlayBtn(false);
    
    
      }

      // Helper function to add leading zeros to single digit numbers
const addLeadingZero = (num) => (num < 10 ? `0${num}` : num);

// Function to generate 72-hour intervals between two timestamps
const generateIntervals = (startTimestamp, endTimestamp) => {
  const intervals = [];
  const start = new Date(startTimestamp);
  const end = new Date(endTimestamp);

  // Calculate the time difference in milliseconds
  const timeDiff = end - start;
  const hourDiff = 1000 * 60 * 60;

  // Calculate the number of intervals
  const numIntervals = 72;

  // Generate intervals
  for (let i = 0; i < numIntervals; i++) {
    const intervalTime = new Date(start.getTime() + i * (timeDiff / numIntervals));
    const year = intervalTime.getUTCFullYear();
    const month = addLeadingZero(intervalTime.getUTCMonth() + 1);
    const date = addLeadingZero(intervalTime.getUTCDate());
    const hours = addLeadingZero(intervalTime.getUTCHours());
    const minutes = addLeadingZero(intervalTime.getUTCMinutes());
    const seconds = addLeadingZero(intervalTime.getUTCSeconds());

    intervals.push(`${year}-${month}-${date}T${hours}:${minutes}:${seconds}Z`);
  }

  return intervals;
};

const isAfter12UTC = (currentTimestamp) => {
    // Convert the current timestamp to a Date object
    const currentDate = toDate(new Date(currentTimestamp));

    // Set the hours to 12:00 UTC
    const twelveUTC = setHours(currentDate, 12);

    // Check if the current timestamp is after 12:00 UTC
    return isAfter(currentDate, twelveUTC);
  }

  const generateTimestamps = () => {
    const currentTimestamp = toDate(new Date()); // get as utc
    const timestamps = [];
    const result = getHours(currentTimestamp)
    if (isAfter12UTC(currentTimestamp)) {

      if (seconds === 0) {
        setSeconds(result - 12);
      }

      for (let i = 0; i < totalSeconds; i++) {
        const timestamp = startOfHour(addHours(setHours(currentTimestamp, 12), i));
        const formattedTimestamp = format(timestamp, "yyyy-MM-dd'T'HH:mm'Z'");
        timestamps.push(formattedTimestamp);
      }
      return timestamps;
    } else {
      if (seconds === 0) {
        setSeconds(result);
      }

      for (let i = 0; i < totalSeconds; i++) {
        const timestamp = startOfHour(addHours(setHours(currentTimestamp, 0), i));
        const formattedTimestamp = format(timestamp, "yyyy-MM-dd'T'HH:mm:ss'Z'");
        timestamps.push(formattedTimestamp);
      }

      return timestamps;
    }
  };

  const timestampsArray = generateTimestamps();

  // console.log('mapPane timestampsArray:', timestampsArray);

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

            const aqhiVector = new VectorSource({
                url: 'https://raw.githubusercontent.com/CANUEhub/SmoKE-App/main/public/data/settlements.json',
                format: new GeoJSON()
            });

            const aqhiVectorLayer = new VectorLayer({
                source: aqhiVector,
                opacity: 1
            });

            aqhiVectorLayer.setStyle(
                new Style({
                    image: new Icon({
                        crossOrigin: 'anonymous',
                        src: 'https://img.icons8.com/nolan/64/map-pin.png',
                        scale: 0.3,
                    }),
                })
            );

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
                layers: [airSurfaceTempLayer, raqdpsLayer, weatherAlertsLayer, aqhiVectorLayer]
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

            // map?.current.on('singleclick', function (event) {

            //     const coordinate = event.coordinate;
            //     const toStringCoordinate = toStringXY(toLonLat(coordinate), 4);

            //     const pinLocCircle = new CircleStyle({
            //         radius: 5,
            //         fill: new Fill({
            //             color: '#16a34a',
            //         }),
            //         stroke: new Stroke({ color: '#22d3ee', width: 1 }),
            //     });
            //     const pinLocStyle = new Style({
            //         image: pinLocCircle,
            //     });

            //     const pinFeature = new Feature({
            //         geometry: new Point(event.coordinate),
            //     });

            //     const pinLayerSource = new VectorSource({
            //         features: [pinFeature]
            //     });

            //     pinLocLayer.getSource().clear();
            //     pinLocLayer.setSource(pinLayerSource);
            //     pinLocLayer.setStyle(pinLocStyle);

            //     overlay.setPosition(coordinate);
            //     setIsLoading(true);

            //     //findAqhiFeatures(coordinate);
            //     findAstFeatures(coordinate);
            //     findAlertsFeatures(coordinate);

            //     setAirTableData(data => {
            //         return { ...data, coordinate: toStringCoordinate }
            //     });

            // });

            setLayerGroupList(layerGroup.getLayers());
            setLayerLegendList(layerGroup.getLayers());
        }
        const layers = map?.current.getLayers().array_;
        const findMapboxLayer = layers.find((item) => item.values_.id === 'mapbox');
            findMapboxLayer.setVisible(true);
            //findLightLayer.setVisible(true)
            // findDarkLayer.setVisible(false);

        //setTimestampsArray(generateTimestamps());
        //setIsTimestampLoaded(true);
        

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
                    const timestamp = generateIntervals(startTime,endTime);
                    // console.log('timestamps', timestamp);
                    // setTimestampsArray(timestamp);
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
                    console.log('newRadarCurrTime', newRadarCurrTime);
                        getSmokeLayer.getSource().updateParams({ 'TIME': newRadarCurrTime });
                    var isoTime = radarCurrTime.toISOString().substring(0, 16) + "Z";
                    console.log('isoTime type', typeof isoTime);
                    console.log('isoTime type', isoTime);
                    console.log('radarTime', radarTime);

                    const secondIndex = timestampsArray.findIndex((element,index) =>{ 
                        //console.log('element', element)
                        return element == isoTime
                    });
                    console.log('secondIndex ', secondIndex)
                    

                    if (isoTime >= radarTime.end) {
                        setSeconds(0);
                        return {
                            ...radarTime,
                            current: radarTime.start,
                            local: localTime,
                            iso: isoTime
                        }
                    }
                    setSeconds(secondIndex);
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

    }, [initMap, isClickPlayBtn, isNewTimeVal, seconds]);

    const sectionRef = useRef(null);

    return (
        <section ref={sectionRef}>

                    <div className="max-sm:col-start-1 max-sm:col-span-1">
                        <div className="mapRef" id='mapRef' ref={mapRef} style={{height: '100vh'}}>
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
                            <Player
              onPlaybackChange={handlePlayBtn}
              onTimeChange={handleTimeChange}
              onStepChange={handleStepTimeChange}
              isPlaying={isClickPlayBtn}
              totalSeconds={totalSeconds}
              currentSeconds={seconds}
              timeStamps={timestampsArray}
            />
                    </div>
        </section>
    )
}

export default MapPane;

