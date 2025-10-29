import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ImageBackground,
    ViewProps,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { eventImages } from "@/constants/imagesData";
import { useUserContext } from "@/context/userContext";
import { useNavigation } from "expo-router";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

function EventImageWithFallback({
	source,
	genre,
	name,
}: {
	source: any;
	genre: string;
	name: string;
}) {
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasError, setHasError] = React.useState(false);
	const opacity = useSharedValue(0.5);

	React.useEffect(() => {
		opacity.value = withRepeat(
			withSequence(
				withTiming(1, { duration: 500 }),
				withTiming(0.5, { duration: 500 })
			),
			-1,
			true
		);
	}, []);

	const skeletonStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	if (!source || hasError) {
		return (
			<View className="h-full justify-center items-center bg-[#8F6AF8]/5">
				<MaterialIcons name="event" size={32} color="#8F6AF8" />
				<Text className="text-[#8F6AF8] text-sm mt-2 text-center px-4">
					{genre} - {name}
				</Text>
			</View>
		);
	}

	return (
		<View className="h-full">
			{isLoading && (
				<Animated.View
					style={[
						{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "#E5E7EB",
						},
						skeletonStyle,
					]}
				>
					<View className="h-full justify-center items-center">
						<MaterialIcons name="image" size={32} color="#9CA3AF" />
					</View>
				</Animated.View>
			)}
			<ImageBackground
				source={source}
				className="h-full justify-end"
				resizeMode="contain"
				onLoadEnd={() => setIsLoading(false)}
				onError={() => setHasError(true)}
			>
				<LinearGradient
					colors={["transparent", "rgba(0,0,0,0.8)"]}
					className="p-4"
				>
					<Text className="text-white font-bold text-lg">{name}</Text>
					<Text className="text-white/80">{genre}</Text>
				</LinearGradient>
			</ImageBackground>
		</View>
	);
}

export default function RegisteredEvents(props: ViewProps) {
    const navigation = useNavigation<any>();

    const { user, soloEvents, groupEvents, getEvents } = useUserContext();

    const [allRegisteredEvents, setAllRegisteredEvents] = useState<any>([]);

    useEffect(() => {
        setAllRegisteredEvents([...soloEvents, ...groupEvents]);
    }, [soloEvents, groupEvents]);

    useEffect(() => {
        if (user) {
            getEvents();
        }
    }, [user]);

    // 2. Spread the received props onto the root View.
    // This will apply any `style` or `className` from the parent.
    return (
        <View {...props} className="px-6 mb-6">
            <View className="flex-row justify-between items-center mb-4">
                <View>
                    <Text className="text-2xl font-bold text-gray-800">
                        My Events
                    </Text>
                    <Text className="text-gray-500">
                        {allRegisteredEvents.length} registered
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("(drawer)", {
                            screen: "index",
                            params: { initialTab: "events" },
                        })
                    }
                    className="bg-[#8F6AF8]/10 px-4 py-2 rounded-full"
                >
                    <Text className="text-[#8F6AF8] font-medium">See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-4"
            >
                {/* ... rest of your component is perfect and needs no changes ... */}
                {allRegisteredEvents.length === 0 ? (
                    <View className="bg-white rounded-xl p-6 w-64 shadow-sm items-center justify-center">
                        <MaterialIcons
                            name="event-busy"
                            size={32}
                            color="#CBD5E1"
                        />
                        <Text className="text-gray-400 mt-2 text-center">
                            No registered events
                        </Text>
                    </View>
                ) : (
                    allRegisteredEvents.map((eventData: any, index: number) => {
                        const event = eventData.event;
                        const imageSource =
                            eventImages[
                                `${event.genre.genre.replace(
                                    /\s/g,
                                    ""
                                )}${event.name
                                    .replace(
                                        /(?:^|\s|-+)(\w)/g,
                                        (_: string, c: string) =>
                                            c.toUpperCase()
                                    )
                                    .replace(/[\s-]/g, "")}`
                            ];

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() =>
                                    navigation.navigate("(drawer)", {
                                        screen: "index",
                                        params: {
                                            initialTab: "events",
                                        },
                                    })
                                }
                                className="bg-white rounded-xl overflow-hidden shadow-sm w-64"
                            >
                                <View className="h-36 bg-[#8F6AF8]">
                                    <EventImageWithFallback
                                        source={imageSource}
                                        genre={event.genre.genre}
                                        name={event.name}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}