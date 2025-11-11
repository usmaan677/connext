import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Calendar, Camera, GraduationCap, LogOut, MapPin, Star, Trophy, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from "react-native-element-dropdown";

// (Optional) still using mock clubs until you have a clubs/memberships table
const mockClubs = [
  { id: '1', name: 'UH Computer Science Club', role: 'Member' },
  { id: '2', name: 'UH Entrepreneurship Society', role: 'Vice President' },
  { id: '3', name: 'UH Gaming Club', role: 'Member' },
];

export default function Profile() {
  const { colors } = useTheme();

  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Edit modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    major: '',
    year: '',
    location: '',
    photo_url: '',
  });

  const majors = [
    { label: "Computer Science", value: "cs" },
    { label: "Engineering", value: "engineering" },
    { label: "Business", value: "business" },
    { label: "Biology", value: "biology" },
    { label: "Psychology", value: "psychology" },
    { label: "Other", value: "other" },
  ];

  const years = [
    { label: "Freshman", value: "freshman" },
    { label: "Sophomore", value: "sophomore" },
    { label: "Junior", value: "junior" },
    { label: "Senior", value: "senior" },
    { label: "Graduate", value: "graduate" },
  ];

  // ---------- Load session user ----------
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) setAuthUser(data?.session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const userId = authUser?.id || null;

  // ---------- Fetch profile ----------
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('profiles select error:', error);
        return;
      }
      setProfile(data);
    } catch (e) {
      console.log('profiles select exception:', e);
    }
  }, [userId]);

  useEffect(() => { if (userId) fetchProfile(); }, [userId, fetchProfile]);

  // ---------- Realtime (optional) ----------
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel('profiles-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${userId}` },
        (payload) => {
          if (payload.new) setProfile(payload.new);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  // ---------- Pull to refresh ----------
  const onRefresh = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [userId, fetchProfile]);

  // ---------- Sign out function ----------
  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) {
                Alert.alert("Error", "Failed to sign out. Please try again.");
              } else {
                Alert.alert("Signed Out", "You have been successfully signed out.");
              }
            } catch (e) {
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          }
        }
      ]
    );
  };

  // ---------- Derived UI values ----------
  const name = profile?.full_name || authUser?.user_metadata?.full_name || '—';
  const email = profile?.email || authUser?.email || '—';
  const handle = (email && email.includes('@')) ? email.split('@')[0] : 'student';
  const avatar = profile?.photo_url || 'https://placekitten.com/200/200';
  const college = profile?.college || 'University of Houston';
  const major = profile?.major || '—';
  const year = profile?.year || '—'; // e.g., freshman/sophomore/etc.
  const location = profile?.location || 'Houston, TX';

  // Open edit modal and populate form
  const openEditModal = () => {
    setEditForm({
      full_name: name !== '—' ? name : '',
      major: major !== '—' ? major : '',
      year: year !== '—' ? year : '',
      location: location !== 'Houston, TX' ? location : '',
      photo_url: avatar !== 'https://placekitten.com/200/200' ? avatar : '',
    });
    setEditModalVisible(true);
  };

  // Pick image from gallery or camera
  const pickImage = async () => {
    Alert.alert(
      "Select Photo",
      "Choose how you'd like to add your photo",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Photo Library", onPress: openGallery },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Camera access is needed to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditForm({...editForm, photo_url: result.assets[0].uri});
    }
  };

  const openGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Photo library access is needed to select photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditForm({...editForm, photo_url: result.assets[0].uri});
    }
  };

  // Save profile changes
  const saveProfile = async () => {
    if (!userId) {
      Alert.alert('Error', 'User not authenticated. Please sign in again.');
      return;
    }
    
    try {
      setEditLoading(true);
      console.log('🔄 Attempting to update profile for user:', userId);
      console.log('📝 Profile data to save:', editForm);
      
      // Build update object with only non-empty fields
      const updateData = {
        user_id: userId,
        email: email,
        role: profile?.role || 'student',
      };
      
      // Only add fields that have values
      if (editForm.full_name && editForm.full_name.trim()) {
        updateData.full_name = editForm.full_name.trim();
      }
      if (editForm.major && editForm.major.trim()) {
        updateData.major = editForm.major.trim();
      }
      if (editForm.year && editForm.year.trim()) {
        updateData.year = editForm.year.trim();
      }
      if (editForm.location && editForm.location.trim()) {
        updateData.location = editForm.location.trim();
      }
      if (editForm.photo_url && editForm.photo_url.trim()) {
        updateData.photo_url = editForm.photo_url.trim();
      }
      
      console.log('📦 Final update data:', updateData);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData, { onConflict: 'user_id' });

      console.log('📡 Database response:', { data, error });

      if (error) {
        console.error('🚨 Profile update error details:', error);
        
        // More specific error messages
        if (error.message.includes('violates row-level security policy')) {
          Alert.alert('Permission Error', 'You do not have permission to update this profile. Please contact support.');
        } else if (error.message.includes('duplicate key')) {
          Alert.alert('Error', 'A profile with this information already exists.');
        } else if (error.message.includes('null value')) {
          Alert.alert('Missing Data', 'Some required fields are missing. Please check your input.');
        } else if (error.message.includes('foreign key')) {
          Alert.alert('Database Error', 'There was an issue linking your profile data.');
        } else if (error.message.includes('column')) {
          Alert.alert('Database Error', 'There was an issue with the profile fields. Please contact support.');
        } else {
          Alert.alert('Update Failed', `Failed to update profile: ${error.message}`);
        }
        return;
      }

      console.log('✅ Profile updated successfully');
      Alert.alert('Success', 'Profile updated successfully!');
      setEditModalVisible(false);
      await fetchProfile(); // Refresh profile data
      
    } catch (e) {
      console.error('💥 Unexpected profile update error:', e);
      
      // Handle different types of exceptions
      if (e.message.includes('fetch') || e.message.includes('network')) {
        Alert.alert('Network Error', 'Unable to connect to the server. Please check your internet connection and try again.');
      } else if (e.message.includes('timeout')) {
        Alert.alert('Timeout Error', 'The request took too long. Please try again.');
      } else {
        Alert.alert('Unexpected Error', `Something went wrong: ${e.message || 'Unknown error'}`);
      }
    } finally {
      console.log('🏁 Profile update attempt finished');
      setEditLoading(false);
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: 120 },
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
    avatarContainer: { position: 'relative', marginBottom: 20 },
    avatarGradientBorder: {
      padding: 5, borderRadius: 75, backgroundColor: colors.primary,
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3,
      shadowRadius: 12, elevation: 8,
    },
    avatarInnerContainer: { borderRadius: 70, overflow: 'hidden', borderWidth: 3, borderColor: colors.header },
    avatar: { width: 140, height: 140 },
    profileBadge: {
      position: 'absolute', top: 8, right: 8, backgroundColor: colors.warning, borderRadius: 20, padding: 10,
      borderWidth: 3, borderColor: colors.header, shadowColor: colors.warning, shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
    },
    userName: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6, textAlign: 'center' },
    userHandle: {
      fontSize: 16, color: colors.primary, marginBottom: 6, fontWeight: '600',
      backgroundColor: `${colors.primary}15`, paddingHorizontal: 16, paddingVertical: 6,
      borderRadius: 20, borderWidth: 1, borderColor: `${colors.primary}30`,
    },
    userEmail: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },

    statsContainer: {
      flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, marginTop: 20, marginBottom: 24,
    },
    statItem: {
      alignItems: 'center', backgroundColor: colors.card, borderRadius: 24, paddingVertical: 24, paddingHorizontal: 16,
      flex: 1, marginHorizontal: 6, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: colors.borderLight,
    },
    statIcon: {
      width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12,
      shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
    },
    statNumber: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 4 },
    statLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

    card: {
      marginHorizontal: 20, marginBottom: 20, borderRadius: 24, backgroundColor: colors.card, padding: 28,
      shadowColor: colors.shadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
      borderWidth: 1, borderColor: colors.borderLight,
    },
    cardTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 24, textAlign: 'left' },

    infoGrid: { gap: 16 },
    infoItem: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 20, padding: 18,
      borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    infoIconContainer: {
      width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 16,
      shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
    },
    infoTextContainer: { flex: 1 },
    infoLabel: {
      fontSize: 12, color: colors.textSecondary, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5,
    },
    infoValue: { fontSize: 16, color: colors.text, fontWeight: '700' },

    clubCard: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 20, padding: 20,
      marginBottom: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    },
    clubIconContainer: { marginRight: 16 },
    clubIconGradient: {
      width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center',
      shadowColor: colors.shadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3,
    },
    clubIconText: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
    clubInfo: { flex: 1 },
    clubName: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 6 },
    roleContainer: { alignSelf: 'flex-start' },
    clubRole: {
      fontSize: 13, color: colors.primary, fontWeight: '600', backgroundColor: `${colors.primary}15`,
      paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: `${colors.primary}25`,
      textTransform: 'uppercase', letterSpacing: 0.3,
    },

    editButton: {
      marginHorizontal: 20, marginTop: 8, borderRadius: 20, overflow: 'hidden',
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
    },
    editButtonGradient: { paddingVertical: 20, paddingHorizontal: 32, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
    editButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '700', marginLeft: 8 },
    editButtonIcon: { marginRight: 4 },

    center: { alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
    hint: { color: colors.textSecondary, marginTop: 8 },

    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 24,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dropdown: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dropdownText: {
      color: colors.text,
      fontSize: 16,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '700',
    },
    cancelButton: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },

    // Photo picker styles
    photoContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    photoPreview: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.background,
      borderWidth: 2,
      borderColor: colors.border,
      marginBottom: 12,
    },
    photoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
    },
    photoButtonText: {
      color: '#ffffff',
      marginLeft: 8,
      fontWeight: '600',
    },
    signOutButton: {
      marginHorizontal: 20, 
      marginTop: 8, 
      marginBottom: 12,
      borderRadius: 20, 
      overflow: 'hidden',
      shadowColor: colors.error, 
      shadowOffset: { width: 0, height: 6 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 12, 
      elevation: 8,
    },
    signOutButtonGradient: { 
      paddingVertical: 20, 
      paddingHorizontal: 32, 
      alignItems: 'center', 
      flexDirection: 'row', 
      justifyContent: 'center' 
    },
    signOutButtonText: { 
      color: '#ffffff', 
      fontSize: 17, 
      fontWeight: '700', 
      marginLeft: 8 
    },
  }), [colors]);

  // ---------- Loading / Signed-out states ----------
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
        <Text style={styles.hint}>Loading…</Text>
      </View>
    );
  }

  if (!authUser) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>You’re signed out</Text>
        <Text style={styles.hint}>Sign in to view your profile.</Text>
      </View>
    );
  }

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
                <Image source={{ uri: avatar }} style={styles.avatar} />
              </View>
            </View>
            <View style={styles.profileBadge}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
            </View>
          </View>

          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userHandle}>@{handle}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* Stats Row (placeholder numbers for now) */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary }]}>
              <Trophy size={20} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{mockClubs.length}</Text>
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
                <Text style={styles.infoValue}>{college}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <BookOpen size={24} color={colors.accent} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Major</Text>
                <Text style={styles.infoValue}>{major}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Calendar size={24} color={colors.warning} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Year</Text>
                <Text style={styles.infoValue}>{year}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MapPin size={24} color={colors.info} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* My Clubs Section (placeholder) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏛️ My Clubs</Text>
          {mockClubs.map((club, index) => (
            <TouchableOpacity key={club.id} style={styles.clubCard} activeOpacity={0.8}>
              <View style={{ marginRight: 16 }}>
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
          onPress={openEditModal}
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

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.error, colors.errorDark || '#cc4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signOutButtonGradient}
          >
            <LogOut size={20} color="#ffffff" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setEditModalVisible(false)}
              >
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Profile Photo */}
              <View style={styles.photoContainer}>
                <Image 
                  source={{ uri: editForm.photo_url || 'https://placekitten.com/200/200' }} 
                  style={styles.photoPreview} 
                />
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                  <Camera size={20} color="#ffffff" />
                  <Text style={styles.photoButtonText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Full Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.full_name}
                  onChangeText={(text) => setEditForm({...editForm, full_name: text})}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              {/* Major */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Major</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: colors.textTertiary }}
                  selectedTextStyle={styles.dropdownText}
                  data={majors}
                  labelField="label"
                  valueField="value"
                  placeholder="Select your major"
                  value={editForm.major}
                  onChange={(item) => setEditForm({...editForm, major: item.value})}
                />
              </View>

              {/* Year */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Academic Year</Text>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={{ color: colors.textTertiary }}
                  selectedTextStyle={styles.dropdownText}
                  data={years}
                  labelField="label"
                  valueField="value"
                  placeholder="Select your year"
                  value={editForm.year}
                  onChange={(item) => setEditForm({...editForm, year: item.value})}
                />
              </View>

              {/* Location */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.location}
                  onChangeText={(text) => setEditForm({...editForm, location: text})}
                  placeholder="Houston, TX"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={saveProfile}
                disabled={editLoading}
              >
                {editLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
