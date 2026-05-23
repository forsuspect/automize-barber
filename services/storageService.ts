import { SEED_DATA } from "@/data/seed";
import { STORAGE_KEYS } from "@/lib/constants";
import type { AppData } from "@/types";
import { getStorageItem, setStorageItem } from "@/utils/storage";

export function loadAppData(): AppData {
  const stored = getStorageItem<AppData>(STORAGE_KEYS.data);
  if (stored) return stored;
  setStorageItem(STORAGE_KEYS.data, SEED_DATA);
  return SEED_DATA;
}

export function saveAppData(data: AppData): void {
  setStorageItem(STORAGE_KEYS.data, data);
}

export function resetAppData(): AppData {
  setStorageItem(STORAGE_KEYS.data, SEED_DATA);
  return { ...SEED_DATA };
}
