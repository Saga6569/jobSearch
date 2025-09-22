import { makeAutoObservable, runInAction } from 'mobx';
import get_work from '../api/api';
import getLocation, { LocationResponse } from '../utiliti/getLocation';
import { fallbackShifts } from '../api/mockData';

type Coordinates = { latitude: number; longitude: number };

export type WorkType = { id: number | string; name: string; nameGt5?: string; nameLt5?: string; nameOne?: string };
export type ShiftItem = {
  id?: string | number;
  logo?: string;
  address?: string;
  companyName?: string;
  dateStartByCity?: string;
  timeStartByCity?: string;
  timeEndByCity?: string;
  currentWorkers?: number;
  planWorkers?: number;
  workTypes?: WorkType[] | string[] | string;
  priceWorker?: number;
  customerFeedbacksCount?: number | string;
  customerRating?: number;
};

type CacheEntry = {
  data: ShiftItem[];
  timestamp: number;
};

class ShiftsStore {
  items: ShiftItem[] = [];
  isLoading = false;
  error: string | null = null;

  // Текущее выбранное объявление
  selectedIndex: number = -1;

  // Кэш по ключу (например, lat,lon), с TTL
  cache = new Map<string, CacheEntry>();
  ttlMs = 5 * 60 * 1000; // 5 минут

  constructor() {
    makeAutoObservable(this);
  }

  private getCacheKey(coords?: Coordinates) {
    if (!coords) return 'current';
    const lat = Number(coords.latitude).toFixed(3);
    const lon = Number(coords.longitude).toFixed(3);
    return `${lat},${lon}`;
  }

  get current(): ShiftItem | undefined {
    if (this.selectedIndex < 0 || this.selectedIndex >= this.items.length) return undefined;
    return this.items[this.selectedIndex];
  }

  selectByIndex(index: number) {
    if (Number.isInteger(index) && index >= 0 && index < this.items.length) {
      this.selectedIndex = index;
    }
  }

  selectById(id?: string | number) {
    if (id === undefined || id === null) return;
    const idx = this.items.findIndex((it) => it.id === id);
    if (idx !== -1) this.selectedIndex = idx;
  }

  selectNext() {
    if (this.items.length === 0) return;
    const next = this.selectedIndex < 0 ? 0 : Math.min(this.items.length - 1, this.selectedIndex + 1);
    this.selectedIndex = next;
  }

  selectPrev() {
    if (this.items.length === 0) return;
    const prev = this.selectedIndex < 0 ? 0 : Math.max(0, this.selectedIndex - 1);
    this.selectedIndex = prev;
  }

  private normalizeResponse(raw: any): ShiftItem[] {
    const items = Array.isArray(raw)
      ? raw
      : raw?.shifts ?? raw?.items ?? raw?.data ?? [];
    return Array.isArray(items) ? items : [];
  }

  private setFromCache(entry: CacheEntry) {
    this.items = entry.data;
    this.error = null;
  }

  async loadForCurrentLocation(force = false) {
    this.isLoading = true;
    this.error = null;
    try {
      const loc: LocationResponse = await getLocation();
      const coords: Coordinates | undefined = loc.coords?.latitude && loc.coords?.longitude
        ? { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
        : undefined;

      const key = this.getCacheKey(coords);
      const now = Date.now();
      const cached = this.cache.get(key);
      if (!force && cached && now - cached.timestamp < this.ttlMs) {
        runInAction(() => this.setFromCache(cached));
        return;
      }

      let data: ShiftItem[] = [];
      try {
        if (coords) {
          const raw = await get_work(coords.latitude.toString(), coords.longitude.toString());
          data = this.normalizeResponse(raw);
        }
      } catch (e) {
        // Игнорируем, упадём в фолбэк
      }

      if (!data || data.length === 0) {
        data = fallbackShifts as ShiftItem[];
      }

      runInAction(() => {
        this.items = data;
        this.cache.set(key, { data, timestamp: now });
        this.error = null;
      });
    } catch (err: any) {
      runInAction(() => {
        this.items = fallbackShifts as ShiftItem[];
        this.error = err?.message ?? 'Ошибка загрузки';
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const shiftsStore = new ShiftsStore();
export default ShiftsStore;


