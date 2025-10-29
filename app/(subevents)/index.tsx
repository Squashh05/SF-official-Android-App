import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import { useUserContext } from "@/context/userContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import { useLocalSearchParams, useNavigation } from "expo-router";
import SubEventsCardLayout from "@/components/Events/SubEventsCardLayout";
import RegisterModal from "@/components/Events/RegisterModal";
import SubEventModal from "@/components/Events/SubEventModal";

export default function index() {
	const { eventsData, user } = useUserContext();
	const { category = "Dance" } = useLocalSearchParams();
	const [subEvents, setSubEvents] = React.useState<any>(null);
	const [selectedSubEvent, setSelectedSubEvent] = React.useState<any>(null);

	const [participantIds, setParticipantIds] = React.useState<string[]>([
		user?.sfId || "",
	]);
	const [participantEmails, setParticipantEmails] = React.useState<string[]>([
		user?.email || "",
	]);

	const navigator = useNavigation<any>();

	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const registrationModalRef = useRef<BottomSheetModal>(null);

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleCloseAndOpenRegistration = useCallback(() => {
		bottomSheetModalRef.current?.close();
		setTimeout(() => {
			registrationModalRef.current?.present();
		}, 300);
	}, []);

	useEffect(() => {
		if (!eventsData) return;

		const subEvents = eventsData.filter((event: any) => {
			return event.genre === category;
		});
		setSubEvents(subEvents[0].events);
	}, [eventsData]);

	return (
		<View className="flex-1">
			<ScrollView className="flex-1">
				<LinearGradient
					colors={["#F6D54B", "#F6B54B"]}
					className="pt-10 h-[200px]"
					style={{
						borderBottomLeftRadius: 1000,
						borderBottomRightRadius: 1000,
						transform: [{ scaleX: 1.5 }],
						marginBottom: -40,
					}}
				>
					<View style={{ transform: [{ scaleX: 1 / 1.5 }] }}>
						<View className="flex-row justify-center px-6">
							<TouchableOpacity
								onPress={() =>
									navigator.navigate("(tabs)", {
										screen: "events",
									})
								}
								className="mr-4 absolute left-4 p-3 rounded-full"
							>
								<FontAwesome5
									name="chevron-left"
									size={24}
									color="#1f2937"
								/>
							</TouchableOpacity>
							<Text className="text-4xl text-center font-extrabold text-gray-800">
								{category}
							</Text>
						</View>
					</View>
				</LinearGradient>

				<SubEventsCardLayout
					category={category as string}
					subEvents={subEvents}
					setSelectedSubEvent={setSelectedSubEvent}
					handlePresentModalPress={handlePresentModalPress}
					setParticipantIds={setParticipantIds}
				/>
			</ScrollView>
			<BottomSheetModalProvider>
				<SubEventModal
					bottomSheetModalRef={bottomSheetModalRef}
					selectedSubEvent={selectedSubEvent}
					handleCloseAndOpenRegistration={
						handleCloseAndOpenRegistration
					}
				/>

				<RegisterModal
					registrationModalRef={registrationModalRef}
					selectedSubEvent={selectedSubEvent}
					participantIds={participantIds}
					setParticipantIds={setParticipantIds}
					participantEmails={participantEmails}
					setParticipantEmails={setParticipantEmails}
				/>
			</BottomSheetModalProvider>
		</View>
	);
}
