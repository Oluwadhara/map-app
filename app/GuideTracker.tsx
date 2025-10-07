import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";

export default function GuideTracker({ route }: any) {
  const { landmark } = route.params;
  
  // Tourist location (fixed for demo)
  const touristLocation = { latitude: 6.606951760180734, longitude: 3.2788709931957953 };

  // Start the guide somewhere far
  const [guidePos, setGuidePos] = useState({ latitude: landmark.latitude + 0.02, longitude: landmark.longitude + 0.02 });

  const guideAnim = useRef(
    new AnimatedRegion({
      latitude: guidePos.latitude,
      longitude: guidePos.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    })
  ).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setGuidePos((prev) => {
        const latDiff = touristLocation.latitude - prev.latitude;
        const lonDiff = touristLocation.longitude - prev.longitude;

        const newLat = prev.latitude + latDiff * 0.05; // 5% closer each tick
        const newLon = prev.longitude + lonDiff * 0.05;

        const newPos = { latitude: newLat, longitude: newLon };

        guideAnim.timing({
          toValue: newPos,
          duration: 1000,
          useNativeDriver: false,
        }).start();

        return newPos;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: touristLocation.latitude,
          longitude: touristLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Tourist */}
        <Marker coordinate={touristLocation} title="You (Tourist)" pinColor="blue" />

        {/* Landmark */}
        <Marker coordinate={{ latitude: landmark.latitude, longitude: landmark.longitude }} title={landmark.name} pinColor="purple" />

        {/* Guide */}
        <Marker.Animated coordinate={guideAnim} title="Tour Guide" pinColor="red" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
});
