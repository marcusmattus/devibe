import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { config } from "../../constants/config";

const AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";

WebBrowser.maybeCompleteAuthSession();

export function getGitHubRedirectUri(): string {
  return AuthSession.makeRedirectUri({
    scheme: "devibe",
    path: config.github.redirectPath,
  });
}

async function createOAuthState(): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function signInWithGitHubOAuth(): Promise<string> {
  if (!config.github.isConfigured) {
    throw new Error("GitHub OAuth is not configured.");
  }

  if (!config.github.supportsOAuthCodeFlow) {
    throw new Error(
      "GitHub OAuth code flow requires EXPO_PUBLIC_GITHUB_CLIENT_SECRET, or enable Device Flow on your GitHub OAuth App."
    );
  }

  const redirectUri = getGitHubRedirectUri();
  const state = await createOAuthState();

  const params = new URLSearchParams({
    client_id: config.github.clientId,
    redirect_uri: redirectUri,
    scope: config.github.scopes.join(" "),
    state,
  });

  const authUrl = `${AUTHORIZE_URL}?${params.toString()}`;
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "cancel" || result.type === "dismiss") {
    throw new Error("GitHub sign-in was cancelled");
  }

  if (result.type !== "success" || !result.url) {
    throw new Error("GitHub sign-in did not complete");
  }

  const callbackUrl = new URL(result.url);
  const error = callbackUrl.searchParams.get("error");
  if (error) {
    const description = callbackUrl.searchParams.get("error_description");
    throw new Error(description ?? error);
  }

  const code = callbackUrl.searchParams.get("code");
  const returnedState = callbackUrl.searchParams.get("state");
  if (!code) {
    throw new Error("No authorization code received from GitHub");
  }
  if (returnedState !== state) {
    throw new Error("GitHub OAuth state mismatch — please try again");
  }

  return exchangeCodeForToken(code, redirectUri);
}

async function exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
  const body = new URLSearchParams({
    client_id: config.github.clientId,
    client_secret: config.github.clientSecret,
    code,
    redirect_uri: redirectUri,
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

  if (!response.ok || data.error) {
    throw new Error(data.error_description ?? data.error ?? "GitHub token exchange failed");
  }

  if (!data.access_token) {
    throw new Error("GitHub did not return an access token");
  }

  return data.access_token;
}
