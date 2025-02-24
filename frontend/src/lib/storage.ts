export const STORAGE_KEYS = {
  USER_ID: "userId",
} as const;

export function getFromStorage(key: keyof typeof STORAGE_KEYS): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS[key]);
}

export function setInStorage(
  key: keyof typeof STORAGE_KEYS,
  value: string
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS[key], value);
}
