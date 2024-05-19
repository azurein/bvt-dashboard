'use client';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import useGeoData from '@/hooks/useGeoData';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [previewLayer, setPreviewLayer] = useState<L.GeoJSON | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const { geoData, loading, error } = useGeoData();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([-6.174929, 106.8260753], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && !error && mapInstance.current) {
      geoData.forEach((data) => {
        const geoJson = JSON.parse(data.geoJson);
        L.geoJSON(geoJson).addTo(mapInstance.current!);
      });
    }
  }, [loading, error, geoData]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && mapInstance.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const geojsonData = JSON.parse(e.target.result as string);
          if (previewLayer) {
            mapInstance.current?.removeLayer(previewLayer);
          }
          const layer = L.geoJSON(geojsonData, {
            style: { color: 'red' },
          }).addTo(mapInstance.current!);
          setPreviewLayer(layer);
          setPreviewData(geojsonData);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = async () => {
    if (!previewData) return;

    setSaveLoading(true);

    const token = Cookies.get('accessToken');
    try {
      const geoJsonDataString = JSON.stringify(previewData);
      await axios.post('/api/proxy?path=api/geodata', { geoJson: geoJsonDataString }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (previewLayer) {
        previewLayer.setStyle({ color: 'green' });
        setPreviewLayer(null);
        setPreviewData(null);
      }
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="relative h-full w-full">
      {isLoggedIn && (
        <div className="flex justify-center my-4">
          <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer mr-4">
            Upload GeoJSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {previewLayer && (
          <button
            onClick={handleSave}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${saveLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={saveLoading}
          >
            {saveLoading ? 'Saving...' : 'Save'}
          </button>
        )}
        </div>
      )}
      <div ref={mapRef} className="h-full w-full"></div>
    </div>
  );
};

export default MapComponent;
