// HomeScreen.tsx
import { Image } from "expo-image";
import React, { useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import { Avatar, IconButton, Searchbar, useTheme } from "react-native-paper";
import styled from "styled-components/native";
import agungi from "../assets/images/agungi.jpg";
import elegushi from "../assets/images/elegushi_beach.jpg";
import freedomPark from "../assets/images/freedom_park.jpg";
import ilashe from "../assets/images/ilashe_beach.jpg";
import kalakuta from "../assets/images/kalakuta_republic_museum.jpg";
import lccImage from "../assets/images/lekki_conservation_centre.jpg";
import makoko from "../assets/images/makoko.jpg";
import nikeArt from "../assets/images/nike_art_gallery.jpg";
import oniruBeach from "../assets/images/oniru_beach.jpg";
import tarkwaBay from "../assets/images/tarkwa_bay.jpg";

type Destination = {
    id: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    image: any; // local import
    category: string;
    description: string;
    rating: number;
};

type Category = {
    id: string;
    name: string;
    icon: string; // could be an emoji or local icon name
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CONTAINER_PADDING = 18;
const CARD_WIDTH = Math.round(SCREEN_WIDTH * 0.72);
const CARD_MARGIN = 12;

const dummyDestinations: Destination[] = [
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
];

const dummyCategories: Category[] = [
    { id: "c1", name: "All", icon: "🌍" },
    { id: "c2", name: "Beaches", icon: "🏖️" },
    { id: "c3", name: "Parks", icon: "🌳" },
    { id: "c4", name: "Museums", icon: "🏛️" },
    { id: "c5", name: "Mountains", icon: "🏔️" },
];

const Root = styled.View`
  flex: 1;
  background-color: ${(props: any) => "#F7FAFF"};
  padding-top: ${Platform.OS === "ios" ? "50px" : "30px"};
` as any;

const TopBar = styled.View`
  padding-horizontal: ${CONTAINER_PADDING}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
` as any;

const Greeting = styled.View`
  flex-direction: column;
  gap: 2px;
` as any;

const GreetingText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props: any) => "#0F172A"};
` as any;

const SubGreeting = styled.Text`
  font-size: 13px;
  color: ${(props: any) => "#475569"};
` as any;

const SearchContainer = styled.View`
  padding-horizontal: ${CONTAINER_PADDING}px;
  margin-bottom: 16px;
` as any;

const SectionTitleRow = styled.View`
  padding-horizontal: ${CONTAINER_PADDING}px;
  margin-top: 6px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
` as any;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props: any) => "#0F172A"};
` as any;

const SeeAllText = styled.Text`
  font-size: 13px;
  color: ${(props: any) => "#6366F1"};
` as any;

const HorizontalList = styled(FlatList as new () => FlatList<Destination>)`
  padding-left: ${CONTAINER_PADDING}px;
` as any;

const DestinationCard = styled(Pressable)`
  width: ${CARD_WIDTH}px;
  margin-right: ${CARD_MARGIN}px;
` as any;

const CardInner = styled.View`
  background-color: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  elevation: 6;
  shadow-color: #000;
  shadow-opacity: 0.08;
  shadow-radius: 16px;
  shadow-offset: 0px 8px;
` as any;

const DestinationMeta = styled.View`
  padding: 12px;
` as any;

const DestinationName = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props: any) => "#0F172A"};
` as any;

const DestinationLocation = styled.Text`
  font-size: 13px;
  color: ${(props: any) => "#64748B"};
  margin-top: 4px;
` as any;

const CategoriesRow = styled.ScrollView`
  padding-horizontal: ${CONTAINER_PADDING}px;
` as any;

const CategoryButton = styled.TouchableOpacity<{ selected?: boolean }>`
  padding: 10px;
  margin-right: 12px;
  background-color: ${(p: any) => (p.selected ? "#fff" : "#fff")};
  border-radius: 12px;
  min-width: 92px;
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 8px;
  shadow-offset: 0px 4px;
` as any;

const CategoryLabel = styled.Text<{ selected?: boolean }>`
  margin-top: 6px;
  font-size: 13px;
  color: ${(p: any) => (p.selected ? "#285aa7ff" : "#64748B")};
  font-weight: 600;
` as any;

const MapPreviewCard = styled.TouchableOpacity`
  margin: 14px ${CONTAINER_PADDING}px;
  background-color: #fff;
  border-radius: 14px;
  overflow: hidden;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.06;
  shadow-radius: 12px;
  shadow-offset: 0px 6px;
` as any;

const MapPreviewInner = styled.View`
  padding: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
` as any;

const MapPreviewText = styled.Text`
  font-size: 15px;
  font-weight: 700;
` as any;

const PlaceholderMap = styled.View`
  height: 110px;
  width: 40%;
  border-radius: 8px;
  overflow: hidden;
  background-color: #eef2ff;
  align-items: center;
  justify-content: center;
` as any;

const FloatingAction = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  bottom: 28px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  elevation: 10;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 12px;
  shadow-offset: 0px 8px;
` as any;

/* ---------- Helper components ---------- */

const ProfileAvatar: React.FC<{ uri?: string }> = ({ uri }) => {
    return (
        <Avatar.Image
            size={44}
            source={
                uri
                    ? { uri }
                    : {
                        uri: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&auto=format&fit=crop",
                    }
            }
            style={{ backgroundColor: "transparent" }}
        />
    );
};

/* ---------- Main Screen Component ---------- */

export default function HomeScreen({
    navigation,
}: {
    navigation?: { navigate: (screen: string, params?: any) => void };
}) {
    const theme = useTheme();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

    const scrollX = useRef(new Animated.Value(0)).current;

    const filteredDestinations = useMemo(() => {
        if (!selectedCategory || selectedCategory === "All") return dummyDestinations;
        return dummyDestinations.filter((d) => d.category === selectedCategory);
    }, [selectedCategory]);

    const onPressDestination = (dest: Destination) => {
        // placeholder navigation - replace with real navigation
        navigation?.navigate?.("DestinationDetails", { id: dest.id });
    };

    const onExploreNearby = () => {
        navigation?.navigate?.("MapScreen");
    };

    const renderDestination = ({ item, index }: { item: Destination; index: number }) => {
        const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_MARGIN),
            index * (CARD_WIDTH + CARD_MARGIN),
            (index + 1) * (CARD_WIDTH + CARD_MARGIN),
        ];
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.93, 1, 0.93],
            extrapolate: "clamp",
        });
        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [8, 0, 8],
            extrapolate: "clamp",
        });

        return (
            <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
                <DestinationCard onPress={() => onPressDestination(item)}>
                    <CardInner>
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: "100%", height: 160 }}
                            contentFit="cover"
                            transition={250}
                            priority="normal"
                        />
                        <DestinationMeta>
                            <DestinationName numberOfLines={1}>{item.name}</DestinationName>
                            <DestinationLocation>{item.location}</DestinationLocation>
                        </DestinationMeta>
                    </CardInner>
                </DestinationCard>
            </Animated.View>
        );
    };

    return (
        <Root>
            <TopBar>
                <Greeting>
                    <GreetingText>Hi, Traveler 👋</GreetingText>
                    <SubGreeting>Discover exciting places nearby</SubGreeting>
                </Greeting>

                <AvatarTouchable onPress={() => navigation?.navigate?.("Profile")}>
                    <ProfileAvatar />
                </AvatarTouchable>
            </TopBar>

            <SearchContainer>
                <Searchbar
                    placeholder="Search attractions, e.g., museums, beaches..."
                    onChangeText={(t) => setSearchQuery(t)}
                    value={searchQuery}
                    icon="magnify"
                    style={{
                        borderRadius: 14,
                        elevation: 0,
                        backgroundColor: "#fff",
                        height: 46,
                    }}
                    inputStyle={{ fontSize: 15 }}
                />
            </SearchContainer>

            <SectionTitleRow>
                <SectionTitle>Popular Destinations</SectionTitle>
                <SeeAllText onPress={() => navigation?.navigate?.("Destinations")}>See All</SeeAllText>
            </SectionTitleRow>

            <HorizontalList
                data={filteredDestinations}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={renderDestination}
                snapToInterval={CARD_WIDTH + CARD_MARGIN}
                decelerationRate="fast"
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                contentContainerStyle={{ paddingVertical: 4 }}
            />

            <SectionTitleRow style={{ marginTop: 18 }}>
                <SectionTitle>Categories</SectionTitle>
                <SeeAllText onPress={() => setSelectedCategory("All")}>Clear</SeeAllText>
            </SectionTitleRow>

            <CategoriesRow horizontal showsHorizontalScrollIndicator={false}>
                {dummyCategories.map((c) => {
                    const selected = selectedCategory === c.name;
                    return (
                        <CategoryButton
                            key={c.id}
                            selected={selected}
                            onPress={() => setSelectedCategory(c.name)}
                            accessibilityRole="button"
                        >
                            <Text style={{ fontSize: 22 }}>{c.icon}</Text>
                            <CategoryLabel selected={selected}>{c.name}</CategoryLabel>
                        </CategoryButton>
                    );
                })}
            </CategoriesRow>

            <MapPreviewCard activeOpacity={0.9} onPress={onExploreNearby}>
                <MapPreviewInner>
                    <View style={{ flex: 1, paddingRight: 12 }}>
                        <MapPreviewText>Explore nearby</MapPreviewText>
                        <Text style={{ marginTop: 6, color: "#64748B" }}>
                            View attractions around your current location
                        </Text>
                    </View>

                    <PlaceholderMap>
                        <Image
                            source={{
                                uri: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=60&auto=format&fit=crop",
                            }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                        />
                    </PlaceholderMap>
                </MapPreviewInner>
            </MapPreviewCard>

            <View style={{ height: 120 }} />

            <FloatingAction
                onPress={() => navigation?.navigate?.("CreateTrip")}
                style={{
                    backgroundColor: "#6366F1",
                }}
            >
                <IconButton icon="plus" size={28} color="#fff" onPress={() => navigation?.navigate?.("CreateTrip")} />
            </FloatingAction>
        </Root>
    );
}

/* ---------- Styled helper elements that use native components ---------- */

const AvatarTouchable = styled.TouchableOpacity`
  border-radius: 28px;
  overflow: hidden;
` as any;

/* ---------- Stylesheet for any tiny pieces ---------- */

const localStyles = StyleSheet.create({
    subtleShadow: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 4,
    },
});

/* ---------- Notes for integration (not shown to the user):
   - This is a single-file HomeScreen ready for Expo + React Native Paper + styled-components.
   - Make sure to wrap your app with PaperProvider and ThemeProvider (if using styled-components' ThemeProvider).
   - Example theme:
     {
       colors: {
         background: "#F7FAFF",
         primary: "#6366F1",
         primaryText: "#0F172A",
         secondaryText: "#64748B",
       }
     }
   - Replace dummy data with your Firebase/remote data and wire navigation to real screens.
   - For advanced animations, swap Animated API to Reanimated v2 as desired.
*/
