import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export default function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session to check if user is verified
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          Alert.alert('Error', 'Failed to verify email. Please try again.');
          router.replace('/login');
          return;
        }

        if (session?.user) {
          Alert.alert('Success', 'Email verified successfully!', [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/home'),
            },
          ]);
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        Alert.alert('Error', 'Something went wrong. Please try logging in again.');
        router.replace('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return null; // This screen doesn't render anything visible
}