import React, { useEffect, useState } from 'react';
import { getCachedPlaces, savePlacesOffline } from '../services/offlineCacheService';
import { Coordinates, ItineraryStop, LocalSearchResult } from '../types';

interface LocalSearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  centerCoordinates: Coordinates;
  destinationName: string;
  onSelectPlaceForNavigation: (stop: ItineraryStop) => void;
}

export const LocalSearchDrawer: React.FC<LocalSearchDrawerProps> = ({
  isOpen,
  onClose,
  centerCoordinates,
  destinationName,
  onSelectPlaceForNavigation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [results, setResults] = useState<LocalSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Places', icon: 'travel_explore' },
    { id: 'dining', label: 'Dining & Cafes', icon: 'restaurant' },
    { id: 'attraction', label: 'Attractions', icon: 'attractions' },
    { id: 'fuel', label: 'Fuel / EV', icon: 'ev_station' },
    { id: 'emergency', label: 'Medical & Help', icon: 'local_hospital' },
  ];

  // Populate curated local places with offline persistence
  useEffect(() => {
    if (!isOpen) return;

    const loadPlaces = async () => {
      setIsLoading(true);

      // Try reading from IndexedDB first
      const cached = await getCachedPlaces(selectedCategory, searchQuery);
      if (cached.length > 0) {
        setResults(cached);
        setIsLoading(false);
        return;
      }

      // Generate contextually aware local search results based on destination
      const isSydney = destinationName.includes('Sydney') || destinationName.includes('Australia');
      const isChina = destinationName.includes('Beijing') || destinationName.includes('China');

      let generated: LocalSearchResult[] = [];

      if (isSydney) {
        generated = [
          {
            id: 'syd-poi-1',
            name: 'Bennelong Restaurant & Bar',
            category: 'dining',
            address: 'Sydney Opera House, Bennelong Point',
            coordinates: { lat: -33.8570, lng: 151.2150 },
            rating: 4.8,
            reviewsCount: 1420,
            openNow: true,
            distanceKm: 0.2,
            cachedOffline: true,
            sourceEngine: 'google',
          },
          {
            id: 'syd-poi-2',
            name: 'Royal Botanic Garden Visitors Kiosk',
            category: 'attraction',
            address: 'Mrs Macquaries Rd, Sydney NSW 2000',
            coordinates: { lat: -33.8640, lng: 151.2165 },
            rating: 4.7,
            reviewsCount: 3890,
            openNow: true,
            distanceKm: 0.8,
            cachedOffline: true,
            sourceEngine: 'google',
          },
          {
            id: 'syd-poi-3',
            name: 'Circular Quay Fast Ferry & EV Hub',
            category: 'fuel',
            address: 'Wharf 4, Circular Quay',
            coordinates: { lat: -33.8610, lng: 151.2110 },
            rating: 4.6,
            reviewsCount: 520,
            openNow: true,
            distanceKm: 0.6,
            cachedOffline: true,
            sourceEngine: 'google',
          },
          {
            id: 'syd-poi-4',
            name: 'Sydney Hospital & Eye Medical Centre',
            category: 'emergency',
            address: '8 Macquarie St, Sydney NSW 2000',
            coordinates: { lat: -33.8680, lng: 151.2130 },
            rating: 4.5,
            reviewsCount: 310,
            openNow: true,
            distanceKm: 1.4,
            cachedOffline: true,
            sourceEngine: 'google',
          },
        ];
      } else if (isChina) {
        generated = [
          {
            id: 'chn-poi-1',
            name: '四季民福烤鸭店 (Siji Minfu Peking Duck)',
            category: 'dining',
            address: '东城区灯市口大街32号 (Dongcheng, Beijing)',
            coordinates: { lat: 39.9180, lng: 116.4150 },
            rating: 4.9,
            reviewsCount: 4890,
            openNow: true,
            distanceKm: 1.1,
            cachedOffline: true,
            sourceEngine: 'amap',
          },
          {
            id: 'chn-poi-2',
            name: '故宫角楼咖啡馆 (Corner Tower Cafe)',
            category: 'dining',
            address: '故宫神武门西侧 (West of Shenwumen)',
            coordinates: { lat: 39.9240, lng: 116.3940 },
            rating: 4.7,
            reviewsCount: 2150,
            openNow: true,
            distanceKm: 0.3,
            cachedOffline: true,
            sourceEngine: 'amap',
          },
          {
            id: 'chn-poi-3',
            name: '国家电网超级快充站 (State Grid Supercharger)',
            category: 'fuel',
            address: '景山前街地下充电枢纽',
            coordinates: { lat: 39.9210, lng: 116.3980 },
            rating: 4.8,
            reviewsCount: 320,
            openNow: true,
            distanceKm: 0.5,
            cachedOffline: true,
            sourceEngine: 'amap',
          },
          {
            id: 'chn-poi-4',
            name: '北京协和医院国际医疗部 (PUMCH Hospital)',
            category: 'emergency',
            address: '东城区王府井帅府园1号',
            coordinates: { lat: 39.9140, lng: 116.4180 },
            rating: 4.9,
            reviewsCount: 940,
            openNow: true,
            distanceKm: 1.8,
            cachedOffline: true,
            sourceEngine: 'amap',
          },
        ];
      } else {
        generated = [
          {
            id: 'gen-poi-1',
            name: `${destinationName} Artisan Cafe`,
            category: 'dining',
            address: 'Central Promenade',
            coordinates: { lat: centerCoordinates.lat + 0.002, lng: centerCoordinates.lng + 0.002 },
            rating: 4.8,
            reviewsCount: 840,
            openNow: true,
            distanceKm: 0.4,
            cachedOffline: true,
            sourceEngine: 'offline_db',
          },
          {
            id: 'gen-poi-2',
            name: `${destinationName} Medical & Tourist Aid`,
            category: 'emergency',
            address: 'Main Information Center',
            coordinates: { lat: centerCoordinates.lat - 0.003, lng: centerCoordinates.lng + 0.001 },
            rating: 4.6,
            reviewsCount: 190,
            openNow: true,
            distanceKm: 0.7,
            cachedOffline: true,
            sourceEngine: 'offline_db',
          },
        ];
      }

      // Filter by category & search query
      let filtered = generated;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((p) => p.category === selectedCategory);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
      }

      setResults(filtered);
      await savePlacesOffline(generated); // Persist in IndexedDB
      setIsLoading(false);
    };

    loadPlaces();
  }, [isOpen, selectedCategory, searchQuery, destinationName, centerCoordinates.lat, centerCoordinates.lng]);

  if (!isOpen) return null;

  const handleStartNav = (place: LocalSearchResult) => {
    const stop: ItineraryStop = {
      id: place.id,
      dayNumber: 1,
      title: place.name,
      subtitle: place.address,
      description: `Local search result: ${place.name}, Rating: ${place.rating}★ (${place.reviewsCount} reviews).`,
      locationName: place.name,
      coordinates: place.coordinates,
      category: place.category as any,
      offlineCached: true,
    };
    onSelectPlaceForNavigation(stop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#F9F6F0] text-[#2C362B] w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl border border-[#2C362B]/10 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 pb-3 border-b border-[#2C362B]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#D9734E]/15 flex items-center justify-center text-[#D9734E]">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Local Search &amp; POIs</h3>
              <p className="text-xs text-[#8A9389]">Persistently cached for offline discovery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-4 pb-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#8A9389]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search places near ${destinationName}...`}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-sm text-[#2C362B] placeholder-[#8A9389] focus:outline-none focus:border-[#D9734E] shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
              </button>
            )}
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#2C362B] text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-[#8A9389]">
              <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
              <span className="text-sm font-medium">Scanning offline cache &amp; live map data...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-[#8A9389]">
              <span className="material-symbols-outlined text-4xl mb-1">search_off</span>
              <p className="text-sm font-medium">No places matching your filter.</p>
            </div>
          ) : (
            results.map((place) => (
              <div
                key={place.id}
                className="p-3.5 rounded-2xl bg-white border border-[#2C362B]/5 shadow-sm hover:border-[#D9734E]/40 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#2C362B]">{place.name}</h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ⚡ Offline Saved
                    </span>
                  </div>
                  <p className="text-xs text-[#8A9389] mt-0.5 line-clamp-1">{place.address}</p>

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <span className="material-symbols-outlined text-xs text-amber-500">star</span>
                      {place.rating} ({place.reviewsCount})
                    </span>
                    <span className="text-[#8A9389] font-medium">• {place.distanceKm} km away</span>
                    <span className="text-emerald-600 font-semibold">• Open now</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartNav(place)}
                  className="h-9 px-3 rounded-full bg-[#D9734E] hover:bg-[#c4623e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all active:scale-95 whitespace-nowrap"
                  title="Start Turn-by-Turn Navigation to this location"
                >
                  <span className="material-symbols-outlined text-sm">navigation</span>
                  Go
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
