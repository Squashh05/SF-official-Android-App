import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Slot, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserContext } from "@/context/userContext";

export default function _layout() {
	// check if user is logged in
	const { isLoggedIn } = useUserContext();

	const navigator = useNavigation<any>();

	if (isLoggedIn) {
		navigator.replace("(tabs)", {
			screen: "index",
		});
	}

	return (
		<SafeAreaView className="flex-1 bg-[#8F6AF8]/60">
			<View className="flex-row justify-between items-center px-6 py-4">
				<View className="flex items-center justify-center">
					<View className="w-20 h-20 bg-white/30 rounded-full absolute" />
					<View className="w-16 h-16 bg-white rounded-full overflow-hidden shadow-lg">
						<Image
							source={require("@/assets/images/icon.png")}
							width={40}
							height={40}
							className="w-full h-full"
						/>
					</View>
				</View>

				<Pressable
					onPress={() => {
						if (isLoggedIn) {
							navigator.replace("(tabs)", {
								screen: "index",
							});
						} else {
							navigator.navigate("(auth)", { screen: "index" });
						}
					}}
					className="bg-white/20 px-4 py-2 rounded-full"
				>
					<Text className="text-white font-bold text-lg">Skip</Text>
				</Pressable>
			</View>

			<Slot />
		</SafeAreaView>
	);
}
