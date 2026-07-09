import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const PREFIX = "devibe_";

export async function getSecureItem(key: string): Promise<string | null> {
  const storageKey = `${PREFIX}${key}`;
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(storageKey);
}

export async function setSecureItem(key: string, value: string): Promise<void> {
  const storageKey = `${PREFIX}${key}`;
  if (Platform.OS === "web") {
    localStorage.setItem(storageKey, value);
    return;
  }
  await SecureStore.setItemAsync(storageKey, value);
}

export async function deleteSecureItem(key: string): Promise<void> {
  const storageKey = `${PREFIX}${key}`;
  if (Platform.OS === "web") {
    localStorage.removeItem(storageKey);
    return;
  }
  await SecureStore.deleteItemAsync(storageKey);
}
