import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [driverPosition, setDriverPosition] = useState({
    latitude: 6.606951760180734, // 🚗 starting point
    longitude: 3.2788709931957953,
  });

  const driverAnim = useRef(
    new AnimatedRegion({
      latitude: driverPosition.latitude,
      longitude: driverPosition.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    })
  ).current;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      let current = await Location.getCurrentPositionAsync({});
      setLocation(current);

      // 🚗 Simulate movement toward your location
      const interval = setInterval(() => {
        setDriverPosition((prev) => {
          if (!current) return prev;

          const latDiff = current.coords.latitude - prev.latitude;
          const lonDiff = current.coords.longitude - prev.longitude;

          // move 1% closer each second
          const newLat = prev.latitude + latDiff * 0.1;
          const newLon = prev.longitude + lonDiff * 0.1;

          const newPos = { latitude: newLat, longitude: newLon };

          // ✅ Correct way: use toValue
          driverAnim.timing({
            toValue: newPos,
            duration: 10000,
            useNativeDriver: false,
          }).start();

          return newPos;
        });
      }, 1000);

      return () => clearInterval(interval);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {/* Your Location */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You"
            pinColor="blue"
          />

          {/* Driver moving toward you */}
          <Marker.Animated
            coordinate={driverAnim}
            title="Driver"
            pinColor="red"
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});


// import React, { useEffect, useRef, useState } from "react";
// import { Dimensions, StyleSheet, View } from "react-native";
// import MapView, { AnimatedRegion, Marker } from "react-native-maps";

// export default function MapScreen() {
//   // 👇 Default location set here
//   const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>({
//     latitude: 6.606951760180734,
//     longitude: 3.2788709931957953,
//   });

//   const [driverPosition, setDriverPosition] = useState({
//     latitude: 6.6000, // 🚗 starting point (a bit away)
//     longitude: 3.3500,
//   });

//   const driverAnim = useRef(
//     new AnimatedRegion({
//       latitude: driverPosition.latitude,
//       longitude: driverPosition.longitude,
//       latitudeDelta: 0.1,
//       longitudeDelta: 0.1,
//     })
//   ).current;

//   useEffect(() => {
//     if (!location) return;

//     // 🚗 Simulate movement toward your location
//     const interval = setInterval(() => {
//       setDriverPosition((prev) => {
//         const latDiff = location.latitude - prev.latitude;
//         const lonDiff = location.longitude - prev.longitude;

//         // move closer each second
//         const newLat = prev.latitude + latDiff * 0.1;
//         const newLon = prev.longitude + lonDiff * 0.1;

//         const newPos = { latitude: newLat, longitude: newLon };

//         driverAnim.timing({
//           toValue: newPos,
//           duration: 1000,
//           useNativeDriver: false,
//         }).start();

//         return newPos;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [location]);

//   return (
//     <View style={styles.container}>
//       {location && (
//         <MapView
//           style={styles.map}
//           initialRegion={{
//             latitude: location.latitude,
//             longitude: location.longitude,
//             latitudeDelta: 0.05,
//             longitudeDelta: 0.05,
//           }}
//         >
//           {/* Your Location */}
//           <Marker coordinate={location} title="You" pinColor="blue" />

//           {/* Driver moving toward you */}
//           <Marker.Animated coordinate={driverAnim} title="Driver" pinColor="red" />
//         </MapView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
// });
