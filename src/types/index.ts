export type MapEngineType = 'google' | 'amap' | 'auto';
export type ActiveEngineType = 'google' | 'amap';

export type BatteryMode = 'high_accuracy' | 'balanced' | 'ultra_battery_saver';

export interface BatteryStatusInfo {
  level: number; // 0 to 1
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  powerSaveActive: boolean;
  dutyCyclePercent: number;
  batteryHealthScore: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ItineraryStop {
  id: string;
  dayNumber: number;
  title: string;
  subtitle?: string;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  timeSlot?: string;
  duration?: string;
  category: 'landmark' | 'nature' | 'dining' | 'activity' | 'hotel' | 'culture';
  imageUrl?: string;
  address?: string;
  tips?: string[];
  offlineCached?: boolean;
  weatherForecast?: {
    temp: string;
    condition: string;
    icon: string;
  };
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  dateStr: string;
  summary?: string;
  stops: ItineraryStop[];
}

export interface Itinerary {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  travelersCount: number;
  destination: string;
  regionCountry: string;
  isChinaRegion: boolean;
  coverImage: string;
  quote: string;
  center: Coordinates;
  zoom: number;
  days: ItineraryDay[];
}

export interface NavigationStep {
  id: string;
  instruction: string;
  roadName: string;
  maneuver: 'turn-left' | 'turn-right' | 'slight-left' | 'slight-right' | 'straight' | 'roundabout' | 'merge' | 'destination' | 'u-turn';
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  durationText: string;
  coordinates: Coordinates;
  speedLimitKmh: number;
  trafficCondition: 'clear' | 'moderate' | 'heavy' | 'incident';
  trafficDelayText?: string;
  alert?: {
    type: 'traffic' | 'camera' | 'hazard' | 'turn';
    message: string;
    severity: 'info' | 'warning' | 'danger';
  };
}

export interface RouteNavigationState {
  isActive: boolean;
  isSimulating: boolean;
  isPaused: boolean;
  currentStepIndex: number;
  routeSteps: NavigationStep[];
  currentLocation: Coordinates;
  currentSpeedKmh: number;
  distanceToNextStepMeters: number;
  distanceToNextStepText: string;
  timeToNextStepText: string;
  totalDistanceRemainingText: string;
  totalDurationRemainingText: string;
  isVoiceMuted: boolean;
  voiceLanguage: string;
  activeAlert?: string;
  recentAnnouncements: string[];
}

export interface LocalSearchResult {
  id: string;
  name: string;
  category: string;
  address: string;
  coordinates: Coordinates;
  rating: number;
  reviewsCount: number;
  openNow: boolean;
  distanceKm: number;
  cachedOffline: boolean;
  sourceEngine: 'google' | 'amap' | 'offline_db';
}

export interface OfflineCacheStats {
  totalItems: number;
  totalSizeBytes: number;
  formattedSize: string;
  lastUpdated: string;
  cachedItinerariesCount: number;
  cachedSearchPlacesCount: number;
  cachedTilesCount: number;
}
