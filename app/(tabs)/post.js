import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, ChevronDown, Image as ImageIcon, MapPin, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
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
    View
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function Post() {
  const { colors } = useTheme();
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [location, setLocation] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Mock data for locations
  const suggestedLocations = [
    'University of Houston',
    'Student Center South',
    'MD Anderson Library',
    'Engineering Building',
    'Business Building'
  ];

  // Request permissions on component mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraResult.status !== 'granted' || mediaLibraryResult.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'We need camera and photo library access to share photos.',
        [{ text: 'OK' }]
      );
    }
  };

  const pickImages = () => {
    Alert.alert(
      "",
      "",
      [
        { text: "Camera", onPress: () => takePhoto() },
        { text: "Library", onPress: () => pickFromLibrary() },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        setSelectedImages([result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not take photo');
    }
  };

  const pickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Allow multiple selection without editing
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => {
          const combined = [...prev, ...newImages];
          return combined.slice(0, 10); // Max 10 images like Instagram
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not access library');
    }
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleShare = async () => {
    if (!caption.trim() && selectedImages.length === 0) {
      Alert.alert("", "Please add a photo or write something");
      return;
    }

    setIsPosting(true);
    
    setTimeout(() => {
      setIsPosting(false);
      Alert.alert("", "Your post has been shared", [
        { text: "OK", onPress: () => {
          setCaption('');
          setSelectedImages([]);
          setLocation('');
          setShowAdvanced(false);
        }}
      ]);
    }, 1500);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 64,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.header,
    },
    headerButton: {
      width: 32,
    },
    headerTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    shareButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    shareButtonDisabled: {
      backgroundColor: colors.surface,
      opacity: 0.6,
    },
    shareButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
    shareButtonTextDisabled: {
      color: colors.textSecondary,
    },
    scrollView: {
      flex: 1,
    },
    imageContainer: {
      position: 'relative',
      height: width,
    },
    imageScrollView: {
      height: width,
    },
    imageWrapper: {
      position: 'relative',
      width: width,
      height: width,
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.surface,
    },
    removeButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 20,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageNumber: {
      position: 'absolute',
      bottom: 12,
      left: 12,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    imageNumberText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '500',
    },
    imageControls: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    imageCount: {
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 8,
    },
    imageCountText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '500',
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    addButtonText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '500',
    },
    thumbnailStrip: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    thumbnailContainer: {
      marginRight: 8,
      position: 'relative',
    },
    thumbnail: {
      width: 60,
      height: 60,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    thumbnailRemove: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 12,
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      height: width,
    },
    placeholderIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    placeholderText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    placeholderSubtext: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 4,
    },
    photoButtonContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    photoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    photoButtonText: {
      color: colors.primary,
      fontSize: 14,
      marginLeft: 6,
      fontWeight: '500',
    },
    captionContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    captionLabel: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    captionInput: {
      color: colors.text,
      fontSize: 16,
      minHeight: 40,
      lineHeight: 22,
    },
    advancedToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    advancedToggleText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    advancedContainer: {
      backgroundColor: colors.background,
    },
    advancedOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    advancedIconContainer: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    advancedIconText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '700',
    },
    advancedTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    advancedTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    advancedSubtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    locationInput: {
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 2,
    },
    locationText: {
      color: colors.primary,
      fontSize: 14,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.header} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>New post</Text>
        
        <TouchableOpacity 
          style={[styles.shareButton, isPosting && styles.shareButtonDisabled]}
          onPress={handleShare}
          disabled={isPosting}
        >
          <Text style={[styles.shareButtonText, isPosting && styles.shareButtonTextDisabled]}>
            {isPosting ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Image Area */}
        {selectedImages.length > 0 ? (
          <View style={styles.imageContainer}>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={styles.imageScrollView}
            >
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                  {/* Image number indicator */}
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            {/* Multiple images indicator and controls */}
            <View style={styles.imageControls}>
              {selectedImages.length > 1 && (
                <View style={styles.imageCount}>
                  <Text style={styles.imageCountText}>{selectedImages.length} photos</Text>
                </View>
              )}
              
              {/* Add more photos button */}
              {selectedImages.length < 10 && (
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={pickImages}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Image thumbnails strip */}
            {selectedImages.length > 1 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.thumbnailStrip}
                contentContainerStyle={{ paddingHorizontal: 8 }}
              >
                {selectedImages.map((image, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.thumbnailContainer}
                  >
                    <Image source={{ uri: image }} style={styles.thumbnail} />
                    <TouchableOpacity 
                      style={styles.thumbnailRemove}
                      onPress={() => removeImage(index)}
                    >
                      <X size={12} color="#fff" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.placeholderContainer} onPress={pickImages}>
            <View>
              <View style={styles.placeholderIconContainer}>
                <Camera size={32} color={colors.textSecondary} />
              </View>
              <Text style={styles.placeholderText}>Tap to add photos</Text>
              <Text style={styles.placeholderSubtext}>Add up to 10 photos</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Change/Add Photo Button */}
        {selectedImages.length > 0 && (
          <View style={styles.photoButtonContainer}>
            <TouchableOpacity style={styles.photoButton} onPress={pickImages}>
              <ImageIcon size={16} color={colors.primary} />
              <Text style={styles.photoButtonText}>
                {selectedImages.length < 10 ? 'Add more photos' : 'Change photos'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Caption Input */}
        <View style={styles.captionContainer}>
          <Text style={styles.captionLabel}>Caption</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor={colors.textTertiary}
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={2200}
          />
        </View>

        {/* Advanced Options Toggle */}
        <TouchableOpacity 
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>Advanced settings</Text>
          <ChevronDown 
            size={16} 
            color={colors.textSecondary} 
            style={{ transform: [{ rotate: showAdvanced ? '180deg' : '0deg' }] }} 
          />
        </TouchableOpacity>

        {/* Advanced Options */}
        {showAdvanced && (
          <View style={styles.advancedContainer}>
            {/* Add Location */}
            <TouchableOpacity style={styles.advancedOption}>
              <MapPin size={20} color={colors.textSecondary} />
              <View style={styles.advancedTextContainer}>
                <Text style={styles.advancedTitle}>Add location</Text>
                {location ? (
                  <Text style={styles.locationText}>{location}</Text>
                ) : (
                  <TextInput
                    style={styles.locationInput}
                    placeholder="Where was this taken?"
                    placeholderTextColor={colors.textTertiary}
                    value={location}
                    onChangeText={setLocation}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Tag People */}
            <TouchableOpacity style={styles.advancedOption}>
              <View style={styles.advancedIconContainer}>
                <Text style={styles.advancedIconText}>@</Text>
              </View>
              <View style={styles.advancedTextContainer}>
                <Text style={styles.advancedTitle}>Tag people</Text>
              </View>
            </TouchableOpacity>

            {/* Add Alt Text */}
            <TouchableOpacity style={styles.advancedOption}>
              <View style={styles.advancedIconContainer}>
                <Text style={[styles.advancedIconText, { fontSize: 12 }]}>Alt</Text>
              </View>
              <View style={styles.advancedTextContainer}>
                <Text style={styles.advancedTitle}>Write alt text</Text>
                <Text style={styles.advancedSubtitle}>More accessible</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}