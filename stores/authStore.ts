import { create } from "zustand";
import * as WebBrowser from "expo-web-browser";
import { deleteSecureItem, getSecureItem, setSecureItem } from "../lib/secureStorage";
import { pollDeviceToken, requestDeviceCode } from "../lib/github/deviceAuth";
import { fetchGitHubUser, validateToken } from "../lib/github/api";
import type { DeviceFlowPending, GitHubUser } from "../lib/github/types";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "github_access_token";
const USER_KEY = "github_user";

interface AuthState {
  user: GitHubUser | null;
  accessToken: string | null;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  deviceFlow: DeviceFlowPending | null;
  hydrate: () => Promise<void>;
  startDeviceFlow: () => Promise<void>;
  cancelDeviceFlow: () => void;
  signInWithToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isHydrated: false,
  isLoading: false,
  error: null,
  deviceFlow: null,

  hydrate: async () => {
    try {
      const [token, userJson] = await Promise.all([
        getSecureItem(TOKEN_KEY),
        getSecureItem(USER_KEY),
      ]);

      if (token && userJson) {
        const user = JSON.parse(userJson) as GitHubUser;
        set({ accessToken: token, user, isHydrated: true });
        return;
      }

      if (token) {
        const user = await fetchGitHubUser(token);
        await setSecureItem(USER_KEY, JSON.stringify(user));
        set({ accessToken: token, user, isHydrated: true });
        return;
      }
    } catch {
      await deleteSecureItem(TOKEN_KEY);
      await deleteSecureItem(USER_KEY);
    }

    set({ accessToken: null, user: null, isHydrated: true });
  },

  startDeviceFlow: async () => {
    set({ isLoading: true, error: null, deviceFlow: null });

    try {
      const pending = await requestDeviceCode();
      set({
        deviceFlow: {
          userCode: pending.userCode,
          verificationUri: pending.verificationUri,
          expiresIn: pending.expiresIn,
        },
      });

      await WebBrowser.openBrowserAsync(pending.verificationUri);

      const token = await pollDeviceToken(pending.deviceCode, pending.interval);
      const user = await fetchGitHubUser(token);

      await setSecureItem(TOKEN_KEY, token);
      await setSecureItem(USER_KEY, JSON.stringify(user));

      set({
        accessToken: token,
        user,
        deviceFlow: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "GitHub sign-in failed",
        deviceFlow: null,
        isLoading: false,
      });
    }
  },

  cancelDeviceFlow: () => {
    set({ deviceFlow: null, isLoading: false, error: null });
  },

  signInWithToken: async (token: string) => {
    const trimmed = token.trim();
    if (!trimmed) {
      set({ error: "Enter a valid GitHub personal access token" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const user = await validateToken(trimmed);
      await setSecureItem(TOKEN_KEY, trimmed);
      await setSecureItem(USER_KEY, JSON.stringify(user));
      set({ accessToken: trimmed, user, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Invalid GitHub token",
        isLoading: false,
      });
    }
  },

  signOut: async () => {
    await deleteSecureItem(TOKEN_KEY);
    await deleteSecureItem(USER_KEY);
    set({ accessToken: null, user: null, deviceFlow: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
