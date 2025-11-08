import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Mock posts data
const posts = [
  {
    id: 1,
    username: "uh_cs_club",
    userAvatar: "https://picsum.photos/40/40?random=10",
    image: "https://picsum.photos/340/340?random=1",
    caption: "Join us for our weekly coding workshop! 🚀"
  },
  {
    id: 2,
    username: "uh_gaming",
    userAvatar: "https://picsum.photos/40/40?random=20",
    image: "https://picsum.photos/340/340?random=2",
    caption: "Tournament this Friday - prizes for winners! 🎮"
  },
  {
    id: 3,
    username: "uh_entrepreneurs",
    userAvatar: "https://picsum.photos/40/40?random=30",
    image: "https://picsum.photos/340/340?random=3",
    caption: "Pitch competition applications now open 💡"
  }
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1B0034", "#370078", "#00C2CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        {/* Header with sign up button (not sticky) */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { flex: 1, textAlign: 'left' }]}>Connext 🚀</Text>
          <TouchableOpacity
            style={styles.signUpButtonCorner}
            onPress={() => router.push("/signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonTextSmall}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        {/* Instagram-style feed */}
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            {/* User Header */}
            <View style={styles.postHeader}>
              <Image 
                source={{ uri: post.userAvatar }} 
                style={styles.userAvatar}
              />
              <Text style={styles.postUsername}>@{post.username}</Text>
            </View>

            {/* Post Image */}
            <Image source={{ uri: post.image }} style={styles.postImage} />

            {/* Actions Row - Like, Comment, Share left; Bookmark right */}
            <View style={styles.postActionsRow}>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="heart" size={25} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="message-circle" size={25} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Feather name="send" size={24} color="#fff" style={{ transform: [{ rotate: "-10deg" }] }} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="bookmark" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Username and Caption below actions */}
            <Text style={styles.postCaption}>
              <Text style={styles.captionUsernameBold}>{post.username}</Text> {post.caption}
            </Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signUpButtonCorner: {
    backgroundColor: 'transparent', // Outline style
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00C2CB', // Accent color for outline
    shadowColor: 'transparent',
    elevation: 0,
    zIndex: 10,
  },
  buttonTextSmall: {
    color: '#00C2CB', // Accent color for text
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedContent: {
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 28, // More rounded corners
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  postUsername: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    backgroundColor: '#2a2a2a',
  },
  postContent: {
    padding: 12,
  },
  postActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
    marginTop: 2,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0, // Make buttons even closer together
  },
  iconButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'transparent',
    marginRight: 1,
    shadowColor: 'transparent',
    elevation: 0,
  },
  postCaption: {
    color: 'white',
    fontSize: 15,
    lineHeight: 20,
    marginHorizontal: 15,
    marginBottom: 16, // Restore more space below caption
    marginTop: 0,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
  captionUsernameBold: {
    fontWeight: 'bold',
    color: 'white',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 60, // keeps button below status bar nicely
    paddingBottom: 16, // space below header
    gap: 12, // space between title and button
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
