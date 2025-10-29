import {
	View,
	Text,
	ToastAndroid,
	ActivityIndicator,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from "react";
import Input from "@/components/input";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

import { useFormik } from "formik";
import * as Yup from "yup";

import axios, { AxiosError } from "axios";
import { useUserContext } from "@/context/userContext";
import { clearData, storeData } from "@/utils/storage";

export default function index() {
	const navigator = useNavigation<any>();

	const [loading, setLoading] = React.useState(false);

	const { setUser, setToken, isLoggedIn } = useUserContext();

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: Yup.object({
			email: Yup.string()
				.email("Invalid email address")
				.required("Required!"),
			password: Yup.string().required("Required!"),
		}),
		onSubmit: async () => {
			try {
				setLoading(true);
				const response = await axios.post("/user/login", {
					email: formik.values.email,
					password: formik.values.password,
				});
				console.log(Object.keys(response.data));

				if (response.data.code === 0) {
					ToastAndroid.show("Login Successful", ToastAndroid.SHORT);

					setUser(response.data.data.user);
					setToken(response.data.data.token);
					await storeData("userData", response.data.data.user);
					await storeData("token", response.data.data.token);

					console.log(response.data.data.token);

					navigator.replace("(tabs)", { screen: "index" });
				} else {
					console.log(response.data);
					ToastAndroid.show(
						response.data.message,
						ToastAndroid.SHORT
					);
				}
			} catch (error) {
				console.error("Login failed:", error);
				if (error instanceof AxiosError) {
					ToastAndroid.show(
						error?.response?.data?.message ?? "Login Failed",
						ToastAndroid.SHORT
					);
				} else {
					ToastAndroid.show("Login Failed", ToastAndroid.SHORT);
				}
				await clearData();
			} finally {
				setLoading(false);
			}
		},
	});

	const handleGoogleLogin = async (googleSignInResponse: any) => {
		try {
			const token = googleSignInResponse.credential;
			await axios
				.post("/user/login/google", {
					token,
				})
				.then((res) => {
					if (res.data.code === 0) {
						setUser(res.data.message);

						localStorage.setItem(
							"userData",
							JSON.stringify(res.data.message)
						);
					} else {
						console.log(res.data);
						ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
					}
				});
		} catch (error) {
			console.error("Google Login failed:", error);
			ToastAndroid.show("Google Login Failed", ToastAndroid.SHORT);
		}
	};

	useEffect(() => {
		console.log("isLoggedIn", isLoggedIn);
		if (isLoggedIn) {
			navigator.replace("(tabs)", { screen: "index" });
		}
	}, [isLoggedIn, navigator]);

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
						<View className="pt-4 pb-8">
							<Text className="text-3xl font-bold text-gray-800 mb-3">
								Welcome Back
							</Text>
							<Text className="text-base text-gray-600">
								Login to your SF Account to continue
							</Text>
						</View>

						<View className="flex-1 justify-center">
							<View className="space-y-6">
								<View className="space-y-4">
									<Input
										placeholder="Enter your Mail ID"
										value={formik.values.email}
										onChangeText={formik.handleChange("email")}
										name="Email"
										error={
											formik.touched.email && formik.errors.email
												? formik.errors.email
												: undefined
										}
										icon="envelope"
									/>

									<View className="h-1" />

									<Input
										placeholder="Enter your Password"
										value={formik.values.password}
										onChangeText={formik.handleChange("password")}
										name="Password"
										error={
											formik.touched.password && formik.errors.password
												? formik.errors.password
												: undefined
										}
										secureTextEntry
										icon="lock"
									/>
								</View>

								<View>
									<Pressable
										onPress={() => {
											if (!formik.isValid) {
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
											{loading ? (
												<ActivityIndicator size={24} color="#fff" />
											) : (
												<Text className="text-white text-lg font-bold text-center">
													Sign In
												</Text>
											)}
										</LinearGradient>
									</Pressable>
								</View>
							</View>
						</View>

						<View className="py-8">
							<View className="flex-row justify-center items-center space-x-2 mb-6">
								<View className="h-[1px] flex-1 bg-gray-200" />
								<Text className="text-gray-400 px-4">or</Text>
								<View className="h-[1px] flex-1 bg-gray-200" />
							</View>

							<TouchableOpacity
								onPress={() => {
									navigator.navigate("(auth)", { screen: "signup" });
								}}
								className="flex-row justify-center items-center space-x-2"
							>
								<Text className="text-gray-600 text-base">
									Don't have an account?
								</Text>
								<Text className="text-[#8F6AF8] font-semibold text-base">
									Sign Up
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
