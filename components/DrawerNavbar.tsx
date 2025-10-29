import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
	getFocusedRouteNameFromRoute,
	useRoute,
} from "@react-navigation/native";
import { useNavigation } from "expo-router";

export default function DrawerNavbar() {
	const route = useRoute();
	const routeName = getFocusedRouteNameFromRoute(route);

	const navigation = useNavigation<any>();

	return (
		<View className="px-4 flex flex-row justify-between items-center">
			<View className="flex flex-row gap-4 items-center">
				<Pressable onPress={navigation.goBack} className="w-8 h-8 rounded-full flex justify-center items-center">
					<FontAwesome name="angle-left" size={32} color="black" />
				</Pressable>

				<Text className="font-semibold text-lg text-[#151515]">
					{routeName === "index"
						? "Profile"
						: routeName === "contact"
						? "Contact Us"
						: routeName === "faqs"
						? "FAQs"
						: routeName === "orders"
						? "Orders"
						: routeName === "sponsors"
						? "Sponsors"
						: routeName === "signout"
						? "Sign Out"
						: routeName === "team"
						? "Team"
						: "Spring Fest 25"}
				</Text>
			</View>

			<View className="flex flex-row items-center gap-2">
				<Image
					source={require("@/assets/images/icon.png")}
					resizeMode="contain"
					className="w-14 h-14"
				/>
			</View>
		</View>
	);
}
