import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Navbar from "@/components/Navbar";
import Drawer from "@/components/Drawer";
import { Slot } from "expo-router";

export default function _layout() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const toggleDrawer = () => {
		setIsDrawerOpen(!isDrawerOpen);
	};
	return (
		<SafeAreaView className="flex-1">
			<Navbar toggleDrawer={toggleDrawer} />
			<Drawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

			<Slot />
		</SafeAreaView>
	);
}
