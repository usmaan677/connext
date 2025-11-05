import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function StudentScreen() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [major, setMajor] = useState(null);
  const [year, setYear] = useState(null);
  const [interest, setInterest] = useState(null);

  const majors = [
    { label: "Computer Science", value: "cs" },
    { label: "Engineering", value: "engineering" },
    { label: "Business", value: "business" },
    { label: "Biology", value: "biology" },
    { label: "Psychology", value: "psychology" },
    { label: "Other", value: "other" },
  ];

  const years = [
    { label: "Freshman", value: "freshman" },
    { label: "Sophomore", value: "sophomore" },
    { label: "Junior", value: "junior" },
    { label: "Senior", value: "senior" },
    { label: "Graduate", value: "graduate" },
  ];

  const interests = [
    { label: "Technology", value: "tech" },
    { label: "Sports", value: "sports" },
    { label: "Arts", value: "arts" },
    { label: "Volunteering", value: "volunteering" },
    { label: "Leadership", value: "leadership" },
    { label: "Social Events", value: "social" },
  ];

  const onSubmit = () => {
    if (!studentName || !studentEmail || !studentPassword || !major || !year) {
      alert("Please fill in all required fields.");
      return;
    }
    alert("Student signed up successfully!");
  };

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Student Sign Up</Text>
        <Text style={styles.subtitle}>
          Discover clubs and connect with campus life!
        </Text>

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#ccc"
          value={studentName}
          onChangeText={setStudentName}
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="University Email"
          placeholderTextColor="#ccc"
          value={studentEmail}
          onChangeText={setStudentEmail}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={studentPassword}
          onChangeText={setStudentPassword}
        />

        {/* Major Dropdown */}
        <Text style={styles.label}>Major</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{ color: "#ccc" }}
          selectedTextStyle={{ color: "#fff" }}
          data={majors}
          labelField="label"
          valueField="value"
          placeholder="Select Major"
          value={major}
          onChange={(item) => setMajor(item.value)}
        />

        {/* Year Dropdown */}
        <Text style={styles.label}>Year</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{ color: "#ccc" }}
          selectedTextStyle={{ color: "#fff" }}
          data={years}
          labelField="label"
          valueField="value"
          placeholder="Select Year"
          value={year}
          onChange={(item) => setYear(item.value)}
        />

        {/* Interests Dropdown */}
        <Text style={styles.label}>Interests</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={{ color: "#ccc" }}
          selectedTextStyle={{ color: "#fff" }}
          data={interests}
          labelField="label"
          valueField="value"
          placeholder="Select Interest"
          value={interest}
          onChange={(item) => setInterest(item.value)}
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
