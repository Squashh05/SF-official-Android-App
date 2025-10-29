import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

interface Props {
	bottomSheetRef: React.RefObject<BottomSheetModal>;
	onSuccess: () => void;
}

export default function JoinContingentSheet({
	bottomSheetRef,
	onSuccess,
}: Props) {
	const { token } = useUserContext();
	const [contingentId, setContingentId] = useState("");
	const [contingentCode, setContingentCode] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleJoin = async () => {
		if (!contingentId.trim() || !contingentCode.trim()) {
			setError("Please fill all fields");
			return;
		}

		try {
			setLoading(true);
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/contingent/join",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						token,
						contingent_id: contingentId,
						contingent_code: contingentCode,
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
			setError("Failed to join contingent");
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSheetModal
			ref={bottomSheetRef}
			snapPoints={["50%"]}
			backgroundStyle={{ backgroundColor: "#F8F9FA" }}
		>
			<BottomSheetScrollView className="flex-1 p-4">
				<View className="flex-1 p-4">
					<Text className="text-2xl font-bold text-gray-800 mb-6">
						Join Contingent
					</Text>

					{error ? (
						<Text className="text-red-500 mb-4">{error}</Text>
					) : null}

					<TextInput
						placeholder="Enter Contingent ID"
						value={contingentId}
						onChangeText={setContingentId}
						className="bg-gray-100 p-4 rounded-xl mb-4"
					/>

					<TextInput
						placeholder="Enter Contingent Code"
						value={contingentCode}
						onChangeText={setContingentCode}
						className="bg-gray-100 p-4 rounded-xl mb-4"
					/>

					<TouchableOpacity
						onPress={handleJoin}
						disabled={loading}
						className={`bg-[#8F6AF8] p-4 rounded-xl ${
							loading ? "opacity-50" : ""
						}`}
					>
						<Text className="text-white font-bold text-center">
							{loading ? "Joining..." : "Join Contingent"}
						</Text>
					</TouchableOpacity>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
