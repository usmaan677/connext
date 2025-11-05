// app/(tabs)/myclubs.js  (do similar for post.js and map.js)
import { Text, View } from "react-native";

export default function MyClubsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1B0034" }}>
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
        Welcome to My Clubs Page
      </Text>
    </View>
  );
}

