import React from 'react';
import { ActiveEngineType, BatteryStatusInfo, Itinerary } from '../types';

interface TopNavbarProps {
  itineraries: Itinerary[];
  activeItinerary: Itinerary;
  onSelectItinerary: (itinerary: Itinerary) => void;
  onOpenNewTripModal: () => void;
  onDeleteTrip: (tripId: string) => void;
  activeEngine: ActiveEngineType;
  batteryInfo: BatteryStatusInfo;
  onOpenBatteryModal: () => void;
  onOpenOfflineModal: () => void;
  onOpenAIModal: () => void;
  viewLayout: 'split' | 'itinerary_only' | 'map_only';
  onSetViewLayout: (layout: 'split' | 'itinerary_only' | 'map_only') => void;
  isSimulatedOffline: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  itineraries,
  activeItinerary,
  onSelectItinerary,
  onOpenNewTripModal,
  onDeleteTrip,
  activeEngine,
  batteryInfo,
  onOpenBatteryModal,
  onOpenOfflineModal,
  onOpenAIModal,
  viewLayout,
  onSetViewLayout,
  isSimulatedOffline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#2C362B]/10 px-3 sm:px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand & Trip Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 rounded-full bg-[#D9734E] flex items-center justify-center text-white font-serif font-black text-base shadow-sm">
            N
          </div>

          {/* Itinerary Dropdown */}
          <div className="relative group flex items-center gap-1.5">
            <select
              value={activeItinerary.id}
              onChange={(e) => {
                if (e.target.value === '__new_trip__') {
                  onOpenNewTripModal();
                  return;
                }
                const found = itineraries.find((it) => it.id === e.target.value);
                if (found) onSelectItinerary(found);
              }}
              className="appearance-none bg-white border border-[#2C362B]/15 rounded-full py-1.5 pl-3.5 pr-8 text-xs sm:text-sm font-bold text-[#2C362B] shadow-sm hover:border-[#D9734E] cursor-pointer focus:outline-none max-w-[200px] sm:max-w-[260px] truncate"
            >
              {itineraries.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.title}
                </option>
              ))}
              <option value="__new_trip__">+ Create New Trip...</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2 text-sm text-gray-500 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* + New Trip button on desktop */}
          <button
            onClick={onOpenNewTripModal}
            className="hidden md:inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-[#D9734E] shadow-xs hover:border-[#D9734E] transition-all"
            title="Create a new custom travel itinerary"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Trip</span>
          </button>

          {/* Engine indicator pill */}
          <span
            className={`hidden lg:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
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

        {/* Right Tools: Live Online Status, View Layout toggles, Battery, Offline Vault */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Live Online connection status */}
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              isSimulatedOffline
                ? 'text-amber-800 bg-amber-50 border-amber-300'
                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSimulatedOffline ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span className="hidden xs:inline">
              {isSimulatedOffline ? 'Simulated Offline' : 'Live Online'}
            </span>
          </span>

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

          {/* AI Landmark Visualizer & Auto-Enhance Button */}
          <button
            onClick={onOpenAIModal}
            className="h-8 px-2.5 rounded-full bg-gradient-to-r from-[#D9734E] to-[#c25e39] text-white hover:opacity-95 flex items-center justify-center gap-1 text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Location-Aware Landmark & AI Imagery Hub"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span className="hidden md:inline">AI Visualizer</span>
          </button>

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

          {/* Offline Vault & Download Manager */}
          <button
            onClick={onOpenOfflineModal}
            className="h-8 px-2.5 rounded-full bg-white border border-gray-200 hover:border-[#D9734E] flex items-center justify-center gap-1 text-xs font-bold text-[#2C362B] shadow-sm transition-all"
            title="Offline Cache Vault & Map Downloader"
          >
            <span className="material-symbols-outlined text-sm text-[#D9734E]">download_for_offline</span>
            <span className="hidden sm:inline">Offline Vault</span>
          </button>
        </div>
      </div>
    </header>
  );
};
