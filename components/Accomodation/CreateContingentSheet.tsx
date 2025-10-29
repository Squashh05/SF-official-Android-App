import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useCallback } from "react";
import { useUserContext } from "@/context/userContext";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface Props {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	onSuccess: () => void;
}

export default function CreateContingentSheet({
	bottomSheetRef,
	onSuccess,
}: Props) {
	const { token } = useUserContext();
	const [contingentName, setContingentName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleCreate = async () => {
		if (!contingentName.trim()) {
			setError("Please enter a contingent name");
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/contingent",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						token,
						contingent_name: contingentName,
					}),
				}
			);
			const data = await response.json();
			if (data.code === 0) {
				bottomSheetRef.current?.dismiss();
				onSuccess();
			} else {
				setError(data.message);
			}
		} catch (err) {
			setError("Failed to create contingent");
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={["40%"]}
			enablePanDownToClose
		>
			<BottomSheetScrollView className="flex-1 p-4">
				<View
					className="flex-1 p-4"
					style={{
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 4,
						},
						shadowOpacity: 0.32,
						shadowRadius: 5.46,

						elevation: 9,
					}}
				>
					<Text className="text-2xl font-bold text-gray-800 mb-6">
						Create New Contingent
					</Text>

					{error ? (
						<Text className="text-red-500 mb-4">{error}</Text>
					) : null}

					<TextInput
						placeholder="Enter Contingent Name"
						value={contingentName}
						onChangeText={setContingentName}
						className="bg-gray-100 p-4 rounded-xl mb-4"
					/>

					<TouchableOpacity
						onPress={handleCreate}
						disabled={loading}
						className={`bg-[#8F6AF8] p-4 rounded-xl ${
							loading ? "opacity-50" : ""
						}`}
					>
						<Text className="text-white font-bold text-center">
							{loading ? "Creating..." : "Create Contingent"}
						</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
