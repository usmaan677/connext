import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Building, Users } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignupChoice() {
  const router = useRouter();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    background: { 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center",
      backgroundColor: colors.background,
    },
    overlay: { 
      alignItems: "center", 
      paddingHorizontal: 24, 
      paddingTop: 80, // Increased from 40 to 80 for more space
      width: "100%",
      flex: 1,
      justifyContent: "center"
    },
    headerSection: {
      alignItems: "center",
      marginBottom: 48,
    },
    title: {
      fontSize: 36,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    subtitle: { 
      fontSize: 18, 
      color: colors.textSecondary, 
      textAlign: "center",
      lineHeight: 24,
      paddingHorizontal: 16,
    },
    cardsContainer: {
      width: "100%",
      maxWidth: 340,
      gap: 20,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 32,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 6,
    },
    studentCard: {
      borderColor: colors.primary,
    },
    clubCard: {
      borderColor: colors.accent,
    },
    cardIcon: {
      width: 72,
      height: 72,
      backgroundColor: colors.primary,
      borderRadius: 36,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    clubCardIcon: {
      backgroundColor: colors.accent,
      shadowColor: colors.accent,
    },
    cardTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    cardDescription: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    guestButton: {
      marginTop: 40,
      paddingVertical: 16,
      paddingHorizontal: 32,
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    guestText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Join Connext 🚀</Text>
          <Text style={styles.subtitle}>
            Connect with your campus community and discover amazing clubs
          </Text>
        </View>

        {/* Cards Section */}
        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <TouchableOpacity
            style={[styles.card, styles.studentCard]}
            onPress={() => router.push("/Student")}
            activeOpacity={0.9}
          >
            <View style={styles.cardIcon}>
              <Users size={36} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>I'm a Student</Text>
            <Text style={styles.cardDescription}>
              Discover clubs, events, and connect with peers
            </Text>
          </TouchableOpacity>

          {/* Club Card */}
          <TouchableOpacity
            style={[styles.card, styles.clubCard]}
            onPress={() => router.push("/Club")}
            activeOpacity={0.9}
          >
            <View style={[styles.cardIcon, styles.clubCardIcon]}>
              <Building size={36} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>I'm a Club</Text>
            <Text style={styles.cardDescription}>
              Promote your club and manage events
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue as Guest Button */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.replace("/(tabs)/home")}
          activeOpacity={0.8}
        >
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
