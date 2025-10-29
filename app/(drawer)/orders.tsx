import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
	ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { useUserContext } from "@/context/userContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Button from "@/components/Events/Button";
import { Checkbox } from 'expo-checkbox';
import { Link } from 'expo-router';

export default function Cart() {
	const { merchInCart, setMerchInCart } = useUserContext();
	const navigator = useNavigation<any>();
	const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
	const [termsAccepted, setTermsAccepted] = useState(false);

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
		}
		setMerchInCart(updatedCart);
	};

	const totalPrice = merchInCart.reduce(
		(acc: number, item: any) => acc + item.price * item.quantity,
		0
	);
	const totalCount = merchInCart.reduce(
		(acc: number, item: any) => acc + item.quantity,
		0
	);

	const calculateShipping = () => {
		if (deliveryOption === 'pickup') return 0;
		if (totalPrice > 2499) return 0;
		return totalCount * 60;
	};

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="px-6 py-4 rounded-b-3xl"
			>
				<View className="flex-row justify-between items-center">
					<View>
						<Text className="text-2xl font-bold text-white">
							My Cart
						</Text>
						<Text className="text-white/80">
							{totalCount} {totalCount === 1 ? "item" : "items"}
						</Text>
					</View>
					<View className="bg-white/20 p-3 rounded-full">
						<MaterialIcons
							name="shopping-cart"
							size={24}
							color="white"
						/>
					</View>
				</View>
			</LinearGradient>

			{/* Cart Items */}
			<ScrollView className="flex-1 px-4 pt-4">
				{merchInCart && merchInCart.length > 0 ? (
					merchInCart.map((item: any, index: number) => (
						<View
							key={index}
							className="bg-white rounded-2xl mb-4 shadow-sm overflow-hidden"
						>
							<View className="flex-row">
								<View className="w-1/3 bg-[#8F6AF8]/5">
									<ImageBackground
										source={require("@/assets/images/home/card-bg.jpg")}
										className="h-32 justify-center items-center p-2"
										resizeMode="cover"
									>
										<Image
											source={item.backImage}
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
					))
				) : (
					<View className="flex-1 justify-center items-center py-20">
						<MaterialIcons
							name="shopping-cart"
							size={64}
							color="#CBD5E1"
						/>
						<Text className="text-gray-400 mt-4 text-lg">
							Your cart is empty
						</Text>
					</View>
				)}
			</ScrollView>

			{/* Checkout Section */}
			{merchInCart && merchInCart.length > 0 && (
				<View className="p-4 bg-white shadow-lg rounded-t-3xl">
					<View className="space-y-2 mb-4">
						<View className="flex-row justify-between">
							<Text className="text-gray-600">Subtotal</Text>
							<Text className="font-medium">₹{totalPrice}</Text>
						</View>
						<View className="flex-row justify-between">
							<Text className="text-gray-600">Items</Text>
							<Text className="font-medium">{totalCount}</Text>
						</View>
						
						{/* Delivery Options */}
						<View className="py-3 border-t border-gray-200">
							<Text className="text-gray-800 font-medium mb-2">Delivery Options:</Text>
							<TouchableOpacity 
								onPress={() => setDeliveryOption('pickup')}
								className={`flex-row items-center p-3 rounded-lg mb-2 ${
									deliveryOption === 'pickup' ? 'bg-[#8F6AF8]/10' : 'bg-gray-100'
								}`}
							>
								<View className={`w-4 h-4 rounded-full border-2 mr-3 ${
									deliveryOption === 'pickup' 
										? 'border-[#8F6AF8] bg-[#8F6AF8]' 
										: 'border-gray-400'
								}`} />
								<View>
									<Text className="font-medium text-gray-800">Pickup from Arena</Text>
									<Text className="text-gray-500 text-sm">Free • Collect during SF</Text>
								</View>
							</TouchableOpacity>
							
							<TouchableOpacity 
								onPress={() => setDeliveryOption('delivery')}
								className={`flex-row items-center p-3 rounded-lg ${
									deliveryOption === 'delivery' ? 'bg-[#8F6AF8]/10' : 'bg-gray-100'
								}`}
							>
								<View className={`w-4 h-4 rounded-full border-2 mr-3 ${
									deliveryOption === 'delivery' 
										? 'border-[#8F6AF8] bg-[#8F6AF8]' 
										: 'border-gray-400'
								}`} />
								<View>
									<Text className="font-medium text-gray-800">Home Delivery</Text>
									<Text className="text-gray-500 text-sm">
										{totalPrice > 2499 
											? 'Free • Orders above ₹3,499' 
											: `₹${totalCount * 60} • ₹60 per item`}
									</Text>
								</View>
							</TouchableOpacity>
						</View>

						<View className="flex-row justify-between">
							<Text className="text-gray-600">Shipping</Text>
							<Text className="font-medium">₹{calculateShipping()}</Text>
						</View>
						
						<View className="flex-row justify-between pt-2 border-t border-gray-200">
							<Text className="text-lg font-bold text-gray-800">Total</Text>
							<Text className="text-lg font-bold text-[#8F6AF8]">
								₹{totalPrice + calculateShipping()}
							</Text>
						</View>
					</View>

					<View className="flex-row items-center space-x-3 mb-4 px-1">
						<Checkbox
							value={termsAccepted}
							onValueChange={setTermsAccepted}
							color={termsAccepted ? '#8F6AF8' : undefined}
							className="mt-1"
						/>
						<Text className="flex-1 text-gray-600">
							I accept the{' '}
							<Link href={{
								pathname: "/(drawer)/merch-terms" as any
							}} className="text-[#8F6AF8] underline">
								terms and conditions
							</Link>
							{' '}
							for this purchase
						</Text>
					</View>

					<Button
						text="Proceed to Checkout"
						marginTop={10}
						handleClick={() => {
							if (!termsAccepted) {
								ToastAndroid.show(
									"Please accept the terms and conditions to continue",
									ToastAndroid.SHORT
								);
								return;
							}
							navigator.navigate("(drawer)", {
								screen: "checkout",
								params: {
									deliveryOption: deliveryOption,
								},
							});
						}}
					/>
				</View>
			)}
		</View>
	);
}
