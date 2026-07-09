import { router } from "expo-router";
import { LoginGateway } from "../components/auth/LoginGateway";
import { useAuthStore } from "../stores/authStore";

export default function LoginScreen() {
  return (
    <LoginGateway
      onSuccess={() => router.replace("/(drawer)")}
      onSkip={async () => {
        await useAuthStore.getState().continueAsGuest();
        router.replace("/(drawer)");
      }}
    />
  );
}
