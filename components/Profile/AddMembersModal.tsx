import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import React, { RefObject, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Button from "../Events/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface AddMembersModalProps {
	modalRef: React.RefObject<BottomSheetModal | null>;
	event: any;
	onAddMembers: (members: { sfId: string; email: string }[]) => Promise<void>;
}

export default function AddMembersModal({
	modalRef,
	event,
	onAddMembers,
}: AddMembersModalProps) {
	// console.log("From add members modal: ", JSON.stringify(event));

	const [loading, setLoading] = useState(false);
	const [newMembers, setNewMembers] = useState<
		{ sfId: string; email: string }[]
	>([{ sfId: "", email: "" }]);

	const handleMemberIdChange = (index: number, value: string) => {
		const updatedMembers = [...newMembers];
		updatedMembers[index].sfId = value;
		setNewMembers(updatedMembers);
	};

	const handleMemberEmailChange = (index: number, value: string) => {
		const updatedMembers = [...newMembers];
		updatedMembers[index].email = value;
		setNewMembers(updatedMembers);
	};

	const handleAddMember = () => {
		const currentMemberCount =
			event.GroupMembers.length + newMembers.length;
		if (currentMemberCount < event.event.max_participation) {
			setNewMembers([...newMembers, { sfId: "", email: "" }]);
		} else {
			ToastAndroid.show(
				`Maximum team size is ${event.event.max_participation}`,
				ToastAndroid.SHORT
			);
		}
	};

	const handleRemoveMember = (index: number) => {
		if (newMembers.length > 1) {
			const updatedMembers = [...newMembers];
			updatedMembers.splice(index, 1);
			setNewMembers(updatedMembers);
		}
	};

	const handleSubmit = async () => {
		if (
			newMembers.some(
				(member) =>
					member.sfId.trim() === "" || member.email.trim() === ""
			)
		) {
			ToastAndroid.show(
				"Please fill all member details",
				ToastAndroid.SHORT
			);
			return;
		}

		try {
			setLoading(true);
			await onAddMembers(newMembers);
			modalRef.current?.close();
			setNewMembers([{ sfId: "", email: "" }]);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSheetModal
			ref={modalRef}
			snapPoints={["80%", "90%"]}
			backgroundStyle={{ backgroundColor: "#F8F9FA" }}
		>
			<BottomSheetScrollView>
				{/* Header Section */}
				<LinearGradient
					colors={["#8F6AF8", "#7054BE"]}
					className="p-6 rounded-lg"
				>
					<View className="flex-row items-center justify-between">
						<View>
							<Text className="text-2xl font-bold text-white mb-1">
								Add Team Members
							</Text>
							<Text className="text-white/80">
								{event?.event.name}
							</Text>
						</View>
						<View className="bg-white/20 p-3 rounded-full">
							<MaterialIcons
								name="group-add"
								size={24}
								color="white"
							/>
						</View>
					</View>
				</LinearGradient>

				<View className="p-6 space-y-6">
					{/* Team Size Info */}
					<View className="bg-white p-4 rounded-xl shadow-sm mb-4">
						<View className="flex-row justify-between items-center">
							<View className="flex-row items-center">
								<MaterialIcons
									name="groups"
									size={20}
									color="#8F6AF8"
								/>
								<Text className="text-gray-800 ml-2">
									Current Team Size
								</Text>
							</View>
							<Text className="text-[#8F6AF8] font-medium">
								{event?.GroupMembers.length} /{" "}
								{event?.event.max_participation}
							</Text>
						</View>
					</View>

					{/* New Members Fields */}
					<View className="space-y-4">
						{newMembers.map((member, index) => (
							<View
								key={index}
								className="bg-white p-4 rounded-xl shadow-sm"
							>
								<View className="flex-row justify-between items-center mb-4">
									<Text className="text-lg font-semibold text-gray-800">
										New Member {index + 1}
									</Text>
									{newMembers.length > 1 && (
										<TouchableOpacity
											className="bg-red-500/10 p-2 rounded-full"
											onPress={() =>
												handleRemoveMember(index)
											}
										>
											<MaterialIcons
												name="person-remove"
												size={20}
												color="#EF4444"
											/>
										</TouchableOpacity>
									)}
								</View>

								<View className="space-y-4">
									<View>
										<Text className="text-gray-500 text-sm mb-1">
											SF ID
										</Text>
										<TextInput
											placeholder="Enter SF ID"
											value={member.sfId}
											onChangeText={(value) =>
												handleMemberIdChange(
													index,
													value
												)
											}
											className="bg-gray-50 p-3 rounded-lg text-gray-800"
										/>
									</View>

									<View>
										<Text className="text-gray-500 text-sm mb-1">
											Email
										</Text>
										<TextInput
											placeholder="Enter Email"
											value={member.email}
											onChangeText={(value) =>
												handleMemberEmailChange(
													index,
													value
												)
											}
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
					<View className="space-y-3 mb-16">
						{event?.GroupMembers.length + newMembers.length <
							event?.event.max_participation && (
								<TouchableOpacity
									onPress={handleAddMember}
									className="flex-row items-center justify-center bg-[#8F6AF8]/10 p-4 rounded-xl"
								>
									<MaterialIcons
										name="person-add"
										size={20}
										color="#8F6AF8"
									/>
									<Text className="text-[#8F6AF8] font-medium ml-2">
										Add Another Member
									</Text>
								</TouchableOpacity>
							)}

						<Button
							marginTop={20}
							text={loading ? "Adding Members..." : "Add Members"}
							loading={loading}
							handleClick={handleSubmit}
						/>
					</View>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
