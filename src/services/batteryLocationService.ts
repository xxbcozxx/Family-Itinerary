import { BatteryMode, BatteryStatusInfo, Coordinates } from '../types';

export class BatteryLocationManager {
  private watchId: number | null = null;
  private timerId: any = null;
  private currentMode: BatteryMode = 'balanced';
  private batteryInfo: BatteryStatusInfo = {
    level: 0.85,
    charging: false,
    chargingTime: 0,
    dischargingTime: 3600 * 5,
    powerSaveActive: false,
    dutyCyclePercent: 42,
    batteryHealthScore: 98,
  };
  private lastPosition: Coordinates = { lat: -33.8568, lng: 151.2153 };
  private listeners: ((coords: Coordinates, heading?: number, speed?: number) => void)[] = [];
  private batteryListeners: ((info: BatteryStatusInfo) => void)[] = [];
  private isStationary = false;
  private stationaryCount = 0;

  constructor() {
    this.initBatteryMonitor();
  }

  private async initBatteryMonitor() {
    try {
      if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
        const battery: any = await (navigator as any).getBattery();
        this.updateBatteryFromNav(battery);

        battery.addEventListener('levelchange', () => this.updateBatteryFromNav(battery));
        battery.addEventListener('chargingchange', () => this.updateBatteryFromNav(battery));
      }
    } catch {
      // Fallback for browsers without Battery API
      this.recalculatePowerMetrics();
    }
  }

  private updateBatteryFromNav(battery: any) {
    this.batteryInfo.level = battery.level;
    this.batteryInfo.charging = battery.charging;
    this.batteryInfo.chargingTime = battery.chargingTime;
    this.batteryInfo.dischargingTime = battery.dischargingTime;

    // Auto-engage power saving if battery < 20% and not charging
    if (this.batteryInfo.level <= 0.20 && !this.batteryInfo.charging && this.currentMode === 'high_accuracy') {
      this.currentMode = 'ultra_battery_saver';
      this.batteryInfo.powerSaveActive = true;
    } else {
      this.batteryInfo.powerSaveActive = this.currentMode === 'ultra_battery_saver';
    }

    this.recalculatePowerMetrics();
    this.notifyBatteryListeners();
  }

  public setMode(mode: BatteryMode) {
    this.currentMode = mode;
    this.batteryInfo.powerSaveActive = mode === 'ultra_battery_saver';
    this.recalculatePowerMetrics();
    this.notifyBatteryListeners();

    // Restart location watcher with new options if active
    if (this.watchId !== null || this.timerId !== null) {
      this.stopTracking();
      this.startTracking();
    }
  }

  public getMode(): BatteryMode {
    return this.currentMode;
  }

  public getBatteryInfo(): BatteryStatusInfo {
    return { ...this.batteryInfo };
  }

  private recalculatePowerMetrics() {
    if (this.currentMode === 'high_accuracy') {
      this.batteryInfo.dutyCyclePercent = 95;
    } else if (this.currentMode === 'balanced') {
      this.batteryInfo.dutyCyclePercent = this.isStationary ? 22 : 45;
    } else {
      this.batteryInfo.dutyCyclePercent = 12;
    }
  }

  public startTracking() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    const highAccuracy = this.currentMode === 'high_accuracy';
    const maxAge = this.currentMode === 'ultra_battery_saver' ? 45000 : (this.currentMode === 'balanced' ? 10000 : 1500);
    const timeout = this.currentMode === 'ultra_battery_saver' ? 25000 : 10000;

    const handleSuccess = (pos: GeolocationPosition) => {
      const newCoords: Coordinates = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      // Detect stationary state for battery savings
      const dist = this.calculateDistanceMeters(this.lastPosition, newCoords);
      if (dist < 4) {
        this.stationaryCount++;
        if (this.stationaryCount >= 3) {
          this.isStationary = true;
        }
      } else {
        this.stationaryCount = 0;
        this.isStationary = false;
      }

      this.lastPosition = newCoords;
      this.recalculatePowerMetrics();
      this.notifyBatteryListeners();

      this.listeners.forEach((listener) => {
        listener(newCoords, pos.coords.heading ?? undefined, pos.coords.speed ?? undefined);
      });
    };

    const handleError = () => {
      // In sandbox/iframe or mock environment, keep last known position
      this.listeners.forEach((listener) => {
        listener(this.lastPosition, 0, 0);
      });
    };

    if (this.currentMode === 'high_accuracy') {
      this.watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        maximumAge: maxAge,
        timeout: timeout,
      });
    } else {
      // For balanced and ultra_battery_saver: interval polling avoids keeping the GPS chip continuously locked
      const pollInterval = this.currentMode === 'ultra_battery_saver' ? 35000 : (this.isStationary ? 20000 : 8000);
      
      const poll = () => {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
          enableHighAccuracy: false,
          maximumAge: maxAge,
          timeout: timeout,
        });
      };

      poll();
      this.timerId = setInterval(poll, pollInterval);
    }
  }

  public stopTracking() {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public subscribeLocation(fn: (coords: Coordinates, heading?: number, speed?: number) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  public subscribeBattery(fn: (info: BatteryStatusInfo) => void): () => void {
    this.batteryListeners.push(fn);
    fn(this.batteryInfo);
    return () => {
      this.batteryListeners = this.batteryListeners.filter((l) => l !== fn);
    };
  }

  private notifyBatteryListeners() {
    this.batteryListeners.forEach((fn) => fn(this.batteryInfo));
  }

  private calculateDistanceMeters(p1: Coordinates, p2: Coordinates): number {
    const R = 6371000;
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLon = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const batteryLocationManager = new BatteryLocationManager();
