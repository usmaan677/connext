import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import {
  ArrowLeft,
  BarChart2,
  Camera,
  MapPin,
  Navigation,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Post() {
  const { colors } = useTheme();

  /* ===================== STATE ===================== */
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [isPosting, setIsPosting] = useState(false);

  // Poll
  const [isPoll, setIsPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);

  // Location
  const [location, setLocation] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [debounce, setDebounce] = useState(null);

  const canPost =
    caption.trim().length > 0 || images.length > 0 || isPoll;

  /* ===================== PERMISSIONS ===================== */
  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync();
  }, []);

  /* ===================== IMAGE PICKER ===================== */
  const pickImages = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      quality: 0.9,
    });

    if (!res.canceled) {
      setImages((prev) =>
        [...prev, ...res.assets.map((a) => a.uri)].slice(0, 10)
      );
    }
  };

  const removeImage = (i) =>
    setImages((p) => p.filter((_, idx) => idx !== i));

  /* ===================== LOCATION AUTOCOMPLETE ===================== */
  const searchLocation = (text) => {
    setQuery(text);
    if (debounce) clearTimeout(debounce);

    if (text.length < 3) {
      setResults([]);
      return;
    }

    setDebounce(
      setTimeout(async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${text}`
          );
          const data = await res.json();
          setResults(data.slice(0, 6));
        } catch (e) {
          console.log("Location search error", e);
        }
      }, 350)
    );
  };

  /* ===================== USE CURRENT LOCATION ===================== */
  const useCurrentLocation = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission denied");
      return;
    }

    const pos = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = pos.coords;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const data = await res.json();

    setLocation(data.display_name);
    setShowSearch(false);
    setQuery("");
    setResults([]);
  };

  /* ===================== POLL HELPERS ===================== */
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions((p) => [...p, ""]);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length <= 2) {
      // If only 2 options left, remove the whole poll
      resetPoll();
    } else {
      setPollOptions((p) => p.filter((_, i) => i !== index));
    }
  };


  const resetPoll = () => {
    setIsPoll(false);
    setPollOptions(["", ""]);
  };

  /* ===================== SHARE POST ===================== */
  const handleShare = async () => {
    if (!canPost) return;
    setIsPosting(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) throw new Error();

      const { error } = await supabase.from("posts").insert({
        caption,
        images,
        is_poll: isPoll,
        poll_options: isPoll
          ? pollOptions.filter((o) => o.trim())
          : null,
        location,
        user_id: auth.user.id,
      });

      if (error) throw error;

      Alert.alert("Posted!");
      setCaption("");
      setImages([]);
      resetPoll();
      setLocation(null);
    } catch {
      Alert.alert("Error", "Failed to post");
    } finally {
      setIsPosting(false);
    }
  };

  /* ===================== STYLES ===================== */
  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 14,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.border,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },

    share: {
      fontWeight: "700",
      color: canPost ? colors.accent : colors.textMuted,
    },

    card: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginTop: 18,
      padding: 16,
      borderRadius: 22,
    },

    input: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.textPrimary,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },

    sectionText: {
      color: colors.textSecondary,
      fontWeight: "600",
    },

    optionRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 10,
    },

    removeBtn: {
      backgroundColor: "rgba(255,255,255,0.08)",
      padding: 8,
      borderRadius: 12,
    },

    imageBox: {
      height: width * 0.7,
      margin: 20,
      borderRadius: 22,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },

    muted: {
      color: colors.textMuted,
    },
  });

  /* ===================== RENDER ===================== */
  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={s.header}>
        <ArrowLeft size={22} color={colors.textPrimary} />
        <Text style={s.title}>Create Post</Text>
        <TouchableOpacity
          disabled={!canPost || isPosting}
          onPress={handleShare}
        >
          <Text style={s.share}>
            {isPosting ? "Posting…" : "Share"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ADD PHOTOS */}
        <TouchableOpacity style={s.imageBox} onPress={pickImages}>
          <Camera size={34} color={colors.accent} />
          <Text style={s.muted}>Add photos</Text>
        </TouchableOpacity>

        {/* CAPTION */}
        <View style={s.card}>
          <TextInput
            placeholder="Write something..."
            placeholderTextColor={colors.textMuted}
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={300}
            style={[s.input, { minHeight: 90 }]}
          />
          <Text style={[s.muted, { alignSelf: "flex-end", marginTop: 6 }]}>
            {caption.length}/300
          </Text>
        </View>

        {/* POLL */}
        <View style={s.card}>
          <TouchableOpacity
            style={s.sectionHeader}
            onPress={() => setIsPoll(!isPoll)}
          >
            <BarChart2 size={18} color={colors.textSecondary} />
            <Text style={s.sectionText}>
              {isPoll ? "Edit Poll" : "Create Poll"}
            </Text>
          </TouchableOpacity>

          {isPoll &&
            pollOptions.map((opt, i) => (
              <View key={i} style={s.optionRow}>
                <TextInput
                  placeholder={`Option ${i + 1}`}
                  placeholderTextColor={colors.textMuted}
                  value={opt}
                  onChangeText={(t) =>
                    setPollOptions((p) =>
                      p.map((o, idx) => (idx === i ? t : o))
                    )
                  }
                  style={[s.input, { flex: 1 }]}
                />

                {/* X IS ALWAYS VISIBLE */}
                <TouchableOpacity
                  style={s.removeBtn}
                  onPress={() => removePollOption(i)}
                >
                  <X size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}


          {isPoll && pollOptions.length < 4 && (
            <TouchableOpacity onPress={addPollOption}>
              <Text style={{ color: colors.accent, marginTop: 12 }}>
                + Add option
              </Text>
            </TouchableOpacity>
          )}

          {isPoll && (
            <TouchableOpacity onPress={resetPoll}>
              <Text style={{ color: "#EF4444", marginTop: 12 }}>
                Remove poll
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* LOCATION */}
        <View style={s.card}>
          <TouchableOpacity
            style={s.sectionHeader}
            onPress={() => setShowSearch(!showSearch)}
          >
            <MapPin size={18} color={colors.accent} />
            <Text
              style={{
                color: location ? colors.textPrimary : colors.textMuted,
                fontWeight: location ? "600" : "400",
              }}
            >
              {location || "Add location"}
            </Text>
          </TouchableOpacity>

          {showSearch && (
            <>
              <TouchableOpacity
                style={[s.optionRow, { marginBottom: 8 }]}
                onPress={useCurrentLocation}
              >
                <Navigation size={16} color={colors.accent} />
                <Text style={{ color: colors.accent }}>
                  Use current location
                </Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Search city, venue, or place"
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={searchLocation}
                style={s.input}
              />

              {results.map((r) => (
                <TouchableOpacity
                  key={r.place_id}
                  style={{ paddingVertical: 10 }}
                  onPress={() => {
                    setLocation(r.display_name);
                    setShowSearch(false);
                    setQuery("");
                    setResults([]);
                  }}
                >
                  <Text style={s.muted}>{r.display_name}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>
    </View>
  );
}
