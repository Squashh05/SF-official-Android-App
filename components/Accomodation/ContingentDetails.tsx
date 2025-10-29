import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import React, { useRef } from "react";
import { useUserContext } from "@/context/userContext";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import AddContingentMembersModal from "./AddContingentMembersModal";
import { useNavigation } from "expo-router";
import LeaveContingentWarningSheet from "./LeaveContingentWarningSheet";

interface Props {
	data: any;
	checkContingentStatus: () => void;
}

export default function ContingentDetails({
	data,
	checkContingentStatus,
}: Props) {
	const { user, token } = useUserContext();
	const isLeader = data.leaderId === user?.id;
	const addMembersRef = useRef<BottomSheetModal>(null);
	const warningSheetRef = useRef<BottomSheetModal>(null);

	const handleLeaveContingent = async () => {
		try {
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/contingent/leave",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				}
			);
			const responseData = await response.json();

			if (responseData.code === 0) {
				ToastAndroid.show(
					isLeader ? "Successfully deleted the contingent" : "Successfully left the contingent",
					ToastAndroid.SHORT
				);
				checkContingentStatus();
			} else {
				ToastAndroid.show(responseData.message, ToastAndroid.SHORT);
			}
		} catch (err) {
			ToastAndroid.show(
				isLeader ? "Failed to delete contingent" : "Failed to leave contingent",
				ToastAndroid.SHORT
			);
		}
	};

	return (
		<View className="flex-1">
			<ScrollView className="flex-1">
				<View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
					<Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
						{data.contingent_name}
					</Text>
					<View className="flex-row items-center justify-between mb-4">
						<View className="bg-gray-50 px-4 py-2 rounded-xl">
							<Text className="text-gray-400 text-sm">ID</Text>
							<Text className="text-gray-700 text-lg font-medium">
								{data.id}
							</Text>
						</View>
						<View className="bg-gray-50 px-4 py-2 rounded-xl">
							<Text className="text-gray-400 text-sm">Code</Text>
							<Text className="text-gray-700 text-lg font-medium">
								{data.code}
							</Text>
						</View>
					</View>
					<View className="bg-gray-50 rounded-xl p-3 flex-row items-center justify-center">
						<Text className="text-gray-500 text-base mr-2">Status</Text>
						{data.contingent_payment_status ? (
							<Text className="text-green-500 font-semibold text-base">Paid</Text>
						) : (
							<Text className="text-red-500 font-semibold text-base">Unpaid</Text>
						)}
					</View>
				</View>

				<View className="bg-white rounded-2xl p-6 shadow-sm mb-4">
					<Text className="text-xl font-bold text-gray-800 mb-6">
						Members
					</Text>
					{data.updatedMembersInfo.map((member: any) => (
						<View
							key={member.sfId}
							className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
						>
							<View>
								<Text className="text-gray-800 text-base font-medium mb-1">
									{member.name}
								</Text>
								<View className="flex-row items-center">
									<Text className="text-gray-500 text-sm">
										{member.sfId}
									</Text>
									<Text className="text-gray-400 mx-2">•</Text>
									{member.paymentStatus ? (
										<Text className="text-green-500 text-sm font-medium">
											Paid
										</Text>
									) : (
										<Text className="text-red-500 text-sm font-medium">
											Unpaid
										</Text>
									)}
								</View>
							</View>
							{member.id === data.leaderId && (
								<View className="bg-purple-100 px-3 py-1.5 rounded-full">
									<Text className="text-[#8F6AF8] text-sm font-medium">
										Leader
									</Text>
								</View>
							)}
						</View>
					))}
				</View>

				{/* Action Buttons */}
				<View className="p-4 space-y-3">
					{isLeader ? (
						<>
							<TouchableOpacity
								onPress={() => addMembersRef.current?.present()}
								className="bg-[#8F6AF8] p-4 rounded-xl flex-row items-center justify-center shadow-sm"
							>
								<MaterialIcons
									name="person-add"
									size={20}
									color="white"
								/>
								<Text className="text-white font-bold ml-2 text-base">
									Add Members
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => warningSheetRef.current?.present()}
								className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center shadow-sm"
							>
								<MaterialIcons
									name="delete"
									size={20}
									color="white"
								/>
								<Text className="text-white font-bold ml-2 text-base">
									Delete Contingent
								</Text>
							</TouchableOpacity>
						</>
					) : (
						<TouchableOpacity
							onPress={() => warningSheetRef.current?.present()}
							className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center shadow-sm"
						>
							<MaterialIcons
								name="exit-to-app"
								size={20}
								color="white"
							/>
							<Text className="text-white font-bold ml-2 text-base">
								Leave Contingent
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>

			<AddContingentMembersModal
				bottomSheetRef={addMembersRef}
				onSuccess={() => {
					checkContingentStatus();
					addMembersRef.current?.dismiss();
				}}
			/>

			<LeaveContingentWarningSheet
				bottomSheetRef={warningSheetRef}
				isLeader={isLeader}
				onConfirm={() => {
					handleLeaveContingent();
					warningSheetRef.current?.dismiss();
				}}
			/>
		</View>
	);
}
