import React from 'react';
import { ActiveEngineType, BatteryStatusInfo, Itinerary } from '../types';

interface TopNavbarProps {
  itineraries: Itinerary[];
  activeItinerary: Itinerary;
  onSelectItinerary: (itinerary: Itinerary) => void;
  activeEngine: ActiveEngineType;
  batteryInfo: BatteryStatusInfo;
  onOpenBatteryModal: () => void;
  onOpenOfflineModal: () => void;
  viewLayout: 'split' | 'itinerary_only' | 'map_only';
  onSetViewLayout: (layout: 'split' | 'itinerary_only' | 'map_only') => void;
  isSimulatedOffline: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  itineraries,
  activeItinerary,
  onSelectItinerary,
  activeEngine,
  batteryInfo,
  onOpenBatteryModal,
  onOpenOfflineModal,
  viewLayout,
  onSetViewLayout,
  isSimulatedOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F6F0]/90 backdrop-blur-md border-b border-[#2C362B]/10 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Trip Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D9734E] flex items-center justify-center text-white font-serif font-black text-base shadow-sm">
            N
          </div>

          {/* Itinerary Dropdown */}
          <div className="relative group">
            <select
              value={activeItinerary.id}
              onChange={(e) => {
                const found = itineraries.find((it) => it.id === e.target.value);
                if (found) onSelectItinerary(found);
              }}
              className="appearance-none bg-white border border-[#2C362B]/15 rounded-full py-1.5 pl-3.5 pr-8 text-xs sm:text-sm font-bold text-[#2C362B] shadow-sm hover:border-[#D9734E] cursor-pointer focus:outline-none"
            >
              {itineraries.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.title} ({it.regionCountry})
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-sm text-gray-500 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Engine indicator pill */}
          <span
            className={`hidden md:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              activeEngine === 'google'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeEngine === 'google' ? 'bg-blue-600' : 'bg-emerald-600'
              }`}
            />
            {activeEngine === 'google' ? 'Google Maps (Non-China)' : 'AMap 高德 (China Region)'}
          </span>
        </div>

        {/* Right Tools: View Layout toggles, Battery, Offline status */}
        <div className="flex items-center gap-2">
          {/* Offline Mode Alert Badge if active */}
          {isSimulatedOffline && (
            <span className="text-[10px] uppercase font-bold text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded-full animate-pulse">
              Offline Test Mode
            </span>
          )}

          {/* View Layout Switcher (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full p-0.5 shadow-sm">
            <button
              onClick={() => onSetViewLayout('split')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                viewLayout === 'split'
                  ? 'bg-[#2C362B] text-white shadow-xs'
                  : 'text-[#8A9389] hover:text-[#2C362B]'
              }`}
              title="Split Screen: Itinerary + Live Map"
            >
              Split
            </button>
            <button
              onClick={() => onSetViewLayout('itinerary_only')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                viewLayout === 'itinerary_only'
                  ? 'bg-[#2C362B] text-white shadow-xs'
                  : 'text-[#8A9389] hover:text-[#2C362B]'
              }`}
              title="Editorial Itinerary Card View"
            >
              Itinerary
            </button>
            <button
              onClick={() => onSetViewLayout('map_only')}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                viewLayout === 'map_only'
                  ? 'bg-[#2C362B] text-white shadow-xs'
                  : 'text-[#8A9389] hover:text-[#2C362B]'
              }`}
              title="Full Screen Map & Turn Navigation"
            >
              Map
            </button>
          </div>

          {/* Quick Battery Modal Launcher */}
          <button
            onClick={onOpenBatteryModal}
            className="h-8 px-2.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 flex items-center gap-1 text-xs font-bold text-[#2C362B] shadow-sm transition-all"
            title="Battery Optimization Manager"
          >
            <span className="material-symbols-outlined text-sm text-[#D9734E]">
              {batteryInfo.charging ? 'battery_charging_full' : 'battery_saver'}
            </span>
            <span className="hidden xs:inline">{Math.round(batteryInfo.level * 100)}%</span>
          </button>

          {/* Quick Offline Storage Modal Launcher */}
          <button
            onClick={onOpenOfflineModal}
            className="h-8 w-8 sm:w-auto sm:px-2.5 rounded-full bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center gap-1 text-xs font-bold text-[#2C362B] shadow-sm transition-all"
            title="Offline Cache Storage"
          >
            <span className="material-symbols-outlined text-sm text-[#D9734E]">cloud_done</span>
            <span className="hidden sm:inline">Offline</span>
          </button>
        </div>
      </div>
    </header>
  );
};
