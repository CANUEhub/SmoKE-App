"use client";

import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import NavBar from "../ui/navbar";
import { format, startOfHour, subHours, addHours, isAfter, setHours, getHours, toDate } from "date-fns";
import Player from "../ui/current/player";
import ThemeClient from "../ui/themeClient";
import { useState } from "react";
import Legend from "../ui/legend";

const mapConfig = {
    "center": [0, 0],

    "kansasCityLonLat": [-94.579228, 39.135386],
    "blueSpringsLonLat": [-94.279851, 39.03412],
    "markerImage24" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-24.png",
    "markerImage32" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png",
    "markerImage64" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-64.png"
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


import MapPane from "../ui/mapPane";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];
const totalSeconds = 71;


export default function OpenLayers() {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(9);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timestamp, setTimestamp] = useState(null);


  const isAfter12UTC = (currentTimestamp) => {
    // Convert the current timestamp to a Date object
    const currentDate = toDate(new Date(currentTimestamp));

    // Set the hours to 12:00 UTC
    const twelveUTC = setHours(currentDate, 12);

    // Check if the current timestamp is after 12:00 UTC
    return isAfter(currentDate, twelveUTC);
  }



  const generateHourlyTimestamps = (startTime, endTime) => {
    const timestamps = [];
    let currentTimestamp = new Date(startTime);
  
    while (isAfter(new Date(endTime), currentTimestamp)) {
      timestamps.push(format(currentTimestamp, "yyyy-MM-dd'T'HH:mm:ssxxx"));
      currentTimestamp = addHours(currentTimestamp, 1);
    }
  
    timestamps.push(format(new Date(endTime), "yyyy-MM-dd'T'HH:mm:ssxxx"));
  
    return timestamps;
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

  const handlePlayback = () => {
    setIsRunning(!isRunning);
  }

  const handleTimeChange = (evt) => {

    console.log("handle time change", evt.target.value);
    setSeconds(evt.target.value);
    setIsRunning(false);
  }

  const handleStepTimeChange = (time) => {

    console.log("handle step time change", time);
    setSeconds(time);
    setIsRunning(false);


  }

  const getTimestamp = (timestamp) => {

    setTimestamp(timestamp)
  }

  //const timestampsArray = generateTimestamps();

  return (
    <main>
      <ThemeClient>
      <NavBar></NavBar>
      <MapPane/>
      <Legend
            thresholds={LEGEND_THRESHOLDS}
            unit={"PM2.5 (ug/m3)"}
            historical={false}
          />
      </ThemeClient>
    </main>
  );
}