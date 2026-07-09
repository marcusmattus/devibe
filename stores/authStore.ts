import { create } from "zustand";
import * as WebBrowser from "expo-web-browser";
import { deleteSecureItem, getSecureItem, setSecureItem } from "../lib/secureStorage";
import { signInWithGitHub } from "../lib/github/signIn";
import { fetchGitHubUser, validateToken } from "../lib/github/api";
import type { DeviceFlowPending, GitHubUser } from "../lib/github/types";
import { signInWithStripeOAuth } from "../lib/stripe/oauth";
import { useAgenticAuthStore } from "./agenticAuthStore";

WebBrowser.maybeCompleteAuthSession();

const TOKEN_KEY = "github_access_token";
const USER_KEY = "github_user";
const AUTH_PROVIDER_KEY = "auth_provider";
const STRIPE_USER_KEY = "stripe_profile";
const EMAIL_USER_KEY = "email_profile";

export type AuthProvider = "github" | "stripe" | "email" | "guest";

export interface AppProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
  login?: string;
}

interface AuthState {
  user: GitHubUser | null;
  accessToken: string | null;
  appProfile: AppProfile | null;
  authProvider: AuthProvider | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  deviceFlow: DeviceFlowPending | null;
  hydrate: () => Promise<void>;
  startDeviceFlow: () => Promise<void>;
  cancelDeviceFlow: () => void;
  signInWithToken: (token: string) => Promise<void>;
  signInWithStripe: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

function profileFromGitHub(user: GitHubUser): AppProfile {
  return {
    id: String(user.id),
    name: user.name ?? user.login,
    email: `${user.login}@users.noreply.github.com`,
    avatarUrl: user.avatar_url,
    provider: "github",
    login: user.login,
  };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  appProfile: null,
  authProvider: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  error: null,
  deviceFlow: null,

  hydrate: async () => {
    try {
      const provider = (await getSecureItem(AUTH_PROVIDER_KEY)) as AuthProvider | null;

      if (provider === "github") {
        const [token, userJson] = await Promise.all([
          getSecureItem(TOKEN_KEY),
          getSecureItem(USER_KEY),
        ]);
        if (token && userJson) {
          const user = JSON.parse(userJson) as GitHubUser;
          set({
            accessToken: token,
            user,
            appProfile: profileFromGitHub(user),
            authProvider: "github",
            isAuthenticated: true,
            isHydrated: true,
          });
          return;
        }
      }

      if (provider === "stripe") {
        const stripeJson = await getSecureItem(STRIPE_USER_KEY);
        if (stripeJson) {
          const stripe = JSON.parse(stripeJson) as AppProfile;
          set({
            appProfile: { ...stripe, provider: "stripe" },
            authProvider: "stripe",
            isAuthenticated: true,
            isHydrated: true,
          });
          return;
        }
      }

      if (provider === "email") {
        const emailJson = await getSecureItem(EMAIL_USER_KEY);
        if (emailJson) {
          const profile = JSON.parse(emailJson) as AppProfile;
          set({
            appProfile: profile,
            authProvider: "email",
            isAuthenticated: true,
            isHydrated: true,
          });
          return;
        }
      }

      if (provider === "guest") {
        set({ authProvider: "guest", isAuthenticated: true, isHydrated: true });
        return;
      }
    } catch {
      await deleteSecureItem(TOKEN_KEY);
      await deleteSecureItem(USER_KEY);
      await deleteSecureItem(AUTH_PROVIDER_KEY);
    }

    set({
      accessToken: null,
      user: null,
      appProfile: null,
      authProvider: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },

  startDeviceFlow: async () => {
    set({ isLoading: true, error: null, deviceFlow: null });

    try {
      const { accessToken: token } = await signInWithGitHub((pending) => {
        set({ deviceFlow: pending });
      });
      const user = await fetchGitHubUser(token);

      await setSecureItem(TOKEN_KEY, token);
      await setSecureItem(USER_KEY, JSON.stringify(user));
      await setSecureItem(AUTH_PROVIDER_KEY, "github");

      const profile = profileFromGitHub(user);
      set({
        accessToken: token,
        user,
        appProfile: profile,
        authProvider: "github",
        isAuthenticated: true,
        deviceFlow: null,
        isLoading: false,
      });

      void useAgenticAuthStore.getState().logAudit({
        action: "login",
        severity: "info",
        details: "GitHub device flow sign-in successful",
        actor: user.login,
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
      await setSecureItem(AUTH_PROVIDER_KEY, "github");
      const profile = profileFromGitHub(user);
      set({
        accessToken: trimmed,
        user,
        appProfile: profile,
        authProvider: "github",
        isAuthenticated: true,
        isLoading: false,
      });
      void useAgenticAuthStore.getState().logAudit({
        action: "login",
        severity: "info",
        details: "GitHub PAT sign-in successful",
        actor: user.login,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Invalid GitHub token",
        isLoading: false,
      });
    }
  },

  signInWithStripe: async () => {
    set({ isLoading: true, error: null });
    try {
      const stripe = await signInWithStripeOAuth();
      const profile: AppProfile = {
        id: stripe.id,
        name: stripe.name,
        email: stripe.email,
        avatarUrl: stripe.avatarUrl,
        provider: "stripe",
      };
      await setSecureItem(STRIPE_USER_KEY, JSON.stringify(profile));
      await setSecureItem(AUTH_PROVIDER_KEY, "stripe");
      set({
        appProfile: profile,
        authProvider: "stripe",
        isAuthenticated: true,
        isLoading: false,
      });
      void useAgenticAuthStore.getState().logAudit({
        action: "login",
        severity: "info",
        details: "Stripe Connect sign-in successful",
        actor: stripe.email,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Stripe sign-in failed",
        isLoading: false,
      });
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed.includes("@")) {
      set({ error: "Enter a valid email address" });
      return;
    }
    if (password.length < 6) {
      set({ error: "Password must be at least 6 characters" });
      return;
    }

    set({ isLoading: true, error: null });
    await new Promise((r) => setTimeout(r, 600));

    const profile: AppProfile = {
      id: `email_${Date.now()}`,
      name: trimmed.split("@")[0],
      email: trimmed,
      provider: "email",
    };

    await setSecureItem(EMAIL_USER_KEY, JSON.stringify(profile));
    await setSecureItem(AUTH_PROVIDER_KEY, "email");
    set({
      appProfile: profile,
      authProvider: "email",
      isAuthenticated: true,
      isLoading: false,
    });
    void useAgenticAuthStore.getState().logAudit({
      action: "login",
      severity: "info",
      details: "Email sign-in successful",
      actor: trimmed,
    });
  },

  continueAsGuest: async () => {
    await setSecureItem(AUTH_PROVIDER_KEY, "guest");
    set({
      authProvider: "guest",
      isAuthenticated: true,
      appProfile: {
        id: "guest",
        name: "Guest",
        email: "",
        provider: "guest",
      },
    });
  },

  signOut: async () => {
    const profile = get().appProfile;
    if (profile?.login) {
      await useAgenticAuthStore.getState().revokeAllSessions(profile.login);
    }
    if (profile) {
      void useAgenticAuthStore.getState().logAudit({
        action: "logout",
        severity: "info",
        details: "Sign-out",
        actor: profile.email || profile.name,
      });
    }
    await Promise.all([
      deleteSecureItem(TOKEN_KEY),
      deleteSecureItem(USER_KEY),
      deleteSecureItem(STRIPE_USER_KEY),
      deleteSecureItem(EMAIL_USER_KEY),
      deleteSecureItem(AUTH_PROVIDER_KEY),
    ]);
    set({
      accessToken: null,
      user: null,
      appProfile: null,
      authProvider: null,
      isAuthenticated: false,
      deviceFlow: null,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
