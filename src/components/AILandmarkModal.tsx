import React, { useState } from 'react';
import { Itinerary } from '../types';
import {
  autoEnhanceItineraryImagery,
  generateAILandmarkImage,
  searchOnlineLandmarkPhotos,
  CURATED_LANDMARK_PHOTOS,
  LandmarkPhoto,
} from '../services/landmarkImageService';

interface AILandmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItinerary: Itinerary;
  onUpdateItinerary: (updated: Itinerary) => void;
}

export const AILandmarkModal: React.FC<AILandmarkModalProps> = ({
  isOpen,
  onClose,
  activeItinerary,
  onUpdateItinerary,
}) => {
  const [activeTab, setActiveTab] = useState<'auto_enhance' | 'ai_generate' | 'browse_landmarks'>('auto_enhance');

  // Auto-enhance state
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceResults, setEnhanceResults] = useState<{
    replacedCount: number;
    enhancements: Array<{ stopTitle: string; landmarkMatched: string; imageUrl: string }>;
  } | null>(null);

  // AI Generation state
  const [genLocation, setGenLocation] = useState(activeItinerary.destination || 'Guangzhou, China');
  const [genLandmark, setGenLandmark] = useState('Canton Tower (广州塔)');
  const [genStyle, setGenStyle] = useState('Photorealistic Golden Hour');
  const [genAspectRatio, setGenAspectRatio] = useState<'16:9' | '1:1' | '4:3'>('16:9');
  const [genCustomPrompt, setGenCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    imageUrl: string;
    source: string;
    title?: string;
    promptUsed?: string;
    symbolicType?: string;
  } | null>(null);
  const [selectedTargetStopId, setSelectedTargetStopId] = useState<string>('trip_cover');

  // Browse landmarks state
  const [searchQuery, setSearchQuery] = useState(activeItinerary.destination.split(',')[0] || 'Guangzhou');
  const [browseResults, setBrowseResults] = useState<LandmarkPhoto[]>(
    CURATED_LANDMARK_PHOTOS.guangzhou || []
  );
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const styleOptions = [
    'Photorealistic Golden Hour',
    'Cinematic Night Skyline & Neon',
    'Aerial Drone 4K Panorama',
    'Vintage Editorial Travel Poster',
    'Traditional Watercolor & Ink Wash',
  ];

  // Run 1-Click Auto Enhancement
  const handleRunAutoEnhance = async () => {
    setIsEnhancing(true);
    try {
      const result = await autoEnhanceItineraryImagery(activeItinerary);
      onUpdateItinerary(result.updatedItinerary);
      setEnhanceResults({
        replacedCount: result.replacedCount,
        enhancements: result.enhancements,
      });
    } catch (err) {
      console.error('Auto enhance failed:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Run AI Generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedResult(null);
    try {
      const res = await generateAILandmarkImage({
        locationName: genLandmark,
        destination: genLocation,
        style: genStyle,
        aspectRatio: genAspectRatio,
        prompt: genCustomPrompt,
      });
      setGeneratedResult(res);
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Apply generated or selected image to trip cover or specific stop
  const handleApplyImage = (imageUrl: string) => {
    if (selectedTargetStopId === 'trip_cover') {
      onUpdateItinerary({
        ...activeItinerary,
        coverImage: imageUrl,
      });
    } else {
      const updatedDays = activeItinerary.days.map((day) => ({
        ...day,
        stops: day.stops.map((stop) => {
          if (stop.id === selectedTargetStopId) {
            return { ...stop, imageUrl };
          }
          return stop;
        }),
      }));
      onUpdateItinerary({
        ...activeItinerary,
        days: updatedDays,
      });
    }
    onClose();
  };

  // Browse search
  const handleSearchBrowse = async (query: string) => {
    setIsSearching(true);
    try {
      const photos = await searchOnlineLandmarkPhotos(query);
      setBrowseResults(photos);
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // All stops for target dropdown
  const allStops = activeItinerary.days.flatMap((d) => d.stops);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FDFBF7] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#2C362B]/15 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#2C362B] to-[#3B483A] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D9734E] flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined text-xl">image_search</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif tracking-tight">
                Location-Aware Landmark & AI Imagery Hub
              </h2>
              <p className="text-xs text-white/70">
                Replace placeholder images with verified symbolic landmarks (Canton Tower, Oriental Pearl, etc.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#2C362B]/10 bg-white px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('auto_enhance')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'auto_enhance'
                ? 'border-[#D9734E] text-[#D9734E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            <span>1-Click Auto Enhance</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_generate')}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_generate'
                ? 'border-[#D9734E] text-[#D9734E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            <span>AI Landmark Studio</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('browse_landmarks');
              handleSearchBrowse(searchQuery);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'browse_landmarks'
                ? 'border-[#D9734E] text-[#D9734E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">photo_library</span>
            <span>Browse Iconic Library</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 1-CLICK AUTO ENHANCE */}
          {activeTab === 'auto_enhance' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
                    <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                      Visual Accuracy & Landmark Guarantee
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Scans all {allStops.length} stops in <span className="font-bold">{activeItinerary.title}</span>.
                    Automatically identifies destination coordinates and location keywords (e.g. Canton Tower,
                    Zhujiang New Town, Oriental Pearl, Forbidden City) and replaces any generic or missing images
                    with verified high-resolution symbolic photography.
                  </p>
                </div>
                <button
                  onClick={handleRunAutoEnhance}
                  disabled={isEnhancing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-base">
                    {isEnhancing ? 'sync' : 'auto_fix_high'}
                  </span>
                  <span>{isEnhancing ? 'Analyzing & Upgrading...' : 'Auto-Enhance Itinerary'}</span>
                </button>
              </div>

              {/* Enhancement Results */}
              {enhanceResults && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#2C362B] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">task_alt</span>
                      Enhanced {enhanceResults.replacedCount} Location Images
                    </h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      100% Accurate Symbolic Coverage
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pt-1">
                    {enhanceResults.enhancements.map((enh, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FDFBF7] border border-gray-200 rounded-lg p-2.5 flex items-center gap-2.5 text-xs"
                      >
                        <img
                          src={enh.imageUrl}
                          alt={enh.landmarkMatched}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-md object-cover border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#2C362B] truncate">{enh.stopTitle}</p>
                          <p className="text-[10px] text-[#D9734E] font-medium truncate">
                            {enh.landmarkMatched}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Itinerary Stops Visual Health Overview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Current Stops & Landmark Imagery</span>
                  <span className="text-gray-500 font-normal">
                    {allStops.filter((s) => s.imageUrl).length} of {allStops.length} stops have symbolic visuals
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {allStops.slice(0, 9).map((stop) => (
                    <div
                      key={stop.id}
                      className="bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-2 text-xs hover:border-[#D9734E] transition-all"
                    >
                      {stop.imageUrl ? (
                        <img
                          src={stop.imageUrl}
                          alt={stop.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-sm">image_not_supported</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 truncate text-[11px]">{stop.title}</p>
                        <p className="text-[10px] text-gray-500 truncate">{stop.locationName || 'General'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI LANDMARK GENERATION STUDIO */}
          {activeTab === 'ai_generate' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Controls */}
                <div className="space-y-3.5 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Destination City / Region
                    </label>
                    <input
                      type="text"
                      value={genLocation}
                      onChange={(e) => setGenLocation(e.target.value)}
                      placeholder="e.g. Guangzhou, Shanghai, Beijing, Batam"
                      className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9734E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Target Landmark / Feature
                    </label>
                    <input
                      type="text"
                      value={genLandmark}
                      onChange={(e) => setGenLandmark(e.target.value)}
                      placeholder="e.g. Canton Tower, Oriental Pearl Tower, The Bund, Barelang Bridge"
                      className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9734E]"
                    />
                  </div>

                  {/* Quick Preset Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setGenLocation('Guangzhou, China');
                        setGenLandmark('Canton Tower & Zhujiang New Town (广州塔)');
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded-full hover:bg-amber-100"
                    >
                      🗼 Canton Tower (广州)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGenLocation('Shanghai, China');
                        setGenLandmark('Oriental Pearl Tower & The Bund (东方明珠与外滩)');
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 rounded-full hover:bg-blue-100"
                    >
                      🏙️ Oriental Pearl (上海)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGenLocation('Beijing, China');
                        setGenLandmark('The Forbidden City Imperial Palace (故宫博物院)');
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold bg-red-50 text-red-900 border border-red-200 rounded-full hover:bg-red-100"
                    >
                      🏯 Forbidden City (北京)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGenLocation('Batam, Indonesia');
                        setGenLandmark('Barelang Bridge (巴淡大桥)');
                      }}
                      className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full hover:bg-emerald-100"
                    >
                      🌉 Barelang Bridge (巴淡)
                    </button>
                  </div>

                  {/* Artistic Style */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Artistic Style
                    </label>
                    <select
                      value={genStyle}
                      onChange={(e) => setGenStyle(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9734E]"
                    >
                      {styleOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Stop */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Apply Result To
                    </label>
                    <select
                      value={selectedTargetStopId}
                      onChange={(e) => setSelectedTargetStopId(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#D9734E]"
                    >
                      <option value="trip_cover">🌟 Trip Cover Banner ({activeItinerary.title})</option>
                      {allStops.map((stop) => (
                        <option key={stop.id} value={stop.id}>
                          Day {stop.dayNumber}: {stop.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-2.5 rounded-xl bg-[#D9734E] hover:bg-[#c25e39] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isGenerating ? 'sync' : 'auto_awesome'}
                    </span>
                    <span>{isGenerating ? 'Generating Symbolic Artwork...' : 'Generate Landmark Imagery'}</span>
                  </button>
                </div>

                {/* Right Preview */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Generated Imagery Preview
                    </h4>
                    {isGenerating ? (
                      <div className="aspect-video w-full rounded-xl bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-8 h-8 rounded-full border-2 border-[#D9734E] border-t-transparent animate-spin" />
                        <p className="text-xs text-gray-600 font-bold">
                          Crafting location-aware visual representation of {genLandmark}...
                        </p>
                      </div>
                    ) : generatedResult ? (
                      <div className="space-y-3">
                        <div className="aspect-video w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group">
                          <img
                            src={generatedResult.imageUrl}
                            alt={generatedResult.title || genLandmark}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white text-xs">
                            <p className="font-bold truncate">{generatedResult.title || genLandmark}</p>
                            <p className="text-[10px] text-white/80">{generatedResult.source}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyImage(generatedResult.imageUrl)}
                          className="w-full py-2 rounded-lg bg-[#2C362B] hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>Apply to {selectedTargetStopId === 'trip_cover' ? 'Trip Cover' : 'Selected Stop'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2">
                        <span className="material-symbols-outlined text-3xl">brush</span>
                        <p className="text-xs">
                          Configure landmark and style on the left, then click Generate.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BROWSE ICONIC LIBRARY */}
          {activeTab === 'browse_landmarks' && (
            <div className="space-y-4">
              {/* Search input */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-xs">
                <span className="material-symbols-outlined text-gray-400 pl-2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchBrowse(searchQuery);
                  }}
                  placeholder="Search landmark (e.g. Canton Tower, Oriental Pearl, Yu Garden, Barelang Bridge)..."
                  className="flex-1 text-xs font-medium px-2 py-1.5 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSearchBrowse(searchQuery)}
                  className="px-4 py-1.5 rounded-lg bg-[#2C362B] text-white font-bold text-xs hover:bg-black transition-all"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Quick destination filters */}
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Guangzhou (广州)', query: 'guangzhou' },
                  { name: 'Shanghai (上海)', query: 'shanghai' },
                  { name: 'Beijing (北京)', query: 'beijing' },
                  { name: 'Batam (巴淡岛)', query: 'batam' },
                ].map((item) => (
                  <button
                    key={item.query}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.query);
                      handleSearchBrowse(item.query);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      searchQuery.toLowerCase().includes(item.query)
                        ? 'bg-[#D9734E] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Grid of Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {browseResults.map((photo, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#D9734E] transition-all flex flex-col group"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs">
                        {photo.category}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-[#2C362B] line-clamp-1">{photo.title}</p>
                        <p className="text-[10px] text-gray-500 truncate">{photo.source}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleApplyImage(photo.url)}
                        className="w-full py-1.5 rounded-lg bg-gray-100 hover:bg-[#D9734E] hover:text-white text-[#2C362B] font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                        <span>Use This Photo</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            Active Trip: <strong className="text-gray-900">{activeItinerary.title}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
