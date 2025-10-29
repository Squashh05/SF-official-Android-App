import { View, Text, Pressable } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const exploreItems = [
	{
		title: "Venues",
		icon: <MaterialIcons name="location-on" size={24} color="white" />,
		linkTo: "(location)",
		screen: "index",
		description: "Locations of Venues",
	},
	{
		title: "Events",
		icon: <MaterialIcons name="event" size={24} color="white" />,
		linkTo: "events",
		description: "Register for Events",
	},
	{
		title: "Acco",
		icon: <MaterialIcons name="hotel" size={24} color="white" />,
		linkTo: "acco",
		description: "Book Accommodation",
	},
	// {
	// 	title: "Stalls",
	// 	icon: <MaterialIcons name="store" size={24} color="white" />,
	// 	linkTo: "(stalls)",
	// 	screen: "index",
	// 	description: "Food & Shopping",
	// },
	{
		title: "CA Leaderboard",
		icon: <MaterialIcons name="leaderboard" size={24} color="white" />,
		linkTo: "(drawer)",
		screen: "ca-leaderboard",
		description: "CA Leaderboard",
	},
];

export default function Explore() {
	const navigation = useNavigation<any>();

	return (
		<View className="px-6 py-6">
			<Text className="text-2xl font-bold text-[#8F6AF8] mb-4">
				Explore
			</Text>
			<View className="flex-row flex-wrap justify-between">
				{exploreItems.map((item, index) => (
					<Pressable
						key={index}
						className="w-[48%] mb-4"
						onPress={() => {
							if (
								item.linkTo === "acco" ||
								item.linkTo === "events"
							) {
								navigation.navigate(item.linkTo);
								return;
							}
							navigation.navigate(item.linkTo, {
								screen: item.screen,
							});
						}}
					>
						<LinearGradient
							colors={["#8F6AF8", "#7054BE"]}
							className="rounded-xl p-4"
						>
							<View className="bg-white/20 w-10 h-10 rounded-full items-center justify-center mb-2">
								{item.icon}
							</View>
							<Text
								className="text-white font-bold text-lg mb-1"
								numberOfLines={1}
							>
								{item.title}
							</Text>
							<Text
								className="text-white/80 text-sm"
								numberOfLines={1}
							>
								{item.description}
							</Text>
						</LinearGradient>
					</Pressable>
				))}
			</View>
		</View>
	);
}
