import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import ProfileInfo from "@/components/Profile/ProfileInfo";
import RegisteredEvents from "@/components/Profile/RegisteredEvents";
import QR from "@/components/Profile/QR";
import { useLocalSearchParams } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage() {
	const { initialTab } = useLocalSearchParams<{ initialTab: string }>();
	const [activeTab, setActiveTab] = useState<"info" | "events" | "qr">(
		"info"
	);

	useEffect(() => {
		if (initialTab) {
			setActiveTab(initialTab as "info" | "events" | "qr");
		}
	}, [initialTab]);

	const tabs = {
		info: "User Info",
		events: "Events",
		qr: "QR Code",
	} as { [key: string]: string };

	return (
		<BottomSheetModalProvider>
			<SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
				{/* Tab Switcher */}
				<View className="flex-row justify-around bg-gray-100 p-4">
					{Object.keys(tabs).map((tab) => (
						<Pressable
							key={tab}
							onPress={() =>
								setActiveTab(tab as "info" | "events" | "qr")
							}
							className={`${
								activeTab === tab
									? "border-b-4 border-purple-600"
									: ""
							} flex-1 justify-center items-center`}
						>
							<Text className="text-lg font-semibold text-purple-600">
								{tabs[tab]}
							</Text>
						</Pressable>
					))}
				</View>

				<View className="p-4">
					{activeTab === "info" && <ProfileInfo />}
					{activeTab === "events" && <RegisteredEvents />}
					{activeTab === "qr" && <QR />}
				</View>
			</SafeAreaView>
		</BottomSheetModalProvider>
	);
}
