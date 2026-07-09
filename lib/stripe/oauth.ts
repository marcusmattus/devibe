import * as WebBrowser from "expo-web-browser";
import { config } from "../../constants/config";
import { setSecureItem } from "../secureStorage";

export interface StripeProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  stripeAccountId: string;
}

const STRIPE_CONNECT_BASE = "https://connect.stripe.com/oauth/authorize";

export async function signInWithStripeOAuth(): Promise<StripeProfile> {
  if (config.stripe.isConfigured) {
    const redirectUri = config.stripe.redirectUri;
    const url = `${STRIPE_CONNECT_BASE}?response_type=code&client_id=${config.stripe.clientId}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}`;

    const result = await WebBrowser.openAuthSessionAsync(url, redirectUri);

    if (result.type === "success" && result.url) {
      // In production, exchange code for token on backend
      const accountId = `acct_${Date.now()}`;
      return {
        id: accountId,
        name: "Stripe User",
        email: "connected@stripe.dev",
        stripeAccountId: accountId,
      };
    }

    if (result.type === "cancel") {
      throw new Error("Stripe sign-in was cancelled");
    }
  }

  // Demo mode when Stripe Connect is not configured
  await new Promise((r) => setTimeout(r, 800));
  const accountId = `acct_demo_${Date.now().toString(36)}`;
  const profile: StripeProfile = {
    id: accountId,
    name: "DeVibe Creator",
    email: "creator@devibe.app",
    stripeAccountId: accountId,
    avatarUrl: undefined,
  };
  await setSecureItem("stripe_profile", JSON.stringify(profile));
  return profile;
}
