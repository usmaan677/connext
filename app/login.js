import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Log In</Text>
        <Text style={styles.subtitle}>Welcome back! Please sign in.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
        />

        <TouchableOpacity style={[styles.button, styles.loginButton]}>
          <Text style={[styles.buttonText, styles.loginText]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.button, styles.backButton]}
        >
          <Text style={[styles.buttonText, styles.backText]}>Back</Text>
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
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
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
  backButton: {
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
  backText: {
    color: "#000",
  },
});
