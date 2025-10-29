import {
	View,
	Text,
	ImageBackground,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { eventImages } from "@/constants/imagesData";

interface EventCardProps {
	event: any;
	isDeregistering: boolean;
	onDeregister: () => void;
}

export default function EventCard({
	event,
	isDeregistering,
	onDeregister,
}: EventCardProps) {
	return (
		<View className="bg-white rounded-xl overflow-hidden shadow-sm">
			<View className="bg-[#8F6AF8]/10">
				<ImageBackground
					source={
						eventImages[
							`${event.event.genre.genre.replaceAll(
								" ",
								""
							)}${event.event.name
								.split(" ")
								.map((word: string) =>
									word.charAt(0).match(/[a-zA-Z]/)
										? word.charAt(0).toUpperCase() +
										  word.slice(1)
										: word
								)
								.join("")
								.replace(/[^a-zA-Z0-9]/g, "")}`
						]
					}
					className="h-32 justify-end"
					resizeMode="contain"
					imageStyle={{ opacity: 0.9 }}
				>
					<LinearGradient
						colors={["transparent", "#8F6AF8"]}
						className="p-4"
					>
						<Text className="text-white text-lg font-bold">
							{event.event.name}
						</Text>
						<Text className="text-white/90">
							{event.event.genre.genre}
						</Text>
					</LinearGradient>
				</ImageBackground>
			</View>
			<View className="p-4 flex-row justify-between items-center">
				<View className="flex-row items-center">
					<MaterialIcons name="event" size={20} color="#8F6AF8" />
					<Text className="ml-2 text-gray-600">
						Event ID: {event.event.id}
					</Text>
				</View>
				<TouchableOpacity
					onPress={onDeregister}
					disabled={isDeregistering}
					className="flex-row items-center bg-red-500/10 px-4 py-2 rounded-full"
				>
					{isDeregistering ? (
						<ActivityIndicator size="small" color="#EF4444" />
					) : (
						<View className="flex flex-row justify-center items-center">
							<MaterialIcons
								name="person-remove"
								size={20}
								color="#EF4444"
							/>
							<Text className="text-red-500 font-medium ml-2">
								Deregister
							</Text>
						</View>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}
