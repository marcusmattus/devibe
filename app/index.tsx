import { useEffect } from "react";
import { router } from "expo-router";
import { SplashView } from "../components/auth/SplashView";
import { useAuthStore } from "../stores/authStore";
import { useAgenticAuthStore } from "../stores/agenticAuthStore";

const SPLASH_MIN_MS = 2600;

export default function SplashScreen() {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrateAgentic = useAgenticAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    hydrateAgentic();
  }, [hydrate, hydrateAgentic]);

  useEffect(() => {
    if (!isHydrated) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }, SPLASH_MIN_MS);

    return () => clearTimeout(timer);
  }, [isHydrated, isAuthenticated]);

  return <SplashView />;
}
