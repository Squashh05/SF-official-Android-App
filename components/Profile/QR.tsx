import { View, Text, ToastAndroid, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
	BarcodeCreatorView,
	BarcodeFormat,
} from "react-native-barcode-creator";
import { useUserContext } from "@/context/userContext";

export default function QR() {
	const { user, token } = useUserContext();

	const [contingentData, setContingentData] = useState<any>(null);

	const fetchContingentData = async () => {
		try {
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/contingent/getMembers",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token }),
				}
			);
			const data = await response.json();
			if (data.code === 0) {
				setContingentData(data.data);
			}
		} catch (err) {
			console.log("Failed to fetch contingent data");
			ToastAndroid.show(
				"Failed To Get Contingent Data",
				ToastAndroid.SHORT
			);
		}
	};
	useEffect(() => {
		fetchContingentData();
	}, []);

	return (
		<ScrollView
			className="space-y-4 mb-16"
			showsVerticalScrollIndicator={false}
		>
			<Text className="text-xl font-bold text-purple-600">
				Your QR Code
			</Text>
			<View className="bg-gray-100 p-4 rounded-lg space-y-2 items-center">
				<Text className="text-base font-medium text-[#8F6AF8] text-center">
					Scan this QR code to check-in at the event.
				</Text>
			</View>
			<View className="self-center items-center bg-gray-100 p-4 pt-2 max-w-[80%] rounded-xl">
				<Text className="text-xl font-bold text-gray-800 text-center mb-2">
					Personal Id
				</Text>
				<BarcodeCreatorView
					value={user?.sfId}
					background={"#FFFFFF"}
					foregroundColor={"#000000"}
					format={BarcodeFormat.CODE128}
					style={{ width: 250, height: 125 }}
				/>
				<Text className="text-lg font-bold text-gray-800 text-center mt-2">
					{user?.sfId}
				</Text>
			</View>
			{contingentData ? (
				<View className="self-center items-center bg-gray-100 p-4 pt-2 max-w-[80%] rounded-xl">
					<Text className="text-xl font-bold text-gray-800 text-center mb-2">
						Contingent Id
					</Text>
					<BarcodeCreatorView
						value={contingentData ? contingentData.id : ""}
						background={"#FFFFFF"}
						foregroundColor={"#000000"}
						format={BarcodeFormat.CODE128}
						style={{ width: 250, height: 125 }}
					/>
					<Text className="text-lg font-bold text-gray-800 text-center mt-2">
						{contingentData ? contingentData.id : ""}
					</Text>
				</View>
			) : null}
		</ScrollView>
	);
}
