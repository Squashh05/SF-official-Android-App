import { UserContextProvider } from "@/context/userContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NavigationContainer() {
	return (
		<UserContextProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Stack
					screenOptions={{
						headerShown: false,
						animation: "fade",
					}}
				>
					<Stack.Screen
						name="index"
						options={{
							animation: "none",
						}}
					/>
					<Stack.Screen
						name="(onboarding)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(auth)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(tabs)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(drawer)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(location)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(subevents)"
						options={{
							animation: "slide_from_right",
						}}
					/>
					<Stack.Screen
						name="(stalls)"
						options={{
							animation: "slide_from_right",
						}}
					/>
				</Stack>
			</GestureHandlerRootView>
		</UserContextProvider>
	);
}
