import { Text, Pressable, Image, View, ImageBackground } from "react-native";
import React from "react";
import { categoryImages, eventImages } from "@/constants/imagesData";
import { useUserContext } from "@/context/userContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function SubEventsCardLayout({
	category,
	subEvents,
	setSelectedSubEvent,
	setParticipantIds,
	handlePresentModalPress,
}: {
	category: string;
	subEvents: any;
	setSelectedSubEvent: (subEvent: any) => void;
	setParticipantIds: (participantIds: string[]) => void;
	handlePresentModalPress: () => void;
}) {
	const { user } = useUserContext();

	return (
		<View className="px-4 py-6 -mt-14">
			{/* Enhanced Section Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="rounded-2xl p-4 mb-6 shadow-lg"
			>
				<View className="flex-row justify-between items-center">
					<View className="flex-row items-center flex-1">
						<View className="bg-white/20 p-2 rounded-xl mr-3">
							<FontAwesome5
								name="trophy"
								size={20}
								color="white"
							/>
						</View>
						<View>
							<Text className="text-white text-xl font-bold">
								Available Events
							</Text>
							<Text className="text-white/80 text-sm">
								{category} • {subEvents?.length || 0} Events
							</Text>
						</View>
					</View>
					<View className="bg-white/20 px-3 py-1 rounded-full">
						<Text className="text-white font-medium">
							{subEvents?.length || 0}
						</Text>
					</View>
				</View>
			</LinearGradient>

			{/* Events Grid */}
			<View className="flex-row flex-wrap justify-between">
				{subEvents &&
					subEvents.map((subEvent: any, index: number) => {
						const eventKey = `${category.replaceAll(
							" ",
							""
						)}${subEvent.name
							.split(" ")
							.map((word: string) =>
								word.charAt(0).match(/[a-zA-Z]/)
									? word.charAt(0).toUpperCase() +
									  word.slice(1)
									: word
							)
							.join("")
							.replace(/[^a-zA-Z0-9]/g, "")}`;

						const image = eventImages[eventKey];

						return (
							<Pressable
								key={index}
								className="w-[48%] mb-4"
								onPress={() => {
									setSelectedSubEvent(subEvent);
									let ids = new Array(
										subEvent?.min_participation || 1
									).fill("");
									ids[0] = user?.sfId || "";
									setParticipantIds(ids);
									handlePresentModalPress();
								}}
							>
								<View className="bg-white rounded-xl overflow-hidden shadow-md">
									<View className="bg-[#8F6AF8]/50">
										<ImageBackground
											source={
												image === undefined
													? categoryImages[category]
													: image
											}
											className="h-40 justify-end"
											resizeMode="contain"
											imageStyle={{ opacity: 0.9 }}
										>
											<LinearGradient
												colors={[
													"transparent",
													"#8F6AF8",
												]}
												className="p-3"
											>
												<View>
													<Text
														className="text-white font-bold text-lg mb-1"
														style={{
															textShadowColor:
																"rgba(0, 0, 0, 0.25)",
															textShadowOffset: {
																width: -1,
																height: 1,
															},
															textShadowRadius: 10,
														}}
													>
														{subEvent.name}
													</Text>
													<View className="flex-row items-center justify-between">
														<View className="flex-row items-center">
															<MaterialIcons
																name="group"
																size={16}
																color="white"
															/>
															<Text className="text-white/90 text-sm ml-1">
																{
																	subEvent.min_participation
																}{" "}
																{subEvent.min_participation >
																1
																	? "Members"
																	: "Member"}
															</Text>
														</View>
														<MaterialIcons
															name="arrow-forward-ios"
															size={16}
															color="white"
														/>
													</View>
												</View>
											</LinearGradient>
										</ImageBackground>
									</View>
								</View>
							</Pressable>
						);
					})}
			</View>

			{/* Empty State */}
			{(!subEvents || subEvents.length === 0) && (
				<View className="flex-1 justify-center items-center p-6">
					<MaterialIcons
						name="event-busy"
						size={48}
						color="#CBD5E1"
					/>
					<Text className="text-gray-400 mt-2 text-center">
						No events available at the moment
					</Text>
				</View>
			)}
		</View>
	);
}
