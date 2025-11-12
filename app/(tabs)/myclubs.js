import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router"; // for navigation
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Explore() {
  const { colors } = useTheme();
  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function fetchProfiles(query) {
    if (!query.trim()) {
      setProfiles([]);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, full_name, photo_url, bio, major, year, role")
      .ilike("full_name", `%${query}%`) // case-insensitive search

    if (error) console.error("Error fetching profiles:", error);
    else setProfiles(data || []);

    setLoading(false);
  }

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProfiles(search);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover students and connect across campus
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: colors.surface, shadowColor: colors.shadow },
        ]}
      >
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          placeholder="Search students..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {/* Loading */}
      {loading && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.textSecondary, marginTop: 10 }}>
            Searching...
          </Text>
        </View>
      )}

      {/* Profiles List */}
      {!loading && profiles.length > 0 && (
        <View>
          {profiles.map((p) => (
            <TouchableOpacity
              key={p.user_id}
              onPress={() => router.push(`/profile/${p.user_id}`)} // navigate to profile
              activeOpacity={0.8}
              style={[styles.card, { backgroundColor: colors.card }]}
            >
              <Image
                source={{
                  uri:
                    p.photo_url ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                }}
                style={styles.avatar}
              />
              <Text style={[styles.name, { color: colors.text }]}>
                {p.full_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!loading && search.trim() && profiles.length === 0 && (
        <Text
          style={{
            color: colors.textSecondary,
            textAlign: "center",
            marginTop: 30,
          }}
        >
          No students found.
        </Text>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 20,
  },
  title: { fontSize: 32, fontWeight: "bold" },
  subtitle: { fontSize: 15, marginTop: 4, lineHeight: 20 },
  searchBar: {
    marginHorizontal: 24,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    marginHorizontal: 24,
    marginBottom: 14,
    padding: 14,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 16,
  },
  name: { fontSize: 16, fontWeight: "700" },
});
