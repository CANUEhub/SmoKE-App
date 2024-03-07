"use client";

import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Icon, Style } from "ol/style";
import { format, startOfHour, subHours, addHours, isAfter, setHours, getHours, toDate } from "date-fns";
import { useState } from "react";
const mapConfig = {
    "center": [0, 0],

    "kansasCityLonLat": [-94.579228, 39.135386],
    "blueSpringsLonLat": [-94.279851, 39.03412],
    "markerImage24" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-24.png",
    "markerImage32" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-32.png",
    "markerImage64" : "https://cdn2.iconfinder.com/data/icons/social-media-and-payment/64/-47-64.png"
}


import MapPane from "../ui/mapPane";

const geojsonObject = mapConfig.geojsonObject;
const geojsonObject2 = mapConfig.geojsonObject2;
const markersLonLat = [mapConfig.kansasCityLonLat, mapConfig.blueSpringsLonLat];
const totalSeconds = 71;


export default function Home() {
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(9);

  const [showLayer1, setShowLayer1] = useState(true);
  const [showLayer2, setShowLayer2] = useState(true);
  const [showMarker, setShowMarker] = useState(false);
  const [seconds, setSeconds] = useState(0);

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

  const timestampsArray = generateTimestamps();

  return (
    <div className="p-0 h-['100%']">
      <MapPane/>
    </div>
  );
}