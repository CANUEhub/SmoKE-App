"use client";

import Map, { Source, Marker, Layer, Popup } from "react-map-gl";
import type { AnySource } from 'react-map-gl';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import type { LayerProps } from 'react-map-gl';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "../ui/navbar";
import Player from "../ui/current/player";
import Forecast from "../ui/current/forecast";
import { useRouter } from 'next/navigation'
import { format, startOfHour, formatISO, addHours } from "date-fns";
import Button from '@mui/material/Button';
import useInterval from '../hooks/useInterval'
import { PlayArrowSharp } from "@mui/icons-material";
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton } from "@mui/material";
import Slider from "@mui/material/Slider";
import Dropdown from '../ui/dropdown';
import CircularProgress from '@mui/material/CircularProgress';
import { featureCollection, lineString, along, featureEach, lineDistance } from '@turf/turf'
import Brightness1RoundedIcon from '@mui/icons-material/Brightness1Rounded';
import parse from 'html-react-parser';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import ThemeClient from "../ui/themeClient";
import Image from 'next/image'

import settlements from "../../public/data/settlements.json";
import classes from "../page.module.css";
import { log, table } from "console";

export default function Page() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const features = settlements.features;
  const [community, setCommunity] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [layer, setLayer] = useState(null);
  const mapRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupLon, setPopupLon] = useState(null);
  const [popupLat, setPopupLat] = useState(null);
  const [aqhiData, setAqhiData] = useState(null);
  const [popupLoading, setPopupLoading] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] =  useState<boolean>(false);
  const totalSeconds = 62;
// layers 

  // historical raste layer

  const customLayer: RasterLayer = {
    id: 'AQHI_2021_avg',
    type: 'raster',
    source: 'mapbox',
  };

  const settlementSource = {
    id:"settlementSource",
    type: 'geojson',
    data: settlements,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
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
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#0ca296',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }

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
          duration: 500
        });
      });
    } else if (featureLayer.layer.id === "unclustered-point") {
      console.log("featureLayer", featureLayer)
      setPopupLat(featureLayer.properties.lat);
      setPopupLon(featureLayer.properties.lon);
      setShowPopup(true);
      setPopupLoading(true);
      handleCommunityChange(featureLayer.id);

    axios.get('/api',{
      params: { sett_id: featureLayer.id }
    })
      .then((response) => {
        console.log("response", response.data.message[0])
        setAqhiData(response.data.message[0]);
        console.log("aqhi", aqhiData);
    }).finally(()=> {
      setPopupLoading(false);
    })
    .catch((e) => { console.log(e)});
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

  const generateTimestamps = () => {
    const currentTimestamp = new Date();
    const timestamps = [];

    // Generate timestamps for the next 72 hours (every hour)
    for (let i = 0; i < totalSeconds; i++) {
      const timestamp = startOfHour(addHours(currentTimestamp, i));
      const formattedTimestamp = timestamp.toISOString().slice(0, -5) + 'Z';
      timestamps.push(formattedTimestamp);
    }

    return timestamps;
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
    // Your custom logic here
    setLayer({
      "type": "raster",
      "tiles": [
        `https://geo.weather.gc.ca/geomet?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=RAQDPS-FW.SFC_PM2.5&TIME=${timestampsArray[seconds]}`
      ],
      "tileSize": 256
    })
    if (seconds === totalSeconds - 2) {
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
    console.log("handleCommunityChange value", value)
    const sett = features.find((feature, index) => {
      return feature.id == value
    });
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
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setCommunity(index.toString());
    setCommunityName(sett.properties.community_name);
    mapRef.current.flyTo({ center: [sett.geometry.coordinates[0], sett.geometry.coordinates[1]], zoom: 12 });

    //router.push("/dashboard");


  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  }

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
        interactiveLayerIds={["clusters", "unclustered-point"]}
        onClick={onMapClick}
      >
        <NavBar onChildStateChange={handleCommunityChange}  ></NavBar>
        <Dropdown onChildStateChange={handleCommunityChange}></Dropdown>
        {layer && (
          <Source {...layer}>
            <Layer {...wmsLayer}></Layer>
          </Source>
        )}

              {showPopup && (
      <Popup longitude={popupLon} latitude={popupLat}
        anchor="bottom"
        onClose={() => handlePopupClose()}>
        
       {!popupLoading && (
        <div style={{padding: "2em"}}>

        <table>
          <tbody>
          <tr>
    <td>aqhi_cur_val</td><td>{aqhiData.aqhi_cur_val}</td>
</tr>
<tr>
    <td>aqhi_maxovermorrow</td><td>{aqhiData.aqhi_maxovermorrow}</td>
</tr>
<tr>
    <td>aqhi_maxtoday</td><td>{aqhiData.aqhi_maxtoday}</td>
</tr>
<tr>
    <td>aqhi_maxtomorrow</td><td>{aqhiData.aqhi_maxtomorrow}</td>
</tr>
<tr>
    <td>pm25_cur</td><td>{aqhiData.pm25_cur}</td>
</tr>
<tr>
    <td>pm25_maxovermorrow</td><td>{aqhiData.pm25_maxovermorrow}</td>
</tr>
<tr>
    <td>pm25_maxtoday</td><td>{aqhiData.pm25_maxtoday}</td>
</tr>
<tr>
    <td>pm25_maxtomorrow</td><td>{aqhiData.pm25_maxtomorrow}</td>
</tr>
<tr>
    <td>prec_sumovermorrow</td><td>{aqhiData.prec_sumovermorrow}</td>
</tr>
<tr>
    <td>prec_sumtoday</td><td>{aqhiData.prec_sumtoday}</td>
</tr>
<tr>
    <td>prec_sumtomorrow</td><td>{aqhiData.prec_sumtomorrow}</td>
</tr>
<tr>
    <td>temp_cur</td><td>{aqhiData.temp_cur}</td>
</tr>
<tr>
    <td>temp_maxovermorrow</td><td>{aqhiData.temp_maxovermorrow}</td>
</tr>
<tr>
    <td>temp_maxtoday</td><td>{aqhiData.temp_maxtoday}</td>
</tr>
<tr>
    <td>temp_maxtomorrow</td><td>{aqhiData.temp_maxtomorrow}</td>
</tr>
          </tbody>
        </table>
        </div>
       )}
       {popupLoading && (
         <CircularProgress/>
       )}
      </Popup>)}


          <Source {...settlementSource}>
            <Layer {...clusteredSettlementLayer} />
            <Layer {...settlementClusterNumber} />
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

{showPopup && (
          <Forecast forcastObject={aqhiData}/>
)}
<Forecast forcastObject={aqhiData}/>

      </Map>
      </ThemeClient>
    </main>
  );
}