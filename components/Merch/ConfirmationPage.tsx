import {
	View,
	Text,
	ImageBackground,
	Image,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserContext } from "@/context/userContext";
import Button from "../Events/Button";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";

interface ConfirmationPageProps {
	personalInfo: any;
	setStep: (step: number) => void;
	deliveryOption: string;
}

export default function ConfirmationPage({
	personalInfo,
	setStep,
	deliveryOption = "pickup",
}: ConfirmationPageProps) {
	const navigator = useNavigation<any>();
	const { merchInCart, setMerchInCart, token } = useUserContext();
	const [loading, setLoading] = useState(false);

	const totalPrice = merchInCart.reduce(
		(acc: number, item: any) => acc + item.price * item.quantity,
		0
	);
	const totalCount = merchInCart.reduce(
		(acc: number, item: any) => acc + item.quantity,
		0
	);

	const calculateShipping = () => {
		if (deliveryOption === "pickup") return 0;
		if (totalPrice > 2499) return 0;
		return totalCount * 60;
	};

	const handleQuantityChange = (
		index: number,
		action: "increase" | "decrease"
	) => {
		const updatedCart = [...merchInCart];
		if (action === "increase") {
			updatedCart[index].quantity += 1;
		} else if (action === "decrease" && updatedCart[index].quantity > 1) {
			updatedCart[index].quantity -= 1;
		} else if (action === "decrease" && updatedCart[index].quantity === 1) {
			updatedCart.splice(index, 1);
			if (updatedCart.length === 0) {
				navigator.navigate("(merch)", { screen: "index" });
			}
		}
		setMerchInCart(updatedCart);
	};

	const handlePlaceOrder = async () => {
		setLoading(true);

		const cart = merchInCart.map((item: any) => ({
			id: item.id,
			category: item.category,
			count: item.quantity,
			price: item.price,
			size: item.size,
			title: item.title,
			total: item.price * item.quantity,
		}));

		try {
			const payload = {
				token: token,
				emergency_number: personalInfo.phoneNumber,
				address:
					deliveryOption === "delivery"
						? `${personalInfo.addressLine1}, ${personalInfo.city}, ${personalInfo.state}, ${personalInfo.pincode}`
						: "collect",
				name: personalInfo.name,
				email: personalInfo.email,
				tax: 0,
				grandtotal: totalPrice + calculateShipping(),
				subtotal: totalPrice,
				cart: cart,
			};

			const url = `https://springfest.in/?cart=${JSON.stringify(
				payload
			)}&origin=2`;
			await WebBrowser.openBrowserAsync(url);

			// const response = await axios.post('/merch/payment/initiate', payload);

			// console.log(JSON.stringify(response.data.data.redirectUrl, null, 2));

			// if (response.data.code === 0) {
			// 	await WebBrowser.openBrowserAsync(response.data.data.redirectUrl);
			// 	setMerchInCart([]);
			// 	// setStep(3);
			// } else {
			// 	ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			// }
		} catch (error) {
			console.log(error);
			ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="px-6 py-4 rounded-b-3xl"
			>
				<View className="flex-row items-center justify-between">
					<View>
						<Text className="text-2xl font-bold text-white">
							Order Review
						</Text>
						<Text className="text-white/80">
							{totalCount} {totalCount === 1 ? "item" : "items"}
						</Text>
					</View>
					<View className="bg-white/20 p-3 rounded-full">
						<MaterialIcons name="receipt" size={24} color="white" />
					</View>
				</View>
			</LinearGradient>

			<ScrollView className="flex-1 pt-3">
				{/* Delivery Address */}
				{deliveryOption === "delivery" ? (
					<View className="p-4">
						<View className="flex-row items-center justify-between mb-3">
							<View className="flex-row items-center">
								<MaterialIcons
									name="location-on"
									size={24}
									color="#8F6AF8"
								/>
								<Text className="text-lg font-bold text-gray-800 ml-2">
									Delivery Address
								</Text>
							</View>
							<TouchableOpacity
								onPress={() => setStep(1)}
								className="bg-[#8F6AF8]/10 px-3 py-1 rounded-full"
							>
								<Text className="text-[#8F6AF8]">Edit</Text>
							</TouchableOpacity>
						</View>
						<View className="bg-white p-4 rounded-xl shadow-sm">
							<Text className="text-lg font-bold text-gray-800 mb-1">
								{personalInfo.name}
							</Text>
							<Text className="text-gray-600 mb-1">
								{personalInfo.phoneNumber}
							</Text>
							<Text className="text-gray-600">
								{personalInfo.addressLine1}
								{personalInfo.addressLine2 &&
									`, ${personalInfo.addressLine2}`}
							</Text>
							<Text className="text-gray-600">
								{personalInfo.city}, {personalInfo.state} -{" "}
								{personalInfo.pincode}
							</Text>
						</View>
					</View>
				) : null}

				{/* Order Items */}
				<View className="px-4">
					<View className="flex-row items-center mb-3">
						<MaterialIcons
							name="shopping-bag"
							size={24}
							color="#8F6AF8"
						/>
						<Text className="text-lg font-bold text-gray-800 ml-2">
							Order Items
						</Text>
					</View>
					{merchInCart.map((item: any, index: number) => (
						<View
							key={index}
							className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
						>
							<View className="flex-row">
								<View className="w-1/3 bg-[#8F6AF8]/5">
									<ImageBackground
										source={require("@/assets/images/home/card-bg.jpg")}
										className="h-32 justify-center items-center p-2"
										resizeMode="cover"
									>
										<Image
											source={item.frontImage}
											className="h-36"
											resizeMode="contain"
										/>
									</ImageBackground>
								</View>

								<View className="flex-1 p-4 justify-between">
									<View>
										<Text className="text-lg font-bold text-gray-800 mb-1">
											{item.title}
										</Text>
										<Text className="text-sm text-gray-500">
											{item.subtitle}
										</Text>
										<View className="flex-row items-center mt-2">
											<MaterialIcons
												name="straighten"
												size={16}
												color="#8F6AF8"
											/>
											<Text className="text-gray-600 ml-1">
												Size: {item.size}
											</Text>
										</View>
									</View>

									<View className="flex-row items-center justify-between mt-2">
										<Text className="text-lg font-bold text-[#8F6AF8]">
											₹{item.price * item.quantity}
										</Text>
										<View className="flex-row items-center bg-gray-100 rounded-full">
											<TouchableOpacity
												onPress={() =>
													handleQuantityChange(
														index,
														"decrease"
													)
												}
												className="p-2"
											>
												<MaterialIcons
													name="remove"
													size={20}
													color="#EF4444"
												/>
											</TouchableOpacity>
											<Text className="px-3 font-medium">
												{item.quantity}
											</Text>
											<TouchableOpacity
												onPress={() =>
													handleQuantityChange(
														index,
														"increase"
													)
												}
												className="p-2"
											>
												<MaterialIcons
													name="add"
													size={20}
													color="#8F6AF8"
												/>
											</TouchableOpacity>
										</View>
									</View>
								</View>
							</View>
						</View>
					))}
				</View>
			</ScrollView>

			{/* Order Summary */}
			<View className="bg-white p-4 rounded-t-3xl shadow-lg">
				<View className="space-y-2 mb-4">
					<View className="flex-row justify-between">
						<Text className="text-gray-600">Subtotal</Text>
						<Text className="font-medium">₹{totalPrice}</Text>
					</View>
					{deliveryOption === "delivery" ? (
						<View className="flex-row justify-between">
							<Text className="text-gray-600">Shipping</Text>
							<Text className="font-medium">
								₹{calculateShipping()}
							</Text>
						</View>
					) : null}
					<View className="flex-row justify-between pt-2 border-t border-gray-200">
						<Text className="text-lg font-bold text-gray-800">
							Total Amount
						</Text>
						<Text className="text-lg font-bold text-[#8F6AF8]">
							₹{totalPrice + calculateShipping()}
						</Text>
					</View>
				</View>

				<Button
					text={loading ? "Placing Order..." : "Confirm Order"}
					handleClick={handlePlaceOrder}
					loading={loading}
					marginTop={0}
				/>
			</View>
		</View>
	);
}
