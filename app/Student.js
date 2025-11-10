// app/StudentSignupScreen.js
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function StudentSignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [year, setYear] = useState(null);
  const [major, setMajor] = useState(null);
  const [loading, setLoading] = useState(false);

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

  function validate() {
    if (!fullname || !email || !password || !year || !major) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password should be at least 6 characters.");
      return false;
    }
    return true;
  }

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Must be whitelisted in Supabase Auth → URL Configuration → Redirect URLs
          emailRedirectTo: "https://moveincorp.com/connext",
          data: {
            full_name: fullname,
            year,
            major,
            role: "student",
          },
        },
      });

      if (error) {
        if (error.message?.toLowerCase().includes("rate limit")) {
          Alert.alert("Too Many Attempts", "Please wait a few minutes and try again.");
        } else if (error.message?.toLowerCase().includes("already registered")) {
          Alert.alert("Account Exists", "This email is already registered.", [
            { text: "Cancel" },
            { text: "Go to Login", onPress: () => router.push("/login") },
          ]);
        } else {
          Alert.alert("Sign up failed", error.message);
        }
        return;
      }

      // Always try to create the profile after successful signup
      if (data.user) {
        const { error: insertError } = await supabase.from("profiles").insert({
          user_id: data.user.id,  // ← Changed from id to user_id
          full_name: fullname,
          email,
          year,
          major,
          role: "student",
        });

        if (insertError) {
          console.warn("Profile insert error:", insertError);
          // Don't show error to user as the account was still created successfully
        }
      }

      // If confirmations are OFF (dev), session exists; best-effort profile upsert here.
      if (data?.user && data?.session) {
        await supabase
          .from("profiles")
          .upsert(
            {
              user_id: data.user.id, // If your PK is user_id, change to user_id: data.user.id and onConflict: "user_id"
              full_name: fullname,
              email,
              year,
              major,
              role: "student",
            },
            { onConflict: "user_id" }
          );
        Alert.alert("Welcome!", "Your student account has been created.");
        router.replace("/(tabs)/home");
        return;
      }

      // Most cases (confirmations ON): no session yet → show verify instructions.
      if (data?.user && !data?.session) {
        Alert.alert(
          "Check your email! 📧",
          `We've sent a verification link to ${email}.\n\nOpen it and you'll be redirected to the verification site.\nAfter that, open the app and sign in to complete setup.`
        );
        router.replace("/login");
        return;
      }
    } catch (e) {
      Alert.alert("Unexpected error", e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Build styles with theme colors (must be inside component)
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollView: {
          flex: 1,
        },
        overlay: {
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: 80,
          paddingBottom: 40,
          minHeight: "100%",
        },
        headerSection: {
          alignItems: "center",
          marginBottom: 40,
        },
        title: {
          fontSize: 32,
          fontWeight: "800",
          color: colors.text,
          marginBottom: 8,
          textAlign: "center",
        },
        subtitle: {
          fontSize: 18,
          color: colors.textSecondary,
          textAlign: "center",
          lineHeight: 24,
          paddingHorizontal: 16,
        },
        formContainer: {
          width: "100%",
          maxWidth: 340,
          gap: 16,
        },
        inputContainer: {
          width: "100%",
        },
        label: {
          color: colors.text,
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 8,
        },
        input: {
          width: "100%",
          backgroundColor: colors.card,
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 16,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          fontSize: 16,
        },
        dropdown: {
          width: "100%",
          backgroundColor: colors.card,
          borderRadius: 16,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        dropdownText: {
          color: colors.text,
          fontSize: 16,
        },
        placeholderText: {
          color: colors.textTertiary,
          fontSize: 16,
        },
        buttonContainer: {
          width: "100%",
          gap: 16,
          marginTop: 32,
        },
        signupButton: {
          width: "100%",
          backgroundColor: colors.primary,
          borderRadius: 16,
          paddingVertical: 18,
          alignItems: "center",
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
          opacity: loading ? 0.7 : 1,
        },
        backButton: {
          width: "100%",
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 16,
          paddingVertical: 18,
          alignItems: "center",
        },
        signupText: {
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: "700",
        },
        backText: {
          color: colors.textSecondary,
          fontSize: 16,
          fontWeight: "600",
        },
        spinner: { marginLeft: 8 },
      }),
    [colors, loading]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.overlay}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Student Registration 🎓</Text>
          <Text style={styles.subtitle}>
            Join Connext and discover amazing clubs on campus
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textTertiary}
              value={fullname}
              onChangeText={setFullName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Student Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="student@cougarnet.uh.edu"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a secure password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Year Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Academic Year *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderText}
              selectedTextStyle={styles.dropdownText}
              data={years}
              labelField="label"
              valueField="value"
              placeholder="Select your year"
              value={year}
              onChange={(item) => setYear(item.value)}
            />
          </View>

          {/* Major Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Major *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderText}
              selectedTextStyle={styles.dropdownText}
              data={majors}
              labelField="label"
              valueField="value"
              placeholder="Select your major"
              value={major}
              onChange={(item) => setMajor(item.value)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {/* Sign Up Button */}
          <TouchableOpacity disabled={loading} style={styles.signupButton} onPress={onSubmit}>
            <Text style={styles.signupText}>
              {loading ? "Creating Account..." : "Create Student Account"}
            </Text>
            {loading ? <ActivityIndicator style={styles.spinner} /> : null}
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>Back to Options</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
