import {
	View,
	Text,
	ToastAndroid,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import Input from "@/components/input";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { storeData } from "@/utils/storage";

export default function Index() {
	const navigator = useNavigation<any>();
	const phoneRegExp = /^[0-9]{10}$/;

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			dob: "",
			gender: "",
			mobile: "",
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.required("Required!")
				.min(3, "Name is too short!"),
			email: Yup.string()
				.email("Invalid email address")
				.required("Required!"),
			mobile: Yup.string()
				.matches(phoneRegExp, "Invalid Phone Number!")
				.required("Required!"),
			dob: Yup.string(),
			gender: Yup.string().required("Required!"),
		}),
		onSubmit: async (values) => {
			const userData = { ...values };

			await storeData("userData", userData);
			navigator.navigate("(auth)", { screen: "password" });
		},
	});

	return (
		<SafeAreaView className="flex-1 bg-white">
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				className="flex-1"
				keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
			>
				<ScrollView
					className="flex-1"
					contentContainerStyle={{ flexGrow: 1 }}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					<View className="flex-1 px-2">
						{/* Header Section */}
						<View className="pt-4 pb-8">
							<Text className="text-3xl font-bold text-gray-800 mb-3">
								Create Account
							</Text>
							<Text className="text-base text-gray-600">
								Join Spring Fest and stay updated with all
								events!
							</Text>
						</View>

						{/* Form Section */}
						<View className="flex-1">
							<View className="space-y-4">
								<Input
									placeholder="Enter your Name"
									onChangeText={formik.handleChange("name")}
									value={formik.values.name}
									name="Name"
									error={
										formik.touched.name &&
										formik.errors.name
											? formik.errors.name
											: undefined
									}
									icon="user"
								/>

								<View />

								<Input
									placeholder="Enter your Phone Number"
									onChangeText={formik.handleChange("mobile")}
									value={formik.values.mobile}
									name="Mobile Number"
									error={
										formik.touched.mobile &&
										formik.errors.mobile
											? formik.errors.mobile
											: undefined
									}
									icon="phone"
								/>

								<View />

								<Input
									placeholder="Enter your Mail ID"
									onChangeText={formik.handleChange("email")}
									value={formik.values.email}
									name="Email"
									error={
										formik.touched.email &&
										formik.errors.email
											? formik.errors.email
											: undefined
									}
									icon="envelope"
								/>

								<View />

								<Input
									placeholder="Enter your Date of Birth"
									onChangeText={(e) => {
										formik.handleChange("dob")(e);
									}}
									value={formik.values.dob}
									name="Date of Birth"
									error={
										formik.touched.dob && formik.errors.dob
											? formik.errors.dob
											: undefined
									}
									icon="calendar"
								/>

								<View />

								<Input
									placeholder="Choose your Gender"
									onChangeText={formik.handleChange("gender")}
									value={formik.values.gender}
									itemTypes={["M", "F"]}
									name="Gender"
									error={
										formik.touched.gender &&
										formik.errors.gender
											? formik.errors.gender
											: undefined
									}
									icon="venus-mars"
								/>
							</View>

							{/* Continue Button */}
							<View className="mt-6">
								<Pressable
									onPress={() => {
										if (!formik.isValid) {
											if (formik.errors.name)
												ToastAndroid.show(
													formik.errors
														.name as string,
													ToastAndroid.SHORT
												);
											else if (formik.errors.email)
												ToastAndroid.show(
													formik.errors
														.email as string,
													ToastAndroid.SHORT
												);
											else if (formik.errors.mobile)
												ToastAndroid.show(
													formik.errors
														.mobile as string,
													ToastAndroid.SHORT
												);
											else if (formik.errors.dob)
												ToastAndroid.show(
													formik.errors.dob as string,
													ToastAndroid.SHORT
												);
											else if (formik.errors.gender)
												ToastAndroid.show(
													formik.errors
														.gender as string,
													ToastAndroid.SHORT
												);
											else
												ToastAndroid.show(
													"Please fill all fields",
													ToastAndroid.SHORT
												);
											return;
										}
										formik.handleSubmit();
									}}
									className="overflow-hidden rounded-2xl"
								>
									<LinearGradient
										colors={["#8F6AF8", "#7054BE"]}
										className="px-6 py-4"
										start={{ x: 0, y: 0 }}
										end={{ x: 0, y: 1 }}
									>
										<Text className="text-white text-lg font-bold text-center">
											Continue
										</Text>
									</LinearGradient>
								</Pressable>
							</View>
						</View>

						{/* Footer Section */}
						<View className="py-8">
							<View className="flex-row justify-center items-center space-x-2 mb-6">
								<View className="h-[1px] flex-1 bg-gray-200" />
								<Text className="text-gray-400 px-4">or</Text>
								<View className="h-[1px] flex-1 bg-gray-200" />
							</View>

							<TouchableOpacity
								onPress={() => {
									navigator.navigate("(auth)", {
										screen: "index",
									});
								}}
								className="flex-row justify-center items-center space-x-2"
							>
								<Text className="text-gray-600 text-base">
									Already have an account?
								</Text>
								<Text className="text-[#8F6AF8] font-semibold text-base">
									Sign In
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
