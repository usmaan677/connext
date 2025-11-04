import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function SignupScreen() {
  const router = useRouter();
  const [clubname, setClubName] = useState("");
  const [clubemail, setClubEmail] = useState("");
  const [clubpassword, setClubPassword] = useState("");
  const [linktree, setLinktree] = useState("");
  const [category, setCategory] = useState(null);

  const categories = [
    { label: "Academic", value: "academic" },
    { label: "Cultural", value: "cultural" },
    { label: "Sports", value: "sports" },
    { label: "Arts", value: "arts" },
    { label: "Technology", value: "technology" },
    { label: "Social", value: "social" },
  ];

  const onSubmit = () => {
    if (!clubname || !clubemail || !clubpassword || !category) {
      alert("Please fill in all fields.");
      return;
    }
    alert("Club signed up successfully!");
  };

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
          placeholder="Club Name"
          placeholderTextColor="#ccc"
          value={clubname}
          onChangeText={setClubName}
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Club Email"
          placeholderTextColor="#ccc"
          value={clubemail}
          onChangeText={setClubEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={clubpassword}
          onChangeText={setClubPassword}
        />

        {/* Linktree Input */}
        <TextInput
          style={styles.input}
          placeholder="Linktree URL"
          placeholderTextColor="#ccc"
          value={linktree}
          onChangeText={setLinktree}
        />

        {/* Category Dropdown */}
        <Text style={styles.label}>Category</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{ color: "#ccc" }}
          selectedTextStyle={{ color: "#fff" }}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Choose category..."
          value={category}
          onChange={(item) => setCategory(item.value)}
        />

        {/* Sign Up Button */}
        <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={onSubmit}>
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
  dropdown: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  label: {
    color: "#fff",
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
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
