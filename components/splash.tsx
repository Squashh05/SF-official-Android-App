import { Image, View } from "react-native";

export default function Splash() {
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