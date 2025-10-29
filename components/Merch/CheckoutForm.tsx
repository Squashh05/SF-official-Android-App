import { View, Text, ScrollView, TextInput } from "react-native";
import React from "react";
import Button from "../Events/Button";
import { MaterialIcons } from "@expo/vector-icons";

interface PersonalInfo {
	name: string;
	email: string;
	phoneNumber: string;
	deliveryOption: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	pincode: string;
}

interface CheckoutFormProps {
	personalInfo: PersonalInfo;
	setPersonalInfo: (info: PersonalInfo) => void;
	goToNextStep: () => void;
}

export default function CheckoutForm({
	personalInfo,
	setPersonalInfo,
	goToNextStep,
}: CheckoutFormProps) {
	return (
		<View className="flex-1">
			<ScrollView className="flex-1 px-4">
				<Text className="text-xl font-bold mb-4">Contact Information</Text>
				
				{/* Required fields for both options */}
				<TextInput
					placeholder="Full Name"
					value={personalInfo.name}
					onChangeText={(text) => setPersonalInfo({...personalInfo, name: text})}
					className="border border-gray-300 p-3 rounded-lg mb-3"
				/>
				
				<TextInput
					placeholder="Email"
					value={personalInfo.email}
					onChangeText={(text) => setPersonalInfo({...personalInfo, email: text})}
					className="border border-gray-300 p-3 rounded-lg mb-3"
					keyboardType="email-address"
				/>
				
				<TextInput
					placeholder="Phone Number"
					value={personalInfo.phoneNumber}
					onChangeText={(text) => setPersonalInfo({...personalInfo, phoneNumber: text})}
					className="border border-gray-300 p-3 rounded-lg mb-3"
					keyboardType="phone-pad"
				/>
				
				{/* Conditional rendering for delivery address */}
				{personalInfo.deliveryOption === 'delivery' && (
					<>
						<Text className="text-xl font-bold mt-4 mb-4">Delivery Address</Text>
						<TextInput
							placeholder="Address Line 1"
							value={personalInfo.addressLine1}
							onChangeText={(text) => setPersonalInfo({...personalInfo, addressLine1: text})}
							className="border border-gray-300 p-3 rounded-lg mb-3"
						/>
						<TextInput
							placeholder="City"
							value={personalInfo.city}
							onChangeText={(text) => setPersonalInfo({...personalInfo, city: text})}
							className="border border-gray-300 p-3 rounded-lg mb-3"
						/>
						<TextInput
							placeholder="State"
							value={personalInfo.state}
							onChangeText={(text) => setPersonalInfo({...personalInfo, state: text})}
							className="border border-gray-300 p-3 rounded-lg mb-3"
						/>
						<TextInput
							placeholder="Pincode"
							value={personalInfo.pincode}
							onChangeText={(text) => setPersonalInfo({...personalInfo, pincode: text})}
							className="border border-gray-300 p-3 rounded-lg mb-3"
							keyboardType="number-pad"
						/>
					</>
				)}
				
				<Button
					text="Continue"
					handleClick={goToNextStep}
				/>

				<View className="h-6"></View>
			</ScrollView>
		</View>
	);
}
