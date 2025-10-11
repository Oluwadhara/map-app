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

type Destination = {
    id: string;
    name: string;
    location: string;
    image: string;
    category: string;
    rating?: number;
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
        id: "d1",
        name: "Lagoon Beach",
        location: "Lagos, NG",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
        category: "Beaches",
        rating: 4.7,
    },
    {
        id: "d2",
        name: "Victoria Park",
        location: "Lagos, NG",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80&auto=format&fit=crop",
        category: "Parks",
        rating: 4.6,
    },
    {
        id: "d3",
        name: "National Museum",
        location: "Abuja, NG",
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80&auto=format&fit=crop",
        category: "Museums",
        rating: 4.8,
    },
    {
        id: "d4",
        name: "Obudu Mountain",
        location: "Cross River, NG",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80&auto=format&fit=crop",
        category: "Mountains",
        rating: 4.9,
    },
    {
        id: "d5",
        name: "Tranquil Cove",
        location: "Calabar, NG",
        image: "https://images.unsplash.com/photo-1501969983502-3be1b9f4e4b9?w=1200&q=80&auto=format&fit=crop",
        category: "Beaches",
        rating: 4.5,
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
