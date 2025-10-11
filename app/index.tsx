import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello Expo 👋🏽</Text>

      <Link href="/MapScreen">Go to map screen</Link>
      <Link href="/StaticTourGuide">Go to StaticTourGuide screen</Link>
      <Link href="/MockDeliveryTracker">Go to MockDeliveryTracker screen</Link>
      <Link href="/LandmarkList">Go to LandmarkList screen</Link>
      <Link href="/HomeScreen">Go to HomeScreen screen</Link>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
