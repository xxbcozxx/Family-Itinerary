import React, { useEffect, useRef, useState } from 'react';
import { AMAP_API_KEY, wgs84ToGcj02 } from '../services/mapEngineService';
import { Coordinates, ItineraryStop, NavigationStep } from '../types';

interface AMapContainerProps {
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

export const AMapContainer: React.FC<AMapContainerProps> = ({
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
  const aMapInstanceRef = useRef<any>(null);
  const trafficLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Convert Center to GCJ-02 for AMap
  const gcjCenter = wgs84ToGcj02(center);

  // Load AMap JS API
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).AMap) {
      setIsLoaded(true);
      return;
    }

    // Set AMap security config if required
    (window as any)._AMapSecurityConfig = {
      securityJsCode: '',
    };

    const scriptId = 'amap-js-sdk';
    if (document.getElementById(scriptId)) {
      const interval = setInterval(() => {
        if ((window as any).AMap) {
          setIsLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_API_KEY}&plugin=AMap.Scale,AMap.ToolBar,AMap.Polyline,AMap.Marker`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setLoadError('AMap (AutoNavi) API failed to load. Verifying connection...');
    };

    document.head.appendChild(script);
  }, []);

  // Initialize AMap Map Instance
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || !(window as any).AMap) return;

    try {
      const AMap = (window as any).AMap;

      if (!aMapInstanceRef.current) {
        const map = new AMap.Map(mapContainerRef.current, {
          center: [gcjCenter.lng, gcjCenter.lat],
          zoom: zoom,
          viewMode: '2D',
          mapStyle: 'amap://styles/whitesmoke', // Clean warm neutral style
          lang: 'zh_cn',
        });

        aMapInstanceRef.current = map;
        trafficLayerRef.current = new AMap.TileLayer.Traffic({
          zIndex: 10,
          autoRefresh: true,
          interval: 60,
        });
      } else {
        aMapInstanceRef.current.setCenter([gcjCenter.lng, gcjCenter.lat]);
        aMapInstanceRef.current.setZoom(zoom);
      }
    } catch (err) {
      console.warn('AMap initialization error:', err);
    }
  }, [isLoaded, gcjCenter.lat, gcjCenter.lng, zoom]);

  // Handle Real-time Traffic Layer
  useEffect(() => {
    if (!aMapInstanceRef.current || !trafficLayerRef.current) return;
    try {
      if (showTraffic) {
        trafficLayerRef.current.setMap(aMapInstanceRef.current);
      } else {
        trafficLayerRef.current.setMap(null);
      }
    } catch (e) {
      console.warn('AMap traffic layer error:', e);
    }
  }, [showTraffic, isLoaded]);

  // Render Stop Markers and Polylines
  useEffect(() => {
    if (!isLoaded || !aMapInstanceRef.current || !(window as any).AMap) return;
    const AMap = (window as any).AMap;
    const map = aMapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const pathCoords: any[] = [];

    stops.forEach((stop, idx) => {
      const gcjStop = wgs84ToGcj02(stop.coordinates);
      const isSelected = stop.id === activeStopId;
      const position = [gcjStop.lng, gcjStop.lat];
      pathCoords.push(position);

      const content = `
        <div style="position: relative; width: 36px; height: 44px; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isSelected ? '#2C362B' : '#D9734E'}; border: 3px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: bold; font-size: 13px; font-family: 'Manrope', sans-serif;">
            ${idx + 1}
          </div>
          <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid ${isSelected ? '#2C362B' : '#D9734E'}; margin-top: -2px;"></div>
        </div>
      `;

      const marker = new AMap.Marker({
        position: position,
        content: content,
        offset: new AMap.Pixel(-18, -42),
        title: stop.title,
        zIndex: isSelected ? 999 : 100 + idx,
      });

      const infoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 8px 10px; max-width: 220px; font-family: 'Manrope', sans-serif; font-size: 12px; color: #2C362B;">
            <div style="font-weight: 700; font-size: 13px; margin-bottom: 2px;">${stop.title}</div>
            <div style="color: #8A9389; margin-bottom: 6px;">${stop.subtitle || stop.locationName}</div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #f0ede6; padding-top: 4px;">
              <span style="color: #D9734E; font-weight: 600;">Day ${stop.dayNumber}</span>
              <span style="color: #8A9389;">${stop.timeSlot || ''}</span>
            </div>
          </div>
        `,
        offset: new AMap.Pixel(0, -42),
      });

      marker.on('click', () => {
        if (onSelectStop) onSelectStop(stop);
        infoWindow.open(map, position);
      });

      if (isSelected) {
        infoWindow.open(map, position);
      }

      marker.setMap(map);
      markersRef.current.push(marker);
    });

    // Draw route lines
    if (navigationSteps && navigationSteps.length > 0) {
      const navPath = navigationSteps.map((s) => {
        const gcj = wgs84ToGcj02(s.coordinates);
        return [gcj.lng, gcj.lat];
      });

      polylineRef.current = new AMap.Polyline({
        path: navPath,
        strokeColor: '#D9734E',
        strokeWeight: 6,
        strokeOpacity: 0.9,
        lineJoin: 'round',
        lineCap: 'round',
        showDir: true,
      });
      polylineRef.current.setMap(map);
    } else if (pathCoords.length > 1) {
      polylineRef.current = new AMap.Polyline({
        path: pathCoords,
        strokeColor: '#D9734E',
        strokeWeight: 4,
        strokeOpacity: 0.7,
        lineJoin: 'round',
        lineCap: 'round',
        strokeStyle: 'solid',
      });
      polylineRef.current.setMap(map);
    }

    if (pathCoords.length > 1 && !activeStopId) {
      map.setFitView(markersRef.current, false, [50, 50, 50, 50]);
    }
  }, [isLoaded, stops, activeStopId, navigationSteps, onSelectStop]);

  // Live User Location Marker for AMap
  useEffect(() => {
    if (!isLoaded || !aMapInstanceRef.current || !userLocation || !(window as any).AMap) return;
    const AMap = (window as any).AMap;
    const map = aMapInstanceRef.current;
    const gcjUser = wgs84ToGcj02(userLocation);

    const userContent = `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="position: absolute; inset: 0; background: rgba(37,99,235,0.3); border-radius: 50%; animation: pulse-ring 2s infinite;"></div>
        <div style="position: absolute; top: 4px; left: 4px; width: 16px; height: 16px; background: #2563EB; border: 2.5px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
      </div>
    `;

    if (!userMarkerRef.current) {
      userMarkerRef.current = new AMap.Marker({
        position: [gcjUser.lng, gcjUser.lat],
        content: userContent,
        offset: new AMap.Pixel(-12, -12),
        title: '当前定位 (Current Position)',
        zIndex: 1000,
      });
      userMarkerRef.current.setMap(map);
    } else {
      userMarkerRef.current.setPosition([gcjUser.lng, gcjUser.lat]);
    }
  }, [isLoaded, userLocation]);

  return (
    <div className="relative w-full h-full bg-[#f4f1ea]">
      {loadError ? (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-[#2C362B]">
          <span className="material-symbols-outlined text-4xl text-[#D9734E] mb-2">explore</span>
          <p className="font-serif text-lg font-bold">AutoNavi AMap (高德地图) Ready</p>
          <p className="text-xs text-[#8A9389] max-w-sm mt-1">{loadError}</p>
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full" />
      )}
    </div>
  );
};
