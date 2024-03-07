// pages/MapPage.js
"use client";
import { useEffect, useRef, useState } from 'react';
import Map from 'ol/Map';
import StadiaMaps from 'ol/source/StadiaMaps';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import View from 'ol/View';
import { getCenter } from 'ol/extent';
import { transformExtent } from 'ol/proj';

export default function DynamicMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [animationId, setAnimationId] = useState<number | null>(null);
  const [frameRate, setFrameRate] = useState(0.5);

  useEffect(() => {
    if (!mapContainer.current) return;

    function threeHoursAgo() {
      return new Date(Math.round(Date.now() / 3600000) * 3600000 - 3600000 * 3);
    }

    const extent = transformExtent([-126, 24, -66, 50], 'EPSG:4326', 'EPSG:3857');
    let startDate = threeHoursAgo();

    const layers = [
      new TileLayer({
        source: new StadiaMaps({
          layer: 'stamen_terrain',
        }),
      }),
      new TileLayer({
        extent: extent,
        source: new TileWMS({
          attributions: ['Iowa State University'],
          url: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r-t.cgi',
          params: { 'LAYERS': 'nexrad-n0r-wmst' },
        }),
      }),
    ];

    const map = new Map({
      layers: layers,
      target: mapContainer.current,
      view: new View({
        center: getCenter(extent),
        zoom: 4,
      }),
    });

    function updateInfo() {
      const el = document.getElementById('info');
      if (el) {
        el.innerHTML = startDate.toISOString();
      }
    }

    function setTime() {
      startDate.setMinutes(startDate.getMinutes() + 15);
      if (startDate > Date.now()) {
        startDate = threeHoursAgo();
      }
      layers[1].getSource().updateParams({ 'TIME': startDate.toISOString() });
      updateInfo();
    }

    function play() {
      stop();
      const id = window.setInterval(setTime, 1000 / frameRate);
      setAnimationId(id);
    }

    function stop() {
      if (animationId !== null) {
        window.clearInterval(animationId);
        setAnimationId(null);
      }
    }

    return () => {
      stop();
    };
  }, [mapContainer, frameRate]);

  return (
    <div>
      <div role="group" aria-label="Animation controls">
        <button onClick={() => play()}>Play</button>
        <button onClick={() => stop()}>Pause</button>
        <span id="info"></span>
      </div>
      <div ref={mapContainer} style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}
