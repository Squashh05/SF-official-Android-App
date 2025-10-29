import React from "react";
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Linking,
	Dimensions,
	Pressable,
	ScrollView,
} from "react-native";
import { FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { useNavigation } from "expo-router";
import { useUserContext } from "@/context/userContext";
import { clearData } from "@/utils/storage";

const { width, height } = Dimensions.get("window");

const items = [
	{
		name: "Profile",
		icon: <FontAwesome5 name="user" size={24} color="black" />,
		linkTo: "index",
	},
	// {
	// 	name: "Orders / Cart",
	// 	icon: <MaterialIcons name="receipt" size={24} color="black" />,
	// 	linkTo: "orders",
	// },
	{
		name: "Contact Us",
		icon: <Feather name="phone" size={24} color="black" />,
		linkTo: "contact",
	},
	{
		name: "FAQs",
		icon: <MaterialIcons name="help-outline" size={24} color="black" />,
		linkTo: "faqs",
	},
	{
		name: "Team",
		icon: <FontAwesome5 name="users" size={20} color="black" />,
		isExternalLink: true,
		url: "https://teams.springfest.in",
	},
	{
		name: "Sponsors",
		icon: <FontAwesome5 name="handshake" size={20} color="black" />,
		isExternalLink: true,
		url: "https://sponsors.springfest.in",
	},
	{
		name: "CA Leaderboard",
		icon: <FontAwesome5 name="trophy" size={20} color="black" />,
		linkTo: "ca-leaderboard",
	},
	{
		name: "Sign Out",
		icon: <MaterialIcons name="logout" size={26} color="black" />,
		// linkTo: "signout",
	},
];

interface DrawerProps {
	isOpen: boolean;
	toggleDrawer: () => void;
}

const Drawer = ({ isOpen, toggleDrawer }: DrawerProps) => {
	const navigator = useNavigation<any>();

	const { user, setUser, setIsLoggedIn } = useUserContext();

	const [pressCount, setPressCount] = React.useState(0);

	// Animation for the drawer
	const translateX = useSharedValue(-300); // Drawer width

	// Animation for the overlay opacity
	const overlayOpacity = useSharedValue(0);

	const animatedDrawerStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(isOpen ? 0 : -300, {
						duration: 500,
					}),
				},
			],
		};
	});

	const animatedOverlayStyle = useAnimatedStyle(() => {
		return {
			opacity: withTiming(isOpen ? 0.5 : 0, {
				duration: 500,
			}),
		};
	});

	React.useEffect(() => {
		translateX.value = isOpen ? 0 : -300;
		overlayOpacity.value = isOpen ? 0.5 : 0;
	}, [isOpen]);

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<Pressable
					style={{
						position: "absolute",
						zIndex: 30,
						top: 0,
						left: 0,
						width,
						height: height * 1.5,
					}}
					onPress={toggleDrawer}
				>
					<Animated.View
						className="absolute top-0 left-0 w-full h-full bg-black"
						style={animatedOverlayStyle}
					/>
				</Pressable>
			)}

			{/* Drawer */}
			<Animated.View
				className="absolute top-0 left-0 w-64 bg-[#FFF1E2] shadow-xl drop-shadow-xl z-30"
				style={[
					animatedDrawerStyle,
					{
						height: height + 100, // Add extra height to ensure coverage
						paddingBottom: 100, // Add padding to account for safe areas
					},
				]}
			>
				<View className="flex-1 flex justify-between h-full">
					{/* Main Content ScrollView */}
					<ScrollView
						className="flex-1 p-4"
						showsVerticalScrollIndicator={false}
						bounces={false}
					>
						{/* Profile Section */}
						<Pressable
							onPress={() => {
								toggleDrawer();
								navigator.navigate("(drawer)", {
									screen: "index",
								});
							}}
							className="flex flex-col items-center mb-8 mt-14"
						>
							<View className="bg-white rounded-lg m-1 border-2 border-[#8F6AF8]/70">
								<Image
									source={
										user?.gender === "M"
											? require("@/assets/images/sleep/male-wizard.png")
											: require("@/assets/images/sleep/female-wizard.png")
									}
									className="w-40 h-40 rounded-lg mb-2"
								/>
							</View>
							<Text
								className="text-lg font-semibold truncate"
								numberOfLines={1}
							>
								{user?.sfId}
							</Text>
							<Text
								className="text-lg font-semibold truncate"
								numberOfLines={1}
							>
								{user?.name}
							</Text>
						</Pressable>

						{/* Drawer Items */}
						{items.map((item, index) => (
							<TouchableOpacity
								key={index}
								className="flex flex-row items-center mb-6"
								onPress={() => {
									toggleDrawer();

									if (item.name === "Sign Out") {
										clearData();
										setUser(null);
										setIsLoggedIn(false);
										navigator.replace("(auth)", {
											screen: "index",
										});
										return;
									}

									if (item.isExternalLink && item.url) {
										Linking.openURL(item.url);
										return;
									}

									navigator.navigate("(drawer)", {
										screen: item.linkTo,
									});
								}}
							>
								{item.icon}
								<Text className="text-lg ml-4">
									{item.name}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>

					{/* Footer Section */}
					<View className="p-4 border-t border-gray-200 bg-[#FFF1E2]">
						<TouchableOpacity
							onPress={() => {
								setPressCount(pressCount + 1);
								if (pressCount === 7) {
									Linking.openURL(
										"com.imaginedtime.sf25app://(tabs)/acco"
									);
									setPressCount(0);
									toggleDrawer();
								}
							}}
						>
							<Text className="text-gray-400 text-xs text-center mb-2">
								Version 1.0.4
							</Text>
						</TouchableOpacity>
						{/* <View className="flex flex-row justify-between mb-2">
							<Text className="text-gray-400 text-xs">About</Text>
							<Text className="text-gray-400 text-xs">T & C</Text>
							<Text className="text-gray-400 text-xs">
								Privacy Policy
							</Text>
						</View> */}
						<TouchableOpacity
							onPress={() =>
								Linking.openURL("https://springfest.in")
							}
						>
							<Text className="text-gray-400 text-xs text-center">
								https://springfest.in
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Animated.View>
		</>
	);
};

export default Drawer;
