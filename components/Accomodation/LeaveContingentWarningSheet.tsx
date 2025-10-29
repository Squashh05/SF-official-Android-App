import { View, Text, TouchableOpacity } from "react-native";
import React, { RefObject } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
	bottomSheetRef: RefObject<BottomSheetModal>;
	isLeader: boolean;
	onConfirm: () => void;
}

export default function LeaveContingentWarningSheet({
	bottomSheetRef,
	isLeader,
	onConfirm,
}: Props) {
	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={["80%", "90%"]}
			enablePanDownToClose
			backgroundStyle={{ backgroundColor: "#F8F9FA" }}
		>
			<BottomSheetScrollView className="flex-1 p-6">
				<View className="items-center mb-2 p-4">
					<View className="bg-red-100 p-4 rounded-full mb-4">
						<MaterialIcons
							name={isLeader ? "warning" : "exit-to-app"}
							size={32}
							color="#EF4444"
						/>
					</View>
					<Text className="text-xl font-bold text-gray-800 mb-2">
						{isLeader ? "Delete Contingent?" : "Leave Contingent?"}
					</Text>
					<Text className="text-gray-500 text-center mb-6">
						Please read the following carefully
					</Text>
				</View>

				<View className="space-y-4 mb-6 px-6">
					{isLeader ? (
						<>
							<WarningItem
								icon="payments"
								title="Payment Status Preserved"
								description="Individual payment status of all members will remain unchanged"
							/>
							<WarningItem
								icon="emoji-events"
								title="Championship Records"
								description="All contingent championship records will be permanently deleted"
							/>
							<WarningItem
								icon="restore"
								title="No Recovery"
								description="You'll need to create a new contingent to participate again"
							/>
						</>
					) : (
						<>
							<WarningItem
								icon="payments"
								title="Payment Status Preserved"
								description="Your payment status will remain unchanged"
							/>
							<WarningItem
								icon="emoji-events"
								title="Championship Points"
								description="Your points will be removed from contingent championship"
							/>
							<WarningItem
								icon="group"
								title="Rejoin Available"
								description="You can rejoin the contingent later if it still exists"
							/>
						</>
					)}
				</View>

				<View className="space-y-3 px-4">
					<TouchableOpacity
						onPress={onConfirm}
						className="bg-red-500 p-4 rounded-xl flex-row items-center justify-center"
					>
						<MaterialIcons
							name={isLeader ? "delete" : "exit-to-app"}
							size={20}
							color="white"
						/>
						<Text className="text-white font-bold ml-2">
							{isLeader
								? "Yes, Delete Contingent"
								: "Yes, Leave Contingent"}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => bottomSheetRef.current?.dismiss()}
						className="p-4 rounded-xl flex-row items-center justify-center"
					>
						<Text className="text-gray-600 font-medium">
							Cancel
						</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}

function WarningItem({
	icon,
	title,
	description,
}: {
	icon: string;
	title: string;
	description: string;
}) {
	return (
		<View className="flex-row items-start my-1">
			<View className="bg-red-50 p-2 rounded-lg">
				<MaterialIcons name={icon as any} size={20} color="#EF4444" />
			</View>
			<View className="ml-3 flex-1">
				<Text className="text-gray-800 font-medium mb-1">{title}</Text>
				<Text className="text-gray-500 text-sm">{description}</Text>
			</View>
		</View>
	);
}
