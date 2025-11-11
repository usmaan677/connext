import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams } from "expo-router";
import { BookOpen, Calendar, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function StudentProfile() {
  const { colors } = useTheme();
  const { user_id } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user_id) fetchProfile();
  }, [user_id]);

  async function fetchProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, photo_url, bio, major, year, role")
      .eq("user_id", user_id)
      .single();

    if (error) console.error("Error fetching profile:", error);
    else setProfile(data);
    setLoading(false);
  }

  if (loading)
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );

  if (!profile)
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>Profile not found.</Text>
      </View>
    );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                profile.photo_url ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <View style={styles.badge} />
        </View>

        <Text style={[styles.name, { color: colors.text }]}>
          {profile.full_name}
        </Text>

        {profile.role && (
          <Text style={[styles.role, { color: colors.textSecondary }]}>
            {profile.role}
          </Text>
        )}

        {profile.bio && (
          <Text
            style={[
              styles.bio,
              { color: colors.textSecondary, textAlign: "center" },
            ]}
          >
            {profile.bio}
          </Text>
        )}
      </View>

      {/* Academic Info Section */}
      <View
        style={[styles.section, { backgroundColor: colors.surface, marginTop: 20 }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          🎓 Academic Information
        </Text>

        <View style={styles.infoRow}>
          <BookOpen color={colors.primary} size={20} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              MAJOR
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {profile.major || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Calendar color={colors.primary} size={20} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              YEAR
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {profile.year || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <User color={colors.primary} size={20} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              ROLE
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {profile.role || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    alignItems: "center",
    paddingVertical: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: { width: 120, height: 120, borderRadius: 100 },
  badge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#f1c40f",
  },
  name: { fontSize: 24, fontWeight: "bold" },
  role: { fontSize: 15, marginTop: 4 },
  bio: { fontSize: 14, marginTop: 8, maxWidth: 280 },
  section: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 18,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 14 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  label: { fontSize: 12, textTransform: "uppercase" },
  value: { fontSize: 15, fontWeight: "600" },
});
