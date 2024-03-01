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
        const bbox = '...'; // define your bounding box
        const timestampsArray = ['...']; // define your timestamps array
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