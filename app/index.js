import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Add a small delay to ensure the layout is mounted before navigation
      setTimeout(() => {
        if (session?.user) {
          // User is authenticated, go to home tabs
          router.replace("/(tabs)/home");
        } else {
          // User is not authenticated, go to signup
          router.replace("/signup");
        }
      }, 100);
    } catch (error) {
      console.log("Auth check error:", error);
      // On error, default to signup
      setTimeout(() => {
        router.replace("/signup");
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen briefly while checking auth and redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
}
