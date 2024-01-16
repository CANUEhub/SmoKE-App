// pages/index.js
"use client"
import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl';

const Home = () => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef(null);
  const [imageSources, setImageSources] = useState([]);

  useEffect(() => {
    // Your API call to fetch and cache images goes here
    // (Similar to the previous example)

    // Fetch and cache images
    const fetchAndCacheImages = async () => {
      const timestamps = ['2024-01-16T18:00:00Z', '2024-01-16T19:00:00Z', '2024-01-16T20:00:00Z', '2024-01-16T21:00:00Z', '2024-01-16T22:00:00Z', '2024-01-16T23:00:00Z', '2024-01-17T00:00:00Z', '2024-01-17T01:00:00Z', '2024-01-17T02:00:00Z', '2024-01-17T03:00:00Z', '2024-01-17T04:00:00Z', '2024-01-17T05:00:00Z', '2024-01-17T06:00:00Z', '2024-01-17T07:00:00Z', '2024-01-17T08:00:00Z', '2024-01-17T09:00:00Z', '2024-01-17T10:00:00Z', '2024-01-17T11:00:00Z', '2024-01-17T12:00:00Z', '2024-01-17T13:00:00Z', '2024-01-17T14:00:00Z', '2024-01-17T15:00:00Z', '2024-01-17T16:00:00Z', '2024-01-17T17:00:00Z', '2024-01-17T18:00:00Z', '2024-01-17T19:00:00Z', '2024-01-17T20:00:00Z'
        // ... (add other timestamps)
      ];

      const newImageSources = timestamps.map((timestamp, index) => {
        const filename = `image_${timestamp.replace(/:/g, '_')}.png`;

        // Assuming the images are in the public/images directory
        const imagePath = `/images/${filename}`;

        return {
          id: `image-source-${index}`,
          type: 'image',
          url: imagePath,
          coordinates: [
            [-180, 90],
            [180, 90],
            [180, -90],
            [-180, -90]
          ]
        };
      });

      setImageSources(newImageSources);
    };

    fetchAndCacheImages();
  }, []);

  return (
    <div>
      <Map
        ref={mapRef}
        width="100%"
        height="400px"
        latitude={0}  // Adjust as needed
        longitude={0} // Adjust as needed
        zoom={2}      // Adjust as needed
        mapboxAccessToken={mapboxToken}
      >
        {imageSources.map((imageSource) => (
          <Source key={imageSource.id} id={imageSource.id} type={imageSource.type} url={imageSource.url} coordinates={imageSource.coordinates}>
            <Layer type="raster" id={`image-layer-${imageSource.id}`} source={imageSource.id} />
          </Source>
        ))}
      </Map>
    </div>
  );
};

export default Home;