import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import "../global.css"; // keep if you're using Expo Web or have global styles

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <View className="items-center justify-center px-5">
        <Text className="text-white text-3xl font-bold mb-2">
          Welcome to Connext 🎓
        </Text>

        <Text className="text-gray-200 text-base text-center mb-8">
          See what’s happening around campus today!
        </Text>

        {/* Log In */}
        <TouchableOpacity
          className="w-56 py-3 rounded-full items-center mb-3 bg-black"
          onPress={() => router.push("/login")}
          activeOpacity={0.85}
        >
          <Text className="text-white text-base font-semibold">Log In</Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <TouchableOpacity
          className="w-56 py-3 rounded-full items-center mb-3 bg-white border border-black"
          onPress={() => router.push("/signup")}
          activeOpacity={0.85}
        >
          <Text className="text-black text-base font-semibold">Sign Up</Text>
        </TouchableOpacity>

        {/* Continue as Guest */}
        <TouchableOpacity
          className="w-56 py-3 rounded-full items-center border border-white"
          onPress={() => router.push("/guest")}
          activeOpacity={0.85}
        >
          <Text className="text-white text-base font-semibold">
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
