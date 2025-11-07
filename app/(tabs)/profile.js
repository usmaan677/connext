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

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            colors={["#00C2CB"]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Avatar */}
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#00C2CB", "#370078"]}
              style={styles.avatarGradientBorder}
            >
              <View style={styles.avatarInnerContainer}>
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatar}
                />
              </View>
            </LinearGradient>
            <View style={styles.profileBadge}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
            </View>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userHandle}>@{user.handle}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#00C2CB' }]}>
              <Trophy size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Clubs</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#6A00FF' }]}>
              <Calendar size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FF6B6B' }]}>
              <Star size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Academic Info Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={["rgba(0, 194, 203, 0.1)", "rgba(55, 0, 120, 0.1)"]}
            style={styles.cardGradient}
          >
            <Text style={styles.cardTitle}>🎓 Academic Information</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <GraduationCap size={24} color="#00C2CB" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>University</Text>
                  <Text style={styles.infoValue}>{user.college}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <BookOpen size={24} color="#6A00FF" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Major</Text>
                  <Text style={styles.infoValue}>{user.major}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <Calendar size={24} color="#FF6B6B" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Graduation</Text>
                  <Text style={styles.infoValue}>Class of {user.gradYear}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIconContainer}>
                  <MapPin size={24} color="#FFD700" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{user.location}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* My Clubs Section */}
        <View style={styles.card}>
          <LinearGradient
            colors={["rgba(106, 0, 255, 0.1)", "rgba(0, 194, 203, 0.1)"]}
            style={styles.cardGradient}
          >
            <Text style={styles.cardTitle}>🏛️ My Clubs</Text>
            {mockClubs.map((club, index) => (
              <TouchableOpacity key={club.id} style={styles.clubCard} activeOpacity={0.8}>
                <View style={styles.clubIconContainer}>
                  <LinearGradient
                    colors={index % 2 === 0 ? ["#00C2CB", "#370078"] : ["#6A00FF", "#FF6B6B"]}
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
          </LinearGradient>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Edit Profile', 'Edit profile functionality would go here')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#00C2CB", "#6A00FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.editButtonGradient}
          >
            <Text style={styles.editButtonText}>✨ Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGradientBorder: {
    padding: 4,
    borderRadius: 70,
    shadowColor: '#00C2CB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  userHandle: {
    fontSize: 18,
    color: '#00C2CB',
    marginBottom: 4,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  card: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 2,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  clubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  roleContainer: {
    alignSelf: 'flex-start',
  },
  clubRole: {
    fontSize: 14,
    color: '#00C2CB',
    fontWeight: '500',
    backgroundColor: 'rgba(0, 194, 203, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 194, 203, 0.3)',
  },
  editButton: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00C2CB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
