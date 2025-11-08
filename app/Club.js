import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTheme } from "@/contexts/ThemeContext";

export default function ClubSignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
      alert("Please fill in all required fields.");
      return;
    }
    alert("Club signed up successfully!");
    // Navigate to main app after successful signup
    router.replace("/(tabs)/home");
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
          <TouchableOpacity style={styles.signupButton} onPress={onSubmit}>
            <Text style={styles.signupText}>Create Club Account</Text>
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
