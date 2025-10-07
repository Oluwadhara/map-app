import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function StaticTourGuide() {
  const tourSpots = [
    {
      id: 1,
      title: "National Museum",
      description: "A must-see cultural landmark.",
      latitude: 6.603,
      longitude: 3.275,
    },
    {
      id: 2,
      title: "Freedom Park",
      description: "Relax and enjoy the outdoors.",
      latitude: 6.607,
      longitude: 3.28,
    },
    {
      id: 3,
      title: "Local Restaurant",
      description: "Try authentic Nigerian dishes.",
      latitude: 6.61,
      longitude: 3.277,
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.606951760180734,
          longitude: 3.2788709931957953,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {tourSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.title}
            description={spot.description}
            pinColor="purple"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
});
