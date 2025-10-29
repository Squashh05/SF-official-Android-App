import { useEffect } from "react";
import { View, Image } from "react-native";
import { useRouter } from "expo-router";
import { useUserContext } from "@/context/userContext";

export default function SplashScreen() {
	const router = useRouter();

	const { isLoggedIn } = useUserContext();

	useEffect(() => {
		// Navigate to onboarding after splash screen (3 seconds)
		const timer = setTimeout(() => {
			if (isLoggedIn) {
				router.replace("/(tabs)/timeline");
			} else {
				router.replace("/(auth)");
			}
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<View className="flex-1 items-center justify-center p-2 bg-black">
			<Image
				source={require("@/assets/images/splash-screen.png")}
				resizeMode="contain"
				className="w-full h-full"
			/>
		</View>
	);
}
