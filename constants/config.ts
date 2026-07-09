const githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID ?? "";

export const config = {
  github: {
    clientId: githubClientId,
    scopes: ["repo", "read:user"],
    isConfigured: githubClientId.length > 0,
  },
} as const;
