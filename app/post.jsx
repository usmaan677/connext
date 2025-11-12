import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PostScreen() {
  const router = useRouter();
  const { name, username, avatar, caption, image } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        <Text style={styles.title}>{name}</Text>

        <View style={styles.postCard}>
          <View style={styles.header}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <Text style={styles.username}>@{username}</Text>
          </View>

          <Image
            source={
              image === "local"
                ? require("../assets/images/umrflyer.png") // fallback for local example
                : { uri: image }
            }
            style={styles.postImage}
          />

          <Text style={styles.caption}>
            <Text style={{ fontWeight: "700" }}>{username}</Text> {caption}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", paddingHorizontal: 16 },
  backButton: {
    marginTop: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-start",
    padding: 8,
    borderRadius: 10,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 20,
  },
  postCard: {
    backgroundColor: "#1c1c1e",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  username: { color: "#fff", fontSize: 15, fontWeight: "600" },
  postImage: { width: "100%", height: 300, resizeMode: "cover" },
  caption: { color: "#ddd", fontSize: 15, lineHeight: 20, padding: 14 },
});
