/** Default GitHub OAuth App client ID for DeVibe Cloud Mobile */
const DEFAULT_GITHUB_CLIENT_ID = "d4ab3bdc49967a7282bb1c0560db28813ccceabc";

const githubClientId =
  process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? DEFAULT_GITHUB_CLIENT_ID;
const githubClientSecret = process.env.EXPO_PUBLIC_GITHUB_CLIENT_SECRET ?? "";
const stripeClientId = process.env.EXPO_PUBLIC_STRIPE_CLIENT_ID ?? "";

export const config = {
  github: {
    clientId: githubClientId,
    clientSecret: githubClientSecret,
    scopes: ["repo", "read:user"],
    redirectPath: "github/oauth",
    isConfigured: githubClientId.length > 0,
    supportsOAuthCodeFlow: githubClientSecret.length > 0,
  },
  stripe: {
    clientId: stripeClientId,
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    redirectUri: "devibe://stripe/oauth",
    isConfigured: stripeClientId.length > 0,
  },
} as const;
