import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Calendar, GraduationCap, MapPin, Star, Trophy } from 'lucide-react-native';
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
      paddingBottom: 120,
    },
    headerSection: {
      alignItems: 'center',
      paddingTop: 70,
      paddingBottom: 32,
      paddingHorizontal: 24,
      backgroundColor: colors.header,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 20,
    },
    avatarGradientBorder: {
      padding: 5,
      borderRadius: 75,
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    avatarInnerContainer: {
      borderRadius: 70,
      overflow: 'hidden',
      borderWidth: 3,
      borderColor: colors.header,
    },
    avatar: {
      width: 140,
      height: 140,
    },
    profileBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: colors.warning,
      borderRadius: 20,
      padding: 10,
      borderWidth: 3,
      borderColor: colors.header,
      shadowColor: colors.warning,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
    userName: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 6,
      textAlign: 'center',
    },
    userHandle: {
      fontSize: 16,
      color: colors.primary,
      marginBottom: 6,
      fontWeight: '600',
      backgroundColor: `${colors.primary}15`,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 16,
      marginTop: 20,
      marginBottom: 24,
    },
    statItem: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 24,
      paddingVertical: 24,
      paddingHorizontal: 16,
      flex: 1,
      marginHorizontal: 6,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    card: {
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 24,
      backgroundColor: colors.card,
      padding: 28,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 24,
      textAlign: 'left',
    },
    infoGrid: {
      gap: 16,
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    infoIconContainer: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    infoTextContainer: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    infoValue: {
      fontSize: 16,
      color: colors.text,
      fontWeight: '700',
    },
    clubCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    clubIconContainer: {
      marginRight: 16,
    },
    clubIconGradient: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
    },
    clubIconText: {
      fontSize: 22,
      fontWeight: '800',
      color: '#ffffff',
    },
    clubInfo: {
      flex: 1,
    },
    clubName: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    roleContainer: {
      alignSelf: 'flex-start',
    },
    clubRole: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
      backgroundColor: `${colors.primary}15`,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: `${colors.primary}25`,
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    editButton: {
      marginHorizontal: 20,
      marginTop: 8,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    editButtonGradient: {
      paddingVertical: 20,
      paddingHorizontal: 32,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    editButtonText: {
      color: '#ffffff',
      fontSize: 17,
      fontWeight: '700',
      marginLeft: 8,
    },
    editButtonIcon: {
      marginRight: 4,
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
