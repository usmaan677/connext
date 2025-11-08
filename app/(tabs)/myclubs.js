import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();

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
              <Calendar size={16} color={colors.primary} />
              <Text style={styles.eventDetail}>{item.date}</Text>
            </View>
            <View style={styles.eventRow}>
              <Clock size={16} color={colors.success} />
              <Text style={styles.eventDetail}>{item.time}</Text>
            </View>
            <View style={styles.eventRow}>
              <MapPin size={16} color={colors.warning} />
              <Text style={styles.eventDetail}>{item.location}</Text>
            </View>
          </View>
        ));
      default:
        return null;
    }
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
    },
    headerSection: {
      paddingHorizontal: 24,
      paddingTop: 64, // Added 4px more padding
      paddingBottom: 24,
      alignItems: 'center',
      backgroundColor: colors.header,
    },
    tabsSection: {
      paddingHorizontal: 24,
      paddingBottom: 100,
    },
    title: {
      color: colors.text,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 16,
    },
    tabHeaderRow: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 4,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: colors.primary,
    },
    tabButtonText: {
      color: colors.textSecondary,
      fontWeight: '600',
      fontSize: 16,
    },
    tabButtonTextActive: {
      color: '#FFFFFF',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
    },
    clubName: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    clubTagline: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 20,
    },
    eventTitle: {
      color: colors.text,
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    eventRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      paddingVertical: 2,
    },
    eventDetail: {
      color: colors.textSecondary,
      fontSize: 14,
      marginLeft: 10,
      fontWeight: '500',
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
    </View>
  );
}