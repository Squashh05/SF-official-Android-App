import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Dimensions,
	ImageBackground,
	Linking,
} from "react-native";
import React, { RefObject } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "@/components/Events/Button";
import { sizes } from "@/constants/merch";

const { width } = Dimensions.get("window");

interface MerchDetailModalProps {
	modalRef: RefObject<BottomSheetModal>;
	merch: any;
	sizeChosen: string;
	setSizeChosen: (size: string) => void;
	onAddToCart: () => void;
}

export default function MerchDetailModal({
	modalRef,
	merch,
	sizeChosen,
	setSizeChosen,
	onAddToCart,
}: MerchDetailModalProps) {
	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);

	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};

	return (
		<BottomSheetModal
			ref={modalRef}
			snapPoints={["90%"]}
			enableDynamicSizing={false}
			backgroundStyle={{ backgroundColor: "#F8F9FA" }}
		>
			<BottomSheetScrollView className="flex-1">
				{/* Hero Section with Carousel */}
				<View className="bg-[#8F6AF8]/5 rounded-b-3xl overflow-hidden">
					<LinearGradient
						colors={["#8F6AF8", "#7054BE"]}
						className="mx-4 px-6 py-4 mb-4 rounded-xl"
					>
						<Text className="text-xl font-bold text-white">
							{merch.title}
						</Text>
						<Text className="text-white/80">{merch.subtitle}</Text>
					</LinearGradient>

					<View className="p-4">
						<View className="bg-gray-50 rounded-2xl overflow-hidden shadow-md">
							<Carousel
								ref={ref}
								data={[
									{ image: merch.backImage },
									{ image: merch.frontImage },
								]}
								loop
								pagingEnabled
								snapEnabled
								onProgressChange={progress}
								width={width - 32}
								height={250}
								renderItem={({ item }) => (
									<View className="items-center justify-center p-4">
										<Image
											source={item.image}
											style={{
												height: 240,
												width: width * 1.2,
											}}
											resizeMode="contain"
										/>
									</View>
								)}
							/>
						</View>

						<Pagination.Basic
							data={[{ color: "white" }, { color: "white" }]}
							progress={progress}
							onPress={onPressPagination}
							dotStyle={{
								width: 8,
								height: 8,
								backgroundColor: "#E2E8F0",
								borderRadius: 4,
							}}
							activeDotStyle={{
								width: 24,
								backgroundColor: "#6D28D9",
								borderRadius: 4,
							}}
							containerStyle={{ gap: 8, marginTop: 16 }}
						/>
					</View>
				</View>

				{/* Content Section */}
				<View className="p-6 space-y-6">
					{/* Price Section */}
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">
							Rs. {merch.price} /-
						</Text>
						<View className="bg-[#8F6AF8]/10 px-4 py-2 rounded-full">
							<Text className="text-[#8F6AF8] font-medium">
								In Stock
							</Text>
						</View>
					</View>

					{/* Size Selection */}
					<View>
						<Text className="text-lg font-semibold text-gray-800 mb-4">
							Select Size
						</Text>
						<View className="flex-row justify-between">
							{sizes.map((size, index) => (
								<TouchableOpacity
									key={index}
									onPress={() =>
										setSizeChosen(Object.keys(size)[0])
									}
									className={`items-center ${sizeChosen === Object.keys(size)[0]
											? "bg-[#8F6AF8]"
											: "bg-gray-100"
										} rounded-2xl p-4 w-16`}
								>
									<Text
										className={`text-sm sm:text-base font-bold ${sizeChosen === Object.keys(size)[0]
												? "text-white"
												: "text-gray-600"
											}`}
										numberOfLines={1}
										adjustsFontSizeToFit
										minimumFontScale={0.5}
									>
										{size[Object.keys(size)[0]][0]}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>

					{/* Size Details */}
					<View className="space-y-4">
						<View className="bg-gray-50 p-4 rounded-xl">
							<Text className="text-gray-600 font-medium mb-2">
								Length (+/- 0.5in)
							</Text>
							<View className="flex-row justify-between">
								{sizes.map((size, index) => (
									<View
										key={index}
										className={`items-center ${sizeChosen === Object.keys(size)[0]
												? "bg-[#8F6AF8]/10"
												: ""
											} rounded-lg px-3 py-1`}
									>
										<Text
											className={`${sizeChosen ===
													Object.keys(size)[0]
													? "text-[#8F6AF8]"
													: "text-gray-600"
												}`}
										>
											{size[Object.keys(size)[0]][1]}"
										</Text>
									</View>
								))}
							</View>
						</View>

						<View className="bg-gray-50 p-4 rounded-xl">
							<Text className="text-gray-600 font-medium mb-2">
								Chest (+/- 0.5in)
							</Text>
							<View className="flex-row justify-between">
								{sizes.map((size, index) => (
									<View
										key={index}
										className={`items-center ${sizeChosen === Object.keys(size)[0]
												? "bg-[#8F6AF8]/10"
												: ""
											} rounded-lg px-3 py-1`}
									>
										<Text
											className={`${sizeChosen ===
													Object.keys(size)[0]
													? "text-[#8F6AF8]"
													: "text-gray-600"
												}`}
										>
											{size[Object.keys(size)[0]][2]}"
										</Text>
									</View>
								))}
							</View>
						</View>
					</View>

					{/* Description */}
					<View className="bg-gray-50 p-4 rounded-xl">
						<View className="flex-row items-center mb-2">
							<MaterialIcons
								name="info-outline"
								size={20}
								color="#8F6AF8"
							/>
							<Text className="text-gray-800 font-semibold ml-2">
								Product Details
							</Text>
						</View>
						<Text className="text-gray-600 leading-6">
							{merch.description}
						</Text>
					</View>

					{/* Add to Cart Button */}
					<Button text="Add To Cart" handleClick={onAddToCart} marginTop={10} />

					{/* Replace Add to Cart with Website Direction */}
					{/* <View className="space-y-4">
						<View className="bg-gray-50 p-4 rounded-xl">
							<View className="flex-row items-center mb-2">
								<MaterialIcons
									name="info"
									size={20}
									color="#8F6AF8"
								/>
								<Text className="text-gray-800 font-semibold ml-2">
									Purchase Information
								</Text>
							</View>
							<Text className="text-gray-600 leading-6">
								To purchase Spring Fest merchandise, please
								visit our official website.
							</Text>
						</View>

						<TouchableOpacity
							onPress={() =>
								Linking.openURL("https://springfest.in/merch")
							}
							className="bg-[#8F6AF8] p-4 rounded-xl flex-row items-center justify-center"
						>
							<MaterialIcons
								name="shopping-bag"
								size={20}
								color="white"
							/>
							<Text className="text-white font-bold ml-2">
								Buy on Website
							</Text>
						</TouchableOpacity>
					</View> */}
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
}
