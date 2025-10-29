import React, { useState } from "react";
import {
	View,
	Text,
	Modal,
	TouchableOpacity,
	TextInput,
	ScrollView,
	ToastAndroid,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "@/context/userContext";

import * as WebBrowser from "expo-web-browser";

interface PaymentFormModalProps {
	visible: boolean;
	onClose: () => void;
	type: "Individual" | "Contingent";
}

export interface PaymentFormData {
	check_in: string;
	check_out: string;
	emergency_number: string;
}

const CHECK_IN_DATES = [
	{ label: "23rd January 2025 Thursday", value: "2025-01-23" },
	{ label: "24th January 2025 Friday", value: "2025-01-24" },
	{ label: "25th January 2025 Saturday", value: "2025-01-25" },
	{ label: "26th January 2025 Sunday", value: "2025-01-26" },
];

export default function PaymentFormModal({
	visible,
	onClose,
	type,
}: PaymentFormModalProps) {
	const [checkIn, setCheckIn] = useState<string | null>(null);
	const [checkOut, setCheckOut] = useState<string | null>(null);
	const [emergencyNumber, setEmergencyNumber] = useState("");
	const [showCheckInOptions, setShowCheckInOptions] = useState(false);
	const [showCheckOutOptions, setShowCheckOutOptions] = useState(false);

	const { token } = useUserContext();

	const getCheckOutDates = () => {
		if (!checkIn) return [];
		const checkInIndex = CHECK_IN_DATES.findIndex(
			(date) => date.value === checkIn
		);
		return CHECK_IN_DATES.slice(checkInIndex);
	};

	const handleSubmit = async () => {
		if (!checkIn || !checkOut || !emergencyNumber) return;

		try {
			const paymentData = {
				token,
				check_in: checkIn,
				check_out: checkOut,
				emergency_number: emergencyNumber,
				type_of_acco: "Common",
				type_of_payment: type,
				payment_source_id: "1",
			};

			const url = `https://springfest.in/?token=${token}&phoneNumber=${emergencyNumber}&type=${type}&origin=2`;

			await WebBrowser.openBrowserAsync(url);

			// const response = await fetch(
			// 	"https://masterapi-springfest.vercel.app/api/payment/initiate",
			// 	{
			// 		method: "POST",
			// 		headers: { "Content-Type": "application/json" },
			// 		body: JSON.stringify(paymentData),
			// 	}
			// );

			// const data = await response.json();
			// if (data.code === 0) {
			// 	await WebBrowser.openBrowserAsync(data.data.redirectUrl);
			// } else {
			// 	ToastAndroid.show(data.message, ToastAndroid.SHORT);
			// }
		} catch (err) {
			console.error("Payment initiation failed:", err);
			ToastAndroid.show("Payment initiation failed", ToastAndroid.SHORT);
		} finally {
			onClose();
		}
	};

	const getSelectedDateLabel = (
		value: string | null,
		dates: typeof CHECK_IN_DATES
	) => {
		if (!value) return "Select Date";
		return (
			dates.find((date) => date.value === value)?.label || "Select Date"
		);
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View className="flex-1 bg-black/50 justify-center p-4">
				<View className="bg-white rounded-2xl p-6">
					{/* Header */}
					<View className="flex-row items-center justify-between mb-6">
						<View>
							<Text className="text-2xl font-bold text-gray-800 mb-1">
								Payment Details
							</Text>
							<Text className="text-gray-500">
								{type === "Individual"
									? "Individual Payment"
									: "Contingent Payment"}
							</Text>
						</View>
						<TouchableOpacity
							onPress={onClose}
							className="bg-gray-100 p-2 rounded-full"
						>
							<MaterialIcons
								name="close"
								size={24}
								color="#374151"
							/>
						</TouchableOpacity>
					</View>

					{/* Form */}
					<ScrollView className="space-y-4">
						{/* Check-in Date */}
						<View className="mb-4">
							<Text className="text-gray-600 mb-2 font-medium">
								Check-in Date
							</Text>
							<TouchableOpacity
								onPress={() => {
									setShowCheckInOptions(true);
									setShowCheckOutOptions(false);
								}}
								className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex-row justify-between items-center"
							>
								<Text className="text-gray-800">
									{getSelectedDateLabel(
										checkIn,
										CHECK_IN_DATES
									)}
								</Text>
								<MaterialIcons
									name={
										showCheckInOptions
											? "keyboard-arrow-up"
											: "keyboard-arrow-down"
									}
									size={24}
									color="#374151"
								/>
							</TouchableOpacity>

							{showCheckInOptions && (
								<View className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
									{CHECK_IN_DATES.map((date) => (
										<TouchableOpacity
											key={date.value}
											onPress={() => {
												setCheckIn(date.value);
												setCheckOut(null);
												setShowCheckInOptions(false);
											}}
											className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${checkIn === date.value
													? "bg-purple-50"
													: ""
												}`}
										>
											<Text
												className={`${checkIn === date.value
														? "text-[#8F6AF8] font-medium"
														: "text-gray-800"
													}`}
											>
												{date.label}
											</Text>
											{checkIn === date.value && (
												<MaterialIcons
													name="check"
													size={20}
													color="#8F6AF8"
												/>
											)}
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Check-out Date */}
						<View className="mb-4">
							<Text className="text-gray-600 mb-2 font-medium">
								Check-out Date
							</Text>
							<TouchableOpacity
								onPress={() => {
									if (!checkIn) {
										ToastAndroid.show(
											"Please select check-in date first",
											ToastAndroid.SHORT
										);
										return;
									}
									setShowCheckOutOptions(true);
									setShowCheckInOptions(false);
								}}
								className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex-row justify-between items-center"
							>
								<Text className="text-gray-800">
									{getSelectedDateLabel(
										checkOut,
										getCheckOutDates()
									)}
								</Text>
								<MaterialIcons
									name={
										showCheckOutOptions
											? "keyboard-arrow-up"
											: "keyboard-arrow-down"
									}
									size={24}
									color="#374151"
								/>
							</TouchableOpacity>

							{showCheckOutOptions && checkIn && (
								<View className="mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
									{getCheckOutDates().map((date) => (
										<TouchableOpacity
											key={date.value}
											onPress={() => {
												setCheckOut(date.value);
												setShowCheckOutOptions(false);
											}}
											className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${checkOut === date.value
													? "bg-purple-50"
													: ""
												}`}
										>
											<Text
												className={`${checkOut === date.value
														? "text-[#8F6AF8] font-medium"
														: "text-gray-800"
													}`}
											>
												{date.label}
											</Text>
											{checkOut === date.value && (
												<MaterialIcons
													name="check"
													size={20}
													color="#8F6AF8"
												/>
											)}
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Emergency Number */}
						<View>
							<Text className="text-gray-600 mb-2 font-medium">
								Emergency Contact
							</Text>
							<TextInput
								value={emergencyNumber}
								onChangeText={setEmergencyNumber}
								placeholder="Enter 10-digit number"
								keyboardType="number-pad"
								maxLength={10}
								className="bg-gray-50 p-4 rounded-xl border border-gray-200"
							/>
						</View>
					</ScrollView>

					{/* Submit Button */}
					<TouchableOpacity
						onPress={handleSubmit}
						disabled={
							!checkIn ||
							!checkOut ||
							emergencyNumber.length !== 10
						}
						className={`mt-6 p-4 rounded-xl flex-row items-center justify-center 
              ${!checkIn || !checkOut || emergencyNumber.length !== 10
								? "bg-gray-300"
								: "bg-[#8F6AF8]"
							}`}
					>
						<MaterialIcons
							name="check-circle"
							size={20}
							color="white"
						/>
						<Text className="text-white font-bold ml-2">
							Proceed to Payment
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}
