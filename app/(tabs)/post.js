import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { decode as atob } from "base-64";
import * as FileSystem from "expo-file-system/legacy";

import * as ImagePicker from "expo-image-picker";

import { ArrowLeft, Camera, X } from "lucide-react-native";
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

  // ============================================================
  // PERMISSIONS
  // ============================================================
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

  // ============================================================
  // PICK IMAGES
  // ============================================================
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
      quality: 0.9,
    });

    if (!result.canceled) {
      setSelectedImages([result.assets[0].uri]);
    }
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      const newImgs = result.assets.map((a) => a.uri);
      setSelectedImages((prev) => [...prev, ...newImgs].slice(0, 10));
    }
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ============================================================
  // FIXED BASE64 → BINARY CONVERTER (RN SAFE)
  // ============================================================
  function decodeBase64(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  }

  // ============================================================
  // UPLOAD TO SUPABASE
  // ============================================================
  async function uploadImageToSupabase(uri, index) {
    try {
      const fileData = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `post_${Date.now()}_${index}.jpg`;

      const arrayBuffer = decodeBase64(fileData);

      const { data, error } = await supabase.storage
        .from("post-images")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (error) {
        console.log("SUPABASE STORAGE ERROR:", error);
        return null;
      }

      const { data: url } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);

      return url.publicUrl;
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
      return null;
    }
  }


  // ============================================================
  // HANDLE SHARE
  // ============================================================
  const handleShare = async () => {
    setIsPosting(true);

    try {
      console.log("👉 getUser start");

      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log("👉 getUser result:", JSON.stringify({ userData, userError }, null, 2));

      if (!userData?.user) {
        Alert.alert("Error", "You must be logged in.");
        setIsPosting(false);
        return;
      }


      const user = userData.user;

      console.log("👉 starting uploads");
      const uploadedUrls = [];

      for (let i = 0; i < selectedImages.length; i++) {
        console.log("   ⬆️ uploading image", i, selectedImages[i]);
        const url = await uploadImageToSupabase(selectedImages[i], i);
        console.log("   ⬆️ result image", i, url);
        if (!url) {
          Alert.alert("Upload error", "One of the images failed to upload.");
          setIsPosting(false);
          return;
        }
        uploadedUrls.push(url);
      }

      console.log("👉 inserting post with URLs:", uploadedUrls);
      const { error: insertError } = await supabase.from("posts").insert({
        caption,
        images: uploadedUrls,
        user_id: user.id,
        full_name: profile?.full_name || "Unknown",
        photo_url: profile?.photo_url || null,
      });

      console.log("👉 insert result:", insertError);
      if (insertError) {
        Alert.alert("Error", insertError.message);
        setIsPosting(false);
        return;
      }

      Alert.alert("Posted!", "Your post has been uploaded.");
      setCaption("");
      setSelectedImages([]);
    } catch (e) {
      console.log("🔥 handleShare exception:", e);
      Alert.alert("Error", "Something went wrong while posting.");
    } finally {
      setIsPosting(false);
    }
  };


  // ============================================================
  // STYLES
  // ============================================================
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
      opacity: isPosting ? 0.5 : 1,
    },

    shareText: { color: "#fff", fontWeight: "600" },

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

    image: {
      width: width,
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
      minHeight: 80,
      textAlignVertical: "top",
    },
  });

  // ============================================================
  // RENDER
  // ============================================================
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
          style={s.shareBtn}
          onPress={handleShare}
          disabled={isPosting}
        >
          <Text style={s.shareText}>
            {isPosting ? "Posting..." : "Share"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* IMAGES */}
        <View style={s.imageCard}>
          {selectedImages.length ? (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={{ width: width, height: width * 0.9 }}
            >
              {selectedImages.map((img, index) => (
                <View key={index} style={{ width: width }}>
                  <Image source={{ uri: img }} style={s.image} />

                  <TouchableOpacity
                    style={s.removeBtn}
                    onPress={() => removeImage(index)}
                  >
                    <X size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={s.placeholder} onPress={pickImages}>
              <Camera size={34} color={colors.textSecondary} />
              <Text style={{ color: colors.text, marginTop: 10 }}>
                Tap to add up to 10 photos
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
