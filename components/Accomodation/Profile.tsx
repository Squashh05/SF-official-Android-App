import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useUserContext } from "@/context/userContext";
import { MaterialIcons } from "@expo/vector-icons";
import QRCodeModal from "./QRModal";
import { ScrollView } from "react-native-gesture-handler";
import PaymentFormModal from "./PaymentFormModal";

type PaymentType = "Individual" | "Contingent";

export default function Profile() {
	const { user, token, hallData, fetchHallData } = useUserContext();
	const [contingentData, setContingentData] = useState<any>(null);
	const [showSfIdModal, setShowSfIdModal] = useState(false);
	const [showContingentModal, setShowContingentModal] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paymentType, setPaymentType] = useState<"Individual" | "Contingent">(
		"Individual"
	);
	const isLeader = contingentData?.leaderId === user?.id;

	const allPaid = contingentData?.members?.every(
		(member: any) => member.paymentStatus
	);

	useEffect(() => {
		fetchContingentData();
		fetchHallData();
	}, []);

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

	const handlePaymentPress = (type: "Individual" | "Contingent") => {
		setPaymentType(type);
		setShowPaymentModal(true);
	};

	return (
		<ScrollView className="flex-1 p-4">
			{/* Personal ID Card */}
			<TouchableOpacity
				onPress={() => setShowSfIdModal(true)}
				className="bg-white rounded-xl p-6 mb-4"
			>
				<View className="flex-row justify-between items-center">
					<View>
						<Text className="text-xl font-bold text-gray-800">
							Personal ID
						</Text>
						<Text className="text-gray-500">{user?.sfId}</Text>
					</View>
					<View className="bg-[#8F6AF8]/10 p-2 rounded-full">
						<MaterialIcons
							name="qr-code"
							size={24}
							color="#8F6AF8"
						/>
					</View>
				</View>
			</TouchableOpacity>

			{/* Hall Allocation Card */}
			{user?.payment_status ? (
				<View className="bg-white rounded-xl p-6 mb-4">
					<View className="flex-row justify-between items-center">
						<View>
							<Text className="text-xl font-bold text-gray-800">
								Hall Allocation
							</Text>
							<Text
								className={
									hallData
										? "text-gray-500"
										: "text-orange-500"
								}
							>
								{hallData
									? hallData.hallAlloted
									: "Not Allocated Yet"}
							</Text>
						</View>
						<View className="bg-[#8F6AF8]/10 p-2 rounded-full">
							<MaterialIcons
								name="apartment"
								size={24}
								color="#8F6AF8"
							/>
						</View>
					</View>
				</View>
			) : null}

			{/* Contingent Details Card */}
			{contingentData && (
				<TouchableOpacity
					onPress={() => setShowContingentModal(true)}
					className="bg-white rounded-xl p-6"
				>
					<View className="flex-row justify-between items-center">
						<View>
							<Text className="text-xl font-bold text-gray-800">
								Contingent Details
							</Text>
							<Text className="text-gray-500">
								{contingentData.contingent_name} (
								{contingentData.id})
							</Text>
						</View>
						<View className="bg-[#8F6AF8]/10 p-2 rounded-full">
							<MaterialIcons
								name="qr-code"
								size={24}
								color="#8F6AF8"
							/>
						</View>
					</View>
				</TouchableOpacity>
			)}

			{/* Payment Card */}
			<View className="bg-white rounded-xl p-6 mb-4 mt-4">
				<View className="space-y-4">
					<View className="flex-row justify-between items-center">
						<Text className="text-xl font-bold text-gray-800">
							Payment Status
						</Text>
						<View className="bg-[#8F6AF8]/10 p-2 rounded-full">
							<MaterialIcons
								name="payment"
								size={24}
								color="#8F6AF8"
							/>
						</View>
					</View>

					{/* Individual Payment Button */}
					<TouchableOpacity
						onPress={() =>
							user?.payment_status
								? null
								: handlePaymentPress("Individual")
						}
						className={`p-4 rounded-xl flex-row items-center justify-center ${
							user?.payment_status
								? "bg-green-500"
								: "bg-[#8F6AF8]"
						}`}
					>
						<MaterialIcons name="person" size={20} color="white" />
						<Text className="text-white font-bold ml-2">
							{user?.payment_status
								? "Payment Verified - Individual"
								: "Pay for Yourself"}
						</Text>
					</TouchableOpacity>

					{/* Contingent Payment Button (Only for leaders) */}
					{isLeader && contingentData && (
						<TouchableOpacity
							onPress={() =>
								allPaid
									? null
									: handlePaymentPress("Contingent")
							}
							className={`p-4 rounded-xl flex-row items-center justify-center ${
								allPaid ? "bg-green-500" : "bg-[#8F6AF8]"
							}`}
						>
							<MaterialIcons
								name="group"
								size={20}
								color="white"
							/>
							<Text className="text-white font-bold ml-2">
								{allPaid
									? "Payment Verified - Contingent"
									: "Pay for Entire Contingent"}
							</Text>
						</TouchableOpacity>
					)}
				</View>
			</View>

			<QRCodeModal
				visible={showSfIdModal}
				onClose={() => setShowSfIdModal(false)}
				value={user?.sfId || ""}
				title="Personal ID QR Code"
			/>

			<QRCodeModal
				visible={showContingentModal}
				onClose={() => setShowContingentModal(false)}
				value={contingentData ? contingentData.id : ""}
				title="Contingent QR Code"
			/>

			<PaymentFormModal
				visible={showPaymentModal}
				onClose={() => setShowPaymentModal(false)}
				type={paymentType}
			/>
		</ScrollView>
	);
}
