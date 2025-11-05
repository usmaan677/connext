import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Animated,
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
  bio: "CS @ UH • Building the UH Clubs App",
  location: "Houston, TX",
  major: "Computer Science",
  gradYear: 2027,
  stats: { followers: 108, following: 42, clubs: 7, events: 12 },
  isSelf: false,
  isFollowing: false
};

// Mock data for tabs
const mockPosts = [
  { id: '1', content: 'Just joined the UH Computer Science Club! Excited to meet fellow developers 🚀', timestamp: '2h ago' },
  { id: '2', content: 'Great networking event at the Engineering building today. Met some amazing alumni!', timestamp: '1d ago' },
  { id: '3', content: 'Working on a new React Native project. The Expo ecosystem is fantastic!', timestamp: '3d ago' },
];

const mockClubs = [
  { id: '1', name: 'UH Computer Science Club', tagline: 'Building the future, one line of code at a time' },
  { id: '2', name: 'UH Entrepreneurship Society', tagline: 'Turning ideas into reality' },
  { id: '3', name: 'UH Gaming Club', tagline: 'Level up your gaming experience' },
];

const mockEvents = [
  { id: '1', title: 'React Native Workshop', date: 'Nov 15, 2025', time: '6:00 PM', location: 'Engineering Building' },
  { id: '2', title: 'Startup Pitch Competition', date: 'Nov 20, 2025', time: '7:00 PM', location: 'Business Building' },
  { id: '3', title: 'Gaming Tournament', date: 'Nov 25, 2025', time: '2:00 PM', location: 'Student Center' },
];

export default function Profile() {
  const [user, setUser] = useState(mockUser);
  const [activeTab, setActiveTab] = useState('Posts');
  const [refreshing, setRefreshing] = useState(false);
  const [followAnimation] = useState(new Animated.Value(1));

  // Handle follow/unfollow with optimistic updates
  const handleFollowToggle = async () => {
    const wasFollowing = user.isFollowing;
    const originalFollowerCount = user.stats.followers;

    // Optimistic update
    setUser(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      stats: {
        ...prev.stats,
        followers: prev.isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1
      }
    }));

    // Animate button
    Animated.sequence([
      Animated.timing(followAnimation, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(followAnimation, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();

    // Simulate network request
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Network error');
      }
    } catch (error) {
      // Revert optimistic update on failure
      setUser(prev => ({
        ...prev,
        isFollowing: wasFollowing,
        stats: {
          ...prev.stats,
          followers: originalFollowerCount
        }
      }));
      Alert.alert('Error', 'Failed to update follow status. Please try again.');
    }
  };

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Posts':
        return mockPosts.map((item) => (
          <View key={item.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-white/20">
            <Text className="text-white text-base leading-relaxed mb-2">{item.content}</Text>
            <Text className="text-gray-300 text-sm">{item.timestamp}</Text>
          </View>
        ));
      case 'Clubs':
        return mockClubs.map((item) => (
          <View key={item.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-white/20">
            <Text className="text-white text-lg font-semibold mb-1">{item.name}</Text>
            <Text className="text-gray-300 text-sm">{item.tagline}</Text>
          </View>
        ));
      case 'Events':
        return mockEvents.map((item) => (
          <View key={item.id} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-3 border border-white/20">
            <Text className="text-white text-lg font-semibold mb-2">{item.title}</Text>
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#d1d5db" />
              <Text className="text-gray-300 text-sm ml-2">{item.date}</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Clock size={16} color="#d1d5db" />
              <Text className="text-gray-300 text-sm ml-2">{item.time}</Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={16} color="#d1d5db" />
              <Text className="text-gray-300 text-sm ml-2">{item.location}</Text>
            </View>
          </View>
        ));
      default:
        return null;
    }
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
        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* Avatar and Basic Info */}
          <View className="items-center mb-6">
            <Image
              source={{ uri: user.avatar }}
              className="w-32 h-32 rounded-full border-4 border-white/20 mb-4"
            />
            <Text className="text-white text-2xl font-bold text-center">{user.name}</Text>
            <Text className="text-gray-300 text-lg">@{user.handle}</Text>
          </View>

          {/* Bio */}
          <Text className="text-gray-200 text-base text-center mb-4 leading-relaxed px-4">
            {user.bio}
          </Text>

          {/* Affiliation Chips */}
          <View className="flex-row justify-center items-center mb-4 flex-wrap">
            <View className="bg-white/20 rounded-full px-4 py-2 mr-2 mb-2">
              <Text className="text-white text-sm font-medium">{user.major} @ UH</Text>
            </View>
            <View className="bg-white/20 rounded-full px-4 py-2 mb-2">
              <Text className="text-white text-sm font-medium">Class of {user.gradYear}</Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row justify-center items-center mb-6">
            <MapPin size={16} color="#d1d5db" />
            <Text className="text-gray-300 text-sm ml-2">{user.location}</Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-around bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{user.stats.following}</Text>
              <Text className="text-gray-300 text-sm">Following</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{user.stats.followers}</Text>
              <Text className="text-gray-300 text-sm">Followers</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{user.stats.clubs}</Text>
              <Text className="text-gray-300 text-sm">Clubs</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-xl font-bold">{user.stats.events}</Text>
              <Text className="text-gray-300 text-sm">Events</Text>
            </View>
          </View>

          {/* Follow/Edit Button */}
          <Animated.View style={{ transform: [{ scale: followAnimation }] }}>
            <TouchableOpacity
              className={`w-full py-4 rounded-full items-center ${
                user.isSelf
                  ? 'bg-white'
                  : user.isFollowing
                  ? 'bg-white/20 border-2 border-white'
                  : 'bg-white'
              }`}
              onPress={user.isSelf ? () => Alert.alert('Edit Profile', 'Edit profile functionality would go here') : handleFollowToggle}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                {!user.isSelf && <Users size={18} color={user.isFollowing ? "#ffffff" : "#111827"} />}
                <Text className={`text-lg font-semibold ${
                  user.isSelf
                    ? 'text-gray-900'
                    : user.isFollowing
                    ? 'text-white ml-2'
                    : 'text-gray-900 ml-2'
                }`}>
                  {user.isSelf ? 'Edit Profile' : user.isFollowing ? 'Following' : 'Follow'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabsSection}>
          {/* Tab Headers */}
          <View className="flex-row bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-4 border border-white/20">
            {['Posts', 'Clubs', 'Events'].map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`flex-1 py-3 rounded-xl items-center ${
                  activeTab === tab ? 'bg-white/20' : ''
                }`}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text className={`font-semibold ${
                  activeTab === tab ? 'text-white' : 'text-gray-300'
                }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View>
            {renderTabContent()}
          </View>
        </View>
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
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  tabsSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
});
