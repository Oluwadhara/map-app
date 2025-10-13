import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList, Image, Linking,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import unnamed from "../../MapApp/assets/images/unnamed.jpg";
import olumo from "../assets/images/olumo.jpg";

// 🌍 Dummy tourist destinations in Nigeria
const destinations = [
  {
    id: "1",
    name: "Lekki Conservation Centre",
    location: "Lagos, NG",
    latitude: 6.4419,
    longitude: 3.5363,
    image:
      unnamed,
    category: "Parks",
    description:
      "Experience Nigeria’s longest canopy walkway, lush greenery, and wildlife at Lekki Conservation Centre — a serene escape from city life.",
    rating: 4.7,
  },
  {
    id: "2",
    name: "Zuma Rock",
    location: "Abuja, NG",
    latitude: 9.1246,
    longitude: 7.2067,
    image:
      unnamed,
    category: "Mountains",
    description:
      "Zuma Rock, known as the 'Gateway to Abuja', is a natural monolith and a symbol of strength and culture in northern Nigeria.",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Olumo Rock",
    location: "Abeokuta, NG",
    latitude: 7.1607,
    longitude: 3.3483,
    image:
      olumo,
    category: "Historic Sites",
    description:
      "Climb the famous Olumo Rock for panoramic views of Abeokuta and discover caves used during the Egba war.",
    rating: 4.8,
  },
  {
    id: "4",
    name: "Yankari National Park",
    location: "Bauchi, NG",
    latitude: 9.75,
    longitude: 10.5,
    image:
      unnamed,
    category: "Wildlife",
    description:
      "A vast wildlife reserve with elephants, lions, and warm Wikki springs — one of Nigeria’s top safari destinations.",
    rating: 4.6,
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [driverPosition, setDriverPosition] = useState({
    latitude: 6.5244,
    longitude: 3.3792, // Lagos default
  });

  const screenHeight = Dimensions.get("window").height;
  const bottomSheetY = useRef(new Animated.Value(screenHeight * 0.75)).current; // collapsed
  const expandedY = screenHeight * 0.4;
  const collapsedY = screenHeight * 0.75;

  const driverAnim = useRef(
    new AnimatedRegion({
      latitude: driverPosition.latitude,
      longitude: driverPosition.longitude,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    })
  ).current;

  // 🎯 Pan gesture for dragging up/down
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        bottomSheetY.setValue(
          Math.min(Math.max(expandedY, collapsedY + gestureState.dy), collapsedY)
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldExpand = gestureState.dy < 0;
        Animated.spring(bottomSheetY, {
          toValue: shouldExpand ? expandedY : collapsedY,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Location permission denied", ToastAndroid.LONG);
        return;
      }

      try {
        const current = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(current);
      } catch {
        ToastAndroid.show("Using Lagos as default location", ToastAndroid.LONG);
      }
    })();
  }, []);

  const handleNavigate = (dest: any) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${dest.latitude},${dest.longitude}`,
      android: `google.navigation:q=${dest.latitude},${dest.longitude}`,
    });
    Linking.openURL(url!);
  };

  const mapRegion = {
    latitude: location?.coords.latitude ?? 6.5244,
    longitude: location?.coords.longitude ?? 3.3792,
    latitudeDelta: 4,
    longitudeDelta: 4,
  };

  const similarPlaces = selectedDest
    ? destinations.filter(
        (d) =>
          d.category === selectedDest.category && d.id !== selectedDest.id
      )
    : [];

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={mapRegion}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You"
            pinColor="blue"
          />
        )}
        <Marker.Animated coordinate={driverAnim} title="Driver" pinColor="red" />
        {destinations.map((dest) => (
          <Marker
            key={dest.id}
            coordinate={{
              latitude: dest.latitude,
              longitude: dest.longitude,
            }}
            title={dest.name}
            description={dest.location}
            onPress={() => {
              setSelectedDest(dest);
              Animated.spring(bottomSheetY, {
                toValue: collapsedY,
                useNativeDriver: false,
              }).start();
            }}
          />
        ))}
      </MapView>

      {selectedDest && (
        <Animated.View
          style={[styles.bottomSheet, { top: bottomSheetY }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.dragHandle} />
          <View style={styles.sheetContent}>
            <Image
              source={selectedDest.image}
              style={styles.image}
            />
            <Text style={styles.title}>{selectedDest.name}</Text>
            <Text style={styles.location}>{selectedDest.location}</Text>
            <Text style={styles.description}>{selectedDest.description}</Text>

            <TouchableOpacity
              style={styles.navigateBtn}
              onPress={() => handleNavigate(selectedDest)}
            >
              <Text style={styles.navigateText}>Head to this destination</Text>
            </TouchableOpacity>

            {similarPlaces.length > 0 && (
              <>
                <Text style={styles.similarTitle}>Similar Places</Text>
                <FlatList
                  data={similarPlaces}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.similarCard}
                      onPress={() => setSelectedDest(item)}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.similarImage}
                      />
                      <Text style={styles.similarName}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    paddingBottom: 20,
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#CBD5E1",
    alignSelf: "center",
    borderRadius: 3,
    marginVertical: 6,
  },
  sheetContent: { paddingHorizontal: 16 },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  title: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginTop: 8 },
  location: { color: "#64748B", fontSize: 13, marginBottom: 6 },
  description: { fontSize: 13, color: "#475569", lineHeight: 18 },
  navigateBtn: {
    backgroundColor: "#2563EB",
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  navigateText: { color: "#fff", fontWeight: "600" },
  similarTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  similarCard: {
    marginTop: 8,
    marginRight: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 6,
    width: 110,
    alignItems: "center",
  },
  similarImage: {
    width: 100,
    height: 70,
    borderRadius: 8,
  },
  similarName: {
    fontSize: 12,
    color: "#334155",
    textAlign: "center",
    marginTop: 4,
  },
});
