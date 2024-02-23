"use client";

import Map, { Source, Layer } from "react-map-gl";
import { useState, useRef, useEffect, useCallback } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "../ui/navbar";
import Sidebar from "../ui/historical/sidebar";
import LayerButtons from "../ui/historical/layerButtons";
import BottomChartBar from "../ui/historical/bottomChartBar";
import { useRouter } from 'next/navigation'
import { format, startOfHour, formatISO, addHours } from "date-fns";
import Dropdown from '../ui/dropdown';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import ThemeClient from "../ui/themeClient";

import settlements from "../../public/data/settlements.json";
import LayerTypes from '../../public/data/raster_data.json'

import classes from "../page.module.css";


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
  const [year, setYear] = useState('');
  const mapRef = useRef(null);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [bottomBarOpen, setBottomBarOpen] = useState<boolean>(false);
  const [splineData, setSplineData] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [adminArea, setAdminArea] = useState(null);
  const [isRunning, setIsRunning] = useState(true);
  const [popupLon, setPopupLon] = useState(null);
  const [popupLat, setPopupLat] = useState(null);
  const [popupLoading, setPopupLoading] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [annualData, setAnnualData] = useState(null);
  const totalSeconds = 62;
  const router = useRouter();
  const [cursor, setCursor] = useState<string>('auto');

  useEffect(() => {
    // Check if the user is authenticated
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const screenWidth = window.innerWidth;

    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.push('/auth');
    } 
    else if(isMobile || screenWidth < 1271) {
      router.push('/mobile');
    }
  }, []);
  // layers 

  const settlementSource = {
    id: "settlementSource",
    type: 'geojson',
    data: settlements
  };

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
const LAYER_TYPES = {
    pm25:'pm25',
    aqhi:'aqhi',
    temp:'temp',
    precip:'precip',
    burn:'burn'
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
      setChartLoading(true);
      setCommunityName(featureLayer.properties['Community_'])
      handleCommunityChange(featureLayer.properties.commid);

      console.log('featureLayer:', featureLayer);
      if(year){

          loadSplineData(layerType, featureLayer.id, year)
      }
    } else {
      return;
    }
  }

  const loadSplineData = (layerType, id, yr) => {
    setChartLoading(true);
    if (layerType === LAYER_TYPES.pm25){
        axios.get('/pm25daily', {
            params: { sett_id: id, year: yr  }
          })
            .then((response) => {
              setSplineData(response.data.message);
              //console.log("pm25 data", response.data.message);
            }).finally(() => {
              setChartLoading(false);
            })
            .catch((e) => { console.log(e) });

            axios.get('/aggregated_pm25', {
              params: { sett_id: id, year: yr  }
            })
              .then((response) => {
                setAnnualData(response.data.message[0]);
                console.log("aggregated data", response.data.message);
              }).finally(() => {
                setChartLoading(false);
              })
              .catch((e) => { console.log(e) });
    } else if (layerType === LAYER_TYPES.aqhi){
        axios.get('/aqhidaily', {
            params: { sett_id: id, year: yr  }
          })
            .then((response) => {
              console.log("Spline Data AQHI", response.data.message);
              setSplineData(response.data.message);
            })
            .catch((e) => { console.log(e) });

            axios.get('/aggregated_aqhi', {
              params: { sett_id: id, year: yr  }
            })
              .then((response) => {
                setAnnualData(response.data.message[0]);
              }).finally(() => {
                setChartLoading(false);
              })
              .catch((e) => { console.log(e) });
    } else {
        return;
    }

  }


  const handleLayerChange = (layerType) => {
    setLayerType(layerType)
    const newLayer = LayerTypes.find((layer)=> layer.id === layerType);
    setHistoricalLayer(newLayer);
    setYearArray(newLayer.years)
    setmapboxStyle(newLayer.mapboxUrl)
    setChartLoading(true);
    setYear('');
    setAnnualData(null);
    setSidebarOpen(true);
    setBottomBarOpen(false);
    console.log('handleLayerYearChange newLayer.years', newLayer.years)
  }

  const handleLayerYearChange = (year) => {
    console.log('handleLayerYearChange', year)
    const layerName = `${historicalLayer.prefix}${year.value}`
    setYear(year.value)
    setmapboxStyle(year.mapboxUrl)
    handleMapLayerChange(layerName, year.value, layerType);
    if(community){
        setBottomBarOpen(true);
    }

  }

  const handleMapLayerChange = (value, year, layerType) => {
    loadSplineData(layerType, community, year);


    if (layer) {
        mapRef.current.getMap().setLayoutProperty(layer, 'visibility', 'none');
      }
      
      setLayer(value);

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
      return feature.properties.commid == value
    });
    setCommunityName(sett.properties['Community_'])
    const evt = new Event("click");
    if(layerType && year) {
        loadSplineData(layerType, value, year);
    }
    zoomToSelectedLoc(evt, sett, value);
  }



  const zoomToSelectedLoc = (e, sett, index) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    setCommunity(index);
    console.log('community', index);
    setCommunityName(sett.properties['Community_'])
    mapRef.current.flyTo({ center: [sett.geometry.coordinates[0], sett.geometry.coordinates[1]], zoom: 12 });
    setSidebarOpen(true);
    if(year){
        setBottomBarOpen(true);
    }
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
          mapStyle={mapboxStyle}
          style={{ zIndex: 1, height: "100vh" }}
          initialViewState={{ latitude: 50.582, longitude: -105.599, zoom: 3 }}
          maxZoom={20}
          minZoom={1}
          styleDiffing={false}
          cursor={cursor}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          interactiveLayerIds={["clusters", "unclustered-point"]}
          onClick={onMapClick}
        >
          <NavBar></NavBar>
          { !sidebarOpen ? (
              <Dropdown onChildStateChange={handleCommunityChange} communityName={communityName}></Dropdown>

          ):(
              <Sidebar 
                isOpen={sidebarOpen} 
                layerType={historicalLayer} 
                onYearChange={handleLayerYearChange} 
                yearArray={yearArray}
                dropdown={handleCommunityChange}
                communityName={communityName}
                yearValue={year}
                barData={annualData}
                isLoading={chartLoading}
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
            <Layer {...unclusteredSettlementPointLayer} />
          </Source>
        </Map>
      </ThemeClient>
    </main>
  );
}