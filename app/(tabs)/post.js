import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Camera, ChevronDown, Image as ImageIcon, MapPin, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Post() {
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

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between pt-16 px-4 pb-3 border-b border-slate-200 bg-white">
        <TouchableOpacity className="w-8">
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        
        <Text className="text-slate-800 text-base font-semibold">New post</Text>
        
        <TouchableOpacity 
          className={`px-3 py-1.5 rounded-lg ${isPosting ? 'opacity-50' : ''}`}
          onPress={handleShare}
          disabled={isPosting}
          style={isPosting ? {} : { backgroundColor: '#3B82F6' }}
        >
          <Text className={`text-base font-semibold ${isPosting ? 'text-slate-400' : 'text-white'}`}>
            {isPosting ? 'Sharing...' : 'Share'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Image Area */}
        {selectedImages.length > 0 ? (
          <View className="relative">
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              style={{ height: width }}
            >
              {selectedImages.map((image, index) => (
                <View key={index} className="relative" style={{ width, height: width }}>
                  <Image source={{ uri: image }} className="w-full h-full bg-slate-100" />
                  <TouchableOpacity 
                    className="absolute top-3 right-3 bg-black/60 rounded-full w-8 h-8 items-center justify-center"
                    onPress={() => removeImage(index)}
                  >
                    <X size={16} color="#fff" />
                  </TouchableOpacity>
                  {/* Image number indicator */}
                  <View className="absolute bottom-3 left-3 bg-black/60 rounded-xl px-2 py-1">
                    <Text className="text-white text-xs font-medium">{index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            
            {/* Multiple images indicator and controls */}
            <View className="absolute bottom-3 right-3 flex-row items-center">
              {selectedImages.length > 1 && (
                <View className="bg-black/60 rounded-xl px-2 py-1 mr-2">
                  <Text className="text-white text-xs font-medium">{selectedImages.length} photos</Text>
                </View>
              )}
              
              {/* Add more photos button */}
              {selectedImages.length < 10 && (
                <TouchableOpacity 
                  className="bg-blue-500 rounded-xl px-2 py-1"
                  onPress={pickImages}
                >
                  <Text className="text-white text-xs font-medium">+ Add</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Image thumbnails strip */}
            {selectedImages.length > 1 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="absolute bottom-0 left-0 right-0 bg-black/60 py-2"
                contentContainerStyle={{ paddingHorizontal: 8 }}
              >
                {selectedImages.map((image, index) => (
                  <TouchableOpacity 
                    key={index}
                    className="mr-2 relative"
                  >
                    <Image source={{ uri: image }} className="w-15 h-15 rounded-lg bg-slate-100" />
                    <TouchableOpacity 
                      className="absolute top-1 right-1 bg-black/60 rounded-full w-6 h-6 items-center justify-center"
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
          <TouchableOpacity className="justify-center items-center bg-slate-100 border-b border-slate-200" style={{ height: width }} onPress={pickImages}>
            <View className="items-center">
              <View className="w-20 h-20 rounded-full bg-slate-200 items-center justify-center mb-4">
                <Camera size={32} color="#64748B" />
              </View>
              <Text className="text-slate-600 text-base">Tap to add photos</Text>
              <Text className="text-slate-400 text-sm mt-1">Add up to 10 photos</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Change/Add Photo Button */}
        {selectedImages.length > 0 && (
          <View className="border-b border-slate-200 bg-white">
            <TouchableOpacity className="flex-row items-center justify-center py-3" onPress={pickImages}>
              <ImageIcon size={16} color="#3B82F6" />
              <Text className="text-blue-500 text-sm ml-1.5">
                {selectedImages.length < 10 ? 'Add more photos' : 'Change photos'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Caption Input */}
        <View className="p-4 border-b border-slate-200 bg-white">
          <Text className="text-slate-800 text-sm font-medium mb-2">Caption</Text>
          <TextInput
            className="text-slate-800 text-base min-h-10"
            placeholder="Write a caption..."
            placeholderTextColor="#94A3B8"
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={2200}
          />
        </View>

        {/* Advanced Options Toggle */}
        <TouchableOpacity 
          className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200 bg-white"
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text className="text-slate-800 text-base">Advanced settings</Text>
          <ChevronDown 
            size={16} 
            color="#64748B" 
            className={showAdvanced ? 'rotate-180' : ''} 
          />
        </TouchableOpacity>

        {/* Advanced Options */}
        {showAdvanced && (
          <View className="bg-slate-50">
            {/* Add Location */}
            <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-slate-200 bg-white">
              <MapPin size={20} color="#64748B" />
              <View className="flex-1 ml-3">
                <Text className="text-slate-800 text-base">Add location</Text>
                {location ? (
                  <Text className="text-blue-500 text-sm mt-0.5">{location}</Text>
                ) : (
                  <TextInput
                    className="text-slate-500 text-sm mt-0.5"
                    placeholder="Where was this taken?"
                    placeholderTextColor="#94A3B8"
                    value={location}
                    onChangeText={setLocation}
                  />
                )}
              </View>
            </TouchableOpacity>

            {/* Tag People */}
            <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-slate-200 bg-white">
              <View className="w-5 h-5 items-center justify-center">
                <Text className="text-slate-600 text-base font-bold">@</Text>
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-800 text-base">Tag people</Text>
              </View>
            </TouchableOpacity>

            {/* Add Alt Text */}
            <TouchableOpacity className="flex-row items-center px-4 py-4 border-b border-slate-200 bg-white">
              <View className="w-5 h-5 items-center justify-center">
                <Text className="text-slate-600 text-xs font-bold">Alt</Text>
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-slate-800 text-base">Write alt text</Text>
                <Text className="text-slate-500 text-sm mt-0.5">More accessible</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}