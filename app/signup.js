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
      paddingTop: 60, // Reduced from 80 to fit better on screen
      paddingBottom: 20, // Added bottom padding
      width: "100%",
      flex: 1,
      justifyContent: "center"
    },
    headerSection: {
      alignItems: "center",
      marginBottom: 32, // Reduced from 48
    },
    title: {
      fontSize: 32, // Reduced from 36
      fontWeight: "800",
      color: colors.text,
      marginBottom: 12, // Reduced from 16
      textAlign: "center",
    },
    subtitle: { 
      fontSize: 16, // Reduced from 18
      color: colors.textSecondary, 
      textAlign: "center",
      lineHeight: 22, // Reduced from 24
      paddingHorizontal: 16,
    },
    cardsContainer: {
      width: "100%",
      maxWidth: 340,
      gap: 16, // Reduced from 20
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20, // Reduced from 24
      padding: 24, // Reduced from 32
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
      width: 60, // Reduced from 72
      height: 60, // Reduced from 72
      backgroundColor: colors.primary,
      borderRadius: 30, // Reduced from 36
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16, // Reduced from 20
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
      fontSize: 20, // Reduced from 24
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6, // Reduced from 8
      textAlign: "center",
    },
    cardDescription: {
      fontSize: 14, // Reduced from 16
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20, // Reduced from 22
    },
    signInPrompt: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 24, // Reduced from original placement
    },
    signInText: {
      color: colors.textSecondary,
      fontSize: 15,
      marginRight: 8,
    },
    signInLink: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
    },
    guestButton: {
      marginTop: 16, // Reduced from 40
      paddingVertical: 14, // Reduced from 16
      paddingHorizontal: 28, // Reduced from 32
      backgroundColor: colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    guestText: {
      color: colors.textSecondary,
      fontSize: 15, // Reduced from 16
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

        {/* Sign In Prompt */}
        <View style={styles.signInPrompt}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signInLink}>Sign In</Text>
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
