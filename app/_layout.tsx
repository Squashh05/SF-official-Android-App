import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import NavigationContainer from "@/components/NavigationContainer";
import Splash from "@/components/splash";
import axios from "axios";
import { NativeWindStyleSheet } from "nativewind";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import React from "react";
import { useNavigation } from "expo-router";

axios.defaults.baseURL = "https://masterapi.springfest.in/api";

NativeWindStyleSheet.setOutput({
	default: "native",
});

function useNotificationObserver() {
	const navigator = useNavigation<any>();

	useEffect(() => {
		let isMounted = true;

		function redirect(notification: Notifications.Notification) {
			const id = notification.request.content.data?.event?.locationId;
			if (id) {
				navigator.navigate("(location)", {
					screen: "index",
					params: {
						id: id,
					},
				});
			}
		}

		Notifications.getLastNotificationResponseAsync().then((response) => {
			if (!isMounted || !response?.notification) {
				return;
			}
			redirect(response?.notification);
		});

		const subscription =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					redirect(response.notification);
				}
			);

		return () => {
			isMounted = false;
			// subscription.remove();
		};
	}, []);
}

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false);

	useNotificationObserver();

	useEffect(() => {
		const prepare = async () => {
			// set a timer to simulate a slow loading experience or Load fonts, make API calls, etc.
			// await new Promise((resolve) => setTimeout(resolve, 1000));

			await SplashScreen.hideAsync();
			setAppIsReady(true);
		};

		prepare();

		// Configure notifications for iOS
		if (Platform.OS === "ios") {
			Notifications.setNotificationCategoryAsync("event", [
				{
					identifier: "open",
					buttonTitle: "Open",
					options: {
						opensAppToForeground: true,
					},
				},
			]);
		}

		// Handle notification response
		const subscription =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {
					const event =
						response.notification.request.content.data.event;
					// Navigate to the event location or details if needed
				}
			);

		return () => {
			subscription.remove();
		};
	}, []);

	return <>{appIsReady ? <NavigationContainer /> : <Splash />}</>;
}
