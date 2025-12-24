import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Camera, GraduationCap, LogOut, MapPin, X, ChevronRight } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from "react-native-element-dropdown";

const defaultAvatar = require('@/assets/images/pfp.jpg');

const mockClubs = [
  { id: '1', name: 'UH Computer Science Club', role: 'Member' },
  { id: '2', name: 'UH Entrepreneurship Society', role: 'Vice President' },
  { id: '3', name: 'UH Gaming Club', role: 'Member' },
];

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
    full_name: '', major: '', year: '', location: '', photo_url: '', base64: '',
  });

  const userId = authUser?.id || null;

  // Load session
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
    return () => { mounted = false; sub?.subscription?.unsubscribe?.(); };
  }, []);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
      if (!error) setProfile(data);
    } catch (e) { console.log('profiles select exception:', e); }
  }, [userId]);

  useEffect(() => { if (userId) fetchProfile(); }, [userId, fetchProfile]);

  // Realtime updates
  useEffect(() => {
    if (!userId) return;
    const channel = supabase.channel('profiles-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${userId}` },
        (payload) => { if (payload.new) setProfile(payload.new); }
      ).subscribe();
    return () => supabase.removeChannel(channel);
  }, [userId]);

  const onRefresh = useCallback(async () => {
    if (!userId) return;
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  }, [userId, fetchProfile]);

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: async () => {
          await supabase.auth.signOut();
          Alert.alert("Signed Out", "You have been successfully signed out.");
      }}
    ]);
  };

  // Derived values
  const name = profile?.full_name || authUser?.user_metadata?.full_name || '—';
  const email = profile?.email || authUser?.email || '—';
  const handle = (email && email.includes('@')) ? email.split('@')[0] : 'student';
  const avatar = profile?.photo_url || '';
  const major = profile?.major || '—';
  const year = profile?.year || '—';
  const location = profile?.location || 'Houston, TX';

  const openEditModal = () => {
    setEditForm({
      full_name: name !== '—' ? name : '',
      major: major !== '—' ? major : '',
      year: year !== '—' ? year : '',
      location: location !== 'Houston, TX' ? location : '',
      photo_url: avatar !== 'https://placekitten.com/200/200' ? avatar : '',
      base64: '',
    });
    setEditModalVisible(true);
  };

  const pickImage = async () => {
    Alert.alert("Select Photo", "Choose source", [
      { text: "Camera", onPress: () => launchPicker(true) },
      { text: "Photo Library", onPress: () => launchPicker(false) },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const launchPicker = async (isCamera) => {
    const method = isCamera ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;
    const perm = isCamera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!perm.granted) {
      Alert.alert("Permission Required", "Access is needed to select photos.");
      return;
    }

    const result = await method({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setEditForm(prev => ({...prev, photo_url: result.assets[0].uri, base64: result.assets[0].base64}));
    }
  };

  const uploadImage = async (base64Image, imageUri) => {
    const fileName = `${userId}/${Date.now()}.jpg`;
    
    // Use the base64 image directly since we already have it from the image picker
    if (!base64Image) {
      throw new Error('No image data available');
    }

    // Convert base64 string to binary string
    const binaryString = atob(base64Image);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, bytes, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      throw new Error(error.message || 'Upload failed');
    }

    // Get the public URL of the uploaded image
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const saveProfile = async () => {
    if (!userId) return;
    setEditLoading(true);
    try {
      const updateData = { user_id: userId, email, role: profile?.role || 'student' };
      if (editForm.full_name?.trim()) updateData.full_name = editForm.full_name.trim();
      if (editForm.major?.trim()) updateData.major = editForm.major.trim();
      if (editForm.year?.trim()) updateData.year = editForm.year.trim();
      if (editForm.location?.trim()) updateData.location = editForm.location.trim();

      if (editForm.base64) {
        try {
          updateData.photo_url = await uploadImage(editForm.base64, editForm.photo_url);
        } catch (_) {
          Alert.alert('Upload Error', 'Failed to upload image. Saving other changes.');
        }
      } else if (editForm.photo_url?.startsWith('http')) {
        updateData.photo_url = editForm.photo_url.trim();
      }

      const { error } = await supabase.from('profiles').upsert(updateData, { onConflict: 'user_id' });
      if (error) throw error;

      Alert.alert('Success', 'Profile updated!');
      setEditModalVisible(false);
      fetchProfile();
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (!authUser) return <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}><Text className="text-xl font-bold" style={{ color: colors.text }}>Signed Out</Text></View>;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="pb-32"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Top Spacing */}
        <View style={{ height: 20 }} />

        {/* Header Section */}
        <View style={{ backgroundColor: colors.card }} className="mb-6 mx-4 rounded-3xl overflow-hidden">
            {/* Banner */}
            <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                className="h-32 w-full"
            />
            
            {/* Profile Content */}
            <View className="px-6 pt-6 pb-8">
              {/* Profile Picture and Edit Button */}
              <View className="flex-row justify-between items-flex-start mb-6">
                <Image 
                    source={avatar ? { uri: avatar } : defaultAvatar}
                    style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: colors.card, backgroundColor: colors.background }}
                />
                <TouchableOpacity 
                    onPress={openEditModal}
                    className="px-5 py-2 rounded-full border"
                    style={{ borderColor: colors.border, backgroundColor: colors.background }}
                >
                    <Text style={{ color: colors.text }} className="font-semibold text-sm">Edit</Text>
                </TouchableOpacity>
              </View>

              {/* Name and Handle */}
              <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">{name}</Text>
              <Text style={{ color: colors.primary }} className="font-medium text-base mb-4">@{handle}</Text>

              {/* Info Row 1 */}
              <View className="flex-row items-center mb-3">
                <GraduationCap size={16} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm">{major}</Text>
              </View>

              {/* Info Row 2 */}
              <View className="flex-row items-center mb-3">
                <Calendar size={16} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm capitalize">{year}</Text>
              </View>

              {/* Info Row 3 */}
              <View className="flex-row items-center mb-6">
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm">{location}</Text>
              </View>

              {/* Stats Row */}
              <View className="flex-row justify-around pt-4 border-t" style={{ borderColor: colors.border }}>
                <View className="items-center py-3 flex-1">
                    <Text style={{ color: colors.text }} className="text-lg font-bold">{mockClubs.length}</Text>
                    <Text style={{ color: colors.textSecondary }} className="text-xs uppercase tracking-wider font-medium mt-1">Clubs</Text>
                </View>
                <View className="items-center py-3 flex-1">
                    <Text style={{ color: colors.text }} className="text-lg font-bold">12</Text>
                    <Text style={{ color: colors.textSecondary }} className="text-xs uppercase tracking-wider font-medium mt-1">Events</Text>
                </View>
                <View className="items-center py-3 flex-1">
                    <Text style={{ color: colors.text }} className="text-lg font-bold">4.8</Text>
                    <Text style={{ color: colors.textSecondary }} className="text-xs uppercase tracking-wider font-medium mt-1">Rating</Text>
                </View>
              </View>
            </View>
        </View>

        {/* Clubs Section */}
        <View className="px-4 mt-2">
            <Text style={{ color: colors.text }} className="text-lg font-bold mb-4 ml-2">My Clubs</Text>
            {mockClubs.map((club, i) => (
                <TouchableOpacity 
                    key={club.id} 
                    className="flex-row items-center p-4 mb-3 rounded-2xl border"
                    style={{ backgroundColor: colors.card, borderColor: colors.border }}
                >
                    <LinearGradient
                        colors={i % 2 === 0 ? [colors.primary, colors.primaryDark] : [colors.accent, '#059669']}
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    >
                        <Text className="text-white text-lg font-bold">{club.name.charAt(0)}</Text>
                    </LinearGradient>
                    <View className="flex-1">
                        <Text style={{ color: colors.text }} className="text-base font-bold mb-0.5">{club.name}</Text>
                        <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase">{club.role}</Text>
                    </View>
                    <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity 
            className="mx-4 mt-8 mb-4 flex-row items-center justify-center py-3 rounded-2xl border"
            style={{ backgroundColor: colors.card, borderColor: colors.error }}
            onPress={handleSignOut}
        >
            <LogOut size={20} color={colors.error} />
            <Text style={{ color: colors.error }} className="text-base font-bold ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="fade" onRequestClose={() => setEditModalVisible(false)}>
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <View className="rounded-3xl p-6 w-full max-w-md max-h-[85%]" style={{ backgroundColor: colors.card }}>
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text }} className="text-xl font-bold">Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)} className="p-2 rounded-full" style={{ backgroundColor: colors.background }}>
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="items-center mb-8">
                <View className="relative">
                    <Image source={{ uri: editForm.photo_url || 'https://placekitten.com/200/200' }} className="w-24 h-24 rounded-full border-2" style={{ borderColor: colors.border }} />
                    <TouchableOpacity 
                        className="absolute bottom-0 right-0 p-2 rounded-full shadow-sm"
                        style={{ backgroundColor: colors.primary }}
                        onPress={pickImage}
                    >
                        <Camera size={16} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={{ color: colors.primary }} className="font-semibold mt-3" onPress={pickImage}>Change Photo</Text>
              </View>

              <View className="mb-5">
                <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase mb-2 ml-1">Full Name</Text>
                <TextInput
                  className="rounded-xl p-4 text-base border"
                  style={{ backgroundColor: colors.background, color: colors.text, borderColor: colors.border }}
                  value={editForm.full_name}
                  onChangeText={t => setEditForm({...editForm, full_name: t})}
                  placeholder="Full Name"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View className="mb-5">
                <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase mb-2 ml-1">Major</Text>
                <Dropdown
                  style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }}
                  placeholderStyle={{ color: colors.textTertiary }}
                  selectedTextStyle={{ color: colors.text, fontSize: 16 }}
                  itemTextStyle={{ color: colors.text }}
                  containerStyle={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius: 12 }}
                  activeColor={colors.background}
                  data={majors}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Major"
                  value={editForm.major}
                  onChange={item => setEditForm({...editForm, major: item.value})}
                />
              </View>

              <View className="mb-5">
                <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase mb-2 ml-1">Year</Text>
                <Dropdown
                  style={{ backgroundColor: colors.background, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }}
                  placeholderStyle={{ color: colors.textTertiary }}
                  selectedTextStyle={{ color: colors.text, fontSize: 16 }}
                  itemTextStyle={{ color: colors.text }}
                  containerStyle={{ backgroundColor: colors.card, borderColor: colors.border, borderRadius: 12 }}
                  activeColor={colors.background}
                  data={years}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Year"
                  value={editForm.year}
                  onChange={item => setEditForm({...editForm, year: item.value})}
                />
              </View>

              <View className="mb-6">
                <Text style={{ color: colors.textSecondary }} className="text-xs font-bold uppercase mb-2 ml-1">Location</Text>
                <TextInput
                  className="rounded-xl p-4 text-base border"
                  style={{ backgroundColor: colors.background, color: colors.text, borderColor: colors.border }}
                  value={editForm.location}
                  onChangeText={t => setEditForm({...editForm, location: t})}
                  placeholder="Location"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <TouchableOpacity 
                className="rounded-xl p-4 items-center mt-2 mb-4"
                style={{ backgroundColor: colors.primary }}
                onPress={saveProfile} 
                disabled={editLoading}
              >
                {editLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Save Changes</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
