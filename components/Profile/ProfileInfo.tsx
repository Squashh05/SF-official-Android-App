import { useUserContext } from "@/context/userContext";
import { clearData, getData } from "@/utils/storage";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import axios from "axios";
import { formatDate } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Image,
	RefreshControl,
	ScrollView,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileInfo() {
	const { user, setUser, setIsLoggedIn, token, hallData, fetchHallData } =
		useUserContext();
	const [dob, setDob] = useState<string>("");

	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const changePasswordModalRef = useRef<BottomSheetModal>(null);
	const deleteAccountModalRef = useRef<BottomSheetModal>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const navigation = useNavigation<any>();

	useEffect(() => {
		if (user?.dob) {
			setDob(formatDate(new Date(user?.dob), "do LLL yyyy"));
		}
	}, [user?.dob]);

	const infoItems = [
		{
			label: "SF ID",
			value: user?.sfId,
			icon: <FontAwesome5 name="id-badge" size={20} color="#8F6AF8" />,
		},
		{
			label: "Hall",
			value: hallData?.hallAlloted,
			icon: <FontAwesome5 name="bed" size={20} color="#8F6AF8" />,
		},
		{
			label: "Email",
			value: user?.email,
			icon: <MaterialIcons name="email" size={20} color="#8F6AF8" />,
		},
		{
			label: "Phone",
			value: user?.mobile,
			icon: <MaterialIcons name="phone" size={20} color="#8F6AF8" />,
		},
		{
			label: "College",
			value: user?.college,
			icon: <FontAwesome5 name="university" size={20} color="#8F6AF8" />,
		},
		{
			label: "DOB",
			value: dob,
			icon: (
				<FontAwesome5 name="birthday-cake" size={20} color="#8F6AF8" />
			),
		},
	];

	console.log("hall alloted", hallData);

	const handleChangePassword = async (
		oldPassword: string,
		newPassword: string
	) => {
		try {
			const response = await axios.post("/user/changePassword", {
				token,
				email: user?.email,
				oldPassword,
				newPassword,
			});

			if (response.data.code === 0) {
				ToastAndroid.show(
					"Password Changed Successfully",
					ToastAndroid.SHORT
				);
			} else {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			}
		} catch (error) {
			console.error("Password Change Failed:", error);
			ToastAndroid.show("Password Change Failed", ToastAndroid.SHORT);
		}
	};

	const handleDeleteAccount = async () => {
		try {
			setIsDeleting(true);
			const response = await axios.delete(`/user/${user?.sfId}`, {
				data: { token },
			});

			if (response.data.code === 0) {
				ToastAndroid.show(
					"Account deleted successfully",
					ToastAndroid.SHORT
				);
				await clearData();
				navigation.replace("(auth)");
			} else {
				ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
			}
		} catch (error) {
			console.error("Delete account failed:", error);
			ToastAndroid.show("Failed to delete account", ToastAndroid.SHORT);
		} finally {
			setIsDeleting(false);
		}
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

	useEffect(() => {
		fetchHallData();
	}, []);

	return (
		<ScrollView
			className="space-y-6 mb-12"
			refreshControl={
				<RefreshControl
					refreshing={loading}
					onRefresh={fetchUserData}
				/>
			}
			nestedScrollEnabled={true}
			showsVerticalScrollIndicator={false}
		>
			{/* Profile Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="rounded-2xl p-6 shadow-lg"
			>
				<View className="items-center">
					<View className="rounded-2xl m-2 border-4 border-white">
						<Image
							source={
								user.gender === "M"
									? require("@/assets/images/sleep/male-wizard.png")
									: require("@/assets/images/sleep/female-wizard.png")
							}
							className="w-40 h-40 rounded-lg mb-2"
						/>
					</View>
					<Text className="text-white text-2xl font-bold mb-1">
						{user?.name}
					</Text>
					<View className="flex-row items-center">
						<Ionicons
							name={
								user.payment_status === 1
									? "checkmark-circle"
									: "close-circle"
							}
							size={20}
							color={
								user.payment_status === 1
									? "#4CAF50"
									: "#EF4444"
							}
						/>
						<Text className="text-white/95 font-semibold ml-1 text-base">
							{user.payment_status === 1
								? "Payment Verified"
								: "Incomplete Payment"}
						</Text>
					</View>
				</View>
			</LinearGradient>

			{/* Info Cards */}
			<View className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
				{infoItems.map((item, index) => (
					<View
						key={index}
						className={`flex-row items-center pb-2 ${
							index !== infoItems.length - 1
								? "border-b border-gray-100"
								: ""
						}`}
					>
						<View className="w-8">{item.icon}</View>
						<View className="flex-1 ml-3">
							<Text className="text-gray-500 text-sm mb-1">
								{item.label}
							</Text>
							<Text className="text-gray-800 font-semibold">
								{item.value || "N/A"}
							</Text>
						</View>
					</View>
				))}

				{/* Change Password Button */}
				<TouchableOpacity
					onPress={() => changePasswordModalRef.current?.present()}
					className="flex-row items-center justify-between py-2 mt-2 border-t border-gray-100"
				>
					<View className="flex-row items-center">
						<MaterialIcons name="lock" size={20} color="#8F6AF8" />
						<Text className="text-gray-800 font-semibold ml-3">
							Change Password
						</Text>
					</View>
					<MaterialIcons
						name="chevron-right"
						size={24}
						color="#8F6AF8"
					/>
				</TouchableOpacity>

				{/* Delete Account Button */}
				<TouchableOpacity
					onPress={() => deleteAccountModalRef.current?.present()}
					className="flex-row items-center justify-between py-2 mt-2 border-t border-gray-100"
				>
					<View className="flex-row items-center">
						<MaterialIcons
							name="delete-forever"
							size={20}
							color="#EF4444"
						/>
						<Text className="text-red-500 font-semibold ml-3">
							Delete Account
						</Text>
					</View>
					<MaterialIcons
						name="chevron-right"
						size={24}
						color="#EF4444"
					/>
				</TouchableOpacity>
			</View>

			{/* Change Password Modal */}
			<ChangePasswordModal
				modalRef={changePasswordModalRef}
				onChangePassword={handleChangePassword}
			/>

			{/* Delete Account Modal */}
			<BottomSheetModal
				ref={deleteAccountModalRef}
				snapPoints={["75%"]}
				backgroundStyle={{ backgroundColor: "#F8F9FA" }}
			>
				<BottomSheetScrollView>
					{/* Header */}
					<LinearGradient
						colors={["#EF4444", "#B91C1C"]}
						className="p-6 mx-4 rounded-xl"
					>
						<View className="flex-row items-center justify-between">
							<View>
								<Text className="text-2xl font-bold text-white mb-1">
									Delete Account
								</Text>
								<Text className="text-white/80">
									This action cannot be undone
								</Text>
							</View>
							<View className="bg-white/20 p-3 rounded-full">
								<MaterialIcons
									name="warning"
									size={24}
									color="white"
								/>
							</View>
						</View>
					</LinearGradient>

					<View className="p-6 space-y-6">
						{/* Warning Message */}
						<View className="bg-red-50 p-4 rounded-xl">
							<Text className="text-red-800 font-medium text-lg mb-2">
								Warning: Permanent Account Deletion
							</Text>
							<Text className="text-red-600">
								This will permanently delete your account and
								all associated data. This action cannot be
								reversed.
							</Text>
						</View>

						{/* Data Deletion Details */}
						<View className="space-y-4">
							<Text className="text-lg font-bold text-gray-800">
								The following data will be deleted:
							</Text>

							{[
								{
									icon: "person",
									text: "Your profile and personal information",
								},
								{
									icon: "event",
									text: "All event registrations and participations",
								},
								{
									icon: "comment",
									text: "All submitted complaints and their history",
								},
								{
									icon: "lightbulb",
									text: "All submitted ideas and suggestions",
								},
								{
									icon: "shopping-cart",
									text: "All merchandise order history",
								},
								{
									icon: "badge",
									text: "Your Spring Fest ID and credentials",
								},
							].map((item, index) => (
								<View
									key={index}
									className="flex-row items-center bg-gray-50 p-4 rounded-xl"
								>
									<MaterialIcons
										name={item.icon as any}
										size={24}
										color="#EF4444"
									/>
									<Text className="text-gray-700 ml-3 flex-1">
										{item.text}
									</Text>
								</View>
							))}
						</View>

						{/* Confirmation Buttons */}
						<View className="space-y-3 pt-4">
							<TouchableOpacity
								onPress={handleDeleteAccount}
								disabled={isDeleting}
								className="bg-red-500 p-4 rounded-xl"
							>
								{isDeleting ? (
									<ActivityIndicator
										color="white"
										size={28}
									/>
								) : (
									<Text className="text-white text-center font-bold">
										Yes, Delete My Account
									</Text>
								)}
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() =>
									deleteAccountModalRef.current?.close()
								}
								className="bg-gray-100 p-4 rounded-xl"
							>
								<Text className="text-gray-700 text-center font-medium">
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</BottomSheetScrollView>
			</BottomSheetModal>
		</ScrollView>
	);
}
