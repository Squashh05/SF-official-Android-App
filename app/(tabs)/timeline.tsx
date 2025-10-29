import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Switch,
	Pressable,
	ToastAndroid,
} from "react-native";
import { day0, day1, day2, day3 } from "@/times.js";
import MapData from "@/constants/map-data";
import { format, parseISO } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "@/context/userContext";
import { useNavigation } from "expo-router";
import {
	registerForPushNotificationsAsync,
	scheduleEventNotification,
} from "@/utils/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const { width } = Dimensions.get("window");

const dayLabels = [
	{ day: "Day 0", date: "23th Jan" },
	{ day: "Day 1", date: "24th Jan" },
	{ day: "Day 2", date: "25th Jan" },
	{ day: "Day 3", date: "26th Jan" },
];

export default function Timeline() {
	const [selectedDay, setSelectedDay] = useState(0);
	const [showOnlyRegistered, setShowOnlyRegistered] = useState(false);
	const { soloEvents, groupEvents } = useUserContext();

	const [loading, setLoading] = useState(true);

	const [days, setDays] = useState([day0, day1, day2, day3]);

	const fetchAndCacheSchedule = async () => {
		setLoading(true);
		try {
			const response = await axios.get("/content/schedule");
			const data = response.data.data;

			const daysData = [data.day0, data.day1, data.day2, data.day3];

			console.log(daysData);

			await AsyncStorage.setItem(
				"cached_timeline",
				JSON.stringify({
					timestamp: Date.now(),
					data: daysData,
				})
			);

			setDays(daysData);
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	const loadSchedule = async () => {
		try {
			const cachedData = await AsyncStorage.getItem("cached_timeline");

			if (cachedData) {
				console.log("trying to load cached data");
				const { timestamp, data } = JSON.parse(cachedData);
				const cacheAge = Date.now() - timestamp;
				const cacheExpiry = 15 * 60 * 1000; // 15 minutes

				if (cacheAge < cacheExpiry) {
					setDays(data);
					setLoading(false);
					return;
				}
			}

			await fetchAndCacheSchedule();
		} catch (error) {
			console.error("Error loading schedule:", error);
			ToastAndroid.show("Failed to load schedule", ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	// const days = [day0, day1, day2, day3];

	const navigator = useNavigation<any>();

	// Combine registered events
	const registeredEvents = [...soloEvents, ...groupEvents].map(
		(event) => event.event.id
	);

	const handleDayChange = (dayIndex: number) => {
		setSelectedDay(dayIndex);
	};

	const filterEvents = (events: any[]) => {
		if (!showOnlyRegistered) return events;
		return events.filter((event) => registeredEvents.includes(event.id));
	};

	const sortedEvents: any = React.useMemo(() => {
		const events = filterEvents(days[selectedDay]);
		return [...events].sort((a, b) => {
			const timeA = new Date(`${a.date}T${a.time}`);
			const timeB = new Date(`${b.date}T${b.time}`);
			return timeA.getTime() - timeB.getTime();
		});
	}, [selectedDay, showOnlyRegistered]);

	useEffect(() => {
		loadSchedule();
	}, []);

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="px-4 pt-4 pb-6"
			>
				<Text className="text-2xl font-bold text-white mb-4">
					Event Schedule
				</Text>

				{/* Day Selector */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					className="flex-row mb-6"
				>
					{dayLabels.map((dayInfo, index) => (
						<TouchableOpacity
							key={index}
							onPress={() => handleDayChange(index)}
							className={`mr-4 px-6 py-3 rounded-xl ${
								selectedDay === index
									? "bg-white"
									: "bg-white/20"
							}`}
						>
							<Text
								className={`text-base font-bold ${
									selectedDay === index
										? "text-[#8F6AF8]"
										: "text-white"
								}`}
							>
								{dayInfo.day}
							</Text>
							<Text
								className={`text-sm ${
									selectedDay === index
										? "text-[#8F6AF8]/70"
										: "text-white/70"
								}`}
							>
								{dayInfo.date}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>

				{/* Filter Switch */}
				<View className="flex-row items-center justify-between bg-white/10 px-4 py-3 rounded-2xl">
					<View className="flex-row items-center">
						<MaterialIcons
							name="event-available"
							size={22}
							color="white"
						/>
						<Text className="text-white ml-3 mr-4 font-semibold">
							My Events Only
						</Text>
					</View>
					<Switch
						value={showOnlyRegistered}
						onValueChange={setShowOnlyRegistered}
						trackColor={{ false: "#ffffff30", true: "#9F7AF8" }}
						thumbColor={showOnlyRegistered ? "#ffffff" : "#f4f3f4"}
						ios_backgroundColor="#ffffff30"
						style={{ transform: [{ scale: 1.3 }] }}
					/>
				</View>
			</LinearGradient>

			{/* Timeline */}
			<ScrollView className="flex-1 px-4">
				{sortedEvents.length > 0 ? (
					sortedEvents.map((event: any, index: number) => {
						const isRegistered = registeredEvents.includes(
							event.id
						);
						const eventTime = new Date(
							`${event.date}T${event.time}`
						);
						const formattedTime = format(eventTime, "hh:mm a");

						return (
							<View
								key={event.id + Math.random()}
								className="flex-row mt-4"
							>
								{/* Time Column */}
								<View className="items-center mr-4 w-20">
									<Text className="text-gray-500 font-medium">
										{formattedTime}
									</Text>
									<View
										className={`h-16 w-0.5 mt-2 ${
											isRegistered
												? "bg-[#8F6AF8]"
												: "bg-gray-200"
										}`}
									/>
								</View>

								{/* Event Card */}
								<View
									className={`flex-1 bg-white rounded-xl p-4 shadow-sm mb-4 ${
										isRegistered
											? "border-l-4 border-[#8F6AF8]"
											: ""
									}`}
								>
									<View className="flex-row items-center justify-between mb-2">
										<Text className="text-lg font-bold text-gray-800">
											{event.title}
										</Text>
										{isRegistered && (
											<View className="bg-[#8F6AF8]/10 p-1 rounded-full">
												<MaterialIcons
													name="check-circle"
													size={20}
													color="#8F6AF8"
												/>
											</View>
										)}
									</View>

									<View className="flex-row items-between justify-between">
										<View className="flex flex-row items-center">
											<MaterialIcons
												name="location-on"
												size={16}
												color="#8F6AF8"
											/>
											<Text className="text-gray-600 ml-1">
												{
													MapData.find(
														(map) =>
															map.id ===
															event.locationId
													)?.title
												}
											</Text>
										</View>

										<Pressable
											onPress={() => {
												navigator.navigate(
													"(location)",
													{
														screen: "index",
														params: {
															id: event.locationId,
														},
													}
												);
											}}
											className="ml-2 flex flex-row items-center"
										>
											<Text className="text-[#8F6AF8]">
												Venue
											</Text>
											<MaterialIcons
												name="chevron-right"
												size={26}
												color="#8F6AF8"
											/>
										</Pressable>
									</View>
								</View>
							</View>
						);
					})
				) : (
					<View className="flex-1 items-center justify-center mt-20">
						<MaterialIcons
							name="event-busy"
							size={48}
							color="#8F6AF8"
							style={{ opacity: 0.5 }}
						/>
						<Text className="text-gray-400 text-lg mt-4 text-center">
							{showOnlyRegistered
								? "No registered events for this day"
								: "Schedule is currently unavailable"}
						</Text>
						{showOnlyRegistered && (
							<TouchableOpacity
								onPress={() => setShowOnlyRegistered(false)}
								className="mt-4 bg-[#8F6AF8]/10 px-4 py-2 rounded-full"
							>
								<Text className="text-[#8F6AF8]">
									Show All Events
								</Text>
							</TouchableOpacity>
						)}
					</View>
				)}
				<View className="h-20" />
			</ScrollView>
		</View>
	);
}
