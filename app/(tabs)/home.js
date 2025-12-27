import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import RNPoll from "react-native-poll";

const choices = [
  { id: 1, choice: "Yes", votes: 12 },
  { id: 2, choice: "No", votes: 8 },
  { id: 3, choice: "Hell nah", votes: 5 },
];


// ===============================================================
// ⭐ YOUR ORIGINAL POSTS (kept exactly as you had them)
// ===============================================================
const staticPosts = [
  {
    id: "local-1",
    username: "umr_houston",
    userAvatar: "https://picsum.photos/40/40?random=99",
    image: require("../../assets/images/umrflyer.png"),
    caption:
      "Join us this Sunday at 12PM for our annual Run4Palestine 5K! 🏃‍♂️🇵🇸 "
      + "All proceeds will go toward humanitarian aid efforts in Palestine. "
      + "Bring your friends, family, and good vibes — let’s make a difference together ❤️ "
      + "#UMR #Run4Palestine #CharityRun #HoustonEvents",
    choices: choices,
  },
  {
    id: "local-2",
    username: "uh_cs_club",
    userAvatar: "https://picsum.photos/40/40?random=10",
    image: "https://picsum.photos/340/340?random=1",
    caption: "Join us for our weekly coding workshop! 🚀",
  },
  {
    id: "local-3",
    username: "uh_gaming",
    userAvatar: "https://picsum.photos/40/40?random=20",
    image: "https://picsum.photos/340/340?random=2",
    caption: "Tournament this Friday — prizes for winners! 🎮",
  },
  {
    id: "local-4",
    username: "uh_entrepreneurs",
    userAvatar: "https://picsum.photos/40/40?random=30",
    image: "https://picsum.photos/340/340?random=3",
    caption: "Pitch competition applications now open 💡",
  },
];



export default function HomeScreen() {
  const { colors, toggleTheme, theme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // ⭐ REAL SUPABASE POSTS
  const [supabasePosts, setSupabasePosts] = useState([]);

  const [liked, setLiked] = useState(false);


  // ===============================================================
  // FETCH POSTS FROM SUPABASE
  // ===============================================================
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("❌ FETCH POSTS ERROR:", error);
      return;
    }

    setSupabasePosts(data);
  };

  // Refresh feed on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );


  // ===============================================================
  // GET USER + PROFILE
  // ===============================================================
  useEffect(() => {
    supabase.auth.getUser().then(res => console.log("USER CHECK:", res));
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        const { data: profileData } = await supabase
          .from("profiles")
          .select("photo_url")
          .eq("user_id", session.user.id)
          .single();

        if (profileData) setProfile(profileData);
      }
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);

          const { data: profileData } = await supabase
            .from("profiles")
            .select("photo_url")
            .eq("user_id", session.user.id)
            .single();

          if (profileData) setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);



  // ===============================================================
  // SHARE BUTTON
  // ===============================================================
  const onShare = async () => {
    try {
      await Share.share({
        message: "Check out this app!",
      });
    } catch (error) {
      console.error("❌ Share error:", error);
    }
  };


  // ===============================================================
  // STYLES
  // ===============================================================
  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerWrapper: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      paddingTop: 70,
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: colors.header,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    logoGroup: { position: "relative", paddingBottom: 4 },
    logoText: { fontSize: 28, fontWeight: "800", color: colors.text },
    logoAccent: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 3,
      borderRadius: 3,
      backgroundColor: colors.primary,
    },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
    profilePicture: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: colors.primary,
    },

    feedContent: { paddingTop: 20, paddingBottom: 40 },

    postCard: {
      backgroundColor: colors.card,
      marginBottom: 20,
      marginHorizontal: 16,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },

    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },

    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 12,
    },

    postUsername: { color: colors.text, fontWeight: "600", fontSize: 15 },

    postImage: {
      width: "100%",
      aspectRatio: 1,
      backgroundColor: colors.borderLight,
    },

    postActionsRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      paddingVertical: 12,
    },

    leftActions: { flexDirection: "row", alignItems: "center" },

    iconButton: { padding: 8 },

    postCaption: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      color: colors.text,
    },
    captionUsernameBold: { fontWeight: "700" },
  });



  // ===============================================================
  // RENDER
  // ===============================================================
  return (
    <View style={s.container}>
      {/* HEADER */}
      <View style={s.headerWrapper}>
        <View style={s.logoGroup}>
          <Text style={s.logoText}>Connext</Text>
          <View style={s.logoAccent} />
        </View>

        <View style={s.headerActions}>
          <TouchableOpacity onPress={toggleTheme}>
            <Feather 
              name={theme === "dark" ? "sun" : "moon"} 
              size={22} 
              color={colors.icon} 
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Image
              source={{
                uri:
                  profile?.photo_url ??
                  "https://placekitten.com/200/200",
              }}
              style={s.profilePicture}
            />
          </TouchableOpacity>
        </View>
      </View>


      {/* FEED */}
      <ScrollView contentContainerStyle={s.feedContent}>

        {/* ⭐ REAL SUPABASE POSTS (TOP) */}
        {supabasePosts.map((post) => (
          <View key={post.id} style={s.postCard}>
            <View style={s.postHeader}>
              <Image
                source={{ uri: post.photo_url || "https://picsum.photos/40" }}
                style={s.userAvatar}
              />
              <Text style={s.postUsername}>
                {post.full_name || "Anonymous"}
              </Text>
            </View>

            <Image
              source={
                typeof post.image === "number"
                  ? post.image
                  : { uri: post.image }
              }
              style={s.postImage}
            />

            <View style={s.postActionsRow}>
              <View style={s.leftActions}>
                <TouchableOpacity onPress={() => setLiked(!liked)}>
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={26}
                    color={liked ? "red" : colors.icon}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={s.iconButton}>
                  <Feather name="message-circle" size={25} color={colors.icon} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onShare}>
                  <Feather name="send" size={24} color={colors.icon} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={s.iconButton}>
                <Feather name="bookmark" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>

            <Text style={s.postCaption}>
              <Text style={s.captionUsernameBold}>
                {post.full_name || "Anonymous"}{" "}
              </Text>
              {post.caption}
            </Text>
          </View>
        ))}


        {/* ⭐ YOUR STATIC POSTS (BOTTOM) */}
        {staticPosts.map((post) => (
          <View key={post.id} style={s.postCard}>
            <View style={s.postHeader}>
              <Image source={{ uri: post.userAvatar }} style={s.userAvatar} />
              <Text style={s.postUsername}>@{post.username}</Text>
            </View>

            <Image
              source={
                typeof post.image === "number"
                  ? post.image
                  : { uri: post.image }
              }
              style={s.postImage}
            />

            {/* ✅ POLL (ONLY ADDITION) */}
            {post.choices && (
              <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
                <RNPoll
                  totalVotes={post.choices.reduce((sum, c) => sum + c.votes, 0)}
                  choices={post.choices}
                  onChoicePress={(choice) => {
                    console.log("Voted:", choice);
                  }}
                />
              </View>
            )}

            <View style={s.postActionsRow}>
              <View style={s.leftActions}>
                <TouchableOpacity onPress={() => setLiked(!liked)}>
                  <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={26}
                    color={liked ? "red" : colors.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={s.iconButton}>
                  <Feather name="message-circle" size={25} color={colors.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onShare}>
                  <Feather name="send" size={24} color={colors.icon} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={s.iconButton}>
                <Feather name="bookmark" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>

            <Text style={s.postCaption}>
              <Text style={s.captionUsernameBold}>
                @{post.username}{" "}
              </Text>
              {post.caption}
            </Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}
