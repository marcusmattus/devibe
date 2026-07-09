import { config } from "../../constants/config";
import type { DeviceCodeResponse, DeviceFlowPending } from "./types";

const DEVICE_CODE_URL = "https://github.com/login/device/code";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

export class DeviceFlowUnavailableError extends Error {
  constructor(message = "GitHub device flow is not available for this OAuth app") {
    super(message);
    this.name = "DeviceFlowUnavailableError";
  }
}

function assertClientId(): string {
  if (!config.github.isConfigured) {
    throw new Error(
      "GitHub OAuth is not configured. Set EXPO_PUBLIC_GITHUB_CLIENT_ID in your environment."
    );
  }
  return config.github.clientId;
}

function isDeviceFlowUnavailable(status: number, body: string): boolean {
  if (status === 404) return true;
  return body.includes("device_flow_disabled") || body.includes('"error":"Not Found"');
}

export async function requestDeviceCode(): Promise<
  DeviceFlowPending & { deviceCode: string; interval: number }
> {
  const clientId = assertClientId();

  const body = new URLSearchParams({
    client_id: clientId,
    scope: config.github.scopes.join(" "),
  });

  const response = await fetch(DEVICE_CODE_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const text = await response.text();

  if (!response.ok) {
    if (isDeviceFlowUnavailable(response.status, text)) {
      throw new DeviceFlowUnavailableError();
    }
    throw new Error(`GitHub device code request failed: ${text}`);
  }

  const data = JSON.parse(text) as DeviceCodeResponse & {
    error?: string;
    error_description?: string;
  };

  if (data.error) {
    if (data.error === "device_flow_disabled") {
      throw new DeviceFlowUnavailableError(data.error_description);
    }
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

export async function pollDeviceToken(
  deviceCode: string,
  intervalSeconds: number
): Promise<string> {
  const clientId = assertClientId();
  const intervalMs = Math.max(intervalSeconds, 5) * 1000;
  const deadline = Date.now() + 15 * 60 * 1000;

  while (Date.now() < deadline) {
    await sleep(intervalMs);

    const body = new URLSearchParams({
      client_id: clientId,
      device_code: deviceCode,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    });

    const response = await fetch(ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
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
