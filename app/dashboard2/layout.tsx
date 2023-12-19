"use client";

import Map, { Marker, NavigationControl, GeolocateControl } from "react-map-gl";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "../ui/navbar";
import classes from "./page.module.css";
import { useParams, useRouter } from 'next/navigation'
import settlements from "../../public/data/settlements.json";


export default function Layout({ children }: { children: React.ReactNode }) {

  const params = useParams<{ community: string; lon: string; lat:string; }>()
  const router = useRouter()
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [community, setCommunity] = useState(Number(params.community));
  const mapRef = useRef(null);
  const features = settlements.features;

  const handleCommunityChange = (value) => {

    if(value === ''){
      return;
    }
    const sett = features.find((feature,index) => {
      setCommunity(index);
      return feature.id == value
    });
    const evt = new Event("click");
    zoomToSelectedLoc(evt, sett, community)
  }

  const zoomToSelectedLoc = (e, sett, index) => {
    // stop event bubble-up which triggers unnecessary events
    e.stopPropagation();
    mapRef.current.flyTo({ center: [sett.geometry.coordinates[0], sett.geometry.coordinates[1]], zoom: 10 });
    router.push(`/dashboard/${index}/${sett.geometry.coordinates[0]}/${sett.geometry.coordinates[1]}`);
  };

  return (
      <main className={classes.mainStyle}>
        <NavBar onChildStateChange={handleCommunityChange} ></NavBar>
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          mapStyle="mapbox://styles/mapbox/light-v11"
          className={classes.mapStyle}
          initialViewState={{ latitude: Number(params.lat), longitude: Number(params.lon), zoom: 10 }}
          maxZoom={20}
          minZoom={3}
        >
            <Marker
                key={params.community}
                latitude={Number(params.lat)}
                longitude={Number(params.lon)}
                color="orange"
              >
              </Marker>

        </Map>
      </main>
  )
}
