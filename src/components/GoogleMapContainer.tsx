import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
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

  // Leaflet Fallback Refs
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkersRef = useRef<L.Marker[]>([]);
  const leafletPolylinesRef = useRef<L.Polyline[]>([]);
  const leafletUserMarkerRef = useRef<L.Marker | null>(null);
  const leafletTrafficLayerRef = useRef<L.Polyline[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const [showKeyNotice, setShowKeyNotice] = useState(true);

  // Catch Google Maps gm_authFailure globally
  useEffect(() => {
    const originalGmAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn(
        'Google Maps JavaScript API authentication failed or ApiNotActivatedMapError. Switching to high-performance interactive vector fallback.'
      );
      setAuthFailed(true);
      if (typeof originalGmAuthFailure === 'function') {
        try {
          originalGmAuthFailure();
        } catch {
          // ignore
        }
      }
    };

    return () => {
      if ((window as any).gm_authFailure) {
        (window as any).gm_authFailure = originalGmAuthFailure;
      }
    };
  }, []);

  // Load Google Maps API script dynamically
  useEffect(() => {
    if (authFailed) return;

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
      console.warn('Google Maps script failed to load. Enabling interactive vector fallback.');
      setAuthFailed(true);
    };

    document.head.appendChild(script);
  }, [authFailed]);

  // Initialize Native Google Map (if not auth failed)
  useEffect(() => {
    if (authFailed || !isLoaded || !mapContainerRef.current) return;

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
            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e2eb' }] },
            { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f7f4ed' }] },
            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
            { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e5ede3' }] },
            { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d8e8d5' }] },
          ],
        });

        mapInstanceRef.current = map;
        trafficLayerRef.current = new google.maps.TrafficLayer();
      } else {
        mapInstanceRef.current.setCenter({ lat: center.lat, lng: center.lng });
        mapInstanceRef.current.setZoom(zoom);
      }
    } catch (err) {
      console.warn('Google map initialization error:', err);
      setAuthFailed(true);
    }
  }, [isLoaded, center.lat, center.lng, zoom, authFailed]);

  // Google Maps: Traffic Layer toggle
  useEffect(() => {
    if (authFailed || !trafficLayerRef.current || !mapInstanceRef.current) return;
    if (showTraffic) {
      trafficLayerRef.current.setMap(mapInstanceRef.current);
    } else {
      trafficLayerRef.current.setMap(null);
    }
  }, [showTraffic, isLoaded, authFailed]);

  // Google Maps: Render Markers & Polylines
  useEffect(() => {
    if (authFailed || !isLoaded || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    stops.forEach((stop, idx) => {
      const isSelected = stop.id === activeStopId;
      const markerPosition = { lat: stop.coordinates.lat, lng: stop.coordinates.lng };
      bounds.extend(markerPosition);

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

      const infoWindow = new google.maps.InfoWindow({ content: infoContent });

      marker.addListener('click', () => {
        if (onSelectStop) onSelectStop(stop);
        infoWindow.open(map, marker);
      });

      if (isSelected) {
        infoWindow.open(map, marker);
      }

      markersRef.current.push(marker);
    });

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
  }, [isLoaded, stops, activeStopId, navigationSteps, onSelectStop, authFailed]);

  // Google Maps: User Location Marker
  useEffect(() => {
    if (authFailed || !isLoaded || !mapInstanceRef.current || !userLocation) return;
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
  }, [isLoaded, userLocation, authFailed]);

  // ==========================================
  // LEAFLET INTERACTIVE FALLBACK ENGINE
  // ==========================================
  useEffect(() => {
    if (!authFailed || !mapContainerRef.current) return;

    // Clean up container children
    if (!leafletMapRef.current) {
      mapContainerRef.current.innerHTML = '';
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Voyager warm clean map tiles
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      leafletMapRef.current = map;
    } else {
      leafletMapRef.current.setView([center.lat, center.lng], zoom);
    }
  }, [authFailed, center.lat, center.lng, zoom]);

  // Leaflet: Render Markers, Routes, Popups
  useEffect(() => {
    if (!authFailed || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Clear old markers & polylines
    leafletMarkersRef.current.forEach((m) => m.remove());
    leafletMarkersRef.current = [];
    leafletPolylinesRef.current.forEach((p) => p.remove());
    leafletPolylinesRef.current = [];
    leafletTrafficLayerRef.current.forEach((p) => p.remove());
    leafletTrafficLayerRef.current = [];

    const latLngs: L.LatLngTuple[] = [];

    stops.forEach((stop, idx) => {
      const isSelected = stop.id === activeStopId;
      const pos: L.LatLngTuple = [stop.coordinates.lat, stop.coordinates.lng];
      latLngs.push(pos);

      const pinHtml = `
        <div style="position: relative; width: 34px; height: 42px; transform: translate(-50%, -100%); cursor: pointer;">
          <svg width="34" height="42" viewBox="0 0 38 46" fill="none">
            <path d="M19 0C8.50659 0 0 8.50659 0 19C0 32.5 19 46 19 46C19 46 38 32.5 38 19C38 8.50659 29.4934 0 19 0Z" fill="${isSelected ? '#2C362B' : '#D9734E'}"/>
            <circle cx="19" cy="18" r="13" fill="#FFFFFF"/>
            <text x="19" y="23" font-size="13" font-family="sans-serif" font-weight="bold" fill="${isSelected ? '#2C362B' : '#D9734E'}" text-anchor="middle">${idx + 1}</text>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: pinHtml,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
      });

      const marker = L.marker(pos, { icon: customIcon, zIndexOffset: isSelected ? 1000 : 100 + idx }).addTo(map);

      const popupContent = `
        <div style="padding: 4px; font-family: sans-serif; min-width: 190px;">
          <h4 style="font-weight: bold; font-size: 14px; margin: 0 0 4px 0; color: #2C362B;">${stop.title}</h4>
          <p style="font-size: 11px; color: #8A9389; margin: 0 0 8px 0; line-height: 1.4;">${stop.subtitle || stop.locationName}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 4px; font-size: 11px;">
            <span style="font-weight: 700; color: #D9734E;">Day ${stop.dayNumber}</span>
            <span style="color: #666;">${stop.timeSlot || ''}</span>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectStop) onSelectStop(stop);
      });

      if (isSelected) {
        marker.openPopup();
      }

      leafletMarkersRef.current.push(marker);
    });

    // Draw route lines
    if (navigationSteps && navigationSteps.length > 0) {
      const stepCoords: L.LatLngTuple[] = navigationSteps.map((s) => [s.coordinates.lat, s.coordinates.lng]);
      const poly = L.polyline(stepCoords, {
        color: '#D9734E',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      leafletPolylinesRef.current.push(poly);
    } else if (stops.length > 1) {
      const poly = L.polyline(latLngs, {
        color: '#D9734E',
        weight: 4,
        opacity: 0.75,
        dashArray: '8, 8',
      }).addTo(map);
      leafletPolylinesRef.current.push(poly);
    }

    // Traffic Flow Simulation Layer
    if (showTraffic && stops.length > 1) {
      const trafficPoly = L.polyline(latLngs, {
        color: '#10B981',
        weight: 3,
        opacity: 0.8,
      }).addTo(map);
      leafletTrafficLayerRef.current.push(trafficPoly);
    }

    if (stops.length > 1 && !activeStopId && latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    }
  }, [authFailed, stops, activeStopId, navigationSteps, onSelectStop, showTraffic]);

  // Leaflet: User Location
  useEffect(() => {
    if (!authFailed || !leafletMapRef.current || !userLocation) return;
    const map = leafletMapRef.current;
    const pos: L.LatLngTuple = [userLocation.lat, userLocation.lng];

    const userHtml = `
      <div style="position: relative; width: 28px; height: 28px; transform: translate(-50%, -50%);">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.25); position: absolute; top: 0; left: 0;"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563EB; border: 2.5px solid #FFFFFF; position: absolute; top: 7px; left: 7px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-user-gps-pin',
      html: userHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    if (!leafletUserMarkerRef.current) {
      leafletUserMarkerRef.current = L.marker(pos, { icon: userIcon, zIndexOffset: 2000 }).addTo(map);
    } else {
      leafletUserMarkerRef.current.setLatLng(pos);
    }
  }, [authFailed, userLocation]);

  return (
    <div className="relative w-full h-full bg-[#f7f4ed]">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Interactive Vector Fallback Status Badge */}
      {authFailed && showKeyNotice && (
        <div className="absolute bottom-4 left-4 z-[999] max-w-sm bg-white/95 backdrop-blur-md border border-[#2C362B]/10 rounded-2xl p-3 shadow-lg text-[#2C362B] animate-fade-in text-xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 font-bold text-[#D9734E]">
              <span className="material-symbols-outlined text-base">info</span>
              <span>Vector Tile Engine Active</span>
            </div>
            <button
              onClick={() => setShowKeyNotice(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <p className="mt-1 text-gray-600 text-[11px] leading-relaxed">
            Rendering high-performance interactive vector tiles. For full Google Maps satellite &amp; live traffic features, enable{' '}
            <strong>Maps JavaScript API</strong> in Google Cloud Console or add your key via settings.
          </p>
        </div>
      )}
    </div>
  );
};
