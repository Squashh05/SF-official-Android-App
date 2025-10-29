import {
	View,
	Text,
	ImageBackground,
	Dimensions,
	ImageSourcePropType,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-reanimated-carousel";

import { galleryImages } from "@/constants/imagesData";

const width = Dimensions.get("window").width;

interface CarouselProps {
	title: string;
	subtitle: string;
	mode?: "horizontal-stack" | "vertical-stack";
	data: any;
}

export default function CarouselComponent({
	title,
	subtitle,
	mode,
	data,
}: CarouselProps) {
	return (
		<View className="mb-6 flex">
			<View className="flex-row justify-between items-center mb-4 px-6">
				<View>
					<Text className="text-2xl font-bold text-gray-800">
						Experience Pronites
					</Text>
					<Text className="text-gray-500">
						Star-studded performances await
					</Text>
				</View>
			</View>

			<Carousel
				style={{
					alignSelf: "center",
				}}
				loop={true}
				width={width * 0.95}
				height={250}
				autoPlay={true}
				autoPlayInterval={4000}
				data={data}
				scrollAnimationDuration={1000}
				mode={mode}
				modeConfig={{
					showLength: 600,
				}}
				renderItem={({ item }: { item: any }) => (
					<View className="items-center">
						<View className="w-[90%] h-[95%] rounded-2xl overflow-hidden">
							<ImageBackground
								source={item as ImageSourcePropType}
								className="w-full h-full"
								resizeMode="cover"
							>
								<LinearGradient
									colors={["transparent", "rgba(0,0,0,0.8)"]}
									className="absolute bottom-0 left-0 right-0 p-4"
								>
									<View className="flex-row items-center">
										<MaterialIcons
											name="music-note"
											size={20}
											color="white"
										/>
										<Text className="text-white font-bold text-lg ml-2">
											Artist Name
										</Text>
									</View>
									<Text className="text-white/80 ml-7">
										Genre • Date • Time
									</Text>
								</LinearGradient>
							</ImageBackground>
						</View>
					</View>
				)}
			/>
		</View>
	);
}
