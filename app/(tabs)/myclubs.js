import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock data for clubs and events
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

import React from 'react';

export default function MyClubs() {
  const [activeTab, setActiveTab] = useState('Clubs');
  const [refreshing, setRefreshing] = useState(false);

  // Handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Clubs':
        return mockClubs.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.clubName}>{item.name}</Text>
            <Text style={styles.clubTagline}>{item.tagline}</Text>
          </View>
        ));
      case 'Events':
        return mockEvents.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <View style={styles.eventRow}>
              <Calendar size={16} color="#d1d5db" />
              <Text style={styles.eventDetail}>{item.date}</Text>
            </View>
            <View style={styles.eventRow}>
              <Clock size={16} color="#d1d5db" />
              <Text style={styles.eventDetail}>{item.time}</Text>
            </View>
            <View style={styles.eventRow}>
              <MapPin size={16} color="#d1d5db" />
              <Text style={styles.eventDetail}>{item.location}</Text>
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
        <View style={styles.headerSection}>
          <Text style={styles.title}>My Clubs & Events</Text>
          <Text style={styles.subtitle}>Manage your clubs and upcoming events</Text>
        </View>
        <View style={styles.tabsSection}>
          <View style={styles.tabHeaderRow}>
            {['Clubs', 'Events'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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
    marginBottom: 16,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  tabButtonText: {
    color: '#d1d5db',
    fontWeight: '600',
    fontSize: 16,
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  clubName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clubTagline: {
    color: '#d1d5db',
    fontSize: 15,
  },
  eventTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  eventDetail: {
    color: '#d1d5db',
    fontSize: 14,
    marginLeft: 8,
  },
});