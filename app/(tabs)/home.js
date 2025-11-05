import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const posts = [
  {
    id: 1,
    username: "@PENGUAM",
    image: "https://placekitten.com/400/300",
    caption: "Why is the formatting for these cards so snitz",
  },
  {
    id: 2,
    username: "@RTC",
    image: "https://placekitten.com/401/300",
    caption: "Usmaan fix plz",
  },
  {
    id: 3,
    username: "@penguamy",
    image: "https://placekitten.com/402/300",
    caption: "UMR President caught having affair with Ammar Ansari! #GoCoogs",
  },
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
      {/* Small sign up button in top right corner */}
      <TouchableOpacity
        style={styles.signUpButtonCorner}
        onPress={() => router.push("/signup")}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonTextSmall}>Sign Up</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.feedContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Welcome to Home Page</Text>
        {/* Instagram-style feed */}
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postUsername}>{post.username}</Text>
            <Image source={{ uri: post.image }} style={styles.postImage} />
            <Text style={styles.postCaption}>{post.caption}</Text>
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={20} color="white" />
                <Text style={[styles.actionText, { color: 'white' }]}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="send" size={20} color="white" />
                <Text style={[styles.actionText, { color: 'white' }]}>Send</Text>
              </TouchableOpacity>
            </View>
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
    position: 'absolute',
    top: 40,
    right: 24,
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  buttonTextSmall: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  feedContent: {
    paddingTop: 100,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    width: 340,
    height: 340, // Make the card more square
    marginBottom: 28,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    overflow: 'hidden', // Ensure image corners are rounded
  },
  postUsername: {
    color: '#00C2CB',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 18,
  },
  postImage: {
    width: 340,
    height: 200,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 10,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },
  postCaption: {
    color: 'white',
    fontSize: 15,
    marginBottom: 8,
    marginHorizontal: 16,
    alignSelf: 'flex-start',
    marginLeft: 18,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 12,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionText: {
    color: '#555',
    fontSize: 14,
    marginLeft: 6,
  },
});
