import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Login successful!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") }
      ]);
    }, 1500);
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
      paddingTop: 60, // Reduced from 80
      paddingBottom: 30, // Reduced from 40
      minHeight: '100%',
    },
    headerSection: {
      alignItems: "center",
      marginBottom: 36, // Reduced from 48
    },
    title: {
      fontSize: 28, // Reduced from 32
      fontWeight: "800",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16, // Reduced from 18
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22, // Reduced from 24
      paddingHorizontal: 16,
    },
    formContainer: {
      width: "100%",
      maxWidth: 340,
      gap: 18, // Reduced from 20
    },
    inputContainer: {
      position: "relative",
      width: "100%",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 14, // Reduced from 16
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 18, // Reduced from 20
      paddingVertical: 14, // Reduced from 16
    },
    inputIcon: {
      marginRight: 10, // Reduced from 12
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 15, // Reduced from 16
      fontWeight: "500",
    },
    eyeButton: {
      padding: 4,
      marginLeft: 8,
    },
    buttonContainer: {
      width: "100%",
      gap: 14, // Reduced from 16
      marginTop: 24, // Reduced from 32
    },
    loginButton: {
      width: "100%",
      backgroundColor: colors.primary,
      borderRadius: 14, // Reduced from 16
      paddingVertical: 16, // Reduced from 18
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    backButton: {
      width: "100%",
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14, // Reduced from 16
      paddingVertical: 16, // Reduced from 18
      alignItems: "center",
    },
    loginText: {
      color: "#FFFFFF",
      fontSize: 16, // Reduced from 18
      fontWeight: "700",
    },
    backText: {
      color: colors.textSecondary,
      fontSize: 15, // Reduced from 16
      fontWeight: "600",
    },
    forgotPassword: {
      alignSelf: "center",
      marginTop: 12, // Reduced from 16
      paddingVertical: 6, // Reduced from 8
    },
    forgotPasswordText: {
      color: colors.primary,
      fontSize: 15, // Reduced from 16
      fontWeight: "600",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24, // Reduced from 32
      paddingHorizontal: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      paddingHorizontal: 16,
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "500",
    },
    signupPrompt: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16, // Reduced from 20
    },
    signupText: {
      color: colors.textSecondary,
      fontSize: 15, // Reduced from 16
    },
    signupLink: {
      color: colors.primary,
      fontSize: 15, // Reduced from 16
      fontWeight: "600",
      marginLeft: 4,
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
          <Text style={styles.title}>Connext 🚀</Text>
          <Text style={styles.subtitle}>
            Welcome back! Sign in to continue your journey
          </Text>
        </View>

        <View style={styles.formContainer}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          {/* Login Button */}
          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Back to Options</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Sign Up Prompt */}
        <View style={styles.signupPrompt}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
