import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import React, { RefObject } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Button from "./Button";
import axios from "axios";
import { useUserContext } from "@/context/userContext";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function RegisterModal({
	registrationModalRef,
	selectedSubEvent,
	participantIds,
	setParticipantIds,
	participantEmails,
	setParticipantEmails,
}: {
	registrationModalRef: RefObject<BottomSheetModal>;
	selectedSubEvent: any;
	participantIds: string[];
	setParticipantIds: (participantIds: string[]) => void;
	participantEmails: string[];
	setParticipantEmails: (participantEmails: string[]) => void;
}) {
	const [loading, setLoading] = React.useState(false);
	const { user, token } = useUserContext();

	const handleParticipantIdChange = (index: number, value: string) => {
		const updatedParticipants = [...participantIds];
		updatedParticipants[index] = value;
		setParticipantIds(updatedParticipants);
	};

	const handleParticipantEmailChange = (index: number, value: string) => {
		const updatedEmails = [...participantEmails];
		updatedEmails[index] = value;
		setParticipantEmails(updatedEmails);
	};

	const handleAddParticipant = () => {
		if (participantIds.length < selectedSubEvent?.max_participation) {
			setParticipantIds([...participantIds, ""]);
		} else {
			ToastAndroid.show(
				`You can only add up to ${selectedSubEvent?.max_participation} participants.`,
				ToastAndroid.SHORT
			);
		}
	};

	const handleRemoveParticipant = (index: number) => {
		if (participantIds.length > selectedSubEvent?.min_participation) {
			const updatedParticipants = [...participantIds];
			updatedParticipants.splice(index, 1);
			setParticipantIds(updatedParticipants);
		} else {
			ToastAndroid.show(
				`At least ${selectedSubEvent?.min_participation} participants are required.`,
				ToastAndroid.SHORT
			);
		}
	};

	const handleRegistration = async () => {
		if (
			participantIds.some((id) => id.trim() === "") ||
			participantEmails.some((email) => email.trim() === "")
		) {
			ToastAndroid.show(
				"Please fill out all participant SF IDs.",
				ToastAndroid.SHORT
			);
			return;
		}

		console.log("Registering with participants:", participantIds);

		try {
			setLoading(true);

			let teamMembers = participantIds.map((id, index) => ({
				sfId: id,
				email: participantEmails[index],
			}));

			const body = {
				token,
				eventCity: "KGP",
				eventId: selectedSubEvent.id,
				teamMembers,
			};

			console.log(JSON.stringify(body));

			const response: any = await axios.post("/event/register", body);

			// console.log(JSON.stringify(response));

			if (response.data.code === 0) {
				registrationModalRef.current?.close();
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			} else if (response.data.code === -5) {
				ToastAndroid.show(
					"Invalid member details! Enter valid SF ID.",
					ToastAndroid.SHORT
				);
			} else if (response.data.code === -4) {
				ToastAndroid.show(
					"Participant/s Already Registered For This Event.",
					ToastAndroid.SHORT
				);
			} else if (response.data.code === -2) {
				ToastAndroid.show(
					"Registration unsuccessful. Please logout and login again",
					ToastAndroid.SHORT
				);
			} else if (response.data.code === -10) {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			} else if (response.data.code === -6) {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			} else {
				ToastAndroid.show(
					response.data.message,
					ToastAndroid.LONG
				);
			}
		} catch (error) {
			console.log("error occurred in sending data", JSON.stringify(error));
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSheetModal
			ref={registrationModalRef}
			snapPoints={["80%", "100%"]}
			backgroundStyle={{ backgroundColor: "#F8F9FA" }}
		>
			<BottomSheetScrollView>
				{/* Header Section */}
				<LinearGradient
					colors={["#8F6AF8", "#7054BE"]}
					className="p-6"
				>
					<View className="flex-row items-center justify-between">
						<View>
							<Text className="text-2xl font-bold text-white mb-1">
								Register Team
							</Text>
							<Text className="text-white/80">
								{selectedSubEvent?.name}
							</Text>
						</View>
						<View className="bg-white/20 p-3 rounded-full">
							<MaterialIcons name="group-add" size={24} color="white" />
						</View>
					</View>
				</LinearGradient>

				<View className="p-6 space-y-6">
					{/* Team Size Info */}
					{selectedSubEvent?.is_group && (
						<View className="bg-white p-4 rounded-xl shadow-sm mb-4">
							<View className="flex-row justify-between items-center">
								<View className="flex-row items-center">
									<MaterialIcons name="groups" size={20} color="#8F6AF8" />
									<Text className="text-gray-800 ml-2">Team Size</Text>
								</View>
								<Text className="text-[#8F6AF8] font-medium">
									{participantIds.length} / {selectedSubEvent?.max_participation}
								</Text>
							</View>
						</View>
					)}

					{/* Participant Fields */}
					<View className="space-y-4">
						{participantIds.map((participantId, index) => (
							<View
								key={index}
								className="bg-white p-4 rounded-xl shadow-sm"
							>
								<View className="flex-row justify-between items-center mb-4">
									<Text className="text-lg font-semibold text-gray-800">
										Participant {index + 1}
									</Text>
									{index >= selectedSubEvent?.min_participation && (
										<TouchableOpacity
											className="bg-red-500/10 p-2 rounded-full"
											onPress={() => handleRemoveParticipant(index)}
										>
											<MaterialIcons name="person-remove" size={20} color="#EF4444" />
										</TouchableOpacity>
									)}
								</View>

								<View className="space-y-4">
									<View>
										<Text className="text-gray-500 text-sm mb-1">SF ID</Text>
										<TextInput
											placeholder="Enter SF ID"
											value={participantId}
											onChangeText={(value) => handleParticipantIdChange(index, value)}
											className="bg-gray-50 p-3 rounded-lg text-gray-800"
										/>
									</View>

									<View>
										<Text className="text-gray-500 text-sm mb-1">Email</Text>
										<TextInput
											placeholder="Enter Email"
											value={participantEmails[index]}
											onChangeText={(value) => handleParticipantEmailChange(index, value)}
											className="bg-gray-50 p-3 rounded-lg text-gray-800"
											keyboardType="email-address"
											autoCapitalize="none"
										/>
									</View>
								</View>
							</View>
						))}
					</View>

					{/* Action Buttons */}
					<View className="space-y-3">
						{selectedSubEvent?.is_group && participantIds.length < selectedSubEvent?.max_participation && (
							<TouchableOpacity
								onPress={handleAddParticipant}
								className="flex-row items-center justify-center bg-[#8F6AF8]/10 p-4 rounded-xl"
							>
								<MaterialIcons name="person-add" size={20} color="#8F6AF8" />
								<Text className="text-[#8F6AF8] font-medium ml-2">
									Add Participant
								</Text>
							</TouchableOpacity>
						)}

						<Button
							text={loading ? "Registering..." : "Confirm Registration"}
							loading={loading}
							handleClick={handleRegistration}
						/>
					</View>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
