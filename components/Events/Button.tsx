import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function Button({
	text,
	loading,
	handleClick,
	marginTop = 32,
}: {
	text: string;
	loading?: boolean;
	handleClick: () => void;
	marginTop?: number;
}) {
	return (
		<Pressable onPress={handleClick}>
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="rounded-xl px-4 py-3"
				style={{ marginTop: marginTop }}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
			>
				{loading ? (
					<ActivityIndicator size={28} color="#fff" />
				) : (
					<Text className="text-white text-lg font-bold text-center">
						{text}
					</Text>
				)}
			</LinearGradient>
		</Pressable>
	);
}
