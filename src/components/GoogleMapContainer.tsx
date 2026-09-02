import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_MAPS_API_KEY } from '../services/mapEngineService';
import { Coordinates, ItineraryStop, NavigationStep } from '../types';

interface GoogleMapContainerProps {
  center: Coordinates;
  zoom: number;
  stops: ItineraryStop[];
  activeStopId?: string;
  onSelectStop?: (stop: ItineraryStop) => void;
  onStartNavToStop?: (stop: ItineraryStop) => void;
  showTraffic: boolean;
  userLocation?: Coordinates;
  navigationSteps?: NavigationStep[];
  currentNavStepIndex?: number;
}

export const GoogleMapContainer: React.FC<GoogleMapContainerProps> = ({
  center,
  zoom,
  stops,
  activeStopId,
  onSelectStop,
  onStartNavToStop,
  showTraffic,
  userLocation,
  navigationSteps,
  currentNavStepIndex = 0,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load Google Maps API script dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      setIsLoaded(true);
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    if (document.getElementById(scriptId)) {
      const interval = setInterval(() => {
        if ((window as any).google?.maps) {
          setIsLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&v=weekly`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError('Google Maps API failed to load. Please check network or API key.');
    };

    document.head.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: center.lat, lng: center.lng },
          zoom: zoom,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#c9e2eb' }],
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f7f4ed' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }],
            },
            {
              featureType: 'poi',
              elementType: 'geometry',
              stylers: [{ color: '#e5ede3' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#d8e8d5' }],
            },
          ],
        });

        mapInstanceRef.current = map;
        trafficLayerRef.current = new google.maps.TrafficLayer();
      } else {
        mapInstanceRef.current.setCenter({ lat: center.lat, lng: center.lng });
        mapInstanceRef.current.setZoom(zoom);
      }
    } catch (err) {
      console.warn('Google map init error:', err);
    }
  }, [isLoaded, center.lat, center.lng, zoom]);

  // Traffic Layer toggle
  useEffect(() => {
    if (!trafficLayerRef.current || !mapInstanceRef.current) return;
    if (showTraffic) {
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    } else {
      trafficLayerRef.current.setMap(null);
    }
  }, [showTraffic, isLoaded]);

  // Render Stop Markers & Polylines
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Clear old polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    // Add Stop Markers
    stops.forEach((stop, idx) => {
      const isSelected = stop.id === activeStopId;
      const markerPosition = { lat: stop.coordinates.lat, lng: stop.coordinates.lng };
      bounds.extend(markerPosition);

      // SVG Pin with Day/Number
      const pinSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46" fill="none">
          <path d="M19 0C8.50659 0 0 8.50659 0 19C0 32.5 19 46 19 46C19 46 38 32.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="${isSelected ? '#2C362B' : '#D9734E'}"/>
          <circle cx="19" cy="18" r="13" fill="#FFFFFF"/>
          <text x="19" y="23" font-size="12" font-family="sans-serif" font-weight="bold" fill="${isSelected ? '#2C362B' : '#D9734E'}" text-anchor="middle">${idx + 1}</text>
        </svg>
      `;

      const marker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        title: stop.title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSvg),
          scaledSize: new google.maps.Size(34, 42),
          anchor: new google.maps.Point(17, 42),
        },
        zIndex: isSelected ? 999 : 100 + idx,
      });

      const infoContent = document.createElement('div');
      infoContent.className = 'p-2 max-w-[240px] font-sans text-left';
      infoContent.innerHTML = `
        <h4 class="font-bold text-sm text-[#2C362B] mb-1">${stop.title}</h4>
        <p class="text-xs text-[#8A9389] line-clamp-2 mb-2">${stop.subtitle || stop.locationName}</p>
        <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
          <span class="font-semibold text-[#D9734E]">Day ${stop.dayNumber}</span>
          <span class="text-gray-500">${stop.timeSlot || ''}</span>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
      });

      marker.addListener('click', () => {
        if (onSelectStop) onSelectStop(stop);
        infoWindow.open(map, marker);
      });

      if (isSelected) {
        infoWindow.open(map, marker);
      }

      markersRef.current.push(marker);
    });

    // Draw route lines connecting itinerary stops or turn-by-turn steps
    if (navigationSteps && navigationSteps.length > 0) {
      const pathCoordinates = navigationSteps.map((s) => ({
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
      }));

      const routePolyline = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#D9734E',
        strokeOpacity: 0.9,
        strokeWeight: 6,
        map: map,
      });

      polylinesRef.current.push(routePolyline);
    } else if (stops.length > 1) {
      const stopCoordinates = stops.map((s) => ({
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
      }));

      const stopsPolyline = new google.maps.Polyline({
        path: stopCoordinates,
        geodesic: true,
        strokeColor: '#D9734E',
        strokeOpacity: 0.7,
        strokeWeight: 4,
        map: map,
      });

      polylinesRef.current.push(stopsPolyline);
    }

    if (stops.length > 1 && !activeStopId) {
      map.fitBounds(bounds, 60);
    }
  }, [isLoaded, stops, activeStopId, navigationSteps, onSelectStop]);

  // Live User Location Marker
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !userLocation) return;
    const map = mapInstanceRef.current;

    const userSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="#3B82F6" fill-opacity="0.25"/>
        <circle cx="14" cy="14" r="7" fill="#2563EB" stroke="#FFFFFF" stroke-width="2.5"/>
      </svg>
    `;

    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: map,
        title: 'Your Current Position',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(userSvg),
          scaledSize: new google.maps.Size(28, 28),
          anchor: new google.maps.Point(14, 14),
        },
        zIndex: 1000,
      });
    } else {
      userMarkerRef.current.setPosition({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [isLoaded, userLocation]);

  return (
    <div className="relative w-full h-full bg-[#f7f4ed]">
      {loadError ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-[#2C362B]">
          <span className="material-symbols-outlined text-4xl text-[#D9734E] mb-2">map_search</span>
          <p className="font-serif text-lg font-bold">Google Maps Engine Ready</p>
          <p className="text-xs text-[#8A9389] max-w-sm mt-1">{loadError}</p>
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full" />
      )}
    </div>
  );
};
