import { Itinerary, LocalSearchResult, OfflineCacheStats } from '../types';

const DB_NAME = 'NomadWondersOfflineDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

export function getOfflineDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('itineraries')) {
        db.createObjectStore('itineraries', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('places')) {
        const placeStore = db.createObjectStore('places', { keyPath: 'id' });
        placeStore.createIndex('category', 'category', { unique: false });
        placeStore.createIndex('sourceEngine', 'sourceEngine', { unique: false });
      }

      if (!db.objectStoreNames.contains('map_metadata')) {
        db.createObjectStore('map_metadata', { keyPath: 'key' });
      }

      if (!db.objectStoreNames.contains('navigation_routes')) {
        db.createObjectStore('navigation_routes', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });

  return dbPromise;
}

export async function saveItineraryOffline(itinerary: Itinerary): Promise<void> {
  try {
    const db = await getOfflineDB();
    const tx = db.transaction(['itineraries', 'map_metadata'], 'readwrite');
    const store = tx.objectStore('itineraries');
    store.put({
      ...itinerary,
      cachedAt: new Date().toISOString(),
      offlineReady: true,
    });

    const metaStore = tx.objectStore('map_metadata');
    metaStore.put({
      key: `itinerary_${itinerary.id}`,
      sizeBytes: JSON.stringify(itinerary).length * 2,
      timestamp: Date.now(),
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save itinerary offline in IndexedDB:', err);
  }
}

export async function getCachedItinerary(id: string): Promise<Itinerary | null> {
  try {
    const db = await getOfflineDB();
    const tx = db.transaction('itineraries', 'readonly');
    const store = tx.objectStore('itineraries');
    const request = store.get(id);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('Failed to read cached itinerary:', err);
    return null;
  }
}

export async function savePlacesOffline(places: LocalSearchResult[]): Promise<void> {
  try {
    const db = await getOfflineDB();
    const tx = db.transaction('places', 'readwrite');
    const store = tx.objectStore('places');

    for (const place of places) {
      store.put({
        ...place,
        cachedOffline: true,
        cachedAt: Date.now(),
      });
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to save places to offline cache:', err);
  }
}

export async function getCachedPlaces(category?: string, query?: string): Promise<LocalSearchResult[]> {
  try {
    const db = await getOfflineDB();
    const tx = db.transaction('places', 'readonly');
    const store = tx.objectStore('places');
    const request = store.getAll();

    return new Promise((resolve) => {
      request.onsuccess = () => {
        let results: LocalSearchResult[] = request.result || [];
        if (category && category !== 'all') {
          results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
        }
        if (query && query.trim()) {
          const q = query.toLowerCase();
          results = results.filter((p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
        }
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('Failed to get cached places:', err);
    return [];
  }
}

export async function getOfflineStats(): Promise<OfflineCacheStats> {
  try {
    const db = await getOfflineDB();
    const tx = db.transaction(['itineraries', 'places', 'map_metadata'], 'readonly');

    const itReq = tx.objectStore('itineraries').count();
    const plReq = tx.objectStore('places').count();
    const metaReq = tx.objectStore('map_metadata').getAll();

    return new Promise((resolve) => {
      tx.oncomplete = () => {
        const itCount = itReq.result || 0;
        const plCount = plReq.result || 0;
        const metas = metaReq.result || [];

        let totalBytes = (itCount * 24000) + (plCount * 1200);
        metas.forEach((m) => {
          if (m.sizeBytes) totalBytes += m.sizeBytes;
        });

        // Convert to readable format
        const formatted = totalBytes > 1024 * 1024
          ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
          : `${(totalBytes / 1024).toFixed(1)} KB`;

        resolve({
          totalItems: itCount + plCount,
          totalSizeBytes: totalBytes,
          formattedSize: formatted,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cachedItinerariesCount: itCount,
          cachedSearchPlacesCount: plCount,
          cachedTilesCount: Math.min(180, itCount * 45 + 20),
        });
      };
      tx.onerror = () => {
        resolve({
          totalItems: 0,
          totalSizeBytes: 0,
          formattedSize: '0 KB',
          lastUpdated: 'Just now',
          cachedItinerariesCount: 0,
          cachedSearchPlacesCount: 0,
          cachedTilesCount: 0,
        });
      };
    });
  } catch {
    return {
      totalItems: 0,
      totalSizeBytes: 0,
      formattedSize: '0 KB',
      lastUpdated: 'Just now',
      cachedItinerariesCount: 0,
      cachedSearchPlacesCount: 0,
      cachedTilesCount: 0,
    };
  }
}

export async function clearAllOfflineCache(): Promise<void> {
  try {
    const db = await getOfflineDB();
    const tx = db.transaction(['itineraries', 'places', 'map_metadata', 'navigation_routes'], 'readwrite');
    tx.objectStore('itineraries').clear();
    tx.objectStore('places').clear();
    tx.objectStore('map_metadata').clear();
    tx.objectStore('navigation_routes').clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to clear cache:', err);
  }
}
