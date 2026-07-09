import { config } from "../../constants/config";
import type { DeviceCodeResponse, DeviceFlowPending } from "./types";

const DEVICE_CODE_URL = "https://github.com/login/device/code";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

function assertClientId(): string {
  if (!config.github.isConfigured) {
    throw new Error(
      "GitHub OAuth is not configured. Set EXPO_PUBLIC_GITHUB_CLIENT_ID in your environment."
    );
  }
  return config.github.clientId;
}

export async function requestDeviceCode(): Promise<DeviceFlowPending & { deviceCode: string; interval: number }> {
  const clientId = assertClientId();

  const response = await fetch(DEVICE_CODE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      scope: config.github.scopes.join(" "),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub device code request failed: ${text}`);
  }

  const data = (await response.json()) as DeviceCodeResponse & { error?: string; error_description?: string };
  if (data.error) {
    throw new Error(data.error_description ?? data.error);
  }

  return {
    deviceCode: data.device_code,
    userCode: data.user_code,
    verificationUri: data.verification_uri,
    expiresIn: data.expires_in,
    interval: data.interval,
  };
}

export async function pollDeviceToken(deviceCode: string, intervalSeconds: number): Promise<string> {
  const clientId = assertClientId();
  const intervalMs = Math.max(intervalSeconds, 5) * 1000;
  const deadline = Date.now() + 15 * 60 * 1000;

  while (Date.now() < deadline) {
    await sleep(intervalMs);

    const response = await fetch(ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        device_code: deviceCode,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      }),
    });

    const data = (await response.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (data.access_token) {
      return data.access_token;
    }

    if (data.error === "authorization_pending") {
      continue;
    }

    if (data.error === "slow_down") {
      await sleep(5000);
      continue;
    }

    throw new Error(data.error_description ?? data.error ?? "GitHub authorization failed");
  }

  throw new Error("GitHub authorization timed out. Please try again.");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
