import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
	getFocusedRouteNameFromRoute,
	useRoute,
} from "@react-navigation/native";
import { useUserContext } from "@/context/userContext";
import { useNavigation } from "expo-router";

interface NavbarProps {
	toggleDrawer: () => void;
}

export default function Navbar({ toggleDrawer }: NavbarProps) {
	const route = useRoute();
	const routeName = getFocusedRouteNameFromRoute(route);

	const navigator = useNavigation<any>();

	const { merchInCart } = useUserContext();

	// Calculate total items in cart
	const totalItems = merchInCart.reduce(
		(acc: number, item: any) => acc + item.quantity,
		0
	);

	return (
		<View className="px-4 flex flex-row justify-between items-center">
			<View className="flex flex-row items-center gap-2">
				<Image
					source={require("@/assets/images/nav-icon.png")}
					resizeMode="contain"
					className="w-44 h-16"
				/>
				{/* <Text className="font-semibold text-lg text-[#151515]">
					{routeName === "index"
						? "Spring Fest 25"
						: routeName === "timeline"
						? "Schedule"
						: routeName === "events"
						? "Events"
						: routeName === "location"
						? "Map"
						: routeName === "acco"
						? "Accommodation"
						: "Spring Fest 25"}
				</Text> */}
			</View>

			<View className="flex flex-row gap-4 items-center">
				{/* <FontAwesome name="search" size={24} color="black" /> */}

				{/* Shopping Cart with Badge */}

				{/* {totalItems > 0 && (
					<TouchableOpacity
						onPress={() => {
							navigator.navigate("(drawer)", {
								screen: "orders",
							});
						}}
					>
						<FontAwesome
							name="shopping-cart"
							size={24}
							color="black"
						/>
						<View className="absolute -top-2 -right-2 bg-red-600 rounded-full h-5 w-5 flex items-center justify-center">
							<Text className="text-white text-xs font-bold">
								{totalItems}
							</Text>
						</View>
					</TouchableOpacity>
				)} */}

				{/* Menu Icon */}
				<TouchableOpacity onPress={toggleDrawer}>
					<MaterialIcons name="menu" size={24} color="black" />
				</TouchableOpacity>
			</View>
		</View>
	);
}
