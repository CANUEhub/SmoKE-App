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
import TextField from '@mui/material/TextField';


import settlements from "../public/data/settlements.json";
import classes from "./page.module.css";
import { FeatureCollection } from "geojson";


export default function Home() {

  const router = useRouter();


  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      router.push('/auth');
    }
  }, []);

  return (
    <main className={classes.mainStyle}>
      <ThemeClient>
        <h1>smokeinfo.ca is under construction</h1>
      </ThemeClient>
    </main>
  )
}
