import { locationList } from "../../constants/LocationList";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import PagerView from "react-native-pager-view";

const INITIAL_REGION = {
  latitude: 29.7199,
  longitude: -95.3422,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function App() {
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [locationIndex, setLocationIndex] = useState(0);
  const [locationSelected, setLocationSelected] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const mapRef = useRef(null);
  const pagerRef = useRef(null);

  // Request location permission
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          setHasLocationPermission(true);
        } else {
          Alert.alert(
            "Location Permission Required",
            "Please enable location permissions to see your position on the map.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
      }
    })();
  }, []);

  // Move camera smoothly to new location (preserve zoom + pitch)
  const moveToLocation = async (index) => {
    if (!mapRef.current) return;
    const loc = locationList[index];
    if (!loc) return;

    try {
      const currentCamera = await mapRef.current.getCamera();
      await mapRef.current.animateCamera({
        center: { latitude: loc.latitude, longitude: loc.longitude },
        zoom: currentCamera.zoom,
        pitch: currentCamera.pitch,
        heading: currentCamera.heading,
      });
      setActiveMarker(index);
    } catch (error) {
      console.warn("Camera move error:", error);
    }
  };

  // When marker is tapped
  const handleMarkerPress = (index) => {
    setLocationSelected(true);
    setLocationIndex(index);
    setActiveMarker(index);
    pagerRef.current?.setPage(index);
    moveToLocation(index);
  };

  // When card swipe changes
  const handlePageSelected = (e) => {
    const index = e.nativeEvent.position;
    setLocationIndex(index);
    setActiveMarker(index);
    moveToLocation(index);
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        mapPadding={{ bottom: locationSelected ? 150 : 0 }}
        initialRegion={INITIAL_REGION}
        provider={Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={hasLocationPermission}
        pitchEnabled
        rotateEnabled
        showsCompass
      >
        {locationList.map((loc, index) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            pinColor={activeMarker === index ? "#ff5252" : "#888"}
            onPress={() => handleMarkerPress(index)}
          />

        ))}
      </MapView>

      {/* Swipe Cards (appear only when marker selected) */}
      {locationSelected && (
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={0}
          onPageSelected={handlePageSelected}
        >
          {locationList.map((loc, index) => (
            <View key={loc.id} style={styles.card}>
              <Text style={styles.cardTitle}>{loc.name}</Text>
              <Text style={styles.cardText}>
                More details, photos, or info about this location.
              </Text>

              <View style={styles.buttonRow}>
                <Button
                  title="Prev"
                  onPress={() => {
                    if (locationIndex > 0) {
                      const newIndex = locationIndex - 1;
                      setLocationIndex(newIndex);
                      pagerRef.current?.setPage(newIndex);
                      moveToLocation(newIndex);
                    }
                  }}
                />
                <Button
                  title="Next"
                  onPress={() => {
                    if (locationIndex < locationList.length - 1) {
                      const newIndex = locationIndex + 1;
                      setLocationIndex(newIndex);
                      pagerRef.current?.setPage(newIndex);
                      moveToLocation(newIndex);
                    }
                  }}
                />
              </View>
            </View>
          ))}
        </PagerView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  map: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  pager: {
    position: "absolute",
    bottom: 80,
    height: 140,
    width: "100%",
    zIndex: 5,
  },
  card: {
    backgroundColor: "#1c1c1c",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    justifyContent: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  cardText: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
