import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // ✅ needed for navigation
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to Connext 🎓</Text>
        <Text style={styles.subtitle}>
          See what’s happening around campus today!
        </Text>

        {/* Log In Button */}
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push("/login")} // ✅ navigate to login page
        >
          <Text style={[styles.buttonText, styles.loginText]}>Log In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push("/signup")}
        >
          <Text style={[styles.buttonText, styles.signupText]}>Sign Up</Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    width: 220,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#000",
  },
  signupButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: {
    color: "#fff",
  },
  signupText: {
    color: "#000",
  },
});
