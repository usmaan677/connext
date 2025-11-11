import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Mock posts data
const posts = [
  {
    id: 1,
    username: "umr_houston",
    userAvatar: "https://picsum.photos/40/40?random=99",
    image: require("../../assets/images/umrflyer.png"),
    caption:
      "Join us this Sunday at 12PM for our annual Run4Palestine 5K! 🏃‍♂️🇵🇸 "
      + "All proceeds will go toward humanitarian aid efforts in Palestine. "
      + "Bring your friends, family, and good vibes — let’s make a difference together ❤️ "
      + "#UMR #Run4Palestine #CharityRun #HoustonEvents",
  },
  {
    id: 2,
    username: "uh_cs_club",
    userAvatar: "https://picsum.photos/40/40?random=10",
    image: "https://picsum.photos/340/340?random=1",
    caption: "Join us for our weekly coding workshop! 🚀",
  },
  {
    id: 3,
    username: "uh_gaming",
    userAvatar: "https://picsum.photos/40/40?random=20",
    image: "https://picsum.photos/340/340?random=2",
    caption: "Tournament this Friday — prizes for winners! 🎮",
  },
  {
    id: 4,
    username: "uh_entrepreneurs",
    userAvatar: "https://picsum.photos/40/40?random=30",
    image: "https://picsum.photos/340/340?random=3",
    caption: "Pitch competition applications now open 💡",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors, toggleTheme, theme } = useTheme();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Get initial session and profile
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        
        // Fetch user profile from database
        const { data: profileData } = await supabase
          .from('profiles')
          .select('photo_url')
          .eq('user_id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
        }
      }
    };

    getSessionAndProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile when user signs in
          const { data: profileData } = await supabase
            .from('profiles')
            .select('photo_url')
            .eq('user_id', session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const handleProfilePress = () => {
    if (user) {
      // Navigate to profile tab
      router.push('/(tabs)/profile');
    } else {
      // Navigate to login
      router.push('/login');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingTop: 70, // Increased from 54 to 70 for more space from top
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.header,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logoGroup: {
      position: 'relative',
      paddingBottom: 4,
    },
    logoText: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: 0.5,
    },
    logoAccent: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 3,
      borderRadius: 3,
      backgroundColor: colors.primary,
      opacity: 0.8,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeToggle: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profilePicture: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    signInBtnNew: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: colors.primary,
      borderRadius: 12,
    },
    signInBtnLabel: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '600',
    },
    feedContent: {
      paddingTop: 20, // Added top padding for spacing between header and posts
      paddingBottom: 40,
    },
    postCard: {
      backgroundColor: colors.card,
      marginBottom: 20,
      marginHorizontal: 16,
      borderRadius: 20,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },
    postUsername: {
      color: colors.text,
      fontWeight: '600',
      fontSize: 15,
    },
    postImage: {
      width: '100%',
      height: undefined,
      aspectRatio: 1,
      backgroundColor: colors.borderLight,
    },
    postActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    leftActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      padding: 8,
    },
    postCaption: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      color: colors.text,
    },
    captionUsernameBold: {
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.logoGroup}>
          <Text style={styles.logoText}>Connext</Text>
          <View style={styles.logoAccent} />
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Feather 
              name={theme === 'dark' ? 'sun' : 'moon'} 
              size={20} 
              color={colors.icon} 
            />
          </TouchableOpacity>
          
          {user ? (
            <TouchableOpacity
              onPress={handleProfilePress}
              activeOpacity={0.8}
            >
              <Image
                source={{ 
                  uri: profile?.photo_url || 
                       user?.user_metadata?.photo_url || 
                       'https://placekitten.com/200/200' 
                }}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.signInBtnNew}
              onPress={handleProfilePress}
              activeOpacity={0.85}
            >
              <Text style={styles.signInBtnLabel}>Sign In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Feed Content */}
      <ScrollView contentContainerStyle={styles.feedContent}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* Post Header */}
            <View style={styles.postHeader}>
              <Image source={{ uri: post.userAvatar }} style={styles.userAvatar} />
              <Text style={styles.postUsername}>@{post.username}</Text>
            </View>

            {/* Post Image */}
            <Image
              source={
                typeof post.image === "number"
                  ? post.image // local require() → your umrflyer.png
                  : { uri: post.image } // remote image (like picsum)
              }
              style={styles.postImage}
            />

            {/* Actions Row - Like, Comment, Share left; Bookmark right */}
            <View style={styles.postActionsRow}>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="heart" size={25} color={colors.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="message-circle" size={25} color={colors.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="send" size={24} color={colors.icon} style={{ transform: [{ rotate: "-10deg" }] }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="bookmark" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>

            {/* Username and Caption below actions */}
            <Text style={styles.postCaption}>
              <Text style={styles.captionUsernameBold}>{post.username}</Text> {post.caption}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
