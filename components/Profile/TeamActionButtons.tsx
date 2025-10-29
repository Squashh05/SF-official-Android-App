import { View, TouchableOpacity, Text, ActivityIndicator, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TeamActionButtonsProps {
	isDeregistering: boolean;
	onDeregisterSelected: () => void;
	onAddMembers: () => void;
	onDeregisterTeam: () => void;
}

export default function TeamActionButtons({
	isDeregistering,
	onDeregisterSelected,
	onAddMembers,
	onDeregisterTeam,
}: TeamActionButtonsProps) {
	return (
		<ScrollView 
			horizontal 
			showsHorizontalScrollIndicator={false}
			className="pt-2"
		>
			<View className="flex-row items-center gap-2 pr-2">
				<TouchableOpacity
					onPress={onDeregisterSelected}
					disabled={isDeregistering}
					className="flex-row items-center bg-red-500/10 px-4 py-2 rounded-full"
				>
					{isDeregistering ? (
						<ActivityIndicator size="small" color="#EF4444" />
					) : (
						<>
							<MaterialIcons
								name="person-remove"
								size={20}
								color="#EF4444"
							/>
							<Text className="text-red-500 font-medium ml-1">
								Remove Selected
							</Text>
						</>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					onPress={onAddMembers}
					className="flex-row items-center bg-[#8F6AF8]/10 px-4 py-2 rounded-full"
				>
					<MaterialIcons
						name="person-add"
						size={20}
						color="#8F6AF8"
					/>
					<Text className="text-[#8F6AF8] font-medium ml-1">
						Add Members
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={onDeregisterTeam}
					disabled={isDeregistering}
					className="flex-row items-center bg-red-500/10 px-4 py-2 rounded-full"
				>
					{isDeregistering ? (
						<ActivityIndicator size="small" color="#EF4444" />
					) : (
						<>
							<MaterialIcons
								name="groups"
								size={20}
								color="#EF4444"
							/>
							<Text className="text-red-500 font-medium ml-1">
								Deregister Team
							</Text>
						</>
					)}
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}
