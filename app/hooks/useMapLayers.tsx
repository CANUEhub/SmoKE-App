import { useState, useEffect } from 'react';
import axios from 'axios';

interface LayerData {
  url: string;
}

export const useMapLayers = () => {
  const [layers, setLayers] = useState<LayerData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bbox = 'bbox-epsg-3857'; // define your bounding box
        const timestampsArray = ['2024-03-04T12:00:00Z', '2024-03-04T13:00:00Z', '2024-03-04T14:00:00Z', '2024-03-04T15:00:00Z', '2024-03-04T16:00:00Z', '2024-03-04T17:00:00Z', '2024-03-04T18:00:00Z', '2024-03-04T19:00:00Z', '2024-03-04T20:00:00Z', '2024-03-04T21:00:00Z', '2024-03-04T22:00:00Z', '2024-03-04T23:00:00Z', '2024-03-05T00:00:00Z', '2024-03-05T01:00:00Z', '2024-03-05T02:00:00Z', '2024-03-05T03:00:00Z', '2024-03-05T04:00:00Z', '2024-03-05T05:00:00Z', '2024-03-05T06:00:00Z', '2024-03-05T07:00:00Z', '2024-03-05T08:00:00Z', '2024-03-05T09:00:00Z', '2024-03-05T10:00:00Z', '2024-03-05T11:00:00Z', '2024-03-05T12:00:00Z', '2024-03-05T13:00:00Z', '2024-03-05T14:00:00Z', '2024-03-05T15:00:00Z', '2024-03-05T16:00:00Z', '2024-03-05T17:00:00Z', '2024-03-05T18:00:00Z', '2024-03-05T19:00:00Z', '2024-03-05T20:00:00Z', '2024-03-05T21:00:00Z', '2024-03-05T22:00:00Z', '2024-03-05T23:00:00Z', '2024-03-06T00:00:00Z', '2024-03-06T01:00:00Z', '2024-03-06T02:00:00Z', '2024-03-06T03:00:00Z', '2024-03-06T04:00:00Z', '2024-03-06T05:00:00Z', '2024-03-06T06:00:00Z', '2024-03-06T07:00:00Z', '2024-03-06T08:00:00Z', '2024-03-06T09:00:00Z', '2024-03-06T10:00:00Z', '2024-03-06T11:00:00Z', '2024-03-06T12:00:00Z', '2024-03-06T13:00:00Z', '2024-03-06T14:00:00Z', '2024-03-06T15:00:00Z', '2024-03-06T16:00:00Z', '2024-03-06T17:00:00Z', '2024-03-06T18:00:00Z', '2024-03-06T19:00:00Z', '2024-03-06T20:00:00Z', '2024-03-06T21:00:00Z', '2024-03-06T22:00:00Z', '2024-03-06T23:00:00Z', '2024-03-07T00:00:00Z', '2024-03-07T01:00:00Z', '2024-03-07T02:00:00Z', '2024-03-07T03:00:00Z', '2024-03-07T04:00:00Z', '2024-03-07T05:00:00Z', '2024-03-07T06:00:00Z', '2024-03-07T07:00:00Z', '2024-03-07T08:00:00Z', '2024-03-07T09:00:00Z', '2024-03-07T10:00:00Z']; // define your timestamps array
        const fetchedLayers: LayerData[] = [];

        for (const timestamp of timestampsArray) {
          const response = await axios.get(`https://geo.weather.gc.ca/geomet?bbox=${bbox}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=RAQDPS-FW.SFC_PM2.5&TIME=${timestamp}`);
          fetchedLayers.push({ url: response.request.responseURL });
        }

        setLayers(fetchedLayers);
      } catch (error) {
        console.error('Error fetching layers:', error);
      }
    };

    fetchData();
  }, []);

  return layers;
};