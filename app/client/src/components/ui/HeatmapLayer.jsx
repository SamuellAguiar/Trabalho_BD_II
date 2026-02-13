import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points }) => {
     const map = useMap();

     useEffect(() => {
          if (!points || points.length === 0) return;

          const heatData = points.map(p => [p.lat, p.lng, 0.8]); 

          const heat = L.heatLayer(heatData, {
               radius: 25,
               blur: 15,
               maxZoom: 17,
               gradient: { 0.4: 'blue', 0.65: 'lime', 1: 'red' }
          }).addTo(map);

          return () => {
               map.removeLayer(heat);
          };
     }, [points, map]);

     return null;
};

export default HeatmapLayer;