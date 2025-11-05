import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1B0034" }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        Welcome to Your Profile
      </Text>
    </View>
  );
}
