import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const landmarks = [
  { id: "1", name: "National Museum", latitude: 6.603, longitude: 3.352 },
  { id: "2", name: "Freedom Park", latitude: 6.599, longitude: 3.370 },
  { id: "3", name: "Lekki Conservation Centre", latitude: 6.430, longitude: 3.543 },
];

export default function LandmarkList({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tourist Landmarks</Text>
      <FlatList
        data={landmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("GuideTracker", { landmark: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  card: { padding: 15, backgroundColor: "#eee", marginVertical: 8, borderRadius: 10 },
  name: { fontSize: 16 },
});
