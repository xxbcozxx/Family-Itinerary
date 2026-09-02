/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BatteryOptimizerModal } from './components/BatteryOptimizerModal';
import { DualMapView } from './components/DualMapView';
import { ItineraryView } from './components/ItineraryView';
import { LocalSearchDrawer } from './components/LocalSearchDrawer';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { TopNavbar } from './components/TopNavbar';
import { SAMPLE_ITINERARIES } from './data/itineraries';
import { batteryLocationManager } from './services/batteryLocationService';
import { resolveActiveEngine } from './services/mapEngineService';
import { navigationManager } from './services/navigationService';
import { getOfflineStats, saveItineraryOffline } from './services/offlineCacheService';
import {
  ActiveEngineType,
  BatteryMode,
  BatteryStatusInfo,
  Coordinates,
  Itinerary,
  ItineraryStop,
  MapEngineType,
  OfflineCacheStats,
  RouteNavigationState,
} from './types';

export default function App() {
  // Itinerary state (Defaults to Australian Wonders as requested)
  const [itineraries, setItineraries] = useState<Itinerary[]>(SAMPLE_ITINERARIES);
  const [activeItinerary, setActiveItinerary] = useState<Itinerary>(SAMPLE_ITINERARIES[0]);
  const [selectedStopId, setSelectedStopId] = useState<string | undefined>(
    SAMPLE_ITINERARIES[0].days[0]?.stops[0]?.id
  );

  // Map Engine Preference ('auto' | 'google' | 'amap')
  const [enginePreference, setEnginePreference] = useState<MapEngineType>('auto');

  // Resolved Active Map Engine
  const activeEngine: ActiveEngineType = resolveActiveEngine(
    enginePreference,
    activeItinerary.center,
    activeItinerary.isChinaRegion
  );

  // Real-time Traffic Layer Toggle
  const [showTraffic, setShowTraffic] = useState(true);

  // Battery Manager State
  const [batteryMode, setBatteryMode] = useState<BatteryMode>('balanced');
  const [batteryInfo, setBatteryInfo] = useState<BatteryStatusInfo>(
    batteryLocationManager.getBatteryInfo()
  );
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>(activeItinerary.center);

  // Offline Cache Stats
  const [cacheStats, setCacheStats] = useState<OfflineCacheStats>({
    totalItems: 3,
    totalSizeBytes: 184000,
    formattedSize: '184 KB',
    lastUpdated: 'Just now',
    cachedItinerariesCount: 3,
    cachedSearchPlacesCount: 12,
    cachedTilesCount: 120,
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Modals & Drawers
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);

  // Layout State ('split' | 'itinerary_only' | 'map_only')
  const [viewLayout, setViewLayout] = useState<'split' | 'itinerary_only' | 'map_only'>('split');
  const [isMobileMapExpanded, setIsMobileMapExpanded] = useState(false);

  // Active Navigation State
  const [navState, setNavState] = useState<RouteNavigationState>({
    isActive: false,
    isSimulating: false,
    isPaused: false,
    currentStepIndex: 0,
    routeSteps: [],
    currentLocation: activeItinerary.center,
    currentSpeedKmh: 45,
    distanceToNextStepMeters: 450,
    distanceToNextStepText: '450 m',
    timeToNextStepText: '2 min',
    totalDistanceRemainingText: '2.4 km',
    totalDurationRemainingText: '8 min',
    isVoiceMuted: false,
    voiceLanguage: 'en-US',
    recentAnnouncements: [],
  });
  const [navDestinationTitle, setNavDestinationTitle] = useState('Sydney Opera House');

  // Initialize Battery & Location Monitoring
  useEffect(() => {
    batteryLocationManager.setMode(batteryMode);
    batteryLocationManager.startTracking();

    const unsubLoc = batteryLocationManager.subscribeLocation((coords) => {
      setUserLocation(coords);
    });

    const unsubBat = batteryLocationManager.subscribeBattery((info) => {
      setBatteryInfo(info);
    });

    return () => {
      unsubLoc();
      unsubBat();
      batteryLocationManager.stopTracking();
    };
  }, []);

  // Pre-cache active itineraries into IndexedDB on mount
  useEffect(() => {
    const initCache = async () => {
      for (const it of SAMPLE_ITINERARIES) {
        await saveItineraryOffline(it);
      }
      refreshStats();
    };
    initCache();
  }, []);

  const refreshStats = async () => {
    const stats = await getOfflineStats();
    setCacheStats(stats);
  };

  // Change itinerary
  const handleSelectItinerary = (itinerary: Itinerary) => {
    setActiveItinerary(itinerary);
    setSelectedStopId(itinerary.days[0]?.stops[0]?.id);
    setUserLocation(itinerary.center);

    // Stop active navigation if switching trips
    if (navState.isActive) {
      handleStopNav();
    }
  };

  // Stop selection
  const handleSelectStop = (stop: ItineraryStop) => {
    setSelectedStopId(stop.id);
  };

  // Turn-by-Turn Navigation Start
  const handleStartNavigation = (stop: ItineraryStop) => {
    const startCoord = userLocation || activeItinerary.center;
    const steps = navigationManager.generateRouteSteps(startCoord, stop);

    setNavDestinationTitle(stop.title);
    setNavState((prev) => ({
      ...prev,
      isActive: true,
      isSimulating: true,
      currentStepIndex: 0,
      routeSteps: steps,
      distanceToNextStepText: steps[0]?.distanceText || '400 m',
      timeToNextStepText: steps[0]?.durationText || '2 min',
      totalDistanceRemainingText: '2.4 km',
      totalDurationRemainingText: '8 min',
    }));

    // On mobile or split, expand map view for navigation
    if (viewLayout === 'itinerary_only') {
      setViewLayout('split');
    }
    setIsMobileMapExpanded(true);

    // Start simulation
    navigationManager.startSimulation(
      steps,
      (updatedState) => {
        setNavState((prev) => ({ ...prev, ...updatedState }));
      },
      () => {
        // Navigation completed
        setNavState((prev) => ({ ...prev, isActive: false, isSimulating: false }));
      }
    );
  };

  const handleStopNav = () => {
    navigationManager.stopSimulation();
    setNavState((prev) => ({ ...prev, isActive: false, isSimulating: false }));
  };

  const handleToggleVoice = () => {
    const nextMuted = !navState.isVoiceMuted;
    navigationManager.setVoiceMuted(nextMuted);
    setNavState((prev) => ({ ...prev, isVoiceMuted: nextMuted }));
  };

  const handleSelectBatteryMode = (mode: BatteryMode) => {
    setBatteryMode(mode);
    batteryLocationManager.setMode(mode);
  };

  // Flatten all stops for map
  const allStops = activeItinerary.days.flatMap((d) => d.stops);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C362B] flex flex-col font-sans selection:bg-[#D9734E]/20 selection:text-[#D9734E]">
      {/* Top Application Bar */}
      <TopNavbar
        itineraries={itineraries}
        activeItinerary={activeItinerary}
        onSelectItinerary={handleSelectItinerary}
        activeEngine={activeEngine}
        batteryInfo={batteryInfo}
        onOpenBatteryModal={() => setIsBatteryModalOpen(true)}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        viewLayout={viewLayout}
        onSetViewLayout={setViewLayout}
        isSimulatedOffline={isSimulatedOffline}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Left Column: Editorial Itinerary Screen */}
        <div
          className={`w-full transition-all duration-300 overflow-y-auto ${
            viewLayout === 'split'
              ? 'lg:w-[50%] xl:w-[45%] lg:border-r border-[#2C362B]/10'
              : viewLayout === 'itinerary_only'
              ? 'w-full'
              : 'hidden'
          }`}
        >
          <ItineraryView
            itinerary={activeItinerary}
            selectedStopId={selectedStopId}
            onSelectStop={handleSelectStop}
            onStartNavigation={handleStartNavigation}
            onOpenLocalSearch={() => setIsSearchDrawerOpen(true)}
            onToggleMapView={() => {
              if (viewLayout === 'itinerary_only') setViewLayout('split');
              setIsMobileMapExpanded(!isMobileMapExpanded);
            }}
            isMapExpanded={isMobileMapExpanded || viewLayout === 'split'}
          />
        </div>

        {/* Right Column: Dual Map Engine & Live Navigation */}
        <div
          className={`w-full transition-all duration-300 relative ${
            viewLayout === 'split'
              ? 'h-[480px] lg:h-auto lg:flex-1'
              : viewLayout === 'map_only'
              ? 'w-full h-[calc(100vh-57px)]'
              : isMobileMapExpanded
              ? 'h-[480px] block'
              : 'hidden'
          }`}
        >
          <DualMapView
            enginePreference={enginePreference}
            activeEngine={activeEngine}
            onSetEnginePreference={setEnginePreference}
            center={activeItinerary.center}
            zoom={activeItinerary.zoom}
            stops={allStops}
            activeStopId={selectedStopId}
            onSelectStop={handleSelectStop}
            onStartNavToStop={handleStartNavigation}
            showTraffic={showTraffic}
            onToggleTraffic={() => setShowTraffic(!showTraffic)}
            batteryMode={batteryMode}
            batteryInfo={batteryInfo}
            onOpenBatteryModal={() => setIsBatteryModalOpen(true)}
            onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
            userLocation={userLocation}
            navState={navState}
            activeDestinationTitle={navDestinationTitle}
            onStopNav={handleStopNav}
            onToggleVoice={handleToggleVoice}
          />
        </div>
      </div>

      {/* Modals & Drawers */}
      <BatteryOptimizerModal
        isOpen={isBatteryModalOpen}
        onClose={() => setIsBatteryModalOpen(false)}
        batteryMode={batteryMode}
        onSelectMode={handleSelectBatteryMode}
        batteryInfo={batteryInfo}
      />

      <OfflineManagerModal
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        activeItinerary={activeItinerary}
        cacheStats={cacheStats}
        onRefreshStats={refreshStats}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
      />

      <LocalSearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setIsSearchDrawerOpen(false)}
        centerCoordinates={activeItinerary.center}
        destinationName={activeItinerary.destination}
        onSelectPlaceForNavigation={handleStartNavigation}
      />
    </div>
  );
}
