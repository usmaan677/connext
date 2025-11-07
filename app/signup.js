import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Building, Users } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SignupChoice() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
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
              <Users size={32} color="#ffffff" />
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
            <View style={styles.cardIcon}>
              <Building size={32} color="#ffffff" />
            </View>
            <Text style={styles.cardTitle}>I'm a Club</Text>
            <Text style={styles.cardDescription}>
              Promote your club and manage events
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>← Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  overlay: { 
    alignItems: "center", 
    paddingHorizontal: 24, 
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
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: { 
    fontSize: 16, 
    color: "#d1d5db", 
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    width: "100%",
    maxWidth: 320,
    gap: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  studentCard: {
    backgroundColor: "rgba(0, 194, 203, 0.2)",
    borderColor: "rgba(0, 194, 203, 0.4)",
  },
  clubCard: {
    backgroundColor: "rgba(106, 0, 255, 0.2)",
    borderColor: "rgba(106, 0, 255, 0.4)",
  },
  cardIcon: {
    width: 64,
    height: 64,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  cardDescription: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
    lineHeight: 20,
  },
  backButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backText: {
    color: "#d1d5db",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
