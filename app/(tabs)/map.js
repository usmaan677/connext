import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

const INITIAL_REGION = {
  latitude: 29.7199,
  longitude: -95.3422,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setHasLocationPermission(true);
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } else {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to see your position on the map.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation={hasLocationPermission}
        showsMyLocationButton={hasLocationPermission}
        showsCompass={true}
        showsScale={true}
        followsUserLocation={false}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width: "100%",
  },
});

