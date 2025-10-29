import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { categories } from "@/constants/merch";

interface CategorySelectorProps {
	chosenCategory: string;
	setChosenCategory: (category: string) => void;
}

export default function CategorySelector({
	chosenCategory,
	setChosenCategory,
}: CategorySelectorProps) {
	return (
		<View className="flex-row justify-between px-6 mb-6">
			{categories.map((category, index) => (
				<Pressable
					key={index}
					className={`items-center`}
					onPress={() => setChosenCategory(category.title)}
				>
					<View
						className={`p-4 rounded-2xl ${
							chosenCategory == category.title
								? "bg-[#8E97FD]"
								: "bg-[#A0A3B1]"
						}`}
					>
						{category.image && (
							<Image
								source={category.image}
								style={{ width: 32, height: 32 }}
								resizeMode="contain"
							/>
						)}
						{category.icon}
					</View>
					<Text className="text-lg font-normal text-[#00000077]">
						{category.title}
					</Text>
				</Pressable>
			))}
		</View>
	);
} 