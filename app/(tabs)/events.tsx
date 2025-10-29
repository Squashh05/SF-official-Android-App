import {
	View,
	Text,
	ScrollView,
	ImageBackground,
	Image,
	Pressable,
	TouchableOpacity,
	RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/userContext";

import { categoryImages } from "@/constants/imagesData";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

import details from "@/context/details";

type EvenCategoryType = {
	title: string;
	image: any;
};

export default function events() {
	const { eventsData, setEventsData } = useUserContext();

	const navigator = useNavigation<any>();

	const [categories, setCategories] = React.useState<
		EvenCategoryType[] | null
	>(null);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!eventsData) return;

		const categories = eventsData.map((event: any, index: number) => {
			return {
				title: event.genre,
				image: categoryImages[event.genre],
			};
		});
		setCategories(categories);
	}, [eventsData]);

	const fetchEvents = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/event");
			let data = await res.data.data;

			// let data = details.data;

			const filteredData = data
				.map((event: any) => ({
					...event,
					events: event.events.filter(
						(subevent: any) =>
							subevent.event_status &&
							subevent.genre !== "Accommodation"
					),
				}))
				.filter((event: any) => event.events.length > 0);
			// console.log(filteredData);
			setEventsData(filteredData);
		} catch (err) {
			console.log(err);
			let data = details.data;
			const filteredData = data
				.map((event: any) => ({
					...event,
					events: event.events.filter(
						(subevent: any) =>
							subevent.event_status &&
							subevent.genre !== "Accommodation"
					),
				}))
				.filter((event: any) => event.events.length > 0);
			// console.log(filteredData);
			setEventsData(filteredData);
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView
			className="flex-1 bg-white"
			refreshControl={
				<RefreshControl refreshing={loading} onRefresh={fetchEvents} />
			}
		>
			<View className="relative">
				<LinearGradient
					colors={["#8F6AF8", "#7054BE"]}
					className="pt-10 h-[200px]"
					style={{
						borderBottomLeftRadius: 1000,
						borderBottomRightRadius: 1000,
						transform: [{ scaleX: 1.5 }],
						marginBottom: -40,
					}}
				>
					<View style={{ transform: [{ scaleX: 1 / 1.5 }] }}>
						<Text className="text-4xl text-center font-extrabold text-gray-100">
							Events
						</Text>
					</View>
				</LinearGradient>
			</View>

			{/* My Events Button */}
			<TouchableOpacity
				onPress={() =>
					navigator.navigate("(drawer)", {
						screen: "index",
						params: { initialTab: "events" },
					})
				}
				style={{ elevation: 5 }}
				className="mx-4 mb-6 -mt-8 bg-white rounded-2xl p-4 flex-row items-center justify-between"
			>
				<View className="flex-row items-center">
					<View className="bg-[#8F6AF8]/10 p-2 rounded-xl mr-3">
						<MaterialIcons
							name="event-available"
							size={24}
							color="#8F6AF8"
						/>
					</View>
					<View>
						<Text className="text-gray-800 font-bold text-lg">
							My Events
						</Text>
						<Text className="text-gray-500 text-sm">
							View registered events
						</Text>
					</View>
				</View>
				<MaterialIcons name="chevron-right" size={24} color="#8F6AF8" />
			</TouchableOpacity>

			{/* Categories Grid */}
			<View className="px-4 py-2 -translate-y-4">
				<View className="flex-row flex-wrap justify-between">
					{categories &&
						!loading &&
						categories.map((category: any, index: number) => (
							<Pressable
								key={index}
								onPress={() => {
									navigator.navigate("(subevents)", {
										screen: "index",
										params: { category: category.title },
									});
								}}
								className="w-[48%] mb-4"
							>
								<View className="bg-white rounded-xl overflow-hidden shadow-lg">
									<LinearGradient
										colors={["#8F6AF8", "#7054BE"]}
										className="p-4"
									>
										<View className="h-24 mb-3">
											<ImageBackground
												source={category.image}
												className="h-full w-full rounded-xl overflow-hidden scale-110"
												imageStyle={{ opacity: 0.7 }}
												resizeMode="contain"
											/>
										</View>
										<View className="flex-row items-center justify-between">
											<Text className="text-white font-bold text-lg">
												{category.title}
											</Text>
											<View className="bg-white/20 rounded-full p-2">
												<MaterialIcons
													name="arrow-forward"
													size={20}
													color="white"
												/>
											</View>
										</View>
									</LinearGradient>
								</View>
							</Pressable>
						))}
				</View>
			</View>

			{/* Loading State */}
			{(!categories || loading) && (
				<View className="flex-1 justify-center items-center p-6">
					<MaterialIcons
						name="event-busy"
						size={48}
						color="#CBD5E1"
					/>
					<Text className="text-gray-400 mt-2 text-center">
						Loading events...
					</Text>
				</View>
			)}
		</ScrollView>
	);
}
