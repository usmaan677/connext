import { useTheme } from '@/contexts/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';

export default function LocationList() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location List</Text>
      <Text style={styles.subtitle}>This feature is coming soon!</Text>
    </View>
  );
}