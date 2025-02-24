import { getFromStorage, setInStorage } from "./storage";

export function getUserId(): string {
  const storedUserId = getFromStorage("USER_ID");

  if (storedUserId) {
    return storedUserId;
  }

  const newUserId = crypto.randomUUID();
  setInStorage("USER_ID", newUserId);
  return newUserId;
}
