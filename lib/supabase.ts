import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, processLock } from '@supabase/supabase-js'
import { AppState, Platform } from 'react-native'
import * as Crypto from 'expo-crypto'

// Polyfill for WebCrypto API
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {
    getRandomValues: (array: any) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    subtle: {
      digest: async (algorithm: string, data: ArrayBuffer) => {
        if (algorithm === 'SHA-256') {
          const hexString = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            new TextDecoder().decode(data),
            { encoding: Crypto.CryptoEncoding.HEX }
          );
          // Convert hex string to ArrayBuffer
          const bytes = new Uint8Array(hexString.length / 2);
          for (let i = 0; i < hexString.length; i += 2) {
            bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
          }
          return bytes.buffer;
        }
        throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    } as any
  } as any;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    ...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
    lock: processLock,
    flowType: 'pkce',
  },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
if (Platform.OS !== "web") {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })
}