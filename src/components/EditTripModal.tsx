import React, { useState, useEffect } from 'react';
import { Coordinates, Itinerary } from '../types';
import {
  LandmarkPhoto,
  searchOnlineLandmarkPhotos,
  resolveSymbolicLandmark,
  generateAILandmarkImage,
} from '../services/landmarkImageService';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trip: Itinerary) => void;
  initialTrip?: Itinerary | null;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTrip,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [destination, setDestination] = useState('');
  const [regionCountry, setRegionCountry] = useState('China');
  const [isChinaRegion, setIsChinaRegion] = useState(true);
  const [dateRange, setDateRange] = useState('');
  const [travelersCount, setTravelersCount] = useState(2);
  const [coverImage, setCoverImage] = useState('');
  const [quote, setQuote] = useState('');
  const [lat, setLat] = useState(39.9163);
  const [lng, setLng] = useState(116.3972);
  const [zoom, setZoom] = useState(12);

  // Live landmark photos suggestions
  const [suggestedPhotos, setSuggestedPhotos] = useState<LandmarkPhoto[]>([]);
  const [isSearchingPhotos, setIsSearchingPhotos] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [isAIMatching, setIsAIMatching] = useState(false);
  const [aiMatchStatus, setAiMatchStatus] = useState<string | null>(null);

  const handleAIMatchCover = async () => {
    setIsAIMatching(true);
    setAiMatchStatus(null);
    try {
      const match = await resolveSymbolicLandmark(
        destination || title || 'China',
        destination || title,
        lat && lng ? { lat, lng } : undefined
      );
      if (match && match.url) {
        setCoverImage(match.url);
        setAiMatchStatus(`Matched iconic landmark: ${match.title}`);
      } else {
        setAiMatchStatus('Fetched symbolic landmark photography.');
      }
    } catch (e) {
      console.warn('AI Match error:', e);
      setAiMatchStatus('Defaulted to location photo.');
    } finally {
      setIsAIMatching(false);
    }
  };

  const handleAIGenerateCoverArt = async () => {
    setIsAIMatching(true);
    setAiMatchStatus('Generating AI golden hour artwork...');
    try {
      const result = await generateAILandmarkImage({
        locationName: destination || title,
        destination: destination,
        style: 'Photorealistic Golden Hour',
      });
      if (result && result.imageUrl) {
        setCoverImage(result.imageUrl);
        setAiMatchStatus(`Generated: ${result.title || destination}`);
      }
    } catch (e) {
      console.warn('AI Generate error:', e);
    } finally {
      setIsAIMatching(false);
    }
  };

  useEffect(() => {
    if (initialTrip) {
      setTitle(initialTrip.title);
      setSubtitle(initialTrip.subtitle || '');
      setDestination(initialTrip.destination);
      setRegionCountry(initialTrip.regionCountry || 'China');
      setIsChinaRegion(initialTrip.isChinaRegion);
      setDateRange(initialTrip.dateRange);
      setTravelersCount(initialTrip.travelersCount || 2);
      setCoverImage(initialTrip.coverImage || '');
      setQuote(initialTrip.quote || '');
      setLat(initialTrip.center.lat);
      setLng(initialTrip.center.lng);
      setZoom(initialTrip.zoom || 12);
      loadLandmarkPhotos(initialTrip.destination || initialTrip.title);
    } else {
      setTitle('');
      setSubtitle('');
      setDestination('Beijing, China');
      setRegionCountry('China');
      setIsChinaRegion(true);
      setDateRange('DEC 2026 • 4 Travelers');
      setTravelersCount(4);
      setCoverImage('https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80');
      setQuote('""');
      setLat(39.9163);
      setLng(116.3972);
      setZoom(12);
      loadLandmarkPhotos('Beijing');
    }
  }, [initialTrip, isOpen]);

  const loadLandmarkPhotos = async (query: string) => {
    if (!query) return;
    setIsSearchingPhotos(true);
    try {
      const photos = await searchOnlineLandmarkPhotos(query);
      setSuggestedPhotos(photos);
    } catch (e) {
      console.warn('Failed to fetch landmark photos:', e);
    } finally {
      setIsSearchingPhotos(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tripData: Itinerary = {
      id: initialTrip ? initialTrip.id : `trip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `${destination} Travel Itinerary`,
      destination: destination.trim() || 'New Destination',
      regionCountry: regionCountry.trim() || 'China',
      isChinaRegion: isChinaRegion,
      dateRange: dateRange.trim() || '2026 • Travel Plan',
      travelersCount: Number(travelersCount) || 2,
      coverImage:
        coverImage.trim() ||
        'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=1200&q=80',
      quote: quote.trim() || `"${title} travel itinerary exploring memorable destinations."`,
      center: {
        lat: Number(lat) || 39.9163,
        lng: Number(lng) || 116.3972,
      },
      zoom: Number(zoom) || 12,
      days: initialTrip
        ? initialTrip.days
        : [
            {
              dayNumber: 1,
              title: 'Day 1: Arrival & Highlights',
              dateStr: 'Day 1',
              summary: 'First day exploration and local dining.',
              stops: [],
            },
          ],
    };

    onSave(tripData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#2C362B]/10 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D9734E] text-2xl">
              {initialTrip ? 'edit_note' : 'add_circle'}
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2C362B]">
              {initialTrip ? 'Edit Trip Details' : 'Create Brand New Trip'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Trip Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Beijing Winter Wonder · 北京冬季之旅"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.length > 2) {
                  loadLandmarkPhotos(e.target.value);
                }
              }}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Subtitle / Theme
            </label>
            <input
              type="text"
              placeholder="e.g., Imperial Dynasties & Winter Great Wall"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Destination City
              </label>
              <input
                type="text"
                placeholder="e.g., Guangzhou, Shanghai, Beijing, Batam"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  loadLandmarkPhotos(e.target.value);
                }}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Country / Region
              </label>
              <input
                type="text"
                placeholder="e.g., China / Singapore / Indonesia"
                value={regionCountry}
                onChange={(e) => setRegionCountry(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Date Range / Travelers
              </label>
              <input
                type="text"
                placeholder="e.g., DEC 2026 • 4 Travelers"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Travelers Count
              </label>
              <input
                type="number"
                min={1}
                value={travelersCount}
                onChange={(e) => setTravelersCount(parseInt(e.target.value) || 1)}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
          </div>

          {/* Region toggle for map engine routing */}
          <div className="flex items-center gap-3 bg-[#F9F6F0] p-3 rounded-2xl border border-gray-200">
            <input
              type="checkbox"
              id="isChinaRegionCheck"
              checked={isChinaRegion}
              onChange={(e) => setIsChinaRegion(e.target.checked)}
              className="w-4 h-4 text-[#D9734E] rounded focus:ring-[#D9734E]"
            />
            <label htmlFor="isChinaRegionCheck" className="text-xs text-[#2C362B] font-semibold cursor-pointer">
              China Region (optimizes with AMap 高德 and GCJ-02 satellite mapping)
            </label>
          </div>

          {/* Symbolic Landmark Photo Selector Section */}
          <div className="bg-[#F9F6F0] p-3.5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C362B] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#D9734E]">photo_library</span>
                Symbolic Landmark Photo
              </span>
              <button
                type="button"
                onClick={() => {
                  setShowPhotoGallery(!showPhotoGallery);
                  loadLandmarkPhotos(destination || title || 'China');
                }}
                className="text-[11px] font-bold text-[#D9734E] hover:underline flex items-center gap-0.5"
              >
                <span>{showPhotoGallery ? 'Hide Gallery' : '🔍 Browse Symbolic Photos'}</span>
              </button>
            </div>

            {/* AI Auto-Match and Generate Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <button
                type="button"
                onClick={handleAIMatchCover}
                disabled={isAIMatching}
                className="px-3 py-1.5 rounded-lg bg-[#2C362B] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm text-[#D9734E]">
                  {isAIMatching ? 'sync' : 'auto_fix_high'}
                </span>
                <span>Auto-Match Landmark</span>
              </button>

              <button
                type="button"
                onClick={handleAIGenerateCoverArt}
                disabled={isAIMatching}
                className="px-3 py-1.5 rounded-lg bg-[#D9734E] hover:bg-[#c25e39] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  {isAIMatching ? 'sync' : 'brush'}
                </span>
                <span>Generate AI Art</span>
              </button>
            </div>

            {aiMatchStatus && (
              <p className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg mb-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                <span>{aiMatchStatus}</span>
              </p>
            )}

            {/* Current Cover Preview */}
            {coverImage && (
              <div className="relative w-full h-32 rounded-xl overflow-hidden mb-2.5 border border-gray-200 group">
                <img
                  src={coverImage}
                  alt="Trip Cover Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full">
                    Current Cover Selected
                  </span>
                </div>
              </div>
            )}

            {/* Quick symbolic photos thumbnail gallery */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                <span>Click a symbolic photo to apply:</span>
                {isSearchingPhotos && (
                  <span className="text-[#D9734E] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#D9734E] animate-ping" />
                    Fetching online...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-gray-200">
                {suggestedPhotos.map((photo, pIdx) => {
                  const isCurrent = coverImage === photo.url;
                  return (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setCoverImage(photo.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 text-left group transition-all ${
                        isCurrent
                          ? 'border-[#D9734E] ring-2 ring-[#D9734E]/30 scale-[0.98]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      title={photo.title}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] text-white font-bold truncate">
                        {photo.source}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct URL Input */}
            <div className="mt-2.5">
              <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">
                Or Custom Image URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#2C362B]"
              />
            </div>
          </div>

          {/* Center Coordinates */}
          <div className="bg-[#F9F6F0] p-3 rounded-2xl border border-gray-200/80">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D9734E] mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">map</span>
              Map Initial Center &amp; Zoom
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">Center Lat</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-[#2C362B]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">Center Lng</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-[#2C362B]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">Default Zoom</label>
                <input
                  type="number"
                  min={1}
                  max={18}
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value) || 12)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-[#2C362B]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Trip Editorial Quote / Motto
            </label>
            <textarea
              rows={2}
              placeholder="e.g., 'Crisp winter air, crimson imperial walls, and unforgettable moments...'"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>{initialTrip ? 'Save Changes' : 'Create Trip'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
