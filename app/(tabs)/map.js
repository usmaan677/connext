import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import PagerView from "react-native-pager-view";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const locations = [
  {
    id: 1,
    name: "Run4Palestine",
    latitude: 29.7214,
    longitude: -95.3419,
    post: {
      username: "umr_houston",
      avatar: "https://picsum.photos/40/40?random=3",
      caption:
        "We’re so excited to see everyone this Sunday for Run4Palestine! ❤️ All proceeds go toward humanitarian aid for families in Gaza. Don’t forget to bring your water bottles and good vibes 🇵🇸.",
      image: require("../../assets/images/umrflyer.png"),
      ig: "https://www.instagram.com/umr_houston/",
    },
  },
  {
    id: 2,
    name: "UH CS Club Workshop",
    latitude: 29.7205,
    longitude: -95.3412,
    post: {
      username: "uh_cs_club",
      avatar: "https://picsum.photos/40/40?random=5",
      caption:
        "Join us for our weekly coding workshop! 🚀 Bring your laptops and dive into hands-on programming with peers.",
      image: { uri: "https://picsum.photos/340/340?random=1" },
      ig: "https://www.instagram.com/uh_cs_club/",
    },
  },
];

const INITIAL_REGION = {
  latitude: 29.7199,
  longitude: -95.3422,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MapScreen() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [activeMarker, setActiveMarker] = useState(0);
  const mapRef = useRef(null);
  const modalizeRef = useRef(null);
  const pagerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") setHasLocationPermission(true);
      else Alert.alert("Location Permission Required", "Please enable location access.");
    })();
  }, []);

  const handleMarkerPress = async (index) => {
    setActiveMarker(index);
    modalizeRef.current?.open();

    const loc = locations[index];
    if (mapRef.current && loc) {
      const currentCamera = await mapRef.current.getCamera();
      mapRef.current.animateCamera({
        center: { latitude: loc.latitude, longitude: loc.longitude },
        zoom: currentCamera.zoom,
      });
    }

    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e) => {
    const index = e.nativeEvent.position;
    setActiveMarker(index);
    const loc = locations[index];
    if (mapRef.current && loc) {
      mapRef.current.animateToRegion({
        latitude: loc.latitude,
        longitude: loc.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={INITIAL_REGION}
        provider={Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        showsUserLocation={hasLocationPermission}
      >
        {locations.map((loc, index) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            onPress={() => handleMarkerPress(index)}
          >
            <Image
              source={loc.post.image}
              style={{
                width: 55,
                height: 55,
                borderRadius: 28,
                borderWidth: 2,
                borderColor: activeMarker === index ? "#ff5252" : "#fff",
              }}
            />
          </Marker>
        ))}
      </MapView>

      {/* MODAL SHEET */}
      <Modalize
        ref={modalizeRef}
        snapPoint={SCREEN_HEIGHT * 0.35}
        modalHeight={SCREEN_HEIGHT * 0.85}
        overlayStyle={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        handleStyle={{ backgroundColor: "#555" }}
        modalStyle={styles.bottomSheet}
        onClosed={() => setActiveMarker(null)}
      >
        <PagerView
          ref={pagerRef}
          style={{ flex: 1, height: SCREEN_HEIGHT * 0.85 }}
          initialPage={0}
          onPageSelected={handlePageSelected}
        >
          {locations.map((loc, index) => (
            <ScrollView
              key={loc.id}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 60 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Close Button */}
              <Pressable
                style={styles.closeBtn}
                onPress={() => modalizeRef.current?.close()}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </Pressable>

              {/* Title */}
              <Text style={styles.cardTitle}>{loc.name}</Text>

              {/* Post */}
              <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                  <Image
                    source={{ uri: loc.post.avatar }}
                    style={styles.userAvatar}
                  />
                  <Text style={styles.postUsername}>@{loc.post.username}</Text>
                </View>

                <Image source={loc.post.image} style={styles.postImage} />

                <Text style={styles.postCaption}>
                  <Text style={{ fontWeight: "700", color: "#fff" }}>
                    {loc.post.username}
                  </Text>{" "}
                  {loc.post.caption}
                </Text>

                {/* Buttons */}
                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => {
                      const url = Platform.select({
                        ios: `http://maps.apple.com/?daddr=${loc.latitude},${loc.longitude}`,
                        android: `geo:${loc.latitude},${loc.longitude}?q=${loc.name}`,
                      });
                      Linking.openURL(url);
                    }}
                  >
                    <Ionicons name="navigate" size={20} color="#fff" />
                    <Text style={styles.actionLabel}>Directions</Text>
                  </Pressable>

                  <Pressable
                    style={styles.actionButton}
                    onPress={() => Linking.openURL(loc.post.ig)}
                  >
                    <Ionicons name="logo-instagram" size={20} color="#fff" />
                    <Text style={styles.actionLabel}>Instagram</Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          ))}
        </PagerView>
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { ...StyleSheet.absoluteFillObject },
  bottomSheet: {
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 14,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 20,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 16,
  },
  postContainer: {
    backgroundColor: "#222",
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  postUsername: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  postImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  postCaption: {
    color: "#eee",
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
    paddingBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#1c1c1e",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#333",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2c2c2e",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  actionLabel: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});
