"use client";

import Map, { Layer, Source } from "react-map-gl";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "./ui/navbar";
import PM25Chart from "./ui/pm25barchart";
import ThemeClient from "./ui/themeClient";
import BiaxialLineChart from "./ui/dailylinechart";
import { useRouter } from 'next/navigation'
import { Box, Container } from '@mui/system';
import Paper from '@mui/material/Paper';
import type { RasterLayer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import type { GeoJSONSource } from 'mapbox-gl';


import settlements from "../public/data/settlements.json";
import classes from "./page.module.css";
import { FeatureCollection } from "geojson";

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
  const [layer, setLayer] = useState('');
  const mapRef = useRef(null);
  const router = useRouter()

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
    //const mapboxSource = mapRef;
    console.log("mapboxSource", mapboxSource)
    const featureLayer = evt.features[0];
    console.log("featureLayer", featureLayer)

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
      handleCommunityChange(featureLayer.id)
    } else {
      return;
    }
  }

  const handleCommunityChange = (value) => {
    if (value === '') {
      return;
    }
    console.log('value: ', value);
    console.log("handleCommunityChange value", value)
    const sett = features.find((feature, index) => {
      return feature.id == value
    });
    const evt = new Event("click");
    zoomToSelectedLoc(evt, sett, value);
  }

  const handleLayerChange = (value) => {
    if (value === '') {
      console.log('no layer');
      return;
    }

    console.log("handleLayerChange value", value)
    const currentlayers = mapRef.current.getStyle().layers
    console.log("layers", currentlayers);

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
      <ThemeClient>
        <NavBar></NavBar>

        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/canue/clqwmwemm00oe01nvflki6c3q"
          style={{ zIndex: 1, height: "100%", width: "100%" }}
          initialViewState={{ latitude: 60.582, longitude: -105.599, zoom: 4 }}
          maxZoom={20}
          minZoom={3}
          interactiveLayerIds={["clusters", "unclustered-point"]}
          onClick={onMapClick}
        >
          <Source {...settlementSource}>
            <Layer {...clusteredSettlementLayer} />
            <Layer {...settlementClusterNumber} />
            <Layer {...unclusteredSettlementPointLayer} />
          </Source>
          <Layer {...customLayer} />
        </Map>

        {/* {community &&
          <div className="barCharts" style={{ position: "absolute", top: 100, left: 0, zIndex: 2 }}>
            <Paper variant="elevation"><h2>{communityName}</h2></Paper>
            <Paper variant="elevation"><PM25Chart community={community}></PM25Chart></Paper>
          </div>

        }

        {community &&
          <div className="barCharts" style={{ position: "absolute", bottom: 0, left: 0, zIndex: 2 }}>
            <Paper variant="elevation"><BiaxialLineChart /></Paper>
          </div>
        } */}


      </ThemeClient>
    </main>
  )
}
