import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ToastAndroid,
} from "react-native";
import React, { RefObject, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Button from "../Events/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface ChangePasswordModalProps {
	modalRef: RefObject<BottomSheetModal>;
	onChangePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({
	modalRef,
	onChangePassword,
}: ChangePasswordModalProps) {
	const [loading, setLoading] = useState(false);
	const [passwords, setPasswords] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [showPasswords, setShowPasswords] = useState({
		oldPassword: false,
		newPassword: false,
		confirmPassword: false,
	});

	const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
		setShowPasswords(prev => ({
			...prev,
			[field]: !prev[field]
		}));
	};

	const handleSubmit = async () => {
		if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
			ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
			return;
		}

		if (passwords.newPassword !== passwords.confirmPassword) {
			ToastAndroid.show("New passwords don't match", ToastAndroid.SHORT);
			return;
		}

		try {
			setLoading(true);
			await onChangePassword(passwords.oldPassword, passwords.newPassword);
			modalRef.current?.close();
			setPasswords({
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<BottomSheetModal
			ref={modalRef}
			snapPoints={["60%"]}
			backgroundStyle={{ backgroundColor: "#F8F9FA" }}
		>
			<BottomSheetScrollView>
				{/* Header Section */}
				<LinearGradient
					colors={["#8F6AF8", "#7054BE"]}
					className="p-6 mx-4 rounded-xl"
				>
					<View className="flex-row items-center justify-between">
						<View>
							<Text className="text-2xl font-bold text-white mb-1">
								Change Password
							</Text>
							<Text className="text-white/80">
								Enter your old and new password
							</Text>
						</View>
						<View className="bg-white/20 p-3 rounded-full">
							<MaterialIcons name="lock" size={24} color="white" />
						</View>
					</View>
				</LinearGradient>

				<View className="p-6 space-y-6">
					{/* Password Fields */}
					<View className="space-y-4">
						<View>
							<Text className="text-gray-600 mb-2 ml-1">Current Password</Text>
							<View className="bg-white rounded-xl shadow-sm overflow-hidden">
								<View className="flex-row items-center px-4 py-3">
									<MaterialIcons name="lock-outline" size={20} color="#8F6AF8" />
									<TextInput
										placeholder="Enter current password"
										value={passwords.oldPassword}
										onChangeText={(text) =>
											setPasswords({ ...passwords, oldPassword: text })
										}
										secureTextEntry={!showPasswords.oldPassword}
										className="flex-1 ml-3 text-gray-800"
									/>
									<TouchableOpacity
										onPress={() => togglePasswordVisibility('oldPassword')}
										className="ml-2"
									>
										<MaterialIcons
											name={showPasswords.oldPassword ? "visibility" : "visibility-off"}
											size={20}
											color="#8F6AF8"
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>

						<View>
							<Text className="text-gray-600 mb-2 ml-1">New Password</Text>
							<View className="bg-white rounded-xl shadow-sm overflow-hidden">
								<View className="flex-row items-center px-4 py-3">
									<MaterialIcons name="lock" size={20} color="#8F6AF8" />
									<TextInput
										placeholder="Enter new password"
										value={passwords.newPassword}
										onChangeText={(text) =>
											setPasswords({ ...passwords, newPassword: text })
										}
										secureTextEntry={!showPasswords.newPassword}
										className="flex-1 ml-3 text-gray-800"
									/>
									<TouchableOpacity
										onPress={() => togglePasswordVisibility('newPassword')}
										className="ml-2"
									>
										<MaterialIcons
											name={showPasswords.newPassword ? "visibility" : "visibility-off"}
											size={20}
											color="#8F6AF8"
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>

						<View>
							<Text className="text-gray-600 mb-2 ml-1">Confirm New Password</Text>
							<View className="bg-white rounded-xl shadow-sm overflow-hidden">
								<View className="flex-row items-center px-4 py-3">
									<MaterialIcons name="lock" size={20} color="#8F6AF8" />
									<TextInput
										placeholder="Confirm new password"
										value={passwords.confirmPassword}
										onChangeText={(text) =>
											setPasswords({ ...passwords, confirmPassword: text })
										}
										secureTextEntry={!showPasswords.confirmPassword}
										className="flex-1 ml-3 text-gray-800"
									/>
									<TouchableOpacity
										onPress={() => togglePasswordVisibility('confirmPassword')}
										className="ml-2"
									>
										<MaterialIcons
											name={showPasswords.confirmPassword ? "visibility" : "visibility-off"}
											size={20}
											color="#8F6AF8"
										/>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View>

					{/* Submit Button */}
					<Button
						text={loading ? "Changing Password..." : "Change Password"}
						loading={loading}
						handleClick={handleSubmit}
					/>
				</View>
			</BottomSheetScrollView>
		</BottomSheetModal>
	);
} 