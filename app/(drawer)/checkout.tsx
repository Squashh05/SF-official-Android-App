import React, { useState } from "react";
import { View, Text, ToastAndroid } from "react-native";
import { useUserContext } from "@/context/userContext";
import Ionicons from "@expo/vector-icons/Ionicons"; // Icon for the third step confirmation
import CheckoutForm from "@/components/Merch/CheckoutForm";
import ConfirmationPage from "@/components/Merch/ConfirmationPage";
import { useLocalSearchParams, useNavigation } from "expo-router";

export default function Checkout() {
	const navigator = useNavigation<any>();

	const { deliveryOption } : {deliveryOption: string} = useLocalSearchParams();

	const [step, setStep] = useState(1); // Track the current step in the form
	const [personalInfo, setPersonalInfo] = useState({
		name: "",
		email: "",
		phoneNumber: "",
		deliveryOption: deliveryOption || 'pickup',
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		pincode: "",
	});

	const goToNextStep = async () => {
		if (
			personalInfo.name &&
			personalInfo.email &&
			personalInfo.phoneNumber
		) {
			if (personalInfo.deliveryOption === 'delivery' && 
				(!personalInfo.addressLine1 || 
				 !personalInfo.city || 
				 !personalInfo.state || 
				 !personalInfo.pincode)) {
				ToastAndroid.show("Please fill all address fields for delivery", ToastAndroid.SHORT);
				return;
			}
			setStep(step + 1);
		} else {
			ToastAndroid.show("Please fill all required fields", ToastAndroid.SHORT);
		}
	};

	return (
		<View className="flex-1 bg-gray-100">
			{/* Step Indicator */}
			<View className="flex-row justify-between items-center mx-4 my-6">
				<View className="flex-1 items-center">
					<View
						className={`h-10 w-10 rounded-full ${
							step >= 1 ? "bg-[#8F6AF8]" : "bg-gray-200"
						} items-center justify-center mb-2`}
					>
						<Text className="text-white font-bold">1</Text>
					</View>
					<Text
						className={`text-sm ${
							step === 1
								? "text-[#8F6AF8] font-bold"
								: "text-gray-500"
						}`}
						numberOfLines={1}
					>
						Details
					</Text>
				</View>

				<View
					className={`h-1 flex-1 mx-2 ${
						step >= 2 ? "bg-[#8F6AF8]" : "bg-gray-200"
					}`}
				/>

				<View className="flex-1 items-center">
					<View
						className={`h-10 w-10 rounded-full ${
							step >= 2 ? "bg-[#8F6AF8]" : "bg-gray-200"
						} items-center justify-center mb-2`}
					>
						<Text className="text-white font-bold">2</Text>
					</View>
					<Text
						className={`text-sm ${
							step === 2
								? "text-[#8F6AF8] font-bold"
								: "text-gray-500"
						}`}
						numberOfLines={1}
					>
						Confirmation
					</Text>
				</View>

				{/* <View
					className={`h-1 flex-1 mx-2 ${
						step >= 3 ? "bg-[#8F6AF8]" : "bg-gray-200"
					}`}
				/> */}

				{/* <View className="flex-1 items-center">
					<View
						className={`h-10 w-10 rounded-full ${
							step >= 3 ? "bg-[#8F6AF8]" : "bg-gray-200"
						} items-center justify-center mb-2`}
					>
						<Text className="text-white font-bold">3</Text>
					</View>
					<Text
						className={`text-sm ${
							step === 3
								? "text-[#8F6AF8] font-bold"
								: "text-gray-500"
						}`}
					>
						Complete
					</Text>
				</View> */}
			</View>

			{/* Step 1: Personal & Address Details */}
			{step === 1 && (
				<CheckoutForm
					personalInfo={personalInfo}
					setPersonalInfo={setPersonalInfo}
					goToNextStep={goToNextStep}
				/>
			)}

			{/* Step 2: Order Confirmation */}
			{step === 2 && (
				<ConfirmationPage
					personalInfo={personalInfo}
					setStep={setStep}
					deliveryOption={deliveryOption}
				/>
			)}

			{/* Step 3: Order Confirmation */}
			{/* {step === 3 && (
				<View className="flex-1 justify-center items-center px-6">
					<View className="bg-green-50 p-8 rounded-full mb-8">
						<Ionicons
							name="checkmark-circle"
							size={100}
							color="#22C55E"
							className="mb-6"
						/>
					</View>
					<Text className="text-3xl font-bold text-gray-800 mb-3 text-center">
						Order Placed Successfully!
					</Text>
					<Text className="text-lg text-gray-600 text-center mb-8">
						Thank you for your order. You will receive a
						confirmation shortly.
					</Text>
					<View className="w-full bg-[#8F6AF8]/10 p-6 rounded-2xl mb-8">
						<Text className="text-[#8F6AF8] text-center font-medium">
							Your order will be delivered within 5-7 business
							days
						</Text>
					</View>
					<TouchableOpacity
						onPress={() =>
							// rather than navigating, we replace the current screen
							navigator.replace("(tabs)", { screen: "index" })
						}
						className="bg-[#8F6AF8] px-8 py-4 rounded-xl"
					>
						<Text className="text-white font-bold text-lg">
							Go to Home
						</Text>
					</TouchableOpacity>
				</View>
			)} */}
		</View>
	);
}
