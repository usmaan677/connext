import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00C2CB",
        tabBarInactiveTintColor: "#8B5A9B",
        tabBarStyle: {
          backgroundColor: "#1B0034",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="myclubs"
        options={{
          title: "My Clubs",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: "#00C2CB",
                borderRadius: 28,
                width: 56,
                height: 56,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons name="add" size={28} color="#1B0034" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
