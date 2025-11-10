import { useTheme } from "@/contexts/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  Camera,
  MapPin,
  X
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
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
  const [caption, setCaption] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [location, setLocation] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [links, setLinks] = useState([""]);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cam.status !== "granted" || lib.status !== "granted") {
      Alert.alert("Permissions Required", "Enable camera and library access.");
    }
  };

  const pickImages = () => {
    Alert.alert("Add Photo", "", [
      { text: "Camera", onPress: takePhoto },
      { text: "Library", onPress: pickFromLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0])
      setSelectedImages([result.assets[0].uri]);
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10,
      quality: 0.8,
    });
    if (!result.canceled && result.assets) {
      const newImgs = result.assets.map((a) => a.uri);
      setSelectedImages((prev) => [...prev, ...newImgs].slice(0, 10));
    }
  };

  const removeImage = (index) =>
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

  const handleShare = () => {
    if (
      !caption.trim() &&
      selectedImages.length === 0 &&
      !pollQuestion.trim() &&
      links.every((l) => !l.trim())
    ) {
      Alert.alert("Nothing to post", "Add content before sharing.");
      return;
    }
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      Alert.alert("Shared!", "Your post has been uploaded.");
      setCaption("");
      setSelectedImages([]);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setLinks([""]);
      setLocation("");
    }, 1200);
  };

  const addOption = () => setPollOptions([...pollOptions, ""]);
  const removeOption = (i) =>
    setPollOptions(pollOptions.filter((_, idx) => idx !== i));
  const handleOptionChange = (i, text) => {
    const updated = [...pollOptions];
    updated[i] = text;
    setPollOptions(updated);
  };

  const addLink = () => setLinks([...links, ""]);
  const removeLink = (i) => setLinks(links.filter((_, idx) => idx !== i));
  const handleLinkChange = (i, text) => {
    const updated = [...links];
    updated[i] = text;
    setLinks(updated);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 64,
      paddingHorizontal: 20,
      paddingBottom: 14,
      borderBottomWidth: 0.6,
      borderBottomColor: colors.border,
      backgroundColor: colors.header,
    },
    title: { fontWeight: "700", color: colors.text, fontSize: 18 },
    shareBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 14,
      shadowColor: colors.primary,
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    shareText: { color: "#fff", fontWeight: "600" },
    scroll: { flex: 1 },

    imageCard: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    placeholder: {
      height: width * 0.85,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
    },
    placeholderIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },
    placeholderText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
      textAlign: "center",
    },
    image: {
      width: "100%",
      height: width * 0.9,
      resizeMode: "cover",
    },
    removeBtn: {
      position: "absolute",
      top: 16,
      right: 16,
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: 6,
      borderRadius: 20,
    },

    sectionCard: {
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginTop: 18,
      padding: 16,
      borderRadius: 20,
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontWeight: "700",
      fontSize: 16,
      color: colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },

    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 10,
    },
    locationInput: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
      marginLeft: 10,
    },
    useCurrentBtn: {
      alignSelf: "flex-start",
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    useCurrentText: { color: colors.primary, fontWeight: "600", fontSize: 14 },

    pollRow: { flexDirection: "row", alignItems: "center" },
    pollInput: { flex: 1, marginRight: 8 },
    removeOption: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 6,
    },
    addOptionBtn: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: "center",
      marginTop: 4,
    },
    addOptionText: {
      color: colors.primary,
      fontWeight: "600",
      fontSize: 14,
    },

    linkRow: { flexDirection: "row", alignItems: "center" },
    linkInput: { flex: 1, marginRight: 8 },
    removeLink: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 6,
    },
    addLinkBtn: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 8,
      alignItems: "center",
      marginTop: 4,
    },
    addLinkText: { color: colors.primary, fontWeight: "600" },
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.title}>Create Post</Text>
        <TouchableOpacity
          style={[s.shareBtn, isPosting && { opacity: 0.5 }]}
          onPress={handleShare}
          disabled={isPosting}
        >
          <Text style={s.shareText}>{isPosting ? "Posting..." : "Share"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* IMAGES */}
        <View style={s.imageCard}>
          {selectedImages.length ? (
            <ScrollView horizontal pagingEnabled>
              {selectedImages.map((img, i) => (
                <View key={i}>
                  <Image source={{ uri: img }} style={s.image} />
                  <TouchableOpacity
                    style={s.removeBtn}
                    onPress={() => removeImage(i)}
                  >
                    <X size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={s.placeholder} onPress={pickImages}>
              <View style={s.placeholderIcon}>
                <Camera size={30} color={colors.textSecondary} />
              </View>
              <Text style={s.placeholderText}>Tap to add up to 10 photos</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CAPTION */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Caption</Text>
          <TextInput
            placeholder="Write something inspiring..."
            placeholderTextColor={colors.textTertiary}
            value={caption}
            onChangeText={setCaption}
            style={s.input}
            multiline
          />
        </View>

        {/* LOCATION */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Add Location</Text>
          <View style={s.locationRow}>
            <MapPin size={20} color={colors.textSecondary} />
            <TextInput
              placeholder="Where was this taken?"
              placeholderTextColor={colors.textTertiary}
              value={location}
              onChangeText={setLocation}
              style={s.locationInput}
            />
          </View>
          <TouchableOpacity
            style={s.useCurrentBtn}
            onPress={() => setLocation("University of Houston")}
          >
            <Text style={s.useCurrentText}>Use Current Location</Text>
          </TouchableOpacity>
        </View>

        {/* POLL */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Poll</Text>
          <TextInput
            placeholder="Ask a question..."
            placeholderTextColor={colors.textTertiary}
            value={pollQuestion}
            onChangeText={setPollQuestion}
            style={s.input}
          />
          {pollOptions.map((opt, i) => (
            <View key={i} style={s.pollRow}>
              <TextInput
                placeholder={`Option ${i + 1}`}
                placeholderTextColor={colors.textTertiary}
                value={opt}
                onChangeText={(t) => handleOptionChange(i, t)}
                style={[s.input, s.pollInput]}
              />
              <TouchableOpacity
                onPress={() => removeOption(i)}
                style={s.removeOption}
              >
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
          {pollOptions.length < 5 && (
            <TouchableOpacity style={s.addOptionBtn} onPress={addOption}>
              <Text style={s.addOptionText}>+ Add Option</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* LINKTREE */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Add Links</Text>
          {links.map((link, i) => (
            <View key={i} style={s.linkRow}>
              <TextInput
                placeholder="https://example.com"
                placeholderTextColor={colors.textTertiary}
                value={link}
                onChangeText={(t) => handleLinkChange(i, t)}
                style={[s.input, s.linkInput]}
              />
              <TouchableOpacity
                onPress={() => removeLink(i)}
                style={s.removeLink}
              >
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
          {links.length < 5 && (
            <TouchableOpacity style={s.addLinkBtn} onPress={addLink}>
              <Text style={s.addLinkText}>+ Add Another Link</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}
