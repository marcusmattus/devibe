const githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? "";
const stripeClientId = process.env.EXPO_PUBLIC_STRIPE_CLIENT_ID ?? "";

export const config = {
  github: {
    clientId: githubClientId,
    scopes: ["repo", "read:user"],
    isConfigured: githubClientId.length > 0,
  },
  stripe: {
    clientId: stripeClientId,
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
    redirectUri: "devibe://stripe/oauth",
    isConfigured: stripeClientId.length > 0,
  },
} as const;
