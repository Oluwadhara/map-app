// import polyline from "@mapbox/polyline";
// import axios from "axios";
// import Constants from "expo-constants";
// import * as Location from "expo-location";
// import React, { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   FlatList, Image,
//   PanResponder,
//   StyleSheet,
//   Text,
//   ToastAndroid,
//   TouchableOpacity,
//   View
// } from "react-native";
// import MapView, { AnimatedRegion, Marker, Polyline } from "react-native-maps";
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


// const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

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
//   // const [driverPosition, setDriverPosition] = useState({
//   //   latitude: 6.5244,
//   //   longitude: 3.3792, // Lagos default
//   // });

//   // new state
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [distance, setDistance] = useState<string | null>(null);
//   const [duration, setDuration] = useState<string | null>(null);

//   const screenHeight = Dimensions.get("window").height;
//   const bottomSheetY = useRef(new Animated.Value(screenHeight * 0.75)).current; // collapsed
//   const expandedY = screenHeight * 0.4;
//   const collapsedY = screenHeight * 0.75;

//   const [driverPosition, setDriverPosition] = useState<any>(null);
//   const [animationIndex, setAnimationIndex] = useState(0);

//   const [driverAnim] = useState(
//     new AnimatedRegion({
//       latitude: routeCoords[0]?.latitude || 0,
//       longitude: routeCoords[0]?.longitude || 0,
//       latitudeDelta: 0.005,
//       longitudeDelta: 0.005,
//     })
//   );

//   const mapRef = useRef<MapView>(null);

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

//   const [tripStarted, setTripStarted] = useState(false);

//   useEffect(() => {
//     if (location) {
//       setDriverPosition({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     }
//   }, [location]);

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

//   const animateDriver = (coords: any[]) => {
//     let index = 0;
//     const interval = setInterval(() => {
//       if (index < coords.length) {
//         const nextCoord = coords[index];
//         setDriverPosition(nextCoord);

//         // 🧭 Move camera smoothly to driver’s position
//         mapRef.current?.animateCamera({
//           center: nextCoord,
//           pitch: 0,
//           zoom: 16,
//         });

//         index++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 1000); // Move every second — adjust for speed
//   };

//   const [previewData, setPreviewData] = useState(null);

//   const handleNavigate = async (dest) => {
//     if (!location) return;

//     try {
//       const origin = `${location.coords.latitude},${location.coords.longitude}`;
//       const destination = `${dest.latitude},${dest.longitude}`;
//       const apiKey = GOOGLE_MAPS_API_KEY;

//       const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`;
//       const { data } = await axios.get(url);

//       if (data.routes.length) {
//         const points = polyline.decode(data.routes[0].overview_polyline.points);
//         const coords = points.map(([lat, lng]) => ({
//           latitude: lat,
//           longitude: lng,
//         }));

//         setRouteCoords(coords);
//         setDistance(data.routes[0].legs[0].distance.text);
//         setDuration(data.routes[0].legs[0].duration.text);

//         setPreviewData({
//           coords,
//           distance: data.routes[0].legs[0].distance.text,
//           duration: data.routes[0].legs[0].duration.text,
//         });

//         mapRef.current?.fitToCoordinates(coords, {
//           edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
//           animated: true,
//         });
//       }
//     } catch (error) {
//       console.error("Route preview failed", error);
//     }
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
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         showsUserLocation={false}
//         initialRegion={{
//           latitude: 6.5244,
//           longitude: 3.3792,
//           latitudeDelta: 0.3,
//           longitudeDelta: 0.3,
//         }}
//       >
//         {/* {location && (
//           // <Marker.Animated coordinate={driverAnim} />
//         )} */}
//         {routeCoords.length > 0 && (
//           <Polyline
//             coordinates={routeCoords}
//             strokeWidth={5}
//             strokeColor="#2563EB"
//           />
//         )}
//         {driverPosition && (
//           <Marker coordinate={driverPosition} title="Driver" pinColor="blue">
//             <View style={{
//               width: 20,
//               height: 20,
//               backgroundColor: '#2563EB',
//               borderRadius: 10,
//               borderWidth: 2,
//               borderColor: 'white'
//             }} />
//           </Marker>
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

//             {/* {distance && duration && (
//               <Text style={{ marginTop: 6, color: "#1E3A8A", fontWeight: "600" }}>
//                 {`Distance: ${distance} | ETA: ${duration}`}
//               </Text>
//             )} */}

//             <TouchableOpacity
//               style={styles.navigateBtn}
//               onPress={() => handleNavigate(selectedDest)}
//             >
//               <Text style={styles.navigateText}>Head to this destination</Text>
//             </TouchableOpacity>

//             {tripStarted && (
//               <TouchableOpacity
//                 style={{
//                   position: "absolute",
//                   top: 60,
//                   right: 20,
//                   backgroundColor: "#ef4444",
//                   padding: 10,
//                   borderRadius: 8,
//                   zIndex: 99,
//                 }}
//                 onPress={() => {
//                   setTripStarted(false);
//                   setRouteCoords([]);
//                   setSelectedDest(null);
//                   setDistance(null);
//                   setDuration(null);
//                   ToastAndroid.show("Trip cancelled", ToastAndroid.SHORT);
//                 }}
//               >
//                 <Text style={{ color: "#fff", fontWeight: "600" }}>Cancel Trip</Text>
//               </TouchableOpacity>
//             )}

//             {!tripStarted && previewData && (
//               <View style={{ marginTop: 10 }}>
//                 <Text style={{ color: "#1E3A8A", fontWeight: "600" }}>
//                   Distance: {previewData.distance} | ETA: {previewData.duration}
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.navigateBtn}
//                   onPress={() => {
//                     setTripStarted(true);
//                     animateDriver(previewData.coords);
//                   }}
//                 >
//                   <Text style={styles.navigateText}>Start Trip</Text>
//                 </TouchableOpacity>
//               </View>
//             )}

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
//                       <Image source={item.image} style={styles.similarImage} />
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









import polyline from "@mapbox/polyline";
import axios from "axios";
import Constants from "expo-constants";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import agungi from "../assets/images/agungi.jpeg";
import elegushi from "../assets/images/elegushi_beach.jpg";
import freedomPark from "../assets/images/freedom_park.jpg";
import ilashe from "../assets/images/ilashe_beach.jpeg";
import kalakuta from "../assets/images/kalakuta_republic_museum.jpeg";
import lccImage from "../assets/images/Lekki_Convention_Center.jpg";
import makoko from "../assets/images/makoko.jpg";
import nikeArt from "../assets/images/nike_art_gallery.jpeg";
import oniruBeach from "../assets/images/oniru_beach.jpeg";
import tarkwaBay from "../assets/images/tarkwa_bay.jpeg";

const GOOGLE_MAPS_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

const destinations = [
  {
    id: "1",
    name: "Lekki Conservation Centre",
    location: "Lagos, NG",
    latitude: 6.4419,
    longitude: 3.5363,
    image: lccImage,
    category: "Parks",
    description:
      "Experience Nigeria’s longest canopy walkway, rich vegetation and wildlife in Lekki.",
    rating: 4.7,
  },
  {
    id: "2",
    name: "Nike Art Gallery",
    location: "Lekki, Lagos",
    latitude: 6.4444,
    longitude: 3.4800,
    image: nikeArt,
    category: "Art Gallery",
    description:
      "One of the largest art galleries in West Africa showcasing Nigerian artworks and textiles.",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Freedom Park",
    location: "Broad Street, Lagos Island",
    latitude: 6.4556,
    longitude: 3.3940,
    image: freedomPark,
    category: "Historic / Park",
    description:
      "A former colonial prison turned into a cultural and recreational park at the heart of Lagos. :contentReference[oaicite:0]{index=0}",
    rating: 4.5,
  },
  {
    id: "4",
    name: "Tarkwa Bay Beach",
    location: "Off Victoria Island, Lagos",
    latitude: 6.4480,
    longitude: 3.3945,
    image: tarkwaBay,
    category: "Beaches",
    description:
      "A sheltered beach accessible by boat, great for swimming and relaxing. :contentReference[oaicite:1]{index=1}",
    rating: 4.4,
  },
  {
    id: "5",
    name: "Elegushi Beach",
    location: "Lekki, Lagos",
    latitude: 6.4300,
    longitude: 3.4910,
    image: elegushi,
    category: "Beaches",
    description:
      "Popular beach with nightlife, food stalls and relaxing beachfront. :contentReference[oaicite:2]{index=2}",
    rating: 4.3,
  },
  {
    id: "6",
    name: "Kalakuta Republic Museum",
    location: "Gbagada, Lagos",
    latitude: 6.5697,
    longitude: 3.3291,
    image: kalakuta,
    category: "Museum",
    description:
      "Museum dedicated to the life of Fela Kuti and the Kalakuta Republic legacy. :contentReference[oaicite:3]{index=3}",
    rating: 4.5,
  },
  {
    id: "7",
    name: "Oniru Beach",
    location: "Victoria Island, Lagos",
    latitude: 6.4280,
    longitude: 3.4420,
    image: oniruBeach,
    category: "Beaches",
    description:
      "A calm beach on Victoria Island — good for unwinding. :contentReference[oaicite:4]{index=4}",
    rating: 4.2,
  },
  {
    id: "8",
    name: "Ilashe Beach",
    location: "Ilashe, Lagos",
    latitude: 6.6010,
    longitude: 3.4670,
    image: ilashe,
    category: "Beaches",
    description:
      "Secluded beach resort in Ilashe, known for its tranquility. :contentReference[oaicite:5]{index=5}",
    rating: 4.4,
  },
  {
    id: "9",
    name: "Makoko Floating Village",
    location: "Lagos Lagoon, Lagos",
    latitude: 6.5120,
    longitude: 3.4060,
    image: makoko,
    category: "Cultural / Neighborhood",
    description:
      "A floating slum on Lagos Lagoon, known for its stilt houses and canoe life.",
    rating: 4.0,
  },
  {
    id: "10",
    name: "Johnson Jakande Tinubu Park",
    location: "Ikeja, Lagos",
    latitude: 6.6020,
    longitude: 3.3480,
    image: agungi,
    category: "Parks",
    description:
      "Public park in Ikeja with trees, gardens and open recreational space. :contentReference[oaicite:6]{index=6}",
    rating: 4.1,
  },
  // Add more until you reach 20, such as:
  // University of Lagos campus, Nigerian National Museum, Eko Atlantic, Country Club, etc.
  {
    id: "11",
    name: "University of Lagos (UNILAG)",
    location: "Akoka, Lagos",
    latitude: 6.5167,
    longitude: 3.3833,
    image: lccImage, // placeholder — import real
    category: "Landmark",
    description: "One of Nigeria’s top universities; interesting architecture and campus.",
    rating: 4.0,
  },
  {
    id: "12",
    name: "Nigerian National Museum, Lagos",
    location: "Onikan, Lagos",
    latitude: 6.4553,
    longitude: 3.3980,
    image: lccImage, // placeholder
    category: "Museum",
    description: "National museum housing Nigerian artifacts and cultural heritage.",
    rating: 4.2,
  },
  {
    id: "13",
    name: "Eko Atlantic City",
    location: "Victoria Island, Lagos",
    latitude: 6.4278,
    longitude: 3.4215,
    image: lccImage, // placeholder
    category: "Modern Landmark",
    description: "Futuristic planned city rising from reclaimed land off Victoria Island.",
    rating: 4.3,
  },
  {
    id: "14",
    name: "Synagogue Church of All Nations (SCOAN)",
    location: "Ikotun Egbe, Lagos",
    latitude: 9.0316, // approximate — update
    longitude: 7.4853,
    image: lccImage, // placeholder
    category: "Religious / Landmark",
    description: "Large Christian ministry and pilgrimage site.",
    rating: 4.4,
  },
  {
    id: "15",
    name: "Landmark Beach",
    location: "Victoria Island, Lagos",
    latitude: 6.4250,
    longitude: 3.4280,
    image: lccImage, // placeholder
    category: "Beach",
    description: "Urban beach on Victoria Island, Lagos.",
    rating: 4.1,
  },
  {
    id: "16",
    name: "Kuramo Beach",
    location: "Victoria Island, Lagos",
    latitude: 6.4200,
    longitude: 3.4300,
    image: lccImage,
    category: "Beach",
    description: "Beach that used to be popular before erosion challenges.",
    rating: 3.9,
  },
  {
    id: "17",
    name: "Elegushi Royal Beach",
    location: "Lekki, Lagos",
    latitude: 6.4315,
    longitude: 3.4915,
    image: lccImage,
    category: "Beach",
    description: "Private beach with amenities, popular among locals and tourists. :contentReference[oaicite:7]{index=7}",
    rating: 4.2,
  },
  {
    id: "18",
    name: "La Campagne Tropicana",
    location: "Ibeju-Lekki, Lagos",
    latitude: 6.4130,
    longitude: 3.5920,
    image: lccImage,
    category: "Beach Resort",
    description: "Beach resort and forest park on the outskirts of Lagos. :contentReference[oaicite:8]{index=8}",
    rating: 4.5,
  },
  {
    id: "19",
    name: "Badagry – Gberefu Island (Point of Return)",
    location: "Badagry, Lagos",
    latitude: 6.4280,
    longitude: 2.8850,
    image: lccImage,
    category: "History / Heritage",
    description: "Historical slave route and memorial site in Badagry.",
    rating: 4.6,
  },
  {
    id: "20",
    name: "Idumota Market",
    location: "Lagos Island",
    latitude: 6.4510,
    longitude: 3.3950,
    image: lccImage,
    category: "Market / Culture",
    description: "One of West Africa’s largest and busiest markets on Lagos Island. :contentReference[oaicite:9]{index=9}",
    rating: 4.0,
  },
  {
    id: "21",
    name: "Murtala Muhammed International Airport (LOS)",
    location: "Ikeja, Lagos",
    latitude: 6.5774,
    longitude: 3.3212,
    image: lccImage, // replace with actual airport image later
    category: "Airport",
    description:
      "Nigeria’s busiest airport and main international gateway, located in Ikeja.",
    rating: 4.3,
  },
  {
    id: "22",
    name: "Murtala Muhammed Domestic Airport (MMA2)",
    location: "Ikeja, Lagos",
    latitude: 6.5779,
    longitude: 3.3216,
    image: lccImage,
    category: "Airport",
    description:
      "The domestic terminal for local flights within Nigeria, adjacent to the international terminal.",
    rating: 4.2,
  },
  {
    id: "23",
    name: "Lagos Air Force Base",
    location: "Ikeja, Lagos",
    latitude: 6.5825,
    longitude: 3.3190,
    image: lccImage,
    category: "Military Base / Airport",
    description:
      "A restricted airbase located beside the Murtala Muhammed Airport complex.",
    rating: 4.0,
  },
  {
    id: "24",
    name: "Lekki-Epe Airstrip",
    location: "Lekki Peninsula, Lagos",
    latitude: 6.4698,
    longitude: 3.6020,
    image: lccImage,
    category: "Airstrip / Private",
    description:
      "A smaller private airstrip serving the Lekki Free Trade Zone and nearby developments.",
    rating: 3.8,
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedDest, setSelectedDest] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);
  const [tripStarted, setTripStarted] = useState(false);
  const [driverPosition, setDriverPosition] = useState<any>(null);
  const { id } = useLocalSearchParams();

  const mapRef = useRef<MapView>(null);
  const driverInterval = useRef<NodeJS.Timeout | null>(null);

  // bottom sheet animation
  const screenHeight = Dimensions.get("window").height;
  const bottomSheetY = useRef(new Animated.Value(screenHeight * 0.75)).current;
  const expandedY = screenHeight * 0.4;
  const collapsedY = screenHeight * 0.75;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        bottomSheetY.setValue(
          Math.min(Math.max(expandedY, collapsedY + g.dy), collapsedY)
        );
      },
      onPanResponderRelease: (_, g) => {
        const shouldExpand = g.dy < 0;
        Animated.spring(bottomSheetY, {
          toValue: shouldExpand ? expandedY : collapsedY,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // Get user's current location
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
        setDriverPosition({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });

        // Center map on user
        mapRef.current?.animateCamera({
          center: {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
          },
          zoom: 15,
        });
      } catch {
        ToastAndroid.show("Unable to get current location", ToastAndroid.LONG);
      }
    })();
  }, []);

  useEffect(() => {
    if (id) {
      const dest = destinations.find((d) => d.id === id);
      if (dest) {
        setSelectedDest(dest);

        // Focus map on the destination
        mapRef.current?.animateCamera({
          center: { latitude: dest.latitude, longitude: dest.longitude },
          zoom: 14,
        });

        // Optional: Automatically preview route to it
        if (location) {
          handleNavigate(dest);
        }
      }
    }
  }, [id, location]);

  // Animate driver movement
  const animateDriver = (coords: any[]) => {
    if (driverInterval.current) clearInterval(driverInterval.current);
    let index = 0;

    driverInterval.current = setInterval(() => {
      if (index < coords.length) {
        const next = coords[index];
        setDriverPosition(next);

        // Follow driver
        mapRef.current?.animateCamera({
          center: next,
          zoom: 16,
        });

        index++;
      } else {
        clearInterval(driverInterval.current!);
        ToastAndroid.show("You’ve reached your destination!", ToastAndroid.SHORT);
        setTripStarted(false);
      }
    }, 1000);
  };

  const handleNavigate = async (dest: any) => {
    if (!location) return;

    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const destination = `${dest.latitude},${dest.longitude}`;

    try {
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;
      const { data } = await axios.get(url);

      if (data.routes.length) {
        const points = polyline.decode(data.routes[0].overview_polyline.points);
        const coords = points.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        setRouteCoords(coords);

        const leg = data.routes[0].legs[0];
        setPreviewData({
          coords,
          distance: leg.distance.text,
          duration: leg.duration.text,
        });

        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      console.error("Error fetching route:", err);
      ToastAndroid.show("Could not load route", ToastAndroid.LONG);
    }
  };

  const cancelTrip = () => {
    setTripStarted(false);
    setRouteCoords([]);
    setPreviewData(null);
    if (driverInterval.current) clearInterval(driverInterval.current);
    ToastAndroid.show("Trip cancelled", ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={!tripStarted}
        initialRegion={{
          latitude: location?.coords.latitude ?? 6.5244,
          longitude: location?.coords.longitude ?? 3.3792,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#2563EB" />
        )}

        {driverPosition && (
          <Marker
            coordinate={driverPosition}
            anchor={{ x: 0.1, y: 0.1 }}
            title="You"
          >
            <View
              style={{
                width: 15,
                height: 15,
                borderRadius: 7.5,
                backgroundColor: 'blue',
                borderWidth: 2,
                borderColor: 'white',
              }}
            />
          </Marker>
        )}

        {destinations.map((dest) => (
          <Marker
            key={dest.id}
            coordinate={{ latitude: dest.latitude, longitude: dest.longitude }}
            title={dest.name}
            description={dest.location}
            onPress={() => {
              setSelectedDest(dest);
              setPreviewData(null);
              setRouteCoords([]);
              setTripStarted(false);
              if (driverInterval.current) clearInterval(driverInterval.current);
            }}
          />
        ))}
      </MapView>

      {selectedDest && (
        <Animated.View style={[styles.bottomSheet, { top: bottomSheetY }]} {...panResponder.panHandlers}>
          <View style={styles.dragHandle} />
          <View style={styles.sheetContent}>
            <Image source={selectedDest.image} style={styles.image} />
            <Text style={styles.title}>{selectedDest.name}</Text>
            <Text style={styles.location}>{selectedDest.location}</Text>
            <Text style={styles.description}>{selectedDest.description}</Text>

            {!tripStarted && !previewData && (
              <TouchableOpacity
                style={styles.navigateBtn}
                onPress={() => handleNavigate(selectedDest)}
              >
                <Text style={styles.navigateText}>Preview Route</Text>
              </TouchableOpacity>
            )}

            {previewData && !tripStarted && (
              <>
                <Text style={styles.infoText}>
                  Distance: {previewData.distance} | ETA: {previewData.duration}
                </Text>
                <TouchableOpacity
                  style={styles.navigateBtn}
                  onPress={() => {
                    setTripStarted(true);
                    animateDriver(previewData.coords);
                  }}
                >
                  <Text style={styles.navigateText}>Start Trip</Text>
                </TouchableOpacity>
              </>
            )}

            {tripStarted && (
              <TouchableOpacity
                style={[styles.navigateBtn, { backgroundColor: "#ef4444" }]}
                onPress={cancelTrip}
              >
                <Text style={styles.navigateText}>Cancel Trip</Text>
              </TouchableOpacity>
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
    paddingVertical: 10,
    alignItems: "center",
  },
  navigateText: { color: "#fff", fontWeight: "600" },
  infoText: { marginTop: 6, color: "#1E3A8A", fontWeight: "600" },
});
