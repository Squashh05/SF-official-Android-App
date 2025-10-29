import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	Easing,
	interpolate,
} from "react-native-reanimated";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

import faqsData from "@/constants/faqs";

interface FAQ {
	id: number;
	ques: string;
	ans: string;
}

const FAQItem = ({
	faq,
	isExpanded,
	toggleExpand,
	big,
}: {
	faq: { id: number; ques: string; ans: string };
	isExpanded: boolean;
	toggleExpand: () => void;
	big: boolean;
}) => {
	// Shared values for height, opacity, and rotation animations
	const height = useSharedValue(isExpanded ? 1 : 0);
	const opacity = useSharedValue(isExpanded ? 1 : 0);
	const rotation = useSharedValue(isExpanded ? 1 : 0);

	// Animated styles for the answer section
	const animatedHeightStyle = useAnimatedStyle(() => ({
		height: height.value * (big ? 170 : 80),
		overflow: "hidden",
	}));

	const animatedOpacityStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
	}));

	// Animated style for the icon rotation
	const animatedIconStyle = useAnimatedStyle(() => {
		const rotateZ = interpolate(rotation.value, [0, 1], [0, 180]);
		return {
			transform: [{ rotateZ: `${rotateZ}deg` }],
		};
	});

	// Handle FAQ toggle with animation
	const handleToggle = () => {
		if (isExpanded) {
			height.value = withTiming(0, {
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
			});
			opacity.value = withTiming(0, {
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
			});
			rotation.value = withTiming(0, {
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
			});
		} else {
			height.value = withTiming(1, {
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
			});
			opacity.value = withTiming(1, {
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
			});
			rotation.value = withTiming(1, {
				duration: 300,
				easing: Easing.bezier(0.4, 0, 0.2, 1),
			});
		}
		toggleExpand();
	};

	return (
		<View className="border-b border-gray-200 p-4">
			<TouchableOpacity
				onPress={handleToggle}
				className="flex-row justify-between items-center"
			>
				<Text className="text-lg font-semibold max-w-[90%]">
					{faq.ques}
				</Text>
				<Animated.View style={animatedIconStyle}>
					<Ionicons name="chevron-down" size={24} color="#8F6AF8" />
				</Animated.View>
			</TouchableOpacity>
			<Animated.View style={[animatedHeightStyle, animatedOpacityStyle]}>
				<Text className="text-gray-500 mt-2">{faq.ans}</Text>
			</Animated.View>
		</View>
	);
};

const FAQPage = () => {
	const [expandedIds, setExpandedIds] = useState<number[]>([]);
	const [faqs, setFaqs] = useState<FAQ[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const toggleExpand = (id: number) => {
		setExpandedIds((prev) =>
			prev.includes(id)
				? prev.filter((itemId) => itemId !== id)
				: [...prev, id]
		);
	};

	const fetchAndCacheFAQs = async () => {
		try {
			const response = await axios.get("/faq");

			if (response.data.code === 0) {
				// Transform the data to match our FAQ interface
				const transformedFaqs: FAQ[] = response.data.data.map(
					(faq: any, index: number) => ({
						id: index + 1,
						ques: faq.ques,
						ans: faq.ans,
					})
				);

				// Cache the FAQs
				await AsyncStorage.setItem(
					"cached_faqs",
					JSON.stringify({
						timestamp: Date.now(),
						data: transformedFaqs,
					})
				);

				setFaqs(transformedFaqs);
			} else {
				throw new Error(response.data.message);
			}
		} catch (error) {
			console.error("Error fetching FAQs:", error);
			setError("Failed to fetch FAQs. Please try again later.");

			// Try to load cached data if fetch fails
			try {
				const cachedData = await AsyncStorage.getItem("cached_faqs");
				if (cachedData) {
					const { data } = JSON.parse(cachedData);
					setFaqs(data);
					setError(null);
				}
			} catch (error) {
				// Transform the data to match our FAQ interface
				const transformedFaqs: FAQ[] = faqsData.data.map(
					(faq: any, index: number) => ({
						id: index + 1,
						ques: faq.ques,
						ans: faq.ans,
					})
				);

				// Cache the FAQs
				await AsyncStorage.setItem(
					"cached_faqs",
					JSON.stringify({
						timestamp: Date.now(),
						data: transformedFaqs,
					})
				);

				setFaqs(transformedFaqs);
			}
		} finally {
			setLoading(false);
		}
	};

	const loadFAQs = async () => {
		try {
			const cachedData = await AsyncStorage.getItem("cached_faqs");

			if (cachedData) {
				const { timestamp, data } = JSON.parse(cachedData);
				const cacheAge = Date.now() - timestamp;
				const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

				if (cacheAge < cacheExpiry) {
					setFaqs(data);
					setLoading(false);
					return;
				}
			}

			await fetchAndCacheFAQs();
		} catch (error) {
			console.error("Error loading FAQs:", error);
			setError("Failed to load FAQs. Please try again later.");
			setLoading(false);
		}
	};

	useEffect(() => {
		loadFAQs();
	}, []);

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center p-6">
				<ActivityIndicator size="large" color="#8F6AF8" />
				<Text className="text-gray-500 mt-4">Loading FAQs...</Text>
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center p-6">
				<MaterialIcons name="error-outline" size={48} color="#EF4444" />
				<Text className="text-gray-800 text-lg font-bold mt-4 text-center">
					{error}
				</Text>
				<TouchableOpacity
					onPress={fetchAndCacheFAQs}
					className="mt-4 bg-[#8F6AF8] px-6 py-3 rounded-full"
				>
					<Text className="text-white font-medium">Try Again</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<ScrollView className="p-4">
			{faqs.map((faq) => (
				<FAQItem
					key={faq.id}
					faq={faq}
					isExpanded={expandedIds.includes(faq.id)}
					toggleExpand={() => toggleExpand(faq.id)}
					big={faq.id === 5}
				/>
			))}
		</ScrollView>
	);
};

export default FAQPage;
