import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Button from "./Button";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { categoryImages, eventImages } from "@/constants/imagesData";

export default function SubEventModal({
	bottomSheetModalRef,
	selectedSubEvent,
	handleCloseAndOpenRegistration,
}: {
	bottomSheetModalRef: any;
	selectedSubEvent: any;
	handleCloseAndOpenRegistration: () => void;
}) {
	const image =
		eventImages[
			`${selectedSubEvent?.genre.replaceAll(
				" ",
				""
			)}${selectedSubEvent?.name
				.split(" ")
				.map((word: string) =>
					word.charAt(0).match(/[a-zA-Z]/)
						? word.charAt(0).toUpperCase() + word.slice(1)
						: word
				)
				.join("")
				.replace(/[^a-zA-Z0-9]/g, "")}`
		];

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			snapPoints={["80%", "100%"]}
			enableDynamicSizing={false}
			backgroundStyle={{ backgroundColor: "#F8F9FA" }}
		>
			<BottomSheetScrollView>
				{/* Hero Section with Image */}
				<View className="h-48 w-full relative bg-[#8F6AF8]/10">
					<View className="absolute inset-0 bg-[#8F6AF8]/5" />
					<Image
						source={
							image === undefined
								? categoryImages[selectedSubEvent?.genre]
								: image
						}
						className="w-full h-full"
						resizeMode="contain"
						style={{ opacity: 0.9 }}
					/>
					<LinearGradient
						colors={["transparent", "#8F6AF8"]}
						className="absolute bottom-0 left-0 right-0 p-4"
					>
						<Text className="text-2xl font-bold text-white">
							{selectedSubEvent?.name}
						</Text>
						<View className="flex-row items-center mt-1">
							<MaterialIcons
								name="event"
								size={16}
								color="white"
							/>
							<Text className="text-white/90 ml-2">
								{selectedSubEvent?.is_group
									? "Group Event"
									: "Solo Event"}
							</Text>
						</View>
					</LinearGradient>
				</View>

				<View className="px-6 space-y-6">
					{/* Event Description */}
					<View className="bg-white p-4 rounded-xl shadow-sm">
						<Text className="text-gray-600 leading-6">
							{selectedSubEvent?.writeup}
						</Text>
					</View>

					{/* Event Details Card */}
					{selectedSubEvent?.is_group && (
						<View className="bg-white p-4 rounded-xl shadow-sm">
							<View className="flex-row items-center mb-4">
								<MaterialIcons
									name="groups"
									size={24}
									color="#8F6AF8"
								/>
								<Text className="text-lg font-bold ml-2 text-gray-800">
									Team Details
								</Text>
							</View>
							<View className="space-y-3">
								<View className="flex-row justify-between items-center">
									<Text className="text-gray-600">
										Minimum Members
									</Text>
									<View className="bg-purple-100 px-3 py-1 rounded-full">
										<Text className="text-[#8F6AF8] font-medium">
											{
												selectedSubEvent?.min_participation
											}
										</Text>
									</View>
								</View>
								<View className="flex-row justify-between items-center">
									<Text className="text-gray-600">
										Maximum Members
									</Text>
									<View className="bg-purple-100 px-3 py-1 rounded-full">
										<Text className="text-[#8F6AF8] font-medium">
											{
												selectedSubEvent?.max_participation
											}
										</Text>
									</View>
								</View>
							</View>
						</View>
					)}

					{/* Rules Section */}
					<View className="bg-white p-4 rounded-xl shadow-sm">
						<View className="flex-row items-center mb-4">
							<FontAwesome5
								name="clipboard-list"
								size={20}
								color="#8F6AF8"
							/>
							<Text className="text-lg font-bold ml-2 text-gray-800">
								Rules & Guidelines
							</Text>
						</View>
						<View className="space-y-2">
							{selectedSubEvent?.rules.map(
								(rule: string, index: number) => {
									if (rule.trim() === "") return;
									return (
										<View key={index} className="flex-row">
											<Text className="text-[#8F6AF8] mr-2">
												•
											</Text>
											<Text className="text-gray-600 flex-1">
												{rule.trim()}
											</Text>
										</View>
									);
								}
							)}
						</View>
					</View>

					<Pressable
						onPress={handleCloseAndOpenRegistration}
						className="mt-4 h-20"
					>
						<LinearGradient
							colors={["#8F6AF8", "#7054BE"]}
							className="rounded-xl px-4 py-3"
							start={{ x: 0.5, y: 0 }}
							end={{ x: 0.5, y: 1 }}
						>
							<Text className="text-white text-lg font-bold text-center">
								Register Now!
							</Text>
						</LinearGradient>
					</Pressable>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
