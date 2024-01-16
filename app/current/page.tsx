"use client";

import Map, { Source, Marker, Layer } from "react-map-gl";
import type {AnySource} from 'react-map-gl';
import type {LayerProps} from 'react-map-gl';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "../ui/navbar";
import Player from "../ui/player";
import { useRouter } from 'next/navigation'
import { format, startOfHour, formatISO, addHours } from "date-fns";
import Button from '@mui/material/Button';
import useInterval from '../hooks/useInterval'
import { PlayArrowSharp } from "@mui/icons-material";
import PauseIcon from '@mui/icons-material/Pause';
import { IconButton } from "@mui/material";
import Slider from "@mui/material/Slider";
import {featureCollection, lineString, along, featureEach, lineDistance} from '@turf/turf'



import settlements from "../../public/data/settlements.json";
import classes from "../page.module.css";

export default function Page() {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    const features = settlements.features;
    const [community, setCommunity] = useState('');
    const [communityName, setCommunityName] = useState('');
    const [layer, setLayer] = useState(null);
    const mapRef = useRef(null);
    const router = useRouter()
    let rectCollection = featureCollection([]);
    let initLoad = true;
    const [pointData, setPointData] = useState(null);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [delay, setDelay] = useState(2500);


  const wmsLayerSource: AnySource = {
      "type": "raster",
      "tiles": [ "https://geo.weather.gc.ca/geomet?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=RAQDPS-FW.SFC_PM2.5-DIFF"],
      "tileSize": 256
  }

  const generateTimestamps = () => {
    const currentTimestamp = new Date();
    const timestamps = [];
  
    // Generate timestamps for the next 72 hours (every hour)
    for (let i = 0; i < 72; i++) {
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
      if(seconds === 71){
        setSeconds(0)
      } else{
        setSeconds(seconds + 1);
      }
    }, isRunning ? delay: null);


    const handleCommunityChange = (value) => {
        if(value === ''){
          return;
        }
        console.log("handleCommunityChange value", value)
        const sett = features.find((feature,index) => {
          return feature.id == value
        });
        const evt = new Event("click");
        zoomToSelectedLoc(evt, sett, value);
      }

      const zoomToSelectedLoc = (e, sett, index) => {
        // stop event bubble-up which triggers unnecessary events
        e.stopPropagation();
        setCommunity(index.toString());
        setCommunityName(sett.properties.community_name);
        console.log("Sett", sett.properties.community_name);
        mapRef.current.flyTo({ center: [sett.geometry.coordinates[0], sett.geometry.coordinates[1]], zoom: 10 });
        //router.push("/dashboard");
          };

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
            
    return (
        <main className={classes.mainStyle}>
        <NavBar onChildStateChange={handleCommunityChange} ></NavBar>
        {/* <Player></Player> */}
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          // onLoad={loadWMSLayer}
          mapStyle="mapbox://styles/mapbox/light-v9"
          style={{zIndex: 1, height: "100%", width: "100%"}}
          initialViewState={{ latitude: 50.582, longitude: -105.599, zoom: 3 }}
          maxZoom={20}
          minZoom={1}
        >
        {layer && (
        <Source {...layer}>
          <Layer {...wmsLayer}></Layer>
        </Source>
        )}
        <div>
        <IconButton style={{background:"black" }}aria-label="Play"  onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? (
          <PlayArrowSharp fontSize="large" style={{ color: "white" }} />
    ) : (
          <PauseIcon fontSize="large" style={{ color: "white" }} />
    )
   }
        </IconButton>
        <Slider
        value={seconds}
  aria-label="Temperature"
  defaultValue={0}
  valueLabelDisplay="auto"
  step={1}
  marks
  min={0}
  max={72}
  onChange={handleTimeChange}
/>
        </div>
        </Map>
        
      </main>
        );
  }