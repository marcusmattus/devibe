import * as Crypto from "expo-crypto";
import { Buffer } from "buffer";
import { getSecureItem, setSecureItem } from "../secureStorage";
import type { SessionJwtPayload } from "./types";

const JWT_SECRET_KEY = "agentic_jwt_secret";

async function getJwtSecret(): Promise<string> {
  const existing = await getSecureItem(JWT_SECRET_KEY);
  if (existing) return existing;
  const secret = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `devibe-agentic-${Date.now()}-${Math.random()}`
  );
  await setSecureItem(JWT_SECRET_KEY, secret);
  return secret;
}

function base64UrlEncode(data: string): string {
  return Buffer.from(data, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(data: string): string {
  const padded = data + "=".repeat((4 - (data.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf-8");
}

async function sign(data: string): Promise<string> {
  const secret = await getJwtSecret();
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${data}.${secret}`
  );
}

export async function createSessionJwt(payload: SessionJwtPayload): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export async function verifySessionJwt(token: string): Promise<SessionJwtPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expected = await sign(`${header}.${body}`);
  if (signature !== expected) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as SessionJwtPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
