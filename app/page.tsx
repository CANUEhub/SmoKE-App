"use client";

import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "./ui/navbar";
import PM25Chart from "./ui/pm25barchart";
import BiaxialLineChart from "./ui/dailylinechart";
import { useRouter } from 'next/navigation'
import { Box, Container } from '@mui/system';
import Paper from '@mui/material/Paper';


import settlements from "../public/data/settlements.json";
import classes from "./page.module.css";

interface GeoJSONFeature {
  type: string;
  properties: {
    name: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
}

export default function Home() {

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const features = settlements.features;
  const [community, setCommunity] = useState('');
  const [communityName, setCommunityName] = useState('');
  const mapRef = useRef(null);
  const router = useRouter()

  // useEffect(() => {
  //   fetch('http://147.182.150.83:8443/api/3/action/datastore_search?resource_id=ecf18f46-ec4f-43f5-85ec-02347768e153&limit=5')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data)
  //       setLoading(false)
  //     })
  // }, [])

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

  const handleLayerChange = (value) => {
    if(value === ''){
      return;
    }
    console.log("handleLayerChange value", value)
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

  return (
      <main className={classes.mainStyle}>
        <NavBar onChildStateChange={handleCommunityChange} onLayerChange={handleLayerChange} ></NavBar>

        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/light-v11"
          style={{zIndex: 1, height: "100%", width: "100%"}}
          initialViewState={{ latitude: 60.582, longitude: -105.599, zoom: 4 }}
          maxZoom={20}
          minZoom={3}
        >

          {features.map((sett, index: number) => {
            return (
              <Marker
                key={index}
                latitude={sett.geometry.coordinates[1]}
                longitude={sett.geometry.coordinates[0]}
                color="orange"
              >
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={(e) => zoomToSelectedLoc(e, sett, index)}
                >
                <RoomOutlinedIcon/>
                </button>
              </Marker>

            );

          })}


        </Map>
        
        {community && 
        <div className="barCharts" style={{position: "absolute", top: 100, left: 0, zIndex: 2}}>
        <Paper variant="elevation"><h2>{communityName}</h2></Paper>
        <Paper variant="elevation"><PM25Chart community={community}></PM25Chart></Paper>
        </div>
        
        } 

        {community && 
        <div className="barCharts" style={{position: "absolute", bottom: 0, left: 0, zIndex: 2}}>

        <Paper variant="elevation"><BiaxialLineChart/></Paper>
        </div>
        
        } 
        
        

      </main>
  )
}
