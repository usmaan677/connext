import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connext</Text>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.signInText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <LinearGradient
        colors={["#F8FAFC", "#F1F5F9", "#E2E8F0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          {/* Title & Subtitle */}
          <Text style={styles.title}>Welcome to Connext 🎓</Text>
          <Text style={styles.subtitle}>
            Connect with your campus community
          </Text>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => router.push("/signup")}
          >
            <Text style={[styles.buttonText, styles.signupText]}>Get Started</Text>
          </TouchableOpacity>

          {/* Continue as Guest */}
          <TouchableOpacity
            onPress={() => {
              router.replace("/(tabs)/home");
            }}
          >
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  signInButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  signInText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#64748B",
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: 240,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  signupButton: {
    backgroundColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: "700",
  },
  signupText: {
    color: "#FFFFFF",
  },
  guestText: {
    color: "#64748B",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
});
