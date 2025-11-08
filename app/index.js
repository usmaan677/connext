import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function HomeScreen() {
  useEffect(() => {
    // Add a small delay to ensure the layout is mounted before navigation
    const timer = setTimeout(() => {
      router.replace("/signup");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen briefly while redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}
