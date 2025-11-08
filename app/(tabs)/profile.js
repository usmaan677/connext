import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, GraduationCap, BookOpen, Star, Calendar, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

// Mock user data
const mockUser = {
  id: "u_001",
  name: "Usmaan Sayed",
  handle: "usmaan",
  avatar: "https://placekitten.com/200/200",
  email: "usmaan@cougarnet.uh.edu",
  college: "University of Houston",
  major: "Computer Science",
  gradYear: 2027,
  location: "Houston, TX",
  studentId: "1234567"
};

// Mock clubs data
const mockClubs = [
  { id: '1', name: 'UH Computer Science Club', role: 'Member' },
  { id: '2', name: 'UH Entrepreneurship Society', role: 'Vice President' },
  { id: '3', name: 'UH Gaming Club', role: 'Member' },
];

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 100,
    },
    headerSection: {
      alignItems: 'center',
      paddingTop: 64, // Added 4px more padding
      paddingBottom: 32,
      paddingHorizontal: 24,
      backgroundColor: colors.header,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 20,
    },
    avatarGradientBorder: {
      padding: 4,
      borderRadius: 70,
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarInnerContainer: {
      borderRadius: 66,
      overflow: 'hidden',
    },
    avatar: {
      width: 132,
      height: 132,
    },
    profileBadge: {
      position: 'absolute',
      top: 10,
      right: 10,
      backgroundColor: `${colors.warning}20`,
      borderRadius: 16,
      padding: 8,
      borderWidth: 2,
      borderColor: colors.warning,
    },
    userName: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    userHandle: {
      fontSize: 18,
      color: colors.primary,
      marginBottom: 4,
      fontWeight: '600',
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 24,
      marginBottom: 24,
    },
    statItem: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      flex: 1,
      marginHorizontal: 6,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    card: {
      marginHorizontal: 24,
      marginBottom: 24,
      borderRadius: 20,
      backgroundColor: colors.card,
      padding: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    infoGrid: {
      gap: 16,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.primary}15`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 2,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '600',
    },
    clubCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    clubIconContainer: {
      marginRight: 16,
    },
    clubIconGradient: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    clubIconText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#ffffff',
    },
    clubInfo: {
      flex: 1,
    },
    clubName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    roleContainer: {
      alignSelf: 'flex-start',
    },
    clubRole: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
      backgroundColor: `${colors.primary}15`,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    editButton: {
      marginHorizontal: 24,
      borderRadius: 16,
      overflow: 'hidden',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    editButtonGradient: {
      paddingVertical: 18,
      paddingHorizontal: 32,
      alignItems: 'center',
    },
    editButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Avatar */}
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradientBorder}>
              <View style={styles.avatarInnerContainer}>
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatar}
                />
              </View>
            </View>
            <View style={styles.profileBadge}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
            </View>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userHandle}>@{user.handle}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary }]}>
              <Trophy size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Clubs</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.success }]}>
              <Calendar size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.warning }]}>
              <Star size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Academic Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎓 Academic Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <GraduationCap size={24} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>University</Text>
                <Text style={styles.infoValue}>{user.college}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <BookOpen size={24} color={colors.accent} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Major</Text>
                <Text style={styles.infoValue}>{user.major}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Calendar size={24} color={colors.warning} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Graduation</Text>
                <Text style={styles.infoValue}>Class of {user.gradYear}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MapPin size={24} color={colors.info} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{user.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* My Clubs Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏛️ My Clubs</Text>
          {mockClubs.map((club, index) => (
            <TouchableOpacity key={club.id} style={styles.clubCard} activeOpacity={0.8}>
              <View style={styles.clubIconContainer}>
                <LinearGradient
                  colors={index % 2 === 0 ? [colors.primary, colors.primaryDark] : [colors.accent, colors.success]}
                  style={styles.clubIconGradient}
                >
                  <Text style={styles.clubIconText}>{club.name.charAt(0)}</Text>
                </LinearGradient>
              </View>
              <View style={styles.clubInfo}>
                <Text style={styles.clubName}>{club.name}</Text>
                <View style={styles.roleContainer}>
                  <Text style={styles.clubRole}>{club.role}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Edit Profile', 'Edit profile functionality would go here')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.editButtonGradient}
          >
            <Text style={styles.editButtonText}>✨ Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
