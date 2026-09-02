import React, { useState, useEffect } from 'react';
import { Coordinates, ItineraryStop } from '../types';
import {
  LandmarkPhoto,
  searchOnlineLandmarkPhotos,
  resolveSymbolicLandmark,
  generateAILandmarkImage,
} from '../services/landmarkImageService';

interface EditStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stop: ItineraryStop, targetDayNumber: number) => void;
  initialStop?: ItineraryStop | null;
  dayNumber: number;
  availableDays: number[];
  defaultCenter?: Coordinates;
}

export const EditStopModal: React.FC<EditStopModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStop,
  dayNumber,
  availableDays,
  defaultCenter,
}) => {
  const [targetDay, setTargetDay] = useState(dayNumber);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(defaultCenter?.lat || 39.9163);
  const [lng, setLng] = useState(defaultCenter?.lng || 116.3972);
  const [timeSlot, setTimeSlot] = useState('');
  const [duration, setDuration] = useState('2.0 hrs');
  const [category, setCategory] = useState<ItineraryStop['category']>('landmark');
  const [description, setDescription] = useState('');
  const [tipsText, setTipsText] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Live photo suggestions
  const [suggestedPhotos, setSuggestedPhotos] = useState<LandmarkPhoto[]>([]);
  const [isSearchingPhotos, setIsSearchingPhotos] = useState(false);
  const [isAIMatching, setIsAIMatching] = useState(false);
  const [aiMatchStatus, setAiMatchStatus] = useState<string | null>(null);

  const handleAIMatchStop = async () => {
    setIsAIMatching(true);
    setAiMatchStatus(null);
    try {
      const match = await resolveSymbolicLandmark(
        locationName || title || 'landmark',
        locationName || title,
        lat && lng ? { lat, lng } : undefined
      );
      if (match && match.url) {
        setImageUrl(match.url);
        setAiMatchStatus(`Matched symbolic landmark: ${match.title}`);
      } else {
        setAiMatchStatus('Fetched location photo.');
      }
    } catch (e) {
      console.warn('AI Match error:', e);
      setAiMatchStatus('Defaulted to symbolic photo.');
    } finally {
      setIsAIMatching(false);
    }
  };

  const handleAIGenerateStopArt = async () => {
    setIsAIMatching(true);
    setAiMatchStatus('Generating AI artwork...');
    try {
      const result = await generateAILandmarkImage({
        locationName: locationName || title,
        destination: address || title,
        style: 'Photorealistic Golden Hour',
      });
      if (result && result.imageUrl) {
        setImageUrl(result.imageUrl);
        setAiMatchStatus(`Generated: ${result.title || locationName || title}`);
      }
    } catch (e) {
      console.warn('AI Generate error:', e);
    } finally {
      setIsAIMatching(false);
    }
  };

  useEffect(() => {
    if (initialStop) {
      setTargetDay(initialStop.dayNumber);
      setTitle(initialStop.title);
      setSubtitle(initialStop.subtitle || '');
      setLocationName(initialStop.locationName || '');
      setAddress(initialStop.address || '');
      setLat(initialStop.coordinates.lat);
      setLng(initialStop.coordinates.lng);
      setTimeSlot(initialStop.timeSlot || '');
      setDuration(initialStop.duration || '2.0 hrs');
      setCategory(initialStop.category || 'landmark');
      setDescription(initialStop.description || '');
      setTipsText(initialStop.tips ? initialStop.tips.join('\n') : '');
      setImageUrl(initialStop.imageUrl || '');
      loadSuggestedPhotos(initialStop.locationName || initialStop.title);
    } else {
      setTargetDay(dayNumber);
      setTitle('');
      setSubtitle('');
      setLocationName('');
      setAddress('');
      setLat(defaultCenter?.lat || 39.9163);
      setLng(defaultCenter?.lng || 116.3972);
      setTimeSlot('09:00 AM');
      setDuration('2.0 hrs');
      setCategory('landmark');
      setDescription('');
      setTipsText('');
      setImageUrl('');
      setSuggestedPhotos([]);
    }
  }, [initialStop, dayNumber, defaultCenter, isOpen]);

  const loadSuggestedPhotos = async (query: string) => {
    if (!query || query.trim().length < 2) return;
    setIsSearchingPhotos(true);
    try {
      const photos = await searchOnlineLandmarkPhotos(query);
      setSuggestedPhotos(photos);
    } catch (e) {
      console.warn('Failed to load photos:', e);
    } finally {
      setIsSearchingPhotos(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tips = tipsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedStop: ItineraryStop = {
      id: initialStop ? initialStop.id : `stop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dayNumber: targetDay,
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      locationName: locationName.trim() || title.trim(),
      address: address.trim() || undefined,
      coordinates: {
        lat: Number(lat) || defaultCenter?.lat || 39.9163,
        lng: Number(lng) || defaultCenter?.lng || 116.3972,
      },
      timeSlot: timeSlot.trim() || undefined,
      duration: duration.trim() || undefined,
      category,
      description: description.trim(),
      tips: tips.length > 0 ? tips : undefined,
      imageUrl: imageUrl.trim() || undefined,
      offlineCached: true,
    };

    onSave(updatedStop, targetDay);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#2C362B]/10 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#D9734E] text-2xl">
              {initialStop ? 'edit_location_alt' : 'add_location_alt'}
            </span>
            <h3 className="font-serif text-xl font-bold text-[#2C362B]">
              {initialStop ? 'Edit Stop / Destination' : 'Add New Stop to Itinerary'}
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
          {/* Day & Category Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Assign to Day
              </label>
              <select
                value={targetDay}
                onChange={(e) => setTargetDay(Number(e.target.value))}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
              >
                {availableDays.map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItineraryStop['category'])}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
              >
                <option value="landmark">Landmark / Sights (游)</option>
                <option value="dining">Food & Dining (食)</option>
                <option value="culture">Culture / Heritage (文)</option>
                <option value="nature">Nature / Outdoors (景)</option>
                <option value="hotel">Hotel / Lodging (宿)</option>
                <option value="activity">Activity / Transport (行)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Stop Name / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Canton Tower / Oriental Pearl Tower / Forbidden City"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.length > 2) {
                  loadSuggestedPhotos(e.target.value);
                }
              }}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
            />
          </div>

          {/* Subtitle / Venue */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Subtitle or Location Venue
            </label>
            <input
              type="text"
              placeholder="e.g., Zhujiang New Town / Lujiazui / Chaoyang"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
            />
          </div>

          {/* Location Name & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Search Venue Name
              </label>
              <input
                type="text"
                placeholder="e.g., 广州塔 / 东方明珠"
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                  loadSuggestedPhotos(e.target.value);
                }}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Street Address
              </label>
              <input
                type="text"
                placeholder="e.g., 阅江西路222号"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Time Slot
              </label>
              <input
                type="text"
                placeholder="e.g., 09:30 AM / Afternoon"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
                Estimated Duration
              </label>
              <input
                type="text"
                placeholder="e.g., 2.5 hrs / 45 min"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B]"
              />
            </div>
          </div>

          {/* Coordinates (Latitude & Longitude for Map Pin) */}
          <div className="bg-[#F9F6F0] p-3 rounded-2xl border border-gray-200/80">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D9734E] mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">pin_drop</span>
              Map Pin Coordinates
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#2C362B]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-semibold mb-0.5">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-[#2C362B]"
                />
              </div>
            </div>
          </div>

          {/* Symbolic Photo Finder & Selection */}
          <div className="bg-[#F9F6F0] p-3.5 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C362B] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#D9734E]">add_photo_alternate</span>
                Symbolic Photo Selection
              </span>
              <button
                type="button"
                onClick={() => loadSuggestedPhotos(locationName || title || 'landmark')}
                className="text-[11px] font-bold text-[#D9734E] hover:underline flex items-center gap-1"
              >
                <span>🔍 Search Photos</span>
              </button>
            </div>

            {/* AI Auto-Match & Generate Buttons */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <button
                type="button"
                onClick={handleAIMatchStop}
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
                onClick={handleAIGenerateStopArt}
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

            {imageUrl && (
              <div className="relative w-full h-28 rounded-xl overflow-hidden mb-2 border border-gray-200">
                <img
                  src={imageUrl}
                  alt="Stop Photo Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {suggestedPhotos.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] text-gray-500 font-medium mb-1 flex items-center justify-between">
                  <span>Click to select landmark photo:</span>
                  {isSearchingPhotos && <span className="text-[#D9734E]">Searching...</span>}
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-1 bg-white rounded-xl border border-gray-200">
                  {suggestedPhotos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 text-left group transition-all ${
                        imageUrl === p.url
                          ? 'border-[#D9734E] ring-2 ring-[#D9734E]/30'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                      title={p.title}
                    >
                      <img
                        src={p.url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white p-0.5 truncate text-center">
                        {p.source}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1">
                Photo URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-[#2C362B]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Stop Description &amp; Highlights
            </label>
            <textarea
              rows={3}
              placeholder="What to do, eat, or experience at this stop..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
            />
          </div>

          {/* Traveler Tips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8A9389] mb-1">
              Traveler Tips (One per line)
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Book tickets in advance&#10;Visit during blue hour for night photos"
              value={tipsText}
              onChange={(e) => setTipsText(e.target.value)}
              className="w-full bg-[#F9F6F0] border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#2C362B] focus:outline-none focus:ring-2 focus:ring-[#D9734E]/50"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>{initialStop ? 'Save Changes' : 'Add Stop'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
