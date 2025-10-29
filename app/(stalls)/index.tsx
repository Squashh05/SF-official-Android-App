import { View, Text } from "react-native";
import React from "react";
import ComingSoon from "@/components/ComingSoon";

export default function index() {
	return (
		<View className="flex-1">
			<ComingSoon
				title="Stalls Coming Soon!"
				subtitle="We're setting up amazing stalls for you. Check back later!"
			/>
		</View>
	);
}
