import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

const quickActionButtons = [
	{
		title: "My Profile",
		description: "View and edit profile",
		icon: <MaterialIcons name="person" size={24} color="white" />,
		route: {
			stack: "(drawer)",
			screen: "index",
		},
	},
	{
		title: "FAQs",
		description: "Get your queries solved",
		icon: <MaterialIcons name="help" size={24} color="white" />,
		route: {
			stack: "(drawer)",
			screen: "faqs",
		},
	},
	{
		title: "Ideas & Complaints",
		description: "Share your ideas and complaints",
		icon: <MaterialIcons name="feedback" size={24} color="white" />,
		route: {
			stack: "(drawer)",
			screen: "contact",
		},
	},
];

export default function QuickActionButtons() {
	const navigation = useNavigation<any>();

	return (
		<View className="px-6 mb-6">
			<Text className="text-2xl font-bold text-gray-800 mb-4">
				Quick Actions
			</Text>
			<View className="space-y-3">
				{quickActionButtons.map((action, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => {
							navigation.navigate(action.route.stack, {
								screen: action.route.screen,
							});
						}}
						className="bg-white rounded-xl overflow-hidden shadow-sm"
					>
						<LinearGradient
							colors={[
								"rgba(143,106,248,0.1)",
								"rgba(112,84,190,0.1)",
							]}
							className="flex-row items-center p-4"
						>
							<View className="bg-[#8F6AF8] p-3 rounded-xl mr-4">
								{action.icon}
							</View>
							<View className="flex-1">
								<Text className="text-gray-800 font-bold text-lg">
									{action.title}
								</Text>
								<Text className="text-gray-500">
									{action.description}
								</Text>
							</View>
							<MaterialIcons
								name="chevron-right"
								size={24}
								color="#8F6AF8"
							/>
						</LinearGradient>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}
