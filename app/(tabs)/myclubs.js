import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, MapPin } from 'lucide-react-native';

// Mock data for clubs and events (same as profile)
const mockClubs = [
  { id: '1', name: 'UH Computer Science Club', tagline: 'Building the future, one line of code at a time' },
  { id: '2', name: 'UH Entrepreneurship Society', tagline: 'Turning ideas into reality' },
  { id: '3', name: 'UH Gaming Club', tagline: 'Level up your gaming experience' },
  { id: '4', name: 'UH Art Collective', tagline: 'Express, Create, Inspire' },
  { id: '5', name: 'UH Debate Society', tagline: 'Sharpen your mind, find your voice' },
];

const mockEvents = [
  { id: '1', title: 'React Native Workshop', date: 'Nov 15, 2025', time: '6:00 PM', location: 'Engineering Building' },
  { id: '2', title: 'Startup Pitch Competition', date: 'Nov 20, 2025', time: '7:00 PM', location: 'Business Building' },
  { id: '3', title: 'Gaming Tournament', date: 'Nov 25, 2025', time: '2:00 PM', location: 'Student Center' },
  { id: '4', title: 'Art Expo', date: 'Dec 2, 2025', time: '5:00 PM', location: 'Fine Arts Center' },
  { id: '5', title: 'Debate Night', date: 'Dec 10, 2025', time: '6:30 PM', location: 'Lecture Hall 3' },
];

export default function MyClubs() {
  const [activeTab, setActiveTab] = useState('Clubs');
  const [refreshing, setRefreshing] = useState(false);

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
          <Text style={styles.title}>My Clubs & Events</Text>
          <Text style={styles.subtitle}>Manage your clubs and upcoming events</Text>
        </View>

        {/* Tabs Section */}
        <View style={styles.tabsSection}>
          {/* Tab Headers */}
          <View className="flex-row bg-white/10 backdrop-blur-sm rounded-2xl p-2 mb-4 border border-white/20">
            {['Clubs', 'Events'].map((tab) => (
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
    alignItems: 'center',
  },
  tabsSection: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#d1d5db',
    fontSize: 18,
    textAlign: 'center',
  },
});