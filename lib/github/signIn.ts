import * as WebBrowser from "expo-web-browser";
import { config } from "../../constants/config";
import {
  DeviceFlowUnavailableError,
  pollDeviceToken,
  requestDeviceCode,
} from "./deviceAuth";
import { signInWithGitHubOAuth } from "./oauthFlow";
import type { DeviceFlowPending } from "./types";

export interface GitHubSignInResult {
  accessToken: string;
  deviceFlow?: DeviceFlowPending | null;
}

/**
 * Signs in with GitHub using device flow when available, otherwise OAuth code flow.
 */
export async function signInWithGitHub(
  onDeviceFlowStarted?: (pending: DeviceFlowPending) => void
): Promise<GitHubSignInResult> {
  try {
    const pending = await requestDeviceCode();
    onDeviceFlowStarted?.({
      userCode: pending.userCode,
      verificationUri: pending.verificationUri,
      expiresIn: pending.expiresIn,
    });

    await WebBrowser.openBrowserAsync(pending.verificationUri);

    const accessToken = await pollDeviceToken(pending.deviceCode, pending.interval);
    return { accessToken, deviceFlow: null };
  } catch (error) {
    if (error instanceof DeviceFlowUnavailableError) {
      if (config.github.supportsOAuthCodeFlow) {
        const accessToken = await signInWithGitHubOAuth();
        return { accessToken, deviceFlow: null };
      }
      throw new Error(
        "GitHub Device Flow is disabled for this OAuth app. Enable it under GitHub → Settings → Developer settings → OAuth Apps, or add EXPO_PUBLIC_GITHUB_CLIENT_SECRET to use the browser OAuth fallback."
      );
    }
    throw error;
  }
}
