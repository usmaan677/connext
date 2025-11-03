import Slider from "@react-native-community/slider"; // ✅ only here
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// ⚠️ NOTE: If you see an error about "Slider" being undefined,
// run this command and import from that package instead:
// npm install @react-native-community/slider
// import Slider from "@react-native-community/slider";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gradYear, setGradYear] = useState(2025);

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>Join Connext and stay in the loop!</Text>

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />

        {/* Graduation Year Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Graduation Year: {gradYear}</Text>
          <Slider
            style={styles.slider}
            minimumValue={2025}
            maximumValue={2030}
            step={1}
            minimumTrackTintColor="#00C2CB"
            maximumTrackTintColor="#999"
            thumbTintColor="#fff"
            value={gradYear}
            onValueChange={setGradYear}
          />
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={[styles.button, styles.signupButton]}>
          <Text style={[styles.buttonText, styles.signupText]}>Sign Up</Text>
        </TouchableOpacity>

        {/* Back Button */}
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
  sliderContainer: {
    width: "80%",
    alignItems: "stretch",
    marginBottom: 25,
  },
  sliderLabel: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  button: {
    width: 220,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
  },
  signupButton: {
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
  signupText: {
    color: "#fff",
  },
  backText: {
    color: "#000",
  },
});
