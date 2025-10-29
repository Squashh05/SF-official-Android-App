import {
	View,
	TouchableOpacity,
	ActivityIndicator,
	Text,
	ToastAndroid,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useUserContext } from "@/context/userContext";
import { MaterialIcons } from "@expo/vector-icons";
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import ContingentDetails from "./ContingentDetails";
import CreateContingentSheet from "./CreateContingentSheet";
import JoinContingentSheet from "./JoinContingentSheet";

export default function Contingent() {
	const { token } = useUserContext();
	const [loading, setLoading] = useState(true);
	const [contingentData, setContingentData] = useState<any>(null);
	const [error, setError] = useState("");

	const createSheetRef = useRef<BottomSheetModal>(null);
	const joinSheetRef = useRef<BottomSheetModal>(null);

	useEffect(() => {
		checkContingentStatus();
	}, []);

	const checkContingentStatus = async () => {
		try {
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/contingent/getMembers",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				}
			);
			const data = await response.json();
			setContingentData(data.code === 0 ? data.data : null);
		} catch (err) {
			setError("Failed to fetch contingent status");
			ToastAndroid.show(
				"Failed To Get Contingent Data",
				ToastAndroid.SHORT
			);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#8F6AF8" />
			</View>
		);
	}

	if (contingentData) {
		return (
			<ContingentDetails
				data={contingentData}
				checkContingentStatus={checkContingentStatus}
			/>
		);
	}

	return (
		<View className="flex-1 p-4">
			<View className="space-y-4">
				<TouchableOpacity
					onPress={() => createSheetRef.current?.present()}
					className="bg-[#8F6AF8] p-4 rounded-xl flex-row items-center justify-between"
				>
					<View className="flex-row items-center">
						<MaterialIcons
							name="group-add"
							size={24}
							color="white"
						/>
						<Text className="text-white font-bold text-lg ml-3">
							Create Contingent
						</Text>
					</View>
					<MaterialIcons
						name="arrow-forward"
						size={24}
						color="white"
					/>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => {
						console.log("open");
						joinSheetRef.current?.present();
					}}
					className="bg-white border-2 border-[#8F6AF8] p-4 rounded-xl flex-row items-center justify-between"
				>
					<View className="flex-row items-center">
						<MaterialIcons name="group" size={24} color="#8F6AF8" />
						<Text className="text-[#8F6AF8] font-bold text-lg ml-3">
							Join Contingent
						</Text>
					</View>
					<MaterialIcons
						name="arrow-forward"
						size={24}
						color="#8F6AF8"
					/>
				</TouchableOpacity>
			</View>

			<CreateContingentSheet
				bottomSheetRef={createSheetRef}
				onSuccess={checkContingentStatus}
			/>

			<JoinContingentSheet
				bottomSheetRef={joinSheetRef}
				onSuccess={checkContingentStatus}
			/>
		</View>
	);
}
