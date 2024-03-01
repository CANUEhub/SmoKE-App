"use client";

import Map, { Source, Marker, Layer, Popup, NavigationControl } from "react-map-gl";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "../ui/navbar";
import Player from "../ui/current/player";
import Forecast from "../ui/current/forecast";
import { useRouter } from 'next/navigation'
import { format, startOfHour, subHours, addHours, isAfter, setHours, getHours, toDate } from "date-fns";
import Button from '@mui/material/Button';
import useInterval from '../hooks/useInterval'
import Dropdown from '../ui/dropdown';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import ThemeClient from "../ui/themeClient";
import Image from 'next/image'

import settlements from "../../public/data/settlements.json";
import classes from "../page.module.css";
import { log, table } from "console";
import Legend from "../ui/legend";

export default function Page() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const features = settlements.features;
  const router = useRouter();
  const [community, setCommunity] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [layer, setLayer] = useState(null);
  const mapRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [aqhiData, setAqhiData] = useState(null);
  const [popupLoading, setPopupLoading] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [startSecondIndex, setStartSecondIndex] = useState(null);
  const [cursor, setCursor] = useState<string>('auto');

  const totalSeconds = 71;


  useEffect(() => {

    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const screenWidth = window.innerWidth;
    console.log("screenWidth", screenWidth)

    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.push('/auth');
    }
    else if (isMobile || screenWidth < 1271) {
      router.push('/mobile');
    }

  }, []);
  // layers 

  // historical raste layer

  const settlementSource = {
    id: "settlementSource",
    type: 'geojson',
    data: settlements
  };

  const clusteredSettlementLayer = {
    id: 'clusters',
    type: 'circle',
    source: 'settlementSource',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#0ca296',
      'circle-radius': 20
    }
  }

  const settlementClusterNumber = {
    id: 'cluster-count',
    type: 'symbol',
    source: 'settlementSource',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12
    }
  }

  const unclusteredSettlementPointLayer = {
    id: 'unclustered-point',
    type: 'circle',
    source: 'settlementSource',
    paint: {
      'circle-color': '#0ca296',
      'circle-radius': 5,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }

  }

  const LEGEND_THRESHOLDS = [
    {
      threshold: '1-10',
      color: '#00CCFF'
    },
    {
      threshold: '10-20',
      color: '#0099CC'
    },
    {
      threshold: '20-30',
      color: '#006699'
    },
    {
      threshold: '30-40',
      color: '#FFFF00'
    },
    {
      threshold: '40-50',
      color: '#FFCC00'
    },
    {
      threshold: '50-60',
      color: '#FF6666'
    },
    {
      threshold: '60-70',
      color: '#FF0000'
    },
    {
      threshold: '70-80',
      color: '#CC0000'
    },
    {
      threshold: '80-90',
      color: '#990000'
    }
  ];

  const fetchForecast = (featureLayerID) => {
    console.log('featureLayer.id', featureLayerID)
    axios.get('/forecast', {
      params: { sett_id: featureLayerID }
    })
      .then((response) => {
        console.log("response", response.data.message[0])
        setAqhiData(response.data.message[0]);
        console.log("aqhi", aqhiData);
      }).finally(() => {
        setPopupLoading(false);
      })
      .catch((e) => { console.log(e) });
  }

  const onMapClick = (evt: mapboxgl.MapLayerMouseEvent) => {

    if (!mapRef || !evt.features) {
      return;
    }

    const mapboxSource = mapRef.current.getSource('settlementSource');
    const featureLayer = evt.features[0];

    if (!featureLayer) {
      return;
    }

    if (featureLayer.layer.id === "clusters") {
      const clusterId = featureLayer.properties.cluster_id;
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        mapRef.current.easeTo({
          center: featureLayer.geometry.coordinates,
          zoom,
          duration: 600
        });
      });
    } else if (featureLayer.layer.id === "unclustered-point") {
      console.log(featureLayer.properties['Community_'])
      // setCommunityName(featureLayer.properties['Community_'])
      setCommunityName(featureLayer.properties['Community_']);
      handleCommunityChange(featureLayer.properties.commid);
    } else {
      return;
    }
  }

  const handlePopupClose = () => {
    setPopupLoading(false);
    setShowPopup(false);
  }

  const handlePlayback = () => {
    setIsRunning(!isRunning);
  }

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
        const formattedTimestamp = format(timestamp, "yyyy-MM-dd'T'HH:mm:ss'Z'");
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

  const wmsLayer = {
    id: 'radar-layer',
    'type': 'raster',
    'source': 'radar',
    'paint': {
      'raster-fade-duration': 0,
      "raster-opacity": 0.5
    }
  };

  const timestampsArray = generateTimestamps();

  useInterval(() => {
    setLayer({
      "type": "raster",
      "tiles": [
        `https://geo.weather.gc.ca/geomet?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=RAQDPS-FW.SFC_PM2.5&TIME=${timestampsArray[seconds]}`
      ],
      "tileSize": 256
    })
    if (seconds === totalSeconds) {
      console.log('hit', seconds)
      setSeconds(0);
    } else {
      setSeconds(seconds + 1);
    }
  }, isRunning ? 2500 : null);


  const handleCommunityChange = (value) => {
    if (value === '') {
      return;
    }
    fetchForecast(value);
    setShowPopup(true);
    setPopupLoading(true);
    const sett = features.find((feature, index) => {
      return feature.properties.commid == value
    });
    setCommunityName(sett.properties['Community_']);
    const evt = new Event("click");
    zoomToSelectedLoc(evt, sett, value);
  }


  const handleStepTimeChange = (time) => {

    console.log("handle time change", time);
    setSeconds(time);
    setIsRunning(false);
    setLayer({
      "type": "raster",
      "tiles": [
        `https://geo.weather.gc.ca/geomet?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=RAQDPS-FW.SFC_PM2.5&TIME=${timestampsArray[seconds]}`
      ],
      "tileSize": 256
    })

  }
  const handleTimeChange = (evt) => {

    console.log("handle time change", evt.target.value);
    setSeconds(evt.target.value);
    setIsRunning(false);
    setLayer({
      "type": "raster",
      "tiles": [
        `https://geo.weather.gc.ca/geomet?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=RAQDPS-FW.SFC_PM2.5&TIME=${timestampsArray[seconds]}`
      ],
      "tileSize": 256
    })
  }

  const zoomToSelectedLoc = (e, sett, index) => {
    e.stopPropagation();
    setCommunity(index.toString());
    mapRef.current.flyTo({ center: [sett.geometry.coordinates[0], sett.geometry.coordinates[1]], zoom: 12 });

  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  }

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('grab'), []);


  return (
    <main className={classes.mainStyle}>
      <ThemeClient>

        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          onLoad={handleMapLoad}
          mapStyle="mapbox://styles/mapbox/light-v9"
          style={{ zIndex: 1, height: "100vh" }}
          initialViewState={{ latitude: 50.582, longitude: -105.599, zoom: 3 }}
          maxZoom={20}
          minZoom={1}
          cursor={cursor}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          interactiveLayerIds={["clusters", "unclustered-point"]}
          onClick={onMapClick}
        >
          <NavigationControl position='bottom-right' />
          <NavBar onChildStateChange={handleCommunityChange}  ></NavBar>
          <Dropdown
            onChildStateChange={handleCommunityChange}
            communityName={communityName} />
          {layer && (
            <Source {...layer}>
              <Layer {...wmsLayer}></Layer>
            </Source>
          )}

          <Source {...settlementSource}>
            {/* <Layer {...clusteredSettlementLayer} />
            <Layer {...settlementClusterNumber} /> */}
            <Layer {...unclusteredSettlementPointLayer} />
          </Source>

          {mapLoaded && (

            <Player
              onPlaybackChange={handlePlayback}
              onTimeChange={handleTimeChange}
              onStepChange={handleStepTimeChange}
              isPlaying={isRunning}
              totalSeconds={totalSeconds}
              currentSeconds={seconds}
              timeStamps={timestampsArray}
            />
          )}

          {mapLoaded && (
          <Legend
            thresholds={LEGEND_THRESHOLDS}
            unit={"PM2.5 (ug/m3)"}
            historical={false}
          />
          )}

          {showPopup && (
            <Forecast
              forcastObject={aqhiData}
              settlementName={communityName}
              isLoading={popupLoading}
              handleClose={handlePopupClose}
            />
          )}


        </Map>
      </ThemeClient>
    </main>
  );
}