import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

export default function ClubSignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [clubname, setClubName] = useState("");
  const [clubemail, setClubEmail] = useState("");
  const [clubpassword, setClubPassword] = useState("");
  const [linktree, setLinktree] = useState("");
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: "Academic", value: "academic" },
    { label: "Cultural", value: "cultural" },
    { label: "Sports", value: "sports" },
    { label: "Arts", value: "arts" },
    { label: "Technology", value: "technology" },
    { label: "Social", value: "social" },
  ];

  function validate() {
    if (!clubname || !clubemail || !clubpassword || !category) {
      Alert.alert("Missing info", "Please fill in all required fields.");
      return false;
    }
    if (clubpassword.length < 6) {
      Alert.alert("Weak password", "Password should be at least 6 characters.");
      return false;
    }
    return true;
  }

  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // Sign up with metadata and proper redirect URL for email verification
      const { data, error } = await supabase.auth.signUp({
        email: clubemail,
        password: clubpassword,
        options: {
          // Use the deep link redirect URL we configured
          emailRedirectTo: "uhclubs://auth/callback",
          data: {
            club_name: clubname,
            linktree,
            category,
            role: "club",
          },
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('rate limit')) {
          Alert.alert(
            "Too Many Attempts",
            "You've tried signing up too many times recently. Please wait a few minutes before trying again."
          );
        } else if (error.message.includes('already registered')) {
          Alert.alert(
            "Account Exists",
            "This email is already registered. Try signing in instead.",
            [
              { text: "Cancel" },
              { text: "Go to Login", onPress: () => router.push("/login") }
            ]
          );
        } else {
          Alert.alert("Sign up failed", error.message);
        }
        return;
      }

      // Check if user already exists and is confirmed
      if (data.user && data.session) {
        // User is immediately confirmed (email confirmation disabled)
        const { error: insertError } = await supabase.from("profiles").insert({
          id: data.user.id,
          club_name: clubname,
          email: clubemail,
          linktree,
          category,
          role: "club",
        });

        if (insertError) {
          console.warn("Profile insert error:", insertError);
        }

        Alert.alert("Welcome!", "Your club account has been created.");
        router.replace("/(tabs)/home");
        return;
      }

      // If no session, email confirmation is required
      if (data.user && !data.session) {
        Alert.alert(
          "Check your email! 📧",
          `We've sent a verification link to ${clubemail}. Please:\n\n1. Check your inbox (and spam folder)\n2. Click the verification link\n3. The link will open this app automatically\n\nIf you don't receive the email within 5 minutes, try signing up again or check your spam folder.`,
          [
            { text: "Resend Email", onPress: () => resendVerificationEmail() },
            { text: "OK", onPress: () => router.replace("/login") }
          ]
        );
        return;
      }

    } catch (e) {
      Alert.alert("Unexpected error", e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: clubemail,
        options: {
          emailRedirectTo: "uhclubs://auth/callback"
        }
      });

      if (error) {
        Alert.alert("Error", "Failed to resend email. Please try again later.");
      } else {
        Alert.alert("Email Sent", "Verification email has been resent. Please check your inbox.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend email. Please try again later.");
    }
  };

  const styles = StyleSheet.create({
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
      minHeight: '100%',
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
    requiredField: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.overlay}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Club Registration 🏛️</Text>
          <Text style={styles.subtitle}>
            Join Connext and connect with students on campus
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Club Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Club Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your club name"
              placeholderTextColor={colors.textTertiary}
              value={clubname}
              onChangeText={setClubName}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Club Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="club@example.com"
              placeholderTextColor={colors.textTertiary}
              value={clubemail}
              onChangeText={setClubEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
              value={clubpassword}
              onChangeText={setClubPassword}
            />
          </View>

          {/* Linktree Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Linktree URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://linktr.ee/yourclub"
              placeholderTextColor={colors.textTertiary}
              value={linktree}
              onChangeText={setLinktree}
              autoCapitalize="none"
            />
          </View>

          {/* Category Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderText}
              selectedTextStyle={styles.dropdownText}
              data={categories}
              labelField="label"
              valueField="value"
              placeholder="Select club category"
              value={category}
              onChange={(item) => setCategory(item.value)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signupButton} onPress={onSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupText}>Create Club Account</Text>
            )}
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Back to Options</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
