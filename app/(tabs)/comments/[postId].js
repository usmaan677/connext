import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, text, created_at, profiles(full_name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    setComments(data || []);
  };

  const addComment = async () => {
    if (!text.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      text,
    });

    setText("");
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Comments
        </Text>
      </View>

      {/* COMMENTS LIST */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Text style={[styles.username, { color: colors.text }]}>
              {item.profiles?.full_name || "User"}
            </Text>
            <Text style={{ color: colors.text }}>{item.text}</Text>
          </View>
        )}
      />

      {/* INPUT */}
      <View style={[styles.inputRow, { borderTopColor: colors.border }]}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Add a comment..."
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, { color: colors.text }]}
        />
        <TouchableOpacity onPress={addComment}>
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "700" },
  commentRow: { marginBottom: 12 },
  username: { fontWeight: "600", marginBottom: 2 },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    alignItems: "center",
  },
  input: { flex: 1, marginRight: 12 },
});
