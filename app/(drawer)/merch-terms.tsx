import React from "react";
import { View, Text, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function MerchTerms() {
	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="px-6 py-4 rounded-b-3xl"
			>
				<Text className="text-2xl font-bold text-white">
					Terms & Conditions
				</Text>
				<Text className="text-white/80">
					Merchandise Purchase Agreement
				</Text>
			</LinearGradient>

			<ScrollView className="flex-1 p-4">
				<View className="bg-white rounded-2xl p-4 shadow-sm">
					<Text className="text-lg font-bold text-gray-800 mb-4">
						Please read these terms carefully before proceeding with your purchase
					</Text>

					{/* Delivery Timeline */}
					<View className="mb-6">
						<Text className="text-base font-semibold text-gray-800 mb-2">
							1. Delivery Timeline
						</Text>
						<Text className="text-gray-600 leading-5">
							• All merchandise will be delivered within 1 month of Spring Fest
							{'\n'}• Standard shipping times will apply based on your location
						</Text>
					</View>

					{/* Delivery Address */}
					<View className="mb-6">
						<Text className="text-base font-semibold text-gray-800 mb-2">
							2. Delivery Address
						</Text>
						<Text className="text-gray-600 leading-5">
							• The delivery address provided must be complete and accurate
							{'\n'}• Any issues arising from incorrect address information will be the responsibility of the customer
						</Text>
					</View>

					{/* No Refund Policy */}
					<View className="mb-6">
						<Text className="text-base font-semibold text-gray-800 mb-2">
							3. No Refund Policy
						</Text>
						<Text className="text-gray-600 leading-5">
							• The purchase process is non-refundable
							{'\n'}• Under no circumstances will refunds be provided
						</Text>
					</View>

					{/* Delivery Method */}
					<View className="mb-6">
						<Text className="text-base font-semibold text-gray-800 mb-2">
							4. Delivery Method
						</Text>
						<Text className="text-gray-600 leading-5">
							• The chosen method of delivery (pickup/delivery) cannot be changed after order placement
							{'\n'}• No refunds will be provided on shipping charges once the delivery method is chosen
						</Text>
					</View>

					<View className="bg-yellow-50 p-4 rounded-lg mb-4">
						<Text className="text-yellow-800 text-sm">
							By proceeding with the purchase, you acknowledge that you have read, understood, and agree to these terms and conditions.
						</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
