import {
	View,
	Text,
	ToastAndroid,
	Pressable,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";
import Input from "@/components/input";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { mergeData } from "@/utils/storage";

export default function index() {
	const navigator = useNavigation<any>();

	const formik = useFormik({
		initialValues: {
			password: "",
			confirmPassword: "",
			security_question: "",
			security_answer: "",
		},
		validationSchema: Yup.object({
			password: Yup.string().required("Required!").min(6, "Too Short!"),
			confirmPassword: Yup.string()
				.required("Required!")
				.min(6, "Too Short!"),
			security_question: Yup.string().required("Required!"),
			security_answer: Yup.string().required("Required!"),
		}),
		onSubmit: async (values) => {
			if (values.password !== values.confirmPassword) {
				ToastAndroid.show(
					"Passwords do not match!",
					ToastAndroid.CENTER
				);
				return;
			}

			await mergeData("userData", values);
			navigator.navigate("(auth)", { screen: "college" });
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
								Create Password
							</Text>
							<Text className="text-base text-gray-600">
								Set up a secure password and security question
							</Text>
						</View>

						{/* Form Section */}
						<View className="flex-1">
							<View className="space-y-4">
								<Input
									placeholder="Enter your Password"
									onChangeText={formik.handleChange("password")}
									value={formik.values.password}
									name="Password"
									error={
										formik.touched.password &&
										formik.errors.password
											? formik.errors.password
											: undefined
									}
									icon="lock"
									secureTextEntry
								/>

								<View />

								<Input
									placeholder="Confirm Your Password"
									onChangeText={formik.handleChange(
										"confirmPassword"
									)}
									value={formik.values.confirmPassword}
									name="Confirm Password"
									error={
										formik.touched.confirmPassword &&
										formik.errors.confirmPassword
											? formik.errors.confirmPassword
											: undefined
									}
									icon="lock"
									secureTextEntry
								/>

								<View />

								<Input
									placeholder="Enter your Security Question"
									onChangeText={formik.handleChange(
										"security_question"
									)}
									value={formik.values.security_question}
									name="Security Question"
									error={
										formik.touched.security_question &&
										formik.errors.security_question
											? formik.errors.security_question
											: undefined
									}
									icon="question-circle"
								/>

								<View />

								<Input
									placeholder="Enter your Security Answer"
									onChangeText={formik.handleChange(
										"security_answer"
									)}
									value={formik.values.security_answer}
									name="Security Answer"
									error={
										formik.touched.security_answer &&
										formik.errors.security_answer
											? formik.errors.security_answer
											: undefined
									}
									icon="key"
								/>
							</View>

							{/* Continue Button */}
							<View className="mt-6">
								<Pressable
									onPress={() => {
										if (!formik.isValid) {
											if (formik.errors.password)
												ToastAndroid.show(
													formik.errors.password,
													ToastAndroid.CENTER
												);
											else if (formik.errors.confirmPassword)
												ToastAndroid.show(
													formik.errors.confirmPassword,
													ToastAndroid.CENTER
												);
											else if (formik.errors.security_question)
												ToastAndroid.show(
													formik.errors.security_question,
													ToastAndroid.CENTER
												);
											else if (formik.errors.security_answer)
												ToastAndroid.show(
													formik.errors.security_answer,
													ToastAndroid.CENTER
												);
											else
												ToastAndroid.show(
													"Please fill all fields!",
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
										<Text className="text-white text-lg font-bold text-center">
											Continue
										</Text>
									</LinearGradient>
								</Pressable>
							</View>
						</View>

						{/* Info Section */}
						<View className="py-8">
							<View className="bg-purple-50 p-4 rounded-xl">
								<Text className="text-sm text-gray-600 text-center">
									Make sure to remember your security question and answer.
									They will help you recover your account if needed.
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
