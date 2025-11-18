import 'dotenv/config';

export default {
  expo: {
    name: "uh-clubs",
    slug: "uh-clubs",
    version: "1.0.0",

    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },

    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        }
      ]
    ]
  }
};
