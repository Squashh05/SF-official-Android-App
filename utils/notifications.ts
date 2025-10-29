import MapData from "@/constants/map-data";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notifications
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export const registerForPushNotificationsAsync = async () => {
	const { status: existingStatus } =
		await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		return false;
	}

	return true;
};

export const scheduleEventNotification = async (event: any) => {
	const eventDate = new Date(`${event.date}T${event.time}`);

	const reminderTime = new Date(eventDate.getTime() - 15 * 60000); // 15 minutes before

	// // Don't schedule if the event is in the past
	if (reminderTime <= new Date()) return;

	try {
		const identifier = `event-${event.id}`;

		// Cancel any existing notification for this event
		await cancelEventNotification(identifier);

		// Schedule new notification
		await Notifications.scheduleNotificationAsync({
			identifier,
			content: {
				title: `Event Reminder - ${event.title}`,
				body: `${event.title} starts in 15 minutes at ${
					MapData.find((loc) => loc.id === event.locationId)?.title
				}`,
				data: { event },
			},
			trigger: {
				date: reminderTime,
				channelId: "event",
			},
		});

		return identifier;
	} catch (error) {
		console.error("Error scheduling notification:", error);
		return null;
	}
};

export const cancelEventNotification = async (identifier: string) => {
	try {
		await Notifications.cancelScheduledNotificationAsync(identifier);
	} catch (error) {
		console.error("Error canceling notification:", error);
	}
};

export const cancelAllEventNotifications = async () => {
	try {
		await Notifications.cancelAllScheduledNotificationsAsync();
	} catch (error) {
		console.error("Error canceling all notifications:", error);
	}
};
