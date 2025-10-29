import {
	View,
	Text,
	ToastAndroid,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import Input from "@/components/input";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { clearData, getData, mergeData, storeData } from "@/utils/storage";
import { useUserContext } from "@/context/userContext";
import axios from "axios";

export default function index() {
	const navigator = useNavigation<any>();
	const [loading, setLoading] = React.useState(false);
	const { setUser } = useUserContext();

	const formik = useFormik({
		initialValues: {
			college: "",
			yop: "",
			city: "",
			state: "",
			addr: "",
		},
		validationSchema: Yup.object({
			college: Yup.string().required("Required!"),
			yop: Yup.string().required("Required!"),
			state: Yup.string().required("Required!"),
			city: Yup.string().required("Required!"),
			addr: Yup.string().required("Required"),
		}),
		onSubmit: async (values) => {
			await mergeData("userData", values);
			const data = await getData("userData");

			try {
				setLoading(true);
				const response = await axios.post("/user/register_user", {
					...data,
					captcha: "8XnF72zRqTPmK3BvW5C9HYgLdMJ68XVA1pYr",
					yop: parseInt(data.yop),
				});

				console.log(JSON.stringify(response));

				if (response.data.code === 0) {
					console.log(response.data.message);

					storeData("userData", response.data.data.data);
					storeData("token", response.data.data.token);

					setUser(response.data.data.data);

					navigator.replace("(tabs)", {
						screen: "index",
					});
					ToastAndroid.show("Signup Successful", ToastAndroid.SHORT);
				} else {
					console.log(JSON.stringify(response.data));
					ToastAndroid.show(
						response.data.message,
						ToastAndroid.SHORT
					);
				}
			} catch (error) {
				console.error("Signup failed:", error);
				ToastAndroid.show("Signup Failed", ToastAndroid.SHORT);
				await clearData();
			} finally {
				setLoading(false);
			}
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
								College Details
							</Text>
							<Text className="text-base text-gray-600">
								Tell us about your educational background
							</Text>
						</View>

						{/* Form Section */}
						<View className="flex-1">
							<View className="space-y-4">
								<Input
									placeholder="Enter your College Name"
									value={formik.values.college}
									onChangeText={formik.handleChange(
										"college"
									)}
									name="College Name"
									error={
										formik.touched.college &&
										formik.errors.college
											? formik.errors.college
											: undefined
									}
									icon="graduation-cap"
								/>

								<View />

								<Input
									placeholder="Enter your Year of Graduation"
									value={formik.values.yop}
									onChangeText={formik.handleChange("yop")}
									name="Year of Graduation"
									error={
										formik.touched.yop && formik.errors.yop
											? formik.errors.yop
											: undefined
									}
									icon="calendar"
								/>

								<View />

								<Input
									placeholder="Enter your State"
									value={formik.values.state}
									onChangeText={formik.handleChange("state")}
									name="State"
									error={
										formik.touched.state &&
										formik.errors.state
											? formik.errors.state
											: undefined
									}
									icon="map-marker"
								/>

								<View />

								<Input
									placeholder="Enter your City"
									value={formik.values.city}
									onChangeText={formik.handleChange("city")}
									name="City"
									error={
										formik.touched.city &&
										formik.errors.city
											? formik.errors.city
											: undefined
									}
									icon="map-pin"
								/>

								<View />

								<Input
									placeholder="Enter your Address"
									value={formik.values.addr}
									onChangeText={formik.handleChange("addr")}
									name="Address"
									error={
										formik.touched.addr &&
										formik.errors.addr
											? formik.errors.addr
											: undefined
									}
									icon="home"
								/>
							</View>

							{/* Continue Button */}
							<View className="mt-6">
								<Pressable
									onPress={() => {
										if (!formik.isValid) {
											if (formik.errors.college)
												ToastAndroid.show(
													formik.errors.college,
													ToastAndroid.CENTER
												);
											else if (formik.errors.yop)
												ToastAndroid.show(
													formik.errors.yop,
													ToastAndroid.CENTER
												);
											else if (formik.errors.state)
												ToastAndroid.show(
													formik.errors.state,
													ToastAndroid.CENTER
												);
											else if (formik.errors.city)
												ToastAndroid.show(
													formik.errors.city,
													ToastAndroid.CENTER
												);
											else
												ToastAndroid.show(
													"Please fill all fields",
													ToastAndroid.CENTER
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
										{loading ? (
											<ActivityIndicator
												size={24}
												color="#fff"
											/>
										) : (
											<Text className="text-white text-lg font-bold text-center">
												Sign Up
											</Text>
										)}
									</LinearGradient>
								</Pressable>
							</View>
						</View>

						{/* Info Section */}
						<View className="py-8">
							<View className="bg-purple-50 p-4 rounded-xl">
								<Text className="text-sm text-gray-600 text-center">
									This is the final step of registration. Make
									sure all details are correct.
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
