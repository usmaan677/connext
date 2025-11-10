import { useTheme } from "@/contexts/ThemeContext";
import { Calendar, MapPin, Search } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock Data
const mockClubs = [
  {
    id: 1,
    name: "UH Robotics Club",
    tagline: "Building tomorrow's innovations, one robot at a time",
    category: "STEM",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab6c7e7b1b?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 2,
    name: "UH Art Collective",
    tagline: "Express, Create, Inspire",
    category: "Arts",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 3,
    name: "Cougar Esports",
    tagline: "Level up your gaming experience",
    category: "Gaming",
    image:
      "https://images.unsplash.com/photo-1612548402204-46b44c6c5a38?auto=format&fit=crop&w=600&q=60",
  },
];

const mockEvents = [
  {
    id: 1,
    title: "Innovation Hackathon",
    date: "Nov 20, 2025",
    location: "Engineering Building",
  },
  {
    id: 2,
    title: "Art Showcase",
    date: "Dec 5, 2025",
    location: "Student Center South",
  },
  {
    id: 3,
    title: "Startup Pitch Night",
    date: "Dec 10, 2025",
    location: "Business Auditorium",
  },
];

const categories = ["All", "STEM", "Arts", "Gaming", "Cultural", "Sports"];

export default function Explore() {
  const { colors } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredClubs = mockClubs.filter(
    (club) =>
      (selectedCategory === "All" || club.category === selectedCategory) &&
      club.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Discover clubs, events, and communities across campus
        </Text>
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchBar,
          { backgroundColor: colors.surface, shadowColor: colors.shadow },
        ]}
      >
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          placeholder="Search clubs or events..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryRow}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            activeOpacity={0.8}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === cat ? colors.primary : colors.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === cat ? "#fff" : colors.textSecondary,
                },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Clubs */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Featured Clubs
      </Text>
      {filteredClubs.map((club) => (
        <View key={club.id} style={[styles.card, { backgroundColor: colors.card }]}>
          <Image source={{ uri: club.image }} style={styles.image} />
          <View style={styles.cardText}>
            <Text style={[styles.clubName, { color: colors.text }]}>
              {club.name}
            </Text>
            <Text style={[styles.clubTagline, { color: colors.textSecondary }]}>
              {club.tagline}
            </Text>
          </View>
        </View>
      ))}

      {/* Upcoming Events */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Upcoming Events
      </Text>
      {mockEvents.map((event) => (
        <View key={event.id} style={[styles.eventCard, { backgroundColor: colors.card }]}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Calendar size={16} color={colors.primary} />
            <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
              {"  "}
              {event.date}
            </Text>
          </View>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {event.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MapPin size={16} color={colors.warning} />
            <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
              {"  "}
              {event.location}
            </Text>
          </View>
        </View>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 20,
  },
  title: { fontSize: 32, fontWeight: "bold" },
  subtitle: { fontSize: 15, marginTop: 4, lineHeight: 20 },
  searchBar: {
    marginHorizontal: 24,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
  },
  categoryRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 18,
    marginHorizontal: 24,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },
  image: { width: "100%", height: 160 },
  cardText: { padding: 16 },
  clubName: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  clubTagline: { fontSize: 14, lineHeight: 20 },
  eventCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  eventDate: { fontSize: 13 },
  eventTitle: { fontSize: 16, fontWeight: "700", marginVertical: 6 },
  eventLocation: { fontSize: 13 },
});
