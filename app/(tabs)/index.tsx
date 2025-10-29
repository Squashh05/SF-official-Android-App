import {
	View,
	Text,
	ImageBackground,
	ScrollView,
	ImageSourcePropType,
	Dimensions,
	BackHandler,
	Alert,
	Pressable,
	Linking,
} from "react-native";
import HomeCarousel from "@/components/HomeCarousel";
import { useUserContext } from "@/context/userContext";
import { galleryImages } from "@/constants/imagesData";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import RegisteredEvents from "@/components/Home/RegisteredEvents";
import QuickActionButtons from "@/components/Home/QuickActionButtons";
import Explore from "@/components/Home/Explore";
import { WebView } from "react-native-webview";

import YoutubePlayer from "react-native-youtube-iframe";
import { useEffect, useState } from "react";
import {
	registerForPushNotificationsAsync,
	scheduleEventNotification,
} from "@/utils/notifications";

import { day0, day1, day2, day3 } from "@/times";

const { width } = Dimensions.get("window");

export default function Home() {
	const { user, soloEvents, groupEvents } = useUserContext();
	const days = [day0, day1, day2, day3];

	const [error, setError] = useState(false);

	useEffect(() => {
		const setupNotifications = async () => {
			// Request permissions
			const hasPermission = await registerForPushNotificationsAsync();
			if (!hasPermission) return;

			// Schedule notifications for all registered events
			const registeredEventDetails = [...soloEvents, ...groupEvents]
				.map((reg) => {
					const eventDetails = days
						.flat()
						.find((event) => event.id === reg.event.id);
					return eventDetails;
				})
				.filter((event) => event); // Remove undefined events

			// Schedule new notifications and track their identifiers
			const newScheduledIds = [];

			for (const event of registeredEventDetails) {
				const notificationId = await scheduleEventNotification(event);
				if (notificationId) {
					newScheduledIds.push(event?.id);
				}
			}
		};

		setupNotifications();
	}, [soloEvents, groupEvents]);

	return (
		<ScrollView className="flex-1 bg-gray-50">
			{/* Hero Section */}
			<View className="relative mb-10">
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
						<View className="flex-row justify-between items-center px-6">
							<View>
								<Text className="text-4xl font-extrabold mb-4 text-gray-100">
									Hello
								</Text>
								<Text
									className="text-3xl font-light text-gray-100"
									numberOfLines={1}
								>
									{user?.name}
								</Text>
							</View>
						</View>
					</View>
				</LinearGradient>
			</View>

			<HomeCarousel />

			<View className="-translate-y-28">
				<Explore />
				<QuickActionButtons />
				<RegisteredEvents />
			</View>

			<View className="px-6 mb-8 -translate-y-28">
				<View className="flex-row justify-between items-center mb-4">
					<View>
						<Text className="text-2xl font-bold text-gray-800">
							Spring Fest '23
						</Text>
						<Text className="text-gray-500">
							Relive the memories
						</Text>
					</View>
				</View>

				<View className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
					{!error ? (
						<YoutubePlayer
							height={300}
							play={false}
							videoId={"QfM0xUC0Xng"}
							onError={() => {
								setError(true);
							}}
							onReady={() => {
								setError(false);
							}}
						/>
					) : (
						<View className="flex justify-center items-center flex-1 gap-2">
							<Text className="text-red-500 text-center font-bold text-xl">
								Network Error
							</Text>
							<Text className="text-center text-white">
								Error Loading Video
							</Text>
						</View>
					)}
				</View>

				{/* Watch on Youtube button */}
				<View className="flex-row items-center justify-center mt-4">
					<Pressable
						onPress={() => {
							Alert.alert(
								"Open in Youtube",
								"Would you like to open the video in Youtube?",
								[
									{
										text: "Cancel",
										style: "cancel",
									},
									{
										text: "Open",
										onPress: () => {
											Linking.openURL(
												"https://www.youtube.com/watch?v=QfM0xUC0Xng"
											);
										},
									},
								]
							);
						}}
						className="flex-row items-center bg-[#FF0000] px-4 py-2 rounded-full"
					>
						<MaterialIcons
							name="play-arrow"
							size={24}
							color="white"
						/>
						<Text className="text-white font-bold ml-2">
							Watch on Youtube
						</Text>
					</Pressable>
				</View>

				{/* Video Description */}
				<View className="mt-4 bg-white p-4 rounded-xl shadow-sm -mb-28">
					<View className="flex-row items-center justify-between">
						<View className="flex-row items-center">
							<MaterialIcons
								name="movie"
								size={24}
								color="#8F6AF8"
							/>
							<Text className="text-gray-800 font-bold text-lg ml-2">
								Official Aftermovie
							</Text>
						</View>
						<View className="bg-[#8F6AF8]/10 px-3 py-1 rounded-full">
							<Text className="text-[#8F6AF8] font-medium">
								2023
							</Text>
						</View>
					</View>
					<Text className="text-gray-600 mt-2">
						Experience the magic and grandeur of Spring Fest 2023.
						From electrifying performances to unforgettable moments,
						relive the journey that made history.
					</Text>
				</View>
			</View>

			{/* Pronites Section */}
			{/* <View className="mb-6 flex">
				<View className="flex-row justify-between items-center mb-4 px-6">
					<View>
						<Text className="text-2xl font-bold text-gray-800">
							Experience Pronites
						</Text>
						<Text className="text-gray-500">
							Star-studded performances await
						</Text>
					</View>
				</View>

				<Carousel
					style={{
						alignSelf: "center",
					}}
					loop={true}
					width={width * 0.95}
					height={250}
					autoPlay={true}
					autoPlayInterval={4000}
					data={Object.values(galleryImages)}
					scrollAnimationDuration={1000}
					mode="vertical-stack"
					modeConfig={{
						showLength: 600,
					}}
					renderItem={({ item }) => (
						<View className="items-center">
							<View className="w-[90%] h-[95%] rounded-2xl overflow-hidden">
								<ImageBackground
									source={item as ImageSourcePropType}
									className="w-full h-full"
									resizeMode="cover"
								>
									<LinearGradient
										colors={[
											"transparent",
											"rgba(0,0,0,0.8)",
										]}
										className="absolute bottom-0 left-0 right-0 p-4"
									>
										<View className="flex-row items-center">
											<MaterialIcons
												name="music-note"
												size={20}
												color="white"
											/>
											<Text className="text-white font-bold text-lg ml-2">
												Artist Name
											</Text>
										</View>
										<Text className="text-white/80 ml-7">
											Genre • Date • Time
										</Text>
									</LinearGradient>
								</ImageBackground>
							</View>
						</View>
					)}
				/>
			</View> */}

			{/* Guest Lectures Section */}
			{/* <View className="mb-20 flex">
				<View className="flex-row justify-between items-center mb-4 px-6">
					<View>
						<Text className="text-2xl font-bold text-gray-800">
							Guest Lectures
						</Text>
						<Text className="text-gray-500">
							Learn from industry leaders
						</Text>
					</View>
				</View>

				<Carousel
					loop
					style={{
						alignSelf: "center",
					}}
					width={width}
					height={250}
					autoPlay={true}
					autoPlayInterval={3500}
					data={Object.values(galleryImages)}
					scrollAnimationDuration={1000}
					mode="horizontal-stack"
					modeConfig={
						{
							// showLength: 200,
						}
					}
					renderItem={({ item }) => (
						<View className="items-center">
							<View className="w-[85%] h-[95%] bg-white rounded-3xl overflow-hidden shadow-lg">
								<ImageBackground
									source={item}
									className="w-full h-full"
									resizeMode="cover"
								>
									<LinearGradient
										colors={["transparent", "#8F6AF8"]}
										className="absolute bottom-0 left-0 right-0 h-20"
									/>
								</ImageBackground>
								<View className="p-4 bg-[#8F6AF8]">
									<Text className="text-white font-bold text-lg">
										Speaker Name
									</Text>
									<View className="flex-row items-center mt-1">
										<MaterialIcons
											name="business"
											size={16}
											color="white"
										/>
										<Text className="text-white/90 ml-2">
											Company • Position
										</Text>
									</View>
								</View>
							</View>
						</View>
					)}
				/>
			</View> */}
		</ScrollView>
	);
}
