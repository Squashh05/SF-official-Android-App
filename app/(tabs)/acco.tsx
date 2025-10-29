import {
	View,
	Text,
	ScrollView,
	Pressable,
	RefreshControl,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
	MaterialIcons,
	MaterialCommunityIcons,
	FontAwesome5,
} from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Profile from "@/components/Accomodation/Profile";
import Contingent from "@/components/Accomodation/Contingent";

import acco_content from "@/constants/acco-content";
import { useUserContext } from "@/context/userContext";
import { clearData, getData } from "@/utils/storage";
import { useNavigation } from "expo-router";

export type AccoContent = {
	id: string;
	mainheading: string;
	content: {
		id: string;
		subheading?: string;
		subcontent?: string;
	}[];
};

export default function Acco() {
	const [activeTab, setActiveTab] = useState(0);
	const scrollViewRef = useRef<ScrollView>(null);

	const { user, setUser, isLoggedIn, setIsLoggedIn } = useUserContext();

	const [loading, setLoading] = useState(false);

	const navigation = useNavigation<any>();

	const tabs = [
		// {
		// 	title: "PROFILE",
		// 	icon: <MaterialIcons name="person" size={24} color="white" />,
		// },
		// {
		// 	title: "CONTINGENT",
		// 	icon: (
		// 		<MaterialIcons name="event-available" size={24} color="white" />
		// 	),
		// },
		{
			title: "INFO",
			icon: <MaterialIcons name="info" size={24} color="white" />,
		},
		{
			title: "REACHING IIT KGP",
			icon: (
				<MaterialCommunityIcons
					name="map-marker-radius"
					size={24}
					color="white"
				/>
			),
		},
		{
			title: "FAQS",
			icon: (
				<MaterialIcons name="question-answer" size={24} color="white" />
			),
		},
		{
			title: "RULES",
			icon: (
				<FontAwesome5 name="clipboard-list" size={24} color="white" />
			),
		},
	];

	const [details, setDetails] = useState<AccoContent[] | null>(null);

	useEffect(() => {
		const fetchDetails = async () => {
			try {
				const response = await fetch(
					"https://masterapi-springfest.vercel.app/api/content/accoContent"
				);
				const data = await response.json();
				setDetails(data.data);
			} catch (error) {
				console.error(error);
				setDetails(acco_content.data);
			}
		};
		fetchDetails();
	}, []);

	const handleTabChange = (index: number) => {
		setActiveTab(index);
		scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
	};

	const fetchUserData = async () => {
		setLoading(true);
		try {
			const tokenFromStorage = await getData("token");
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/user/getUser",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token: tokenFromStorage }),
				}
			);
			const data = await response.json();

			if (data.code === 0) {
				setUser(data.data);
				console.log(data.data);
			} else if (data.message.includes("Unauthorized")) {
				clearData();
				setUser(null);
				setIsLoggedIn(false);
				navigation.replace("(auth)", {
					screen: "index",
				});
			}
		} catch (err) {
			console.error("Failed to fetch hall data", JSON.stringify(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSheetModalProvider>
			<View className="flex-1 bg-gray-50">
				{/* Header with Curved Background */}
				<View className="relative">
					<LinearGradient
						colors={["#8F6AF8", "#7054BE"]}
						className="pt-10 h-[200px]"
						style={{
							borderBottomLeftRadius: 1000,
							borderBottomRightRadius: 1000,
							transform: [{ scaleX: 1.5 }],
							marginBottom: -40,
						}}
					>
						<View style={{ transform: [{ scaleX: 1 / 1.5 }] }}>
							<Text className="text-4xl text-center font-extrabold text-gray-100">
								Accommodation
							</Text>
							<Text className="text-center text-base text-gray-100 mt-2">
								Your stay at IIT KGP
							</Text>
						</View>
					</LinearGradient>
				</View>

				{/* Tab Navigation */}
				<View className="px-4 py-2 -mt-4 mb-4">
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="gap-2"
					>
						{tabs.map((tab, index) => (
							<Pressable
								key={index}
								onPress={() => handleTabChange(index)}
								className={`px-4 py-3 rounded-xl mr-2 flex-row items-center ${
									activeTab === index
										? "bg-[#F6D54B]"
										: "bg-gray-100"
								}`}
							>
								<View className="mr-2">
									{React.cloneElement(tab.icon, {
										color:
											activeTab === index
												? "#1f2937"
												: "#9ca3af",
									})}
								</View>
								<Text
									className={`${
										activeTab === index
											? "text-gray-800 font-bold"
											: "text-gray-500"
									}`}
								>
									{tab.title}
								</Text>
							</Pressable>
						))}
					</ScrollView>
				</View>

				{/* Content Section */}
				<ScrollView
					ref={scrollViewRef}
					className="flex-1 px-6"
					refreshControl={
						<RefreshControl
							refreshing={loading}
							onRefresh={fetchUserData}
						/>
					}
					nestedScrollEnabled={true}
				>
					{
						// activeTab === 0 ? (
						// 	<Profile />
						// ) : activeTab === 1 ? (
						// 	<Contingent />
						// ) :
						details &&
							// details[activeTab - 2].content.map((item, index) =>
							details[activeTab].content.map((item, index) => (
								<View key={index} className="mb-6">
									{item.subheading && (
										<View className="flex-row items-center mb-3 bg-white p-4 rounded-xl shadow-sm">
											<MaterialIcons
												name="chevron-right"
												size={24}
												color="#F6D54B"
											/>
											<Text className="text-lg font-bold text-gray-800 ml-2 flex-1 flex-wrap">
												{item.subheading}
											</Text>
										</View>
									)}
									<View className="bg-white p-4 rounded-xl shadow-sm">
										<Text className="text-gray-600 leading-6">
											{item.subcontent}
										</Text>
									</View>
								</View>
							))
					}
				</ScrollView>
			</View>
		</BottomSheetModalProvider>
	);
}
