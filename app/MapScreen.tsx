import polyline from "@mapbox/polyline";
import axios from "axios";
import Constants from "expo-constants";
import { Image } from "expo-image";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Linking,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { AnimatedRegion, Marker, Polyline } from "react-native-maps";

// 🌍 Google Maps API Key
const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY;

// 🗺️ Lagos tourist destinations
const destinations = [
  {
    id: "1",
    name: "Lekki Conservation Centre",
    location: "Lagos, NG",
    latitude: 6.4419,
    longitude: 3.5363,
    image: require("../assets/images/lcc.jpg"),
    category: "Parks",
    description:
      "Experience Nigeria’s longest canopy walkway, lush greenery, and wildlife at Lekki Conservation Centre.",
    rating: 4.7,
  },
  {
    id: "2",
    name: "Nike Art Gallery",
    location: "Lagos, NG",
    latitude: 6.4253,
    longitude: 3.4772,
    image: require("../assets/images/nike.jpg"),
    category: "Art",
    description:
      "One of West Africa’s largest art galleries showcasing Nigerian culture and creativity.",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Tarkwa Bay Beach",
    location: "Lagos, NG",
    latitude: 6.3952,
    longitude: 3.3975,
    image: require("../assets/images/tarkwa.jpg"),
    category: "Beaches",
    description:
      "A serene island beach accessible by boat, popular for swimming and picnics.",
    rating: 4.6,
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const driverAnim = useRef(
    new AnimatedRegion({
      latitude: 6.5244,
      longitude: 3.3792,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    })
  ).current;

  // 🧭 Request location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        ToastAndroid.show("Location permission denied", ToastAndroid.SHORT);
        return;
      }

      let current = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = current.coords;

      // Check if user is outside Nigeria
      if (latitude < 4 || latitude > 14 || longitude < 2 || longitude > 15) {
        ToastAndroid.show("You appear to be outside Nigeria 🇳🇬", ToastAndroid.LONG);
      }

      setLocation(current);
    })();
  }, []);

  // 🛣️ Fetch directions when destination selected
  const fetchRoute = async (dest: any) => {
    if (!location) return;

    try {
      const origin = `${location.coords.latitude},${location.coords.longitude}`;
      const destination = `${dest.latitude},${dest.longitude}`;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.routes.length) {
        const points = polyline.decode(
          response.data.routes[0].overview_polyline.points
        );
        const coords = points.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }));
        setRouteCoords(coords);

        const leg = response.data.routes[0].legs[0];
        setDistance(leg.distance.text);
        setDuration(leg.duration.text);
      }
    } catch (error) {
      console.error("Route error:", error);
    }
  };

  const handleNavigate = (dest: any) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${dest.latitude},${dest.longitude}`,
      android: `google.navigation:q=${dest.latitude},${dest.longitude}`,
    });
    url && Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation={false}
        initialRegion={{
          latitude: 6.5244, // Default: Lagos
          longitude: 3.3792,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        {/* 🟦 User Location */}
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

        {/* 📍 Destinations */}
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
              fetchRoute(dest);
            }}
          />
        ))}

        {/* 🛣️ Route Polyline */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#2563EB"
          />
        )}
      </MapView>

      {/* 🧾 Destination Info Card */}
      {selectedDest && (
        <Animated.View style={styles.infoCard}>
          <Image source={selectedDest.image} style={styles.image} contentFit="cover" />
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.title}>{selectedDest.name}</Text>
            <Text style={styles.subtitle}>{selectedDest.location}</Text>
            <Text style={styles.category}>
              {selectedDest.category} • ⭐ {selectedDest.rating}
            </Text>

            {distance ? (
              <Text style={styles.distance}>
                🚗 {distance} • ⏱️ {duration}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.navigateBtn}
              onPress={() => handleNavigate(selectedDest)}
            >
              <Text style={styles.navigateText}>Start Navigation</Text>
            </TouchableOpacity>
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
  infoCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    padding: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  subtitle: { fontSize: 13, color: "#64748B", marginVertical: 2 },
  category: { fontSize: 13, color: "#475569" },
  distance: { fontSize: 13, color: "#334155", marginTop: 4 },
  navigateBtn: {
    backgroundColor: "#2563EB",
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  navigateText: { color: "#fff", fontWeight: "600" },
});





















































// import * as Location from "expo-location";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   FlatList, Image, Linking,
//   PanResponder,
//   Platform,
//   StyleSheet,
//   Text,
//   ToastAndroid,
//   TouchableOpacity,
//   View
// } from "react-native";
// import MapView, { AnimatedRegion, Marker } from "react-native-maps";
// import agungi from "../assets/images/agungi.jpeg";
// import elegushi from "../assets/images/elegushi_beach.jpg";
// import freedomPark from "../assets/images/freedom_park.jpg";
// import ilashe from "../assets/images/ilashe_beach.jpeg";
// import kalakuta from "../assets/images/kalakuta_republic_museum.jpeg";
// import makoko from "../assets/images/makoko.jpg";
// import nikeArt from "../assets/images/nike_art_gallery.jpeg";
// import oniruBeach from "../assets/images/oniru_beach.jpeg";
// import tarkwaBay from "../assets/images/tarkwa_bay.jpeg";
// import lccImage from "../assets/images/unnamed.jpg";

// // 🌍 Dummy tourist destinations in Nigeria
// const destinations = [
//   {
//     id: "1",
//     name: "Lekki Conservation Centre",
//     location: "Lagos, NG",
//     latitude: 6.4419,
//     longitude: 3.5363,
//     image: lccImage,
//     category: "Parks",
//     description:
//       "Experience Nigeria’s longest canopy walkway, rich vegetation and wildlife in Lekki.",
//     rating: 4.7,
//   },
//   {
//     id: "2",
//     name: "Nike Art Gallery",
//     location: "Lekki, Lagos",
//     latitude: 6.4444,
//     longitude: 3.4800,
//     image: nikeArt,
//     category: "Art Gallery",
//     description:
//       "One of the largest art galleries in West Africa showcasing Nigerian artworks and textiles.",
//     rating: 4.6,
//   },
//   {
//     id: "3",
//     name: "Freedom Park",
//     location: "Broad Street, Lagos Island",
//     latitude: 6.4556,
//     longitude: 3.3940,
//     image: freedomPark,
//     category: "Historic / Park",
//     description:
//       "A former colonial prison turned into a cultural and recreational park at the heart of Lagos. :contentReference[oaicite:0]{index=0}",
//     rating: 4.5,
//   },
//   {
//     id: "4",
//     name: "Tarkwa Bay Beach",
//     location: "Off Victoria Island, Lagos",
//     latitude: 6.4480,
//     longitude: 3.3945,
//     image: tarkwaBay,
//     category: "Beaches",
//     description:
//       "A sheltered beach accessible by boat, great for swimming and relaxing. :contentReference[oaicite:1]{index=1}",
//     rating: 4.4,
//   },
//   {
//     id: "5",
//     name: "Elegushi Beach",
//     location: "Lekki, Lagos",
//     latitude: 6.4300,
//     longitude: 3.4910,
//     image: elegushi,
//     category: "Beaches",
//     description:
//       "Popular beach with nightlife, food stalls and relaxing beachfront. :contentReference[oaicite:2]{index=2}",
//     rating: 4.3,
//   },
//   {
//     id: "6",
//     name: "Kalakuta Republic Museum",
//     location: "Gbagada, Lagos",
//     latitude: 6.5697,
//     longitude: 3.3291,
//     image: kalakuta,
//     category: "Museum",
//     description:
//       "Museum dedicated to the life of Fela Kuti and the Kalakuta Republic legacy. :contentReference[oaicite:3]{index=3}",
//     rating: 4.5,
//   },
//   {
//     id: "7",
//     name: "Oniru Beach",
//     location: "Victoria Island, Lagos",
//     latitude: 6.4280,
//     longitude: 3.4420,
//     image: oniruBeach,
//     category: "Beaches",
//     description:
//       "A calm beach on Victoria Island — good for unwinding. :contentReference[oaicite:4]{index=4}",
//     rating: 4.2,
//   },
//   {
//     id: "8",
//     name: "Ilashe Beach",
//     location: "Ilashe, Lagos",
//     latitude: 6.6010,
//     longitude: 3.4670,
//     image: ilashe,
//     category: "Beaches",
//     description:
//       "Secluded beach resort in Ilashe, known for its tranquility. :contentReference[oaicite:5]{index=5}",
//     rating: 4.4,
//   },
//   {
//     id: "9",
//     name: "Makoko Floating Village",
//     location: "Lagos Lagoon, Lagos",
//     latitude: 6.5120,
//     longitude: 3.4060,
//     image: makoko,
//     category: "Cultural / Neighborhood",
//     description:
//       "A floating slum on Lagos Lagoon, known for its stilt houses and canoe life.",
//     rating: 4.0,
//   },
//   {
//     id: "10",
//     name: "Johnson Jakande Tinubu Park",
//     location: "Ikeja, Lagos",
//     latitude: 6.6020,
//     longitude: 3.3480,
//     image: agungi,
//     category: "Parks",
//     description:
//       "Public park in Ikeja with trees, gardens and open recreational space. :contentReference[oaicite:6]{index=6}",
//     rating: 4.1,
//   },
//   // Add more until you reach 20, such as:
//   // University of Lagos campus, Nigerian National Museum, Eko Atlantic, Country Club, etc.
//   {
//     id: "11",
//     name: "University of Lagos (UNILAG)",
//     location: "Akoka, Lagos",
//     latitude: 6.5167,
//     longitude: 3.3833,
//     image: lccImage, // placeholder — import real
//     category: "Landmark",
//     description: "One of Nigeria’s top universities; interesting architecture and campus.",
//     rating: 4.0,
//   },
//   {
//     id: "12",
//     name: "Nigerian National Museum, Lagos",
//     location: "Onikan, Lagos",
//     latitude: 6.4553,
//     longitude: 3.3980,
//     image: lccImage, // placeholder
//     category: "Museum",
//     description: "National museum housing Nigerian artifacts and cultural heritage.",
//     rating: 4.2,
//   },
//   {
//     id: "13",
//     name: "Eko Atlantic City",
//     location: "Victoria Island, Lagos",
//     latitude: 6.4278,
//     longitude: 3.4215,
//     image: lccImage, // placeholder
//     category: "Modern Landmark",
//     description: "Futuristic planned city rising from reclaimed land off Victoria Island.",
//     rating: 4.3,
//   },
//   {
//     id: "14",
//     name: "Synagogue Church of All Nations (SCOAN)",
//     location: "Ikotun Egbe, Lagos",
//     latitude: 9.0316, // approximate — update
//     longitude: 7.4853,
//     image: lccImage, // placeholder
//     category: "Religious / Landmark",
//     description: "Large Christian ministry and pilgrimage site.",
//     rating: 4.4,
//   },
//   {
//     id: "15",
//     name: "Landmark Beach",
//     location: "Victoria Island, Lagos",
//     latitude: 6.4250,
//     longitude: 3.4280,
//     image: lccImage, // placeholder
//     category: "Beach",
//     description: "Urban beach on Victoria Island, Lagos.",
//     rating: 4.1,
//   },
//   {
//     id: "16",
//     name: "Kuramo Beach",
//     location: "Victoria Island, Lagos",
//     latitude: 6.4200,
//     longitude: 3.4300,
//     image: lccImage,
//     category: "Beach",
//     description: "Beach that used to be popular before erosion challenges.",
//     rating: 3.9,
//   },
//   {
//     id: "17",
//     name: "Elegushi Royal Beach",
//     location: "Lekki, Lagos",
//     latitude: 6.4315,
//     longitude: 3.4915,
//     image: lccImage,
//     category: "Beach",
//     description: "Private beach with amenities, popular among locals and tourists. :contentReference[oaicite:7]{index=7}",
//     rating: 4.2,
//   },
//   {
//     id: "18",
//     name: "La Campagne Tropicana",
//     location: "Ibeju-Lekki, Lagos",
//     latitude: 6.4130,
//     longitude: 3.5920,
//     image: lccImage,
//     category: "Beach Resort",
//     description: "Beach resort and forest park on the outskirts of Lagos. :contentReference[oaicite:8]{index=8}",
//     rating: 4.5,
//   },
//   {
//     id: "19",
//     name: "Badagry – Gberefu Island (Point of Return)",
//     location: "Badagry, Lagos",
//     latitude: 6.4280,
//     longitude: 2.8850,
//     image: lccImage,
//     category: "History / Heritage",
//     description: "Historical slave route and memorial site in Badagry.",
//     rating: 4.6,
//   },
//   {
//     id: "20",
//     name: "Idumota Market",
//     location: "Lagos Island",
//     latitude: 6.4510,
//     longitude: 3.3950,
//     image: lccImage,
//     category: "Market / Culture",
//     description: "One of West Africa’s largest and busiest markets on Lagos Island. :contentReference[oaicite:9]{index=9}",
//     rating: 4.0,
//   },
// ];

// export default function MapScreen() {
//   const [location, setLocation] = useState<Location.LocationObject | null>(null);
//   const [selectedDest, setSelectedDest] = useState<any>(null);
//   const [driverPosition, setDriverPosition] = useState({
//     latitude: 6.5244,
//     longitude: 3.3792, // Lagos default
//   });

//   const screenHeight = Dimensions.get("window").height;
//   const bottomSheetY = useRef(new Animated.Value(screenHeight * 0.75)).current; // collapsed
//   const expandedY = screenHeight * 0.4;
//   const collapsedY = screenHeight * 0.75;

//   const driverAnim = useRef(
//     new AnimatedRegion({
//       latitude: driverPosition.latitude,
//       longitude: driverPosition.longitude,
//       latitudeDelta: 0.5,
//       longitudeDelta: 0.5,
//     })
//   ).current;

//   // 🎯 Pan gesture for dragging up/down
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gestureState) =>
//         Math.abs(gestureState.dy) > 10,
//       onPanResponderMove: (_, gestureState) => {
//         bottomSheetY.setValue(
//           Math.min(Math.max(expandedY, collapsedY + gestureState.dy), collapsedY)
//         );
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         const shouldExpand = gestureState.dy < 0;
//         Animated.spring(bottomSheetY, {
//           toValue: shouldExpand ? expandedY : collapsedY,
//           useNativeDriver: false,
//         }).start();
//       },
//     })
//   ).current;

//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         ToastAndroid.show("Location permission denied", ToastAndroid.LONG);
//         return;
//       }

//       try {
//         const current = await Location.getCurrentPositionAsync({
//           accuracy: Location.Accuracy.High,
//         });
//         setLocation(current);
//       } catch {
//         ToastAndroid.show("Using Lagos as default location", ToastAndroid.LONG);
//       }
//     })();
//   }, []);

//   const handleNavigate = (dest: any) => {
//     const url = Platform.select({
//       ios: `maps://app?daddr=${dest.latitude},${dest.longitude}`,
//       android: `google.navigation:q=${dest.latitude},${dest.longitude}`,
//     });
//     Linking.openURL(url!);
//   };

//   const mapRegion = {
//     latitude: location?.coords.latitude ?? 6.5244,
//     longitude: location?.coords.longitude ?? 3.3792,
//     latitudeDelta: 4,
//     longitudeDelta: 4,
//   };

//   const similarPlaces = selectedDest
//     ? destinations.filter(
//       (d) =>
//         d.category === selectedDest.category && d.id !== selectedDest.id
//     )
//     : [];

//   return (
//     <View style={styles.container}>
//       <MapView style={styles.map} initialRegion={mapRegion}>
//         {location && (
//           <Marker
//             coordinate={{
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             }}
//             title="You"
//             pinColor="blue"
//           />
//         )}
//         <Marker.Animated coordinate={driverAnim} title="Driver" pinColor="red" />
//         {destinations.map((dest) => (
//           <Marker
//             key={dest.id}
//             coordinate={{
//               latitude: dest.latitude,
//               longitude: dest.longitude,
//             }}
//             title={dest.name}
//             description={dest.location}
//             onPress={() => {
//               setSelectedDest(dest);
//               Animated.spring(bottomSheetY, {
//                 toValue: collapsedY,
//                 useNativeDriver: false,
//               }).start();
//             }}
//           />
//         ))}
//       </MapView>

//       {selectedDest && (
//         <Animated.View
//           style={[styles.bottomSheet, { top: bottomSheetY }]}
//           {...panResponder.panHandlers}
//         >
//           <View style={styles.dragHandle} />
//           <View style={styles.sheetContent}>
//             <Image
//               source={selectedDest.image}
//               style={styles.image}
//             />
//             <Text style={styles.title}>{selectedDest.name}</Text>
//             <Text style={styles.location}>{selectedDest.location}</Text>
//             <Text style={styles.description}>{selectedDest.description}</Text>

//             <TouchableOpacity
//               style={styles.navigateBtn}
//               onPress={() => handleNavigate(selectedDest)}
//             >
//               <Text style={styles.navigateText}>Head to this destination</Text>
//             </TouchableOpacity>

//             {similarPlaces.length > 0 && (
//               <>
//                 <Text style={styles.similarTitle}>Similar Places</Text>
//                 <FlatList
//                   data={similarPlaces}
//                   horizontal
//                   showsHorizontalScrollIndicator={false}
//                   keyExtractor={(item) => item.id}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       style={styles.similarCard}
//                       onPress={() => setSelectedDest(item)}
//                     >
//                       <Image
//                         source={{ uri: item.image }}
//                         style={styles.similarImage}
//                       />
//                       <Text style={styles.similarName}>{item.name}</Text>
//                     </TouchableOpacity>
//                   )}
//                 />
//               </>
//             )}
//           </View>
//         </Animated.View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
//   bottomSheet: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     elevation: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     paddingBottom: 20,
//   },
//   dragHandle: {
//     width: 50,
//     height: 5,
//     backgroundColor: "#CBD5E1",
//     alignSelf: "center",
//     borderRadius: 3,
//     marginVertical: 6,
//   },
//   sheetContent: { paddingHorizontal: 16 },
//   image: {
//     width: "100%",
//     height: 150,
//     borderRadius: 12,
//   },
//   title: { fontSize: 18, fontWeight: "700", color: "#0F172A", marginTop: 8 },
//   location: { color: "#64748B", fontSize: 13, marginBottom: 6 },
//   description: { fontSize: 13, color: "#475569", lineHeight: 18 },
//   navigateBtn: {
//     backgroundColor: "#2563EB",
//     marginTop: 10,
//     borderRadius: 8,
//     paddingVertical: 8,
//     alignItems: "center",
//   },
//   navigateText: { color: "#fff", fontWeight: "600" },
//   similarTitle: {
//     marginTop: 14,
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#0F172A",
//   },
//   similarCard: {
//     marginTop: 8,
//     marginRight: 10,
//     backgroundColor: "#F1F5F9",
//     borderRadius: 10,
//     padding: 6,
//     width: 110,
//     alignItems: "center",
//   },
//   similarImage: {
//     width: 100,
//     height: 70,
//     borderRadius: 8,
//   },
//   similarName: {
//     fontSize: 12,
//     color: "#334155",
//     textAlign: "center",
//     marginTop: 4,
//   },
// });
