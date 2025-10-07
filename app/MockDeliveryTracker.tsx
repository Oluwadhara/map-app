import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { AnimatedRegion, Marker, Polyline } from "react-native-maps";

export default function MockDeliveryTracker() {
  const [userLocation] = useState({
    latitude: 6.606951760180734,
    longitude: 3.2788709931957953,
  });

  const [driverPath, setDriverPath] = useState<any[]>([]);

  const driverAnim = useRef(
    new AnimatedRegion({
      latitude: 6.616, // driver starts a bit farther north
      longitude: 3.27,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    })
  ).current;

  useEffect(() => {
    const interval = setInterval(() => {
      driverAnim.stopAnimation((prev) => {
        if (!prev) return;
        const latDiff = userLocation.latitude - prev.latitude;
        const lonDiff = userLocation.longitude - prev.longitude;

        const newLat = prev.latitude + latDiff * 0.05; // move closer
        const newLon = prev.longitude + lonDiff * 0.05;

        const newPos = { latitude: newLat, longitude: newLon };
        setDriverPath((p) => [...p, newPos]);

        driverAnim.timing({
          toValue: newPos,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* User marker */}
        <Marker coordinate={userLocation} pinColor="blue" title="You" />

        {/* Driver marker */}
        <Marker.Animated coordinate={driverAnim} pinColor="red" title="Driver" />

        {/* Driver path */}
        <Polyline coordinates={driverPath} strokeWidth={4} strokeColor="green" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
});
