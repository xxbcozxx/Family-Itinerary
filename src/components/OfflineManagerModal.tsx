import React, { useState } from 'react';
import { clearAllOfflineCache, saveItineraryOffline } from '../services/offlineCacheService';
import { Itinerary, OfflineCacheStats } from '../types';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItinerary: Itinerary;
  cacheStats: OfflineCacheStats;
  onRefreshStats: () => void;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  activeItinerary,
  cacheStats,
  onRefreshStats,
  isSimulatedOffline,
  onToggleSimulatedOffline,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadMessage, setDownloadMessage] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  if (!isOpen) return null;

  const handleDownloadOfflinePack = async () => {
    setIsDownloading(true);
    setDownloadProgress(15);
    setDownloadMessage('Caching itinerary stops & travel guide...');

    await new Promise((r) => setTimeout(r, 400));
    setDownloadProgress(45);
    setDownloadMessage('Storing vector map tiles & route geometry in IndexedDB...');

    await saveItineraryOffline(activeItinerary);

    await new Promise((r) => setTimeout(r, 500));
    setDownloadProgress(80);
    setDownloadMessage('Pre-caching nearby emergency & POI databases...');

    await new Promise((r) => setTimeout(r, 400));
    setDownloadProgress(100);
    setDownloadMessage('Offline pack ready for zero-network environments!');

    setTimeout(() => {
      setIsDownloading(false);
      onRefreshStats();
    }, 800);
  };

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all offline cached maps, places, and itineraries?')) {
      setIsClearing(true);
      await clearAllOfflineCache();
      await onRefreshStats();
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F9F6F0] text-[#2C362B] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#2C362B]/10 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2C362B]/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D9734E]/15 flex items-center justify-center text-[#D9734E]">
              <span className="material-symbols-outlined text-xl">offline_pin</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2C362B]">Persistent Offline Storage</h3>
              <p className="text-xs text-[#8A9389]">IndexedDB local cache for maps & searches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Offline Cache Stats Breakdown */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#2C362B]/5">
            <span className="text-[11px] font-bold text-[#8A9389] uppercase tracking-wider block mb-1">
              Cached Storage
            </span>
            <span className="font-serif text-2xl font-black text-[#D9734E]">
              {cacheStats.formattedSize}
            </span>
            <span className="text-[10px] text-[#8A9389] block mt-0.5">
              Across {cacheStats.totalItems} records
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#2C362B]/5">
            <span className="text-[11px] font-bold text-[#8A9389] uppercase tracking-wider block mb-1">
              Map Tiles & Routes
            </span>
            <span className="font-serif text-2xl font-black text-[#2C362B]">
              {cacheStats.cachedTilesCount} <span className="text-sm font-sans font-normal text-gray-500">tiles</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              ● Ready for offline navigation
            </span>
          </div>
        </div>

        {/* Simulated Offline Mode Switch */}
        <div className="mt-4 p-4 rounded-2xl bg-white shadow-sm border border-[#2C362B]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isSimulatedOffline ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
              <span className="material-symbols-outlined text-lg">
                {isSimulatedOffline ? 'cloud_off' : 'cloud_done'}
              </span>
            </div>
            <div>
              <span className="font-bold text-sm text-[#2C362B]">Simulate Offline Mode</span>
              <p className="text-[11px] text-[#8A9389]">
                {isSimulatedOffline ? 'Testing zero-network IndexedDB mode' : 'Connected to live network & traffic'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleSimulatedOffline}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              isSimulatedOffline ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                isSimulatedOffline ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Download Offline Pack CTA */}
        <div className="mt-4 p-4 rounded-2xl bg-[#2C362B] text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#D9734E]">download_for_offline</span>
              <span className="font-bold text-sm">{activeItinerary.title} Pack</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
              Offline Ready
            </span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed mb-3">
            Saves full itinerary notes, GPS waypoints, high-res photos, and turn maneuvers directly into browser persistent storage.
          </p>

          {isDownloading ? (
            <div className="space-y-2">
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#D9734E] h-2 transition-all duration-300 rounded-full"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-amber-300 italic">{downloadMessage}</p>
            </div>
          ) : (
            <button
              onClick={handleDownloadOfflinePack}
              className="w-full h-10 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">cloud_download</span>
              Re-Sync & Cache Itinerary Offline
            </button>
          )}
        </div>

        {/* Clear Cache Action */}
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-[#2C362B]/10">
          <button
            onClick={handleClearCache}
            disabled={isClearing}
            className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition-all"
          >
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            {isClearing ? 'Purging...' : 'Purge Cached Data'}
          </button>

          <button
            onClick={onClose}
            className="px-5 h-9 rounded-full bg-black/10 hover:bg-black/15 text-[#2C362B] text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
