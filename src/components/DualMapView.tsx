import React from 'react';
import {
  ActiveEngineType,
  BatteryMode,
  BatteryStatusInfo,
  Coordinates,
  ItineraryStop,
  MapEngineType,
  NavigationStep,
  RouteNavigationState,
} from '../types';
import { AMapContainer } from './AMapContainer';
import { GoogleMapContainer } from './GoogleMapContainer';
import { NavigationHud } from './NavigationHud';

interface DualMapViewProps {
  enginePreference: MapEngineType;
  activeEngine: ActiveEngineType;
  onSetEnginePreference: (pref: MapEngineType) => void;
  center: Coordinates;
  zoom: number;
  stops: ItineraryStop[];
  activeStopId?: string;
  onSelectStop?: (stop: ItineraryStop) => void;
  onStartNavToStop?: (stop: ItineraryStop) => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
  batteryMode: BatteryMode;
  batteryInfo: BatteryStatusInfo;
  onOpenBatteryModal: () => void;
  onOpenOfflineModal: () => void;
  userLocation?: Coordinates;
  navState: RouteNavigationState;
  activeDestinationTitle: string;
  onStopNav: () => void;
  onToggleVoice: () => void;
}

export const DualMapView: React.FC<DualMapViewProps> = ({
  enginePreference,
  activeEngine,
  onSetEnginePreference,
  center,
  zoom,
  stops,
  activeStopId,
  onSelectStop,
  onStartNavToStop,
  showTraffic,
  onToggleTraffic,
  batteryMode,
  batteryInfo,
  onOpenBatteryModal,
  onOpenOfflineModal,
  userLocation,
  navState,
  activeDestinationTitle,
  onStopNav,
  onToggleVoice,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Active Navigation Head-Up Display */}
      {navState.isActive && (
        <NavigationHud
          navState={navState}
          activeDestinationTitle={activeDestinationTitle}
          onStopNav={onStopNav}
          onToggleVoice={onToggleVoice}
        />
      )}

      {/* Top Floating Map Controls Bar (Visible when not actively navigating) */}
      {!navState.isActive && (
        <div className="absolute top-4 inset-x-4 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto max-w-4xl mx-auto">
          {/* Provider Auto-Switching Pill */}
          <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full p-1 shadow-lg border border-[#2C362B]/10 text-xs font-semibold">
            <div className="px-3 py-1.5 flex items-center gap-1.5 text-[#2C362B]">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeEngine === 'google' ? 'bg-blue-600' : 'bg-emerald-600'
                } animate-pulse`}
              />
              <span className="font-bold">
                {activeEngine === 'google' ? 'Google Maps' : 'AMap (高德地图)'}
              </span>
              <span className="text-[10px] text-[#8A9389] uppercase tracking-wider bg-gray-100 px-1.5 py-0.5 rounded">
                {enginePreference === 'auto' ? 'Auto-Switch' : 'Locked'}
              </span>
            </div>

            <div className="flex items-center gap-0.5 border-l border-gray-200 pl-1">
              <button
                onClick={() => onSetEnginePreference('auto')}
                className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                  enginePreference === 'auto'
                    ? 'bg-[#2C362B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Automatically switch between Google Maps and AMap based on geographic boundaries"
              >
                Auto
              </button>
              <button
                onClick={() => onSetEnginePreference('google')}
                className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                  enginePreference === 'google'
                    ? 'bg-[#2C362B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Google
              </button>
              <button
                onClick={() => onSetEnginePreference('amap')}
                className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
                  enginePreference === 'amap'
                    ? 'bg-[#2C362B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                AMap
              </button>
            </div>
          </div>

          {/* Right Action Tools: Traffic, Battery, Offline */}
          <div className="flex items-center gap-2">
            {/* Real-time Traffic Toggle */}
            <button
              onClick={onToggleTraffic}
              className={`h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-md transition-all ${
                showTraffic
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/95 text-[#2C362B] hover:bg-gray-50'
              }`}
              title="Toggle Real-Time Traffic Congestion Layer"
            >
              <span className="material-symbols-outlined text-base">traffic</span>
              <span>{showTraffic ? 'Traffic Live' : 'Traffic Off'}</span>
            </button>

            {/* Battery Optimization Pill */}
            <button
              onClick={onOpenBatteryModal}
              className={`h-9 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-md backdrop-blur-md transition-all ${
                batteryMode === 'ultra_battery_saver'
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-white/95 text-[#2C362B] hover:bg-gray-50'
              }`}
              title="Battery-Efficient GPS Settings"
            >
              <span className="material-symbols-outlined text-base">
                {batteryInfo.charging ? 'battery_charging_full' : 'battery_saver'}
              </span>
              <span>{Math.round(batteryInfo.level * 100)}%</span>
            </button>

            {/* Offline Cache Manager */}
            <button
              onClick={onOpenOfflineModal}
              className="h-9 px-3 rounded-full bg-white/95 text-[#2C362B] hover:bg-gray-50 flex items-center gap-1.5 text-xs font-bold shadow-md backdrop-blur-md transition-all"
              title="Persistent Offline Storage Manager"
            >
              <span className="material-symbols-outlined text-base text-[#D9734E]">
                offline_pin
              </span>
              <span className="hidden sm:inline">Offline Cached</span>
            </button>
          </div>
        </div>
      )}

      {/* Render the Selected Map Engine */}
      {activeEngine === 'google' ? (
        <GoogleMapContainer
          center={center}
          zoom={zoom}
          stops={stops}
          activeStopId={activeStopId}
          onSelectStop={onSelectStop}
          onStartNavToStop={onStartNavToStop}
          showTraffic={showTraffic}
          userLocation={userLocation}
          navigationSteps={navState.isActive ? navState.routeSteps : undefined}
          currentNavStepIndex={navState.currentStepIndex}
        />
      ) : (
        <AMapContainer
          center={center}
          zoom={zoom}
          stops={stops}
          activeStopId={activeStopId}
          onSelectStop={onSelectStop}
          onStartNavToStop={onStartNavToStop}
          showTraffic={showTraffic}
          userLocation={userLocation}
          navigationSteps={navState.isActive ? navState.routeSteps : undefined}
          currentNavStepIndex={navState.currentStepIndex}
        />
      )}
    </div>
  );
};
