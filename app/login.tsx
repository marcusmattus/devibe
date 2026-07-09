import { router } from "expo-router";
import { LoginGateway } from "../components/auth/LoginGateway";
import { useAuthStore } from "../stores/authStore";

export default function LoginScreen() {
  return (
    <LoginGateway
      onSuccess={() => router.replace("/(tabs)")}
      onSkip={async () => {
        await useAuthStore.getState().continueAsGuest();
        router.replace("/(tabs)");
      }}
    />
  );
}
