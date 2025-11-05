import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ChoiceScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Join Connext 🚀</Text>
        <Text style={styles.subtitle}>
          Choose how you’d like to get started
        </Text>

        {/* Student Button */}
        <TouchableOpacity
          style={[styles.button, styles.studentButton]}
          onPress={() => router.push("/Student")}
        >
          <Text style={[styles.buttonText, styles.studentText]}>Student</Text>
        </TouchableOpacity>

        {/* Club Button */}
        <TouchableOpacity
          style={[styles.button, styles.clubButton]}
          onPress={() => router.push("/Club")}
        >
          <Text style={[styles.buttonText, styles.clubText]}>Club</Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={() => router.back()}
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
    fontSize: 32,
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
    marginBottom: 40,
    textAlign: "center",
  },
  button: {
    width: 220,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  studentButton: {
    backgroundColor: "#00C2CB",
  },
  clubButton: {
    backgroundColor: "#6A00FF",
  },
  backButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  studentText: {
    color: "#fff",
  },
  clubText: {
    color: "#fff",
  },
  backText: {
    color: "#000",
  },
});
