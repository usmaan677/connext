import { Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1B0034" }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        Welcome to Home Page
      </Text>
    </View>
  );
}
