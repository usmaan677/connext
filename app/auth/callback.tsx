import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthCallback() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    // Handle the auth callback
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          // Redirect to login on error
          router.replace('/login');
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to home
          router.replace('/(tabs)/home');
        } else {
          // No session, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth callback exception:', error);
        router.replace('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    text: {
      fontSize: 16,
      color: colors.text,
      marginTop: 20,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Processing authentication...</Text>
    </View>
  );
}