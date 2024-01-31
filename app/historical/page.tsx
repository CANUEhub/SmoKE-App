"use client";

import Map, { Source, Layer, NavigationControl } from "react-map-gl";
import { useState, useRef } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "../ui/navbar";
import Sidebar from "../ui/historical/sidebar";
import LayerButtons from "../ui/historical/layerButtons";
import BottomChartBar from "../ui/historical/bottomChartBar";

import { format, startOfHour, formatISO, addHours } from "date-fns";
import Button from '@mui/material/Button';
import useInterval from '../hooks/useInterval'
import Dropdown from '../ui/dropdown';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import ThemeClient from "../ui/themeClient";
import Image from 'next/image'

import settlements from "../../public/data/settlements.json";
import LayerTypes from '../../public/data/raster_data.json'

import classes from "../page.module.css";
import { log, table } from "console";

export default function Page() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const features = settlements.features;
  const [community, setCommunity] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [historicalLayer, setHistoricalLayer] = useState(null);
  const [yearArray, setYearArray] = useState([]);
  const [mapboxStyle, setmapboxStyle] = useState('mapbox://styles/mapbox/light-v9');
  const [layer, setLayer] = useState(null);
  const [layerType, setLayerType] = useState('');
  const [year, setYear] = useState(null);
  const mapRef = useRef(null);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [bottomBarOpen, setBottomBarOpen] = useState<boolean>(false);
  const [splineData, setSplineData] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [popupLon, setPopupLon] = useState(null);
  const [popupLat, setPopupLat] = useState(null);
  const [aqhiData, setAqhiData] = useState(null);
  const [popupLoading, setPopupLoading] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const totalSeconds = 62;
  // layers 

  const settlementSource = {
    id: "settlementSource",
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

  
  const wmsLayer = {
    id: 'radar-layer',
    'type': 'raster',
    'source': 'radar',
    'paint': {
      'raster-fade-duration': 0,
      "raster-opacity": 0.5
    }
  };


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
      setChartLoading(true);
      handleCommunityChange(featureLayer.id);
      console.log('featureLayer:', featureLayer);
      if(year){

          loadSplineData(featureLayer.id,year)
      }
    } else {
      return;
    }
  }

  const handlePopupClose = () => {
    setPopupLoading(false);
    //setShowPopup(false);
  }

  const loadSplineData = (id, yr) => {
    console.log('loadSplineData id: ',id)
    console.log('loadSplineData year: ',yr)
    axios.get('/pm25daily', {
        params: { sett_id: id, year: yr  }
      })
        .then((response) => {
          console.log("response", response.data.message)
          setSplineData(response.data.message);
          console.log("aqhi", aqhiData);
        }).finally(() => {
          setChartLoading(false);
        })
        .catch((e) => { console.log(e) });
  }


  const handleLayerChange = (layerType) => {
    console.log('layer Type change',layerType);
    setLayerType(layerType)
    const newLayer = LayerTypes.find((layer)=> layer.id === layerType);
    setHistoricalLayer(newLayer);
    setYearArray(newLayer.years)
    setmapboxStyle(newLayer.mapboxUrl)
    setSidebarOpen(true)
  }

  const handleLayerYearChange = (year) => {
    console.log('year change', year.value);
    const layerName = `${historicalLayer.prefix}${year.value}`
    setYear(year.value)
    setmapboxStyle(year.mapboxUrl)
    handleMapLayerChange(layerName, year.value);
    if(community){
        setBottomBarOpen(true);
    }

  }

  const handleMapLayerChange = (value, year) => {
    const currentlayers = mapRef.current.getStyle().layers
    loadSplineData(community, year);

    if (layer) {
        mapRef.current.getMap().setLayoutProperty(layer, 'visibility', 'none');
      }
      
      setLayer(value);
      console.log('layer:', value);

    const visibility = mapRef.current.getMap().getLayoutProperty(
        value,
        'visibility'
      );
  
      if (visibility === "none") {
        mapRef.current.getMap().setLayoutProperty(value, 'visibility', 'visible');
      } else if (visibility === "visible") {
        mapRef.current.getMap().setLayoutProperty(value, 'visibility', 'none');
      }

  }





  const handleCommunityChange = (value) => {
    if (value === '') {
      return;
    }
    console.log("handleCommunityChange value", value)
    setCommunity(value);
    const sett = features.find((feature, index) => {
      return feature.id == value
    });
    const evt = new Event("click");
    if(layerType && year) {
        console.log('called')
        loadSplineData(value, year);
    }
    zoomToSelectedLoc(evt, sett, value);
  }



  const zoomToSelectedLoc = (e, sett, index) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setCommunity(index);
    console.log('community', index);
    setCommunityName(sett.properties.community_name);
    mapRef.current.flyTo({ center: [sett.geometry.coordinates[0], sett.geometry.coordinates[1]], zoom: 12 });
    setSidebarOpen(true);
    if(year && layerType){
        setBottomBarOpen(true);
    }
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
          mapStyle={mapboxStyle}
          style={{ zIndex: 1, height: "100vh" }}
          initialViewState={{ latitude: 50.582, longitude: -105.599, zoom: 3 }}
          maxZoom={20}
          minZoom={1}
          styleDiffing={false}
          interactiveLayerIds={["clusters", "unclustered-point"]}
          onClick={onMapClick}
        >
          <NavBar></NavBar>
          { !sidebarOpen ? (
              <Dropdown onChildStateChange={handleCommunityChange}></Dropdown>

          ):(
              <Sidebar 
                isOpen={sidebarOpen} 
                layerType={historicalLayer} 
                onYearChange={handleLayerYearChange} 
                yearArray={yearArray}
                dropdown={handleCommunityChange}
                communityName={communityName}
                />
                
                )}

          <LayerButtons 
            layerChange={handleLayerChange} 
            layerType={layerType}/>
          { bottomBarOpen && (

          <BottomChartBar
                  isOpen={bottomBarOpen}
                  isLoading={chartLoading}
                  spline={splineData}
                  layerType={layerType}
                />
          )}
          <Source {...settlementSource}>
            <Layer {...clusteredSettlementLayer} />
            <Layer {...settlementClusterNumber} />
            <Layer {...unclusteredSettlementPointLayer} />
          </Source>
          <NavigationControl position='bottom-right' />

        </Map>
      </ThemeClient>
    </main>
  );
}