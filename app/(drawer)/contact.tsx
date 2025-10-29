import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ToastAndroid,
	ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUserContext } from "@/context/userContext";
import axios from "axios";
import { format } from "date-fns";

type Complaint = {
	id: number;
	type: string;
	issue: string;
	status: string;
	created_at: string;
	remarks: string;
};

type Idea = {
	id: number;
	title: string;
	idea: string;
	category: string;
	graded: number;
	createdAt: string;
	updatedAt: string;
};

export default function Contact() {
	const { token } = useUserContext();
	const [activeTab, setActiveTab] = useState<"ideas" | "complaints">("ideas");
	const [complaints, setComplaints] = useState<Complaint[]>([]);
	const [ideas, setIdeas] = useState<Idea[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [newComplaint, setNewComplaint] = useState({
		type: "",
		issue: "",
	});

	const [newIdea, setNewIdea] = useState({
		title: "",
		idea: "",
		category: "",
	});

	const fetchComplaints = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				"/user/complaints/fetchComplaints",
				{
					token,
				}
			);

			if (response.data.code === 0) {
				setComplaints(response.data.data);
			} else {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			}
		} catch (error) {
			console.error("Error fetching complaints:", error);
			ToastAndroid.show("Failed to fetch complaints", ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	const submitComplaint = async () => {
		if (!newComplaint.type || !newComplaint.issue) {
			ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
			return;
		}

		try {
			setSubmitting(true);
			const response = await axios.post(
				"/user/complaints/submitComplaints",
				{
					token,
					type: newComplaint.type,
					issue: newComplaint.issue,
				}
			);

			if (response.data.code === 0) {
				ToastAndroid.show(
					"Complaint submitted successfully",
					ToastAndroid.SHORT
				);
				setNewComplaint({ type: "", issue: "" });
				fetchComplaints();
			} else {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			}
		} catch (error) {
			console.error("Error submitting complaint:", error);
			ToastAndroid.show("Failed to submit complaint", ToastAndroid.SHORT);
		} finally {
			setSubmitting(false);
		}
	};

	const fetchIdeas = async () => {
		try {
			setLoading(true);
			const response = await axios.post("/user/ideas/fetchIdeas", {
				token,
			});

			if (response.data.code === 0) {
				setIdeas(response.data.data);
			} else {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			}
		} catch (error) {
			console.error("Error fetching ideas:", error);
			ToastAndroid.show("Failed to fetch ideas", ToastAndroid.SHORT);
		} finally {
			setLoading(false);
		}
	};

	const submitIdea = async () => {
		if (!newIdea.title || !newIdea.idea || !newIdea.category) {
			ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
			return;
		}

		try {
			setSubmitting(true);
			const response = await axios.post("/user/ideas/submitIdeas", {
				token,
				...newIdea,
			});

			if (response.data.code === 0) {
				ToastAndroid.show(
					"Idea submitted successfully",
					ToastAndroid.SHORT
				);
				setNewIdea({ title: "", idea: "", category: "" });
				fetchIdeas();
			} else {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			}
		} catch (error) {
			console.error("Error submitting idea:", error);
			ToastAndroid.show("Failed to submit idea", ToastAndroid.SHORT);
		} finally {
			setSubmitting(false);
		}
	};

	useEffect(() => {
		if (activeTab === "complaints") {
			fetchComplaints();
		} else {
			fetchIdeas();
		}
	}, [activeTab]);

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "in progress":
				return "bg-yellow-500";
			case "resolved":
				return "bg-green-500";
			case "pending":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	return (
		<ScrollView className="flex-1 bg-gray-50">
			{/* Header with Gradient */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="rounded-b-[40px] shadow-lg"
			>
				<View className="p-6 pt-12">
					<View className="flex-row justify-between items-center mb-8">
						<View>
							<Text className="text-3xl font-bold text-white mb-2">
								Help Center
							</Text>
							<Text className="text-white/80 text-base">
								Share your ideas and concerns
							</Text>
						</View>
						<View className="bg-white/20 p-4 rounded-2xl">
							<MaterialIcons
								name="support-agent"
								size={28}
								color="white"
							/>
						</View>
					</View>

					{/* Enhanced Tab Switcher */}
					<View className="bg-white/20 rounded-2xl p-1.5">
						{["ideas", "complaints"].map((tab) => (
							<TouchableOpacity
								key={tab}
								onPress={() =>
									setActiveTab(tab as "ideas" | "complaints")
								}
								className={`flex-1 py-4 px-6 rounded-xl ${
									activeTab === tab
										? "bg-white shadow-sm"
										: "bg-transparent"
								}`}
							>
								<View className="flex-row items-center justify-center">
									<MaterialIcons
										name={
											tab === "ideas"
												? "lightbulb"
												: "support"
										}
										size={20}
										color={
											activeTab === tab
												? "#8F6AF8"
												: "white"
										}
										style={{ marginRight: 8 }}
									/>
									<Text
										className={`text-center font-bold capitalize ${
											activeTab === tab
												? "text-[#8F6AF8]"
												: "text-white"
										}`}
									>
										{tab}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</LinearGradient>

			{/* Content Section */}
			<View className="p-4 -mt-6">
				{activeTab === "ideas" ? (
					// Ideas Section
					<View>
						{/* New Idea Form */}
						<View className="bg-white rounded-2xl shadow-md p-6 mb-6">
							<View className="flex-row items-center mb-4">
								<MaterialIcons
									name="lightbulb"
									size={24}
									color="#8F6AF8"
								/>
								<Text className="text-xl font-bold text-gray-800 ml-2">
									Share Your Idea
								</Text>
							</View>
							<View className="space-y-4">
								<View>
									<Text className="text-gray-600 mb-2">
										Title
									</Text>
									<TextInput
										placeholder="Enter idea title"
										value={newIdea.title}
										onChangeText={(text) =>
											setNewIdea({
												...newIdea,
												title: text,
											})
										}
										className="bg-gray-50 p-3 rounded-xl text-gray-800"
									/>
								</View>
								<View>
									<Text className="text-gray-600 mb-2">
										Category
									</Text>
									<TextInput
										placeholder="Enter idea category"
										value={newIdea.category}
										onChangeText={(text) =>
											setNewIdea({
												...newIdea,
												category: text,
											})
										}
										className="bg-gray-50 p-3 rounded-xl text-gray-800"
									/>
								</View>
								<View>
									<Text className="text-gray-600 mb-2">
										Description
									</Text>
									<TextInput
										placeholder="Describe your idea"
										value={newIdea.idea}
										onChangeText={(text) =>
											setNewIdea({
												...newIdea,
												idea: text,
											})
										}
										multiline
										numberOfLines={4}
										className="bg-gray-50 p-3 rounded-xl text-gray-800"
										textAlignVertical="top"
									/>
								</View>
								<TouchableOpacity
									onPress={submitIdea}
									disabled={submitting}
									className="bg-[#8F6AF8] rounded-xl p-3"
								>
									{submitting ? (
										<ActivityIndicator color="white" />
									) : (
										<Text className="text-white text-center font-semibold">
											Submit Idea
										</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>

						{/* Ideas History */}
						<View>
							<View className="flex-row items-center mb-4">
								<MaterialIcons
									name="history"
									size={24}
									color="#8F6AF8"
								/>
								<Text className="text-xl font-bold text-gray-800 ml-2">
									My Ideas
								</Text>
							</View>
							{loading ? (
								<View className="py-8">
									<ActivityIndicator
										size="large"
										color="#8F6AF8"
									/>
								</View>
							) : ideas.length > 0 ? (
								<View className="space-y-4">
									{ideas.map((idea) => (
										<View
											key={idea.id}
											className="bg-white rounded-xl shadow-sm p-4"
										>
											<View className="flex-row justify-between items-start mb-2">
												<View className="flex-1">
													<Text className="text-lg font-semibold text-gray-800">
														{idea.title}
													</Text>
													<Text className="text-gray-500 text-sm">
														{format(
															new Date(
																idea.createdAt
															),
															"MMM d, yyyy 'at' h:mm a"
														)}
													</Text>
												</View>
												<View
													className={`${
														idea.graded
															? "bg-green-500"
															: "bg-yellow-500"
													} px-3 py-1 rounded-full ml-2`}
												>
													<Text className="text-white text-sm">
														{idea.graded
															? "Graded"
															: "Pending"}
													</Text>
												</View>
											</View>
											<View className="bg-gray-50 px-3 py-1 rounded-full self-start mb-2">
												<Text className="text-gray-600">
													{idea.category}
												</Text>
											</View>
											<Text className="text-gray-600">
												{idea.idea}
											</Text>
										</View>
									))}
								</View>
							) : (
								<View className="bg-gray-50 p-6 rounded-xl items-center">
									<MaterialIcons
										name="lightbulb"
										size={48}
										color="#CBD5E1"
									/>
									<Text className="text-gray-400 mt-2">
										No ideas submitted yet
									</Text>
								</View>
							)}
						</View>
					</View>
				) : (
					// Complaints Section
					<View>
						{/* New Complaint Form */}
						<View className="bg-white rounded-2xl shadow-md p-6 mb-6">
							<View className="flex-row items-center mb-4">
								<MaterialIcons
									name="report-problem"
									size={24}
									color="#8F6AF8"
								/>
								<Text className="text-xl font-bold text-gray-800 ml-2">
									Report an Issue
								</Text>
							</View>
							<View className="space-y-4">
								<View>
									<Text className="text-gray-600 mb-2">
										Type
									</Text>
									<TextInput
										placeholder="Enter complaint type"
										value={newComplaint.type}
										onChangeText={(text) =>
											setNewComplaint({
												...newComplaint,
												type: text,
											})
										}
										className="bg-gray-50 p-3 rounded-xl text-gray-800"
									/>
								</View>
								<View>
									<Text className="text-gray-600 mb-2">
										Issue
									</Text>
									<TextInput
										placeholder="Describe your issue"
										value={newComplaint.issue}
										onChangeText={(text) =>
											setNewComplaint({
												...newComplaint,
												issue: text,
											})
										}
										multiline
										numberOfLines={4}
										className="bg-gray-50 p-3 rounded-xl text-gray-800"
										textAlignVertical="top"
									/>
								</View>
								<TouchableOpacity
									onPress={submitComplaint}
									disabled={submitting}
									className="bg-[#8F6AF8] rounded-xl p-3"
								>
									{submitting ? (
										<ActivityIndicator color="white" />
									) : (
										<Text className="text-white text-center font-semibold">
											Submit Complaint
										</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>

						{/* Complaints History */}
						<View>
							<View className="flex-row items-center mb-4">
								<MaterialIcons
									name="history"
									size={24}
									color="#8F6AF8"
								/>
								<Text className="text-xl font-bold text-gray-800 ml-2">
									Issue History
								</Text>
							</View>
							{loading ? (
								<View className="py-8">
									<ActivityIndicator
										size="large"
										color="#8F6AF8"
									/>
								</View>
							) : complaints.length > 0 ? (
								<View className="space-y-4">
									{complaints.map((complaint) => (
										<View
											key={complaint.id}
											className="bg-white rounded-xl shadow-sm p-4"
										>
											<View className="flex-row justify-between items-start mb-2">
												<View>
													<Text className="text-lg font-semibold text-gray-800">
														{complaint.type}
													</Text>
													<Text className="text-gray-500 text-sm">
														{format(
															new Date(
																complaint.created_at
															),
															"MMM d, yyyy 'at' h:mm a"
														)}
													</Text>
												</View>
												<View
													className={`${getStatusColor(
														complaint.status
													)} px-3 py-1 rounded-full`}
												>
													<Text className="text-white text-sm">
														{complaint.status}
													</Text>
												</View>
											</View>
											<Text className="text-gray-600 mb-2">
												{complaint.issue}
											</Text>
											{complaint.remarks && (
												<View className="bg-gray-50 p-3 rounded-xl mt-2">
													<Text className="text-gray-500 text-sm font-medium">
														Remarks:
													</Text>
													<Text className="text-gray-600">
														{complaint.remarks}
													</Text>
												</View>
											)}
										</View>
									))}
								</View>
							) : (
								<View className="bg-gray-50 p-6 rounded-xl items-center">
									<MaterialIcons
										name="history"
										size={48}
										color="#CBD5E1"
									/>
									<Text className="text-gray-400 mt-2">
										No complaints history
									</Text>
								</View>
							)}
						</View>
					</View>
				)}
			</View>
		</ScrollView>
	);
}
