'use client';

import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showMarker?: boolean;
  showServiceArea?: boolean;
}

declare global {
  interface Window {
    google: any;
    googleMapsLoaded?: boolean;
    initGoogleMaps?: () => void;
  }
}

export default function GoogleMap({ 
  center = { lat: 13.1579, lng: -61.2248 },
  zoom = 10,
  height = '256px',
  showMarker = true,
  showServiceArea = false
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeMap = () => {
      if (!window.google || !window.google.maps) return;
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: 'roadmap',
      });

      mapInstanceRef.current = map;

      // Add marker for main office/base location
      if (showMarker) {
        const marker = new window.google.maps.Marker({
          position: center,
          map,
          title: 'Ranchie Taxi - Saint Vincent',
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
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

        const serviceArea = new window.google.maps.Polygon({
          paths: serviceAreaCoords,
          strokeColor: '#ea580c',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#ea580c',
          fillOpacity: 0.15
        });
        
        serviceArea.setMap(map);
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Check if script is already loading or loaded
    if (window.googleMapsLoaded) {
      // Wait for it to finish loading
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          initializeMap();
        }
      }, 100);
      
      // Clear interval after 10 seconds to prevent infinite loop
      setTimeout(() => clearInterval(checkInterval), 10000);
      return;
    }

    // Mark as loading
    window.googleMapsLoaded = true;

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBwGQlYvLODysT5Lgd0k-VRp0jzp2_-ix8&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeMap();
    };
    
    script.onerror = (error) => {
      console.error('Error loading Google Maps:', error);
      window.googleMapsLoaded = false;
    };

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${script.src}"]`);
    if (!existingScript) {
      document.head.appendChild(script);
    } else {
      // Script exists, wait for it to load
      if (window.google && window.google.maps) {
        initializeMap();
      } else {
        existingScript.addEventListener('load', initializeMap);
      }
    }

    // Cleanup
    return () => {
      mapInstanceRef.current = null;
    };
  }, [center.lat, center.lng, zoom, showMarker, showServiceArea]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden"
    />
  );
}