import React from "react";

import { Slot } from "expo-router";
import DrawerNavbar from "@/components/DrawerNavbar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
	return (
		<SafeAreaView className="flex-1">
			<DrawerNavbar />

			<Slot />
		</SafeAreaView>
	);
}
