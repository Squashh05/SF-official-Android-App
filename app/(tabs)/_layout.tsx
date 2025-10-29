import React, { useEffect, useState } from "react";
import { Tabs, useNavigation, useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, BackHandler, Dimensions } from "react-native";

import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { LinearGradient } from "expo-linear-gradient";
import Navbar from "@/components/Navbar";
import Drawer from "@/components/Drawer";

export default function _layout() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { width } = Dimensions.get("window");

	// Calculate icon size based on screen width
	const getIconSize = () => {
		if (width >= 768) {
			// tablet
			return 36;
		}
		return 26; // phone
	};

	// Calculate padding based on screen width
	const getPadding = () => {
		if (width >= 768) {
			return 12;
		}
		return 2;
	};

	// Calculate tab bar height based on screen width
	const getTabBarHeight = () => {
		if (width >= 768) {
			return 80;
		}
		return 60;
	};

	const getMinWidth = () => {
		if (width >= 768) {
			return 60;
		}
		return 44;
	};

	const iconSize = getIconSize();
	const padding = getPadding();
	const tabBarHeight = getTabBarHeight();

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};

	const segments = useSegments();

	useEffect(() => {
		const onBackPress = () => {
			console.log(segments);
			// This logic seems correct: it checks if you are at the top level of the tabs.
			if (segments.length === 1 && segments[0] === "(tabs)") {
				Alert.alert(
					"Exit App",
					"Are you sure you want to exit?",
					[
						{ text: "Cancel", style: "cancel", onPress: () => null },
						{ text: "Exit", onPress: () => BackHandler.exitApp() },
					],
					{ cancelable: true }
				);
				// Return true to prevent the default back behavior (exiting the app)
				return true;
			}
			// Return false to allow the default back behavior (e.g., navigating back)
			return false;
		};

		// 1. Save the subscription object
		const subscription = BackHandler.addEventListener(
			"hardwareBackPress",
			onBackPress
		);

		// 2. Return a cleanup function that calls .remove() on the subscription
		return () => subscription.remove();

	}, [segments]);

	return (
		<SafeAreaView className="flex-1" edges={["top"]}>
			<Navbar toggleDrawer={toggleDrawer} />
			<Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
				<Tabs
					screenOptions={{
						headerShown: false,
						tabBarStyle: {
							backgroundColor: "#fff",
							height: tabBarHeight,
							borderTopLeftRadius: 20,
							borderTopRightRadius: 20,
						},
						tabBarShowLabel: false,
					}}
				>
					<Tabs.Screen
						name="events"
						options={{
							tabBarIcon: ({ focused }) => (
								<LinearGradient
									colors={
										focused
											? ["#8F6AF8", "#7054BE"]
											: ["#fff", "#fff"]
									}
									className="rounded-2xl"
									style={{
										padding,
										minWidth: getMinWidth(),
										width: iconSize + (padding * 2) + 8,
										height: iconSize + (padding * 2) + 8,
										alignItems: 'center',
										justifyContent: 'center',
										// marginTop: 1
									}}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
								>
									<MaterialIcons
										name="event"
										size={iconSize}
										color={focused ? "#fff" : "#8F6AF8"}
									/>
								</LinearGradient>
							),
						}}
					/>

					<Tabs.Screen
						name="timeline"
						options={{
							tabBarIcon: ({ focused }) => (
								<LinearGradient
									colors={
										focused
											? ["#8F6AF8", "#7054BE"]
											: ["#fff", "#fff"]
									}
									className="rounded-2xl"
									style={{
										padding,
										minWidth: getMinWidth(),
										width: iconSize + (padding * 2) + 8,
										height: iconSize + (padding * 2) + 8,
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: 1
									}}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
								>
									<Feather
										name="clock"
										size={iconSize}
										color={focused ? "#fff" : "#8F6AF8"}
									/>
								</LinearGradient>
							),
						}}
					/>

					<Tabs.Screen
						name="index"
						options={{
							tabBarIcon: ({ focused }) => (
								<LinearGradient
									colors={
										focused
											? ["#8F6AF8", "#7054BE"]
											: ["#fff", "#fff"]
									}
									className="rounded-2xl"
									style={{
										padding,
										minWidth: getMinWidth(),
										width: iconSize + (padding * 2) + 8,
										height: iconSize + (padding * 2) + 8,
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: 1
									}}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
								>
									<Feather
										name="home"
										size={iconSize}
										color={focused ? "#fff" : "#8F6AF8"}
									/>
								</LinearGradient>
							),
						}}
					/>

					<Tabs.Screen
						name="merch"
						options={{
							tabBarIcon: ({ focused }) => (
								<LinearGradient
									colors={
										focused
											? ["#8F6AF8", "#7054BE"]
											: ["#fff", "#fff"]
									}
									className="rounded-2xl"
									style={{
										padding,
										minWidth: getMinWidth(),
										width: iconSize + (padding * 2) + 8,
										height: iconSize + (padding * 2) + 8,
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: 1
									}}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
								>
									<Ionicons
										name="shirt-outline"
										size={iconSize}
										color={focused ? "#fff" : "#8F6AF8"}
									/>
								</LinearGradient>
							),
						}}
					/>

					<Tabs.Screen
						name="acco"
						options={{
							tabBarIcon: ({ focused }) => (
								<LinearGradient
									colors={
										focused
											? ["#8F6AF8", "#7054BE"]
											: ["#fff", "#fff"]
									}
									className="rounded-2xl"
									style={{
										padding,
										minWidth: getMinWidth(),
										width: iconSize + (padding * 2) + 8,
										height: iconSize + (padding * 2) + 8,
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: 1
									}}
									start={{ x: 0.5, y: 0 }}
									end={{ x: 0.5, y: 1 }}
								>
									<MaterialCommunityIcons
										name="bed-outline"
										size={iconSize}
										color={focused ? "#fff" : "#8F6AF8"}
									/>
								</LinearGradient>
							),
						}}
					/>
				</Tabs>
		</SafeAreaView>
	);
}
