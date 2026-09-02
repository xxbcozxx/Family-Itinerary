/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AILandmarkModal } from './components/AILandmarkModal';
import { BatteryOptimizerModal } from './components/BatteryOptimizerModal';
import { DualMapView } from './components/DualMapView';
import { EditDayModal } from './components/EditDayModal';
import { EditStopModal } from './components/EditStopModal';
import { EditTripModal } from './components/EditTripModal';
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
  ItineraryDay,
  ItineraryStop,
  MapEngineType,
  OfflineCacheStats,
  RouteNavigationState,
} from './types';

const STORAGE_KEY_ITINERARIES = 'nomad_wonders_itineraries_v3';
const STORAGE_KEY_ACTIVE_ID = 'nomad_wonders_active_id_v3';

export default function App() {
  // Load persisted itineraries from localStorage or fallback to default SAMPLE_ITINERARIES
  const [itineraries, setItineraries] = useState<Itinerary[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_ITINERARIES);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to load itineraries from localStorage:', e);
      }
    }
    return SAMPLE_ITINERARIES;
  });

  // Active itinerary state (Defaults to Beijing December Winter Trip)
  const [activeItinerary, setActiveItinerary] = useState<Itinerary>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
        if (savedActiveId) {
          const found = itineraries.find((it) => it.id === savedActiveId);
          if (found) return found;
        }
      } catch {
        // ignore
      }
    }
    return itineraries[0] || SAMPLE_ITINERARIES[0];
  });

  const [selectedStopId, setSelectedStopId] = useState<string | undefined>(
    activeItinerary.days[0]?.stops[0]?.id
  );

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITINERARIES, JSON.stringify(itineraries));
    } catch (e) {
      console.warn('Failed to save itineraries to localStorage:', e);
    }
  }, [itineraries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeItinerary.id);
    } catch {
      // ignore
    }
  }, [activeItinerary.id]);

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
    totalItems: 4,
    totalSizeBytes: 240000,
    formattedSize: '240 KB',
    lastUpdated: 'Just now',
    cachedItinerariesCount: 4,
    cachedSearchPlacesCount: 16,
    cachedTilesCount: 140,
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Modals & Drawers
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Edit Modals
  const [isEditStopModalOpen, setIsEditStopModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState<ItineraryStop | null>(null);
  const [stopTargetDayNumber, setStopTargetDayNumber] = useState(1);

  const [isEditDayModalOpen, setIsEditDayModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);

  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Itinerary | null>(null);

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
  const [navDestinationTitle, setNavDestinationTitle] = useState('Destination');

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
      for (const it of itineraries) {
        await saveItineraryOffline(it);
      }
      refreshStats();
    };
    initCache();
  }, [itineraries]);

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

  // =========================================================================
  // ITINERARY MODIFICATION HANDLERS (Add/Edit/Delete Stops, Days, Trips)
  // =========================================================================

  // 1. ADD / EDIT STOP
  const handleOpenAddStop = (dayNumber: number) => {
    setEditingStop(null);
    setStopTargetDayNumber(dayNumber);
    setIsEditStopModalOpen(true);
  };

  const handleOpenEditStop = (stop: ItineraryStop) => {
    setEditingStop(stop);
    setStopTargetDayNumber(stop.dayNumber);
    setIsEditStopModalOpen(true);
  };

  const handleSaveStop = (stopToSave: ItineraryStop, targetDayNum: number) => {
    setActiveItinerary((prevTrip) => {
      const updatedDays = prevTrip.days.map((day) => {
        // If stop was in this day previously, remove it (in case day changed or editing)
        const filteredStops = day.stops.filter((s) => s.id !== stopToSave.id);

        if (day.dayNumber === targetDayNum) {
          return {
            ...day,
            stops: [...filteredStops, stopToSave],
          };
        }
        return {
          ...day,
          stops: filteredStops,
        };
      });

      const updatedTrip: Itinerary = {
        ...prevTrip,
        days: updatedDays,
      };

      // Update in overall list
      setItineraries((all) =>
        all.map((it) => (it.id === updatedTrip.id ? updatedTrip : it))
      );

      return updatedTrip;
    });

    setSelectedStopId(stopToSave.id);
  };

  const handleDeleteStop = (stopId: string, dayNumber: number) => {
    setActiveItinerary((prevTrip) => {
      const updatedDays = prevTrip.days.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            stops: day.stops.filter((s) => s.id !== stopId),
          };
        }
        return day;
      });

      const updatedTrip: Itinerary = {
        ...prevTrip,
        days: updatedDays,
      };

      setItineraries((all) =>
        all.map((it) => (it.id === updatedTrip.id ? updatedTrip : it))
      );

      return updatedTrip;
    });
  };

  // 2. ADD / EDIT DAY
  const handleOpenAddDay = () => {
    setEditingDay(null);
    setIsEditDayModalOpen(true);
  };

  const handleOpenEditDay = (day: ItineraryDay) => {
    setEditingDay(day);
    setIsEditDayModalOpen(true);
  };

  const handleSaveDay = (dayToSave: ItineraryDay) => {
    setActiveItinerary((prevTrip) => {
      const exists = prevTrip.days.some((d) => d.dayNumber === dayToSave.dayNumber);
      let updatedDays: ItineraryDay[];

      if (exists && editingDay) {
        // Edit existing day
        updatedDays = prevTrip.days.map((d) =>
          d.dayNumber === editingDay.dayNumber ? { ...d, ...dayToSave, stops: d.stops } : d
        );
      } else {
        // Add new day
        updatedDays = [...prevTrip.days, dayToSave].sort((a, b) => a.dayNumber - b.dayNumber);
      }

      const updatedTrip: Itinerary = {
        ...prevTrip,
        days: updatedDays,
      };

      setItineraries((all) =>
        all.map((it) => (it.id === updatedTrip.id ? updatedTrip : it))
      );

      return updatedTrip;
    });
  };

  const handleDeleteDay = (dayNumber: number) => {
    setActiveItinerary((prevTrip) => {
      const updatedDays = prevTrip.days
        .filter((d) => d.dayNumber !== dayNumber)
        .map((d, idx) => ({ ...d, dayNumber: idx + 1 })); // re-index

      const updatedTrip: Itinerary = {
        ...prevTrip,
        days: updatedDays,
      };

      setItineraries((all) =>
        all.map((it) => (it.id === updatedTrip.id ? updatedTrip : it))
      );

      return updatedTrip;
    });
  };

  // 3. CREATE / EDIT TRIP
  const handleOpenNewTrip = () => {
    setEditingTrip(null);
    setIsEditTripModalOpen(true);
  };

  const handleOpenEditTrip = () => {
    setEditingTrip(activeItinerary);
    setIsEditTripModalOpen(true);
  };

  const handleSaveTrip = (tripToSave: Itinerary) => {
    setItineraries((all) => {
      const exists = all.some((it) => it.id === tripToSave.id);
      if (exists) {
        return all.map((it) => (it.id === tripToSave.id ? tripToSave : it));
      } else {
        return [tripToSave, ...all];
      }
    });

    setActiveItinerary(tripToSave);
    setSelectedStopId(tripToSave.days[0]?.stops[0]?.id);
    setUserLocation(tripToSave.center);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (itineraries.length <= 1) {
      alert('Cannot delete the only remaining itinerary.');
      return;
    }

    const remaining = itineraries.filter((it) => it.id !== tripId);
    setItineraries(remaining);
    setActiveItinerary(remaining[0]);
    setSelectedStopId(remaining[0].days[0]?.stops[0]?.id);
    setUserLocation(remaining[0].center);
  };

  // =========================================================================
  // Turn-by-Turn Navigation Start
  // =========================================================================
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
  const availableDayNumbers = activeItinerary.days.map((d) => d.dayNumber);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2C362B] flex flex-col font-sans selection:bg-[#D9734E]/20 selection:text-[#D9734E]">
      {/* Top Application Bar */}
      <TopNavbar
        itineraries={itineraries}
        activeItinerary={activeItinerary}
        onSelectItinerary={handleSelectItinerary}
        onOpenNewTripModal={handleOpenNewTrip}
        onDeleteTrip={handleDeleteTrip}
        activeEngine={activeEngine}
        batteryInfo={batteryInfo}
        onOpenBatteryModal={() => setIsBatteryModalOpen(true)}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
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
            onAddStop={handleOpenAddStop}
            onEditStop={handleOpenEditStop}
            onDeleteStop={handleDeleteStop}
            onAddDay={handleOpenAddDay}
            onEditDay={handleOpenEditDay}
            onDeleteDay={handleDeleteDay}
            onEditTrip={handleOpenEditTrip}
            onOpenAIModal={() => setIsAIModalOpen(true)}
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

      {/* Edit Stop Modal */}
      <EditStopModal
        isOpen={isEditStopModalOpen}
        onClose={() => setIsEditStopModalOpen(false)}
        onSave={handleSaveStop}
        initialStop={editingStop}
        dayNumber={stopTargetDayNumber}
        availableDays={availableDayNumbers.length > 0 ? availableDayNumbers : [1]}
        defaultCenter={activeItinerary.center}
      />

      {/* Edit Day Modal */}
      <EditDayModal
        isOpen={isEditDayModalOpen}
        onClose={() => setIsEditDayModalOpen(false)}
        onSave={handleSaveDay}
        initialDay={editingDay}
        suggestedDayNumber={activeItinerary.days.length + 1}
      />

      {/* Edit Trip Modal */}
      <EditTripModal
        isOpen={isEditTripModalOpen}
        onClose={() => setIsEditTripModalOpen(false)}
        onSave={handleSaveTrip}
        initialTrip={editingTrip}
      />

      {/* AI Location-Aware Landmark & Imagery Modal */}
      <AILandmarkModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        activeItinerary={activeItinerary}
        onUpdateItinerary={(updated) => {
          handleSaveTrip(updated);
        }}
      />
    </div>
  );
}
