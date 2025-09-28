'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showMarker?: boolean;
  showServiceArea?: boolean;
}

export default function GoogleMap({ 
  center = { lat: 13.1579, lng: -61.2248 },
  zoom = 10,
  height = '256px',
  showMarker = true,
  showServiceArea = false
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: 'AIzaSyBwGQlYvLODysT5Lgd0k-VRp0jzp2_-ix8',
      version: 'weekly',
    });

    loader.load().then(() => {
      if (mapRef.current && !mapInstanceRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: 'roadmap',
        });

        mapInstanceRef.current = map;

        // Add marker for main office/base location
        if (showMarker) {
          const marker = new google.maps.Marker({
            position: center,
            map,
            title: 'Ranchie Taxi - Saint Vincent',
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
          });

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <strong>Ranchie Taxi</strong><br>
                Serving all of Saint Vincent<br>
                24/7 Service Available<br>
                📞 1784-493-2354
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }

        // Add service area overlay
        if (showServiceArea) {
          const serviceAreaCoords = [
            { lat: 13.378, lng: -61.194 },
            { lat: 13.378, lng: -61.120 },
            { lat: 13.250, lng: -61.120 },
            { lat: 13.090, lng: -61.200 },
            { lat: 13.090, lng: -61.280 },
            { lat: 13.250, lng: -61.280 },
            { lat: 13.378, lng: -61.194 }
          ];

          const serviceArea = new google.maps.Polygon({
            paths: serviceAreaCoords,
            strokeColor: '#ea580c',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#ea580c',
            fillOpacity: 0.15
          });
          
          serviceArea.setMap(map);
        }
      }
    }).catch((error) => {
      console.error('Error loading Google Maps:', error);
    });

    // Cleanup
    return () => {
      mapInstanceRef.current = null;
    };
  }, [center, zoom, showMarker, showServiceArea]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
}