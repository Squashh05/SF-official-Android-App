import {
	Image,
	ImageBackground,
	Pressable,
	ScrollView,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useRef, useState } from "react";
import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { merchandises, merchandisesInCategory } from "@/constants/merch";
import { useUserContext } from "@/context/userContext";
import CategorySelector from "@/components/Merch/CategorySelector";
import MerchDetailModal from "@/components/Merch/MerchDetailModal";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import ComingSoon from "@/components/ComingSoon";

export default function Merch() {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const { merchInCart, setMerchInCart } = useUserContext();

	const [chosenCategory, setChosenCategory] = useState("All");
	const [merchChosen, setMerchChosen] = useState(0);
	const [sizeChosen, setSizeChosen] = useState("L");

	const navigator = useNavigation<any>();

	const handleAddToCart = () => {
		const merch = merchandises[merchChosen];
		const index = merchInCart.findIndex(
			(item: any) =>
				item.title === merch.title && item.size === sizeChosen
		);

		if (index !== -1) {
			merchInCart[index].quantity += 1;
		} else {
			setMerchInCart([
				...merchInCart,
				{ ...merch, size: sizeChosen, quantity: 1 },
			]);
		}

		ToastAndroid.show("Added to Cart", ToastAndroid.SHORT);
	};

	return (
		<ComingSoon />
	);

	// return (
	// 	<BottomSheetModalProvider>
	// 		<ScrollView>
	// 			<LinearGradient
	// 				colors={["#8F6AF8", "#7054BE"]}
	// 				className="pt-10 h-[200px]"
	// 				style={{
	// 					borderBottomLeftRadius: 1000,
	// 					borderBottomRightRadius: 1000,
	// 					transform: [{ scaleX: 1.5 }],
	// 					marginBottom: -40,
	// 				}}
	// 			>
	// 				<View style={{ transform: [{ scaleX: 1 / 1.5 }] }}>
	// 					<View className="flex-row justify-center px-6">
	// 						<View className="flex-col justify-center items-center">
	// 							<Text className="text-4xl text-gray-100 font-bold pl-6 -translate-x-3">
	// 								Merchandise
	// 							</Text>
	// 							<Text className="text-center text-base text-gray-100 font-light px-10 py-2">
	// 								Discover our exclusive collection of
	// 								merchandise
	// 							</Text>
	// 						</View>
	// 					</View>
	// 				</View>
	// 			</LinearGradient>

	// 			<CategorySelector
	// 				chosenCategory={chosenCategory}
	// 				setChosenCategory={setChosenCategory}
	// 			/>

	// 			<View className="flex-row flex-wrap justify-center px-4 gap-6 mb-8">
	// 				{merchandises.map((merch, index) => {
	// 					if (
	// 						!merchandisesInCategory[chosenCategory].includes(
	// 							index
	// 						)
	// 					) {
	// 						return null;
	// 					}

	// 					return (
	// 						<Pressable
	// 							key={index}
	// 							className="w-[85%] bg-[#1f2937ee] border-2 border-[#8E97FD] overflow-hidden shadow-xl flex flex-row rounded-3xl divide-x divide-gray-500"
	// 							onPress={() => {
	// 								setMerchChosen(index);
	// 								bottomSheetModalRef.current?.present();
	// 							}}
	// 						>
	// 							<ImageBackground
	// 								source={require("@/assets/images/home/card-bg.jpg")}
	// 								style={{ height: 180 }}
	// 								className="flex-1 flex justify-center items-center p-2"
	// 								resizeMode="cover"
	// 							>
	// 								<Image
	// 									source={merch.backImage}
	// 									style={{ height: 220 }}
	// 									resizeMode="contain"
	// 								/>
	// 							</ImageBackground>
	// 							<View className="flex-1 flex justify-center p-3 bg-[#1f293799]">
	// 								<Text className="text-xl font-bold text-white px-2 text-center mb-2">
	// 									{merch.title}
	// 								</Text>

	// 								<Text className="text-sm font-normal text-gray-200 px-2 text-center">
	// 									{merch.subtitle}
	// 								</Text>

	// 								<View className="flex-row justify-center items-center mt-4">
	// 									<MaterialIcons
	// 										name="local-mall"
	// 										size={20}
	// 										color="#8E97FD"
	// 									/>
	// 									<Text className="text-2xl font-semibold text-[#8E97FD] px-2 text-center">
	// 										Rs. {merch.price} /-
	// 									</Text>
	// 								</View>
	// 							</View>
	// 						</Pressable>
	// 					);
	// 				})}
	// 			</View>

	// 			<MerchDetailModal
	// 				modalRef={bottomSheetModalRef}
	// 				merch={merchandises[merchChosen]}
	// 				sizeChosen={sizeChosen}
	// 				setSizeChosen={setSizeChosen}
	// 				onAddToCart={handleAddToCart}
	// 			/>
	// 		</ScrollView>
	// 	</BottomSheetModalProvider>
	// );
}
