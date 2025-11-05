import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00C2CB",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#1B0034",
          height: 60,
          borderTopWidth: 0,
          elevation: 10,
        },
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* My Clubs */}
      <Tabs.Screen
        name="myclubs"
        options={{
          title: "My Clubs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      {/* Post (center button) */}
      <Tabs.Screen
        name="post"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: "#00C2CB",
                borderRadius: 35,
                width: 60,
                height: 60,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 25,
                shadowColor: "#00C2CB",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.6,
                shadowRadius: 5,
              }}
            >
              <Ionicons name="add" size={32} color="#1B0034" />
            </View>
          ),
        }}
      />

      {/* Map */}
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
