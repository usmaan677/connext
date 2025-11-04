import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function ChooseRoleScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up As</Text>

        {/* Student Button */}
        <TouchableOpacity
          style={[styles.button, styles.studentButton]}
          onPress={() => router.push("/Student")}
        >
          <Text style={styles.buttonText}>Student</Text>
        </TouchableOpacity>

        {/* Club Button */}
        <TouchableOpacity
          style={[styles.button, styles.clubButton]}
          onPress={() => router.push("/Club")}
        >
          <Text style={styles.buttonText}>Club</Text>
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
  container: {
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 20,
  },
  button: {
    width: 220,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  studentButton: {
    backgroundColor: "#00C2CB",
  },
  clubButton: {
    backgroundColor: "#6A00FF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
