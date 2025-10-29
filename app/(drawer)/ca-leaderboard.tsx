import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import Animated, { FadeInDown } from "react-native-reanimated";

interface LeaderboardEntry {
	rank: number;
	name: string;
	score: number;
	sfId: string;
}

export default function CALeaderboard() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchLeaderboard = async () => {
		try {
			const response = await axios.get("/cap/publicDashboard");
			if (response.data.code === 0) {
				setLeaderboard(response.data.data);
			} else {
				throw new Error(response.data.message);
			}
		} catch (error) {
			console.error("Error fetching leaderboard:", error);
			setError("Failed to fetch leaderboard");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLeaderboard();
	}, []);

	const getRankColor = (rank: number) => {
		switch (rank) {
			case 1:
				return ["#FFD700", "#FFA500"]; // Gold
			case 2:
				return ["#C0C0C0", "#A0A0A0"]; // Silver
			case 3:
				return ["#CD7F32", "#8B4513"]; // Bronze
			default:
				return ["#8F6AF8", "#7054BE"]; // Default purple
		}
	};

	const getMedalIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return "🥇";
			case 2:
				return "🥈";
			case 3:
				return "🥉";
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#8F6AF8" />
				<Text className="text-gray-500 mt-4">
					Loading leaderboard...
				</Text>
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
			</View>
		);
	}

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="p-6 rounded-b-3xl"
			>
				<View className="flex-row justify-between items-center">
					<View>
						<Text className="text-2xl font-bold text-white mb-1">
							CA Leaderboard
						</Text>
						<Text className="text-white/80">
							Top {leaderboard.length} Campus Ambassadors
						</Text>
					</View>
					<View className="bg-white/20 p-3 rounded-full">
						<FontAwesome5 name="trophy" size={24} color="white" />
					</View>
				</View>
			</LinearGradient>

			{/* Leaderboard List */}
			<ScrollView className="flex-1 px-4 pt-4">
				{leaderboard.map((entry, index) => (
					<Animated.View
						key={entry.sfId}
						entering={FadeInDown.delay(index * 100)}
						className="mb-3"
					>
						<LinearGradient
							colors={getRankColor(entry.rank)}
							className="p-[1px] rounded-xl"
						>
							<View className="flex-row items-center bg-white p-4 rounded-xl">
								{/* Rank */}
								<View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center">
									{getMedalIcon(entry.rank) ? (
										<Text className="text-2xl">
											{getMedalIcon(entry.rank)}
										</Text>
									) : (
										<Text className="text-lg font-bold text-gray-700">
											#{entry.rank}
										</Text>
									)}
								</View>

								{/* User Info */}
								<View className="flex-1 ml-4">
									<Text className="text-gray-800 font-bold text-lg">
										{entry.name}
									</Text>
									<Text className="text-gray-500">
										{entry.sfId}
									</Text>
								</View>

								{/* Score */}
								<View className="bg-gray-50 px-4 py-2 rounded-full">
									<Text className="text-[#8F6AF8] font-bold">
										{entry.score} pts
									</Text>
								</View>
							</View>
						</LinearGradient>
					</Animated.View>
				))}
			</ScrollView>
		</View>
	);
}
