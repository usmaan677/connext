import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, processLock } from "@supabase/supabase-js";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import { AppState, Platform } from "react-native";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

// ✅ READ VALUES FROM app.json → extra
const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig.extra;

// Polyfill for WebCrypto API
if (typeof globalThis.crypto === "undefined") {
  globalThis.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {
      digest: async (algorithm, data) => {
        if (algorithm === "SHA-256") {
          const hexString = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            new TextDecoder().decode(data),
            { encoding: Crypto.CryptoEncoding.HEX }
          );

          const bytes = new Uint8Array(hexString.length / 2);
          for (let i = 0; i < hexString.length; i += 2) {
            bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
          }

          return bytes.buffer;
        }
        throw new Error(`Unsupported algorithm: ${algorithm}`);
      },
    },
  };
}

// ✅ USE THE VALUES FROM app.json
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
    flowType: "implicit",
  },
});

// Auto-refresh on foreground
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
