import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEnsureProfile } from "@/hooks/useEnsureProfile";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  useEnsureProfile();
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="Student" />
        <Stack.Screen name="Club" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}