import { Platform } from "react-native";
import * as Crypto from "expo-crypto";
import { getSecureItem, setSecureItem } from "../secureStorage";

const FINGERPRINT_KEY = "device_fingerprint";

export async function getDeviceFingerprint(): Promise<string> {
  const existing = await getSecureItem(FINGERPRINT_KEY);
  if (existing) return existing;

  const seed = `${Platform.OS}-${Platform.Version}-${Date.now()}-${Math.random()}`;
  const fingerprint = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    seed
  );
  await setSecureItem(FINGERPRINT_KEY, fingerprint);
  return fingerprint;
}

export function getDeviceLabel(): string {
  const os = Platform.OS === "ios" ? "iOS" : Platform.OS === "android" ? "Android" : "Web";
  return `${os} Device`;
}

export async function getSimulatedIpAddress(): Promise<string> {
  const fp = await getDeviceFingerprint();
  const segment = parseInt(fp.slice(0, 2), 16) % 200 + 10;
  return `192.168.${segment}.${parseInt(fp.slice(2, 4), 16) % 254 + 1}`;
}
