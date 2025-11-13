import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system"; // base64 upload fix
import * as ImagePicker from "expo-image-picker";
import {
  ArrowLeft,
  Camera,
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
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]) {
      setSelectedImages([result.assets[0].uri]);
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      setSelectedImages([result.assets[0].uri]);
    }
  };

  const removeImage = () =>
    setSelectedImages([]);

  // --------------------------------
  // 🚀 HANDLE SHARE → SAVE TO SUPABASE
  // --------------------------------
  const handleShare = async () => {
    if (isPosting) return;

    if (selectedImages.length === 0) {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    setIsPosting(true);

    try {
      // 1️⃣ GET LOGGED-IN USER
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) throw new Error("Not logged in.");

      const userId = user.id;
      const fullName = user.user_metadata.full_name || "Unknown";

      // 2️⃣ READ IMAGE AS BASE64
      const imageUri = selectedImages[0];

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `${userId}-${Date.now()}.jpg`;

      // 3️⃣ UPLOAD TO SUPABASE
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, Buffer.from(base64, "base64"), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      // 4️⃣ GET PUBLIC URL
      const { data: pub } = supabase
        .storage
        .from("post-images")
        .getPublicUrl(uploadData.path);

      const imageUrl = pub.publicUrl;

      // 5️⃣ INSERT TO POSTS TABLE
      const { error: insertError } = await supabase.from("posts").insert({
        caption,
        photo_url: imageUrl,
        full_name: fullName,
        user_id: userId,
      });

      if (insertError) throw insertError;

      Alert.alert("Success!", "Your post has been shared.");

      // Reset UI
      setCaption("");
      setSelectedImages([]);

    } catch (err) {
      console.log("POST ERROR:", err);
      Alert.alert("Upload error", err.message);
    }

    setIsPosting(false);
  };

  // --------------------------------
  // UI STYLES
  // --------------------------------
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
          <Text style={s.shareText}>
            {isPosting ? "Posting..." : "Share"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll}>

        {/* IMAGE AREA */}
        <View style={s.imageCard}>
          {selectedImages.length ? (
            <View>
              <Image source={{ uri: selectedImages[0] }} style={s.image} />
              <TouchableOpacity style={s.removeBtn} onPress={removeImage}>
                <X size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={s.placeholder} onPress={pickImages}>
              <View style={s.placeholderIcon}>
                <Camera size={30} color={colors.textSecondary} />
              </View>
              <Text style={s.placeholderText}>
                Tap to add a photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CAPTION */}
        <View style={s.sectionCard}>
          <Text style={s.sectionTitle}>Caption</Text>
          <TextInput
            placeholder="Write something..."
            placeholderTextColor={colors.textTertiary}
            value={caption}
            onChangeText={setCaption}
            style={s.input}
            multiline
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}
