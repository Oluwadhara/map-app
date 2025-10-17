// import { Link } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Hello Expo 👋🏽</Text>

//       <Link href="/MapScreen">Go to map screen</Link>
//       <Link href="/StaticTourGuide">Go to StaticTourGuide screen</Link>
//       <Link href="/MockDeliveryTracker">Go to MockDeliveryTracker screen</Link>
//       <Link href="/LandmarkList">Go to LandmarkList screen</Link>
//       <Link href="/HomeScreen">Go to HomeScreen screen</Link>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

export default function App() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to HomeScreen after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/HomeScreen');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fade and zoom animation */}
      <Animated.View entering={ZoomIn.duration(800)}>
        <Image
          source={require('../assets/images/icon.png')} // your logo or splash image
          style={styles.logo}
        />
      </Animated.View>

      <Animated.Text entering={FadeIn.delay(600).duration(1000)} style={styles.title}>
        Welcome
      </Animated.Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2563EB', // blue background
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    marginTop: 16,
  },
});
