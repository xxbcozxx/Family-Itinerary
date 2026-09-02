import { ActiveEngineType, Coordinates, MapEngineType } from '../types';

export const AMAP_API_KEY =
  (import.meta as any).env?.VITE_AMAP_API_KEY || 'c658af726cad75cfa4d992ba59bbcb2c';
export const GOOGLE_MAPS_API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDRysP99SREOPNtyFjJ9tUhBZZIcFLZ6s8';

/**
 * Checks if a given coordinate is located inside mainland China territory
 * (Approximate bounding polygons / bounding boxes covering mainland China & coastal waters)
 */
export function isCoordinateInChina(coords: Coordinates): boolean {
  const { lat, lng } = coords;
  // General Mainland China approximate bounding box
  if (lat >= 18.15 && lat <= 53.55 && lng >= 73.66 && lng <= 135.05) {
    // Exclude parts of neighboring countries like Philippines / Vietnam / Korea / Japan edges
    if (lat < 21.0 && lng > 117.0) return false; // South China Sea outside
    if (lat > 38.0 && lng > 125.0) return false; // Korea/Japan
    return true;
  }
  return false;
}

/**
 * Determine the active map provider based on user preference, current destination, or coordinates.
 */
export function resolveActiveEngine(
  preference: MapEngineType,
  coords: Coordinates,
  isChinaExplicitFlag?: boolean
): ActiveEngineType {
  if (preference === 'amap') return 'amap';
  if (preference === 'google') return 'google';

  // In 'auto' mode:
  if (isChinaExplicitFlag !== undefined) {
    return isChinaExplicitFlag ? 'amap' : 'google';
  }

  return isCoordinateInChina(coords) ? 'amap' : 'google';
}

/**
 * WGS-84 (GPS standard used by Google Maps) to GCJ-02 (Mars coordinates used by AMap in China)
 * High accuracy conversion algorithm
 */
const PI = Math.PI;
const A_AXIS = 6378245.0;
const EE = 0.00669342162296594323;

function transformLat(x: number, y: number): number {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}

function transformLon(x: number, y: number): number {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}

export function wgs84ToGcj02(wgsCoords: Coordinates): Coordinates {
  if (!isCoordinateInChina(wgsCoords)) {
    return wgsCoords;
  }
  const { lat, lng } = wgsCoords;
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLon = transformLon(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((A_AXIS * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLon = (dLon * 180.0) / ((A_AXIS / sqrtMagic) * Math.cos(radLat) * PI);
  return {
    lat: lat + dLat,
    lng: lng + dLon
  };
}

export function gcj02ToWgs84(gcjCoords: Coordinates): Coordinates {
  if (!isCoordinateInChina(gcjCoords)) {
    return gcjCoords;
  }
  const { lat, lng } = gcjCoords;
  let dLat = transformLat(lng - 105.0, lat - 35.0);
  let dLon = transformLon(lng - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((A_AXIS * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLon = (dLon * 180.0) / ((A_AXIS / sqrtMagic) * Math.cos(radLat) * PI);
  return {
    lat: lat - dLat,
    lng: lng - dLon
  };
}
