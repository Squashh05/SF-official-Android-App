import { clearData, getData } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

import details from "./details.js";
import { useNavigation } from "expo-router";
import { ToastAndroid } from "react-native";

type UserType = {
	id?: string;
	name: string;
	email: string;
	phone: string;
	dob: string;
	gender: string;

	password?: string;
	confirmPassword?: string;
	securityQuestion?: string;
	securityAnswer?: string;

	college?: string;
	yearOfGraduation?: string;
	state: string;
	city: string;
};

type UserContextType = {
	user: any | null;
	setUser: (user: any) => void;
	token: string | null;
	setToken: (token: string) => void;
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	hallData: any;
	setHallData: (hallData: any) => void;
	fetchHallData: () => void;
	eventsData: any;
	setEventsData: (eventsData: any) => void;
	merchInCart: any;
	setMerchInCart: (merchInCart: any) => void;
	soloEvents: any;
	setSoloEvents: (soloEvents: any) => void;
	groupEvents: any;
	setGroupEvents: (groupEvents: any) => void;
	getEvents: () => void;
	fetchUserData: () => void;
};

const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => {},
	token: null,
	setToken: () => {},
	isLoggedIn: false,
	setIsLoggedIn: () => {},
	hallData: null,
	setHallData: () => {},
	fetchHallData: () => {},
	eventsData: null,
	setEventsData: () => {},
	merchInCart: null,
	setMerchInCart: () => {},
	soloEvents: null,
	setSoloEvents: () => {},
	groupEvents: null,
	setGroupEvents: () => {},
	getEvents: () => {},
	fetchUserData: () => {},
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<any | null>({
		sfId: "",
		name: "",
		email: "",
		mobile: "",
		dob: "",
		college: "",
	});
	const [token, setToken] = React.useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

	const [hallData, setHallData] = useState<{ hallAlloted: string } | null>(
		null
	);

	const [eventsData, setEventsData] = React.useState<any>(null);
	const [merchInCart, setMerchInCart] = React.useState<any>([]);

	const [soloEvents, setSoloEvents] = useState<any>([]);
	const [groupEvents, setGroupEvents] = useState<any>([]);

	const navigator = useNavigation<any>();

	const getEvents = async () => {
		try {
			let url = "/user/registered_events";

			const tokenFromStorage = await getData("token");

			const response = await axios.post(url, {
				token: tokenFromStorage,
			});

			// console.log(tokenFromStorage);

			if (response.data.code === 0) {
				setSoloEvents(response.data.soloEventData);
				setGroupEvents(response.data.groupEventData);
			} else {
				// if I get error saying token expired, then I need to clear the token and redirect to login page
				if (response.data.message.includes("Unauthorized")) {
					clearData();
					navigator.navigate("(auth)", {
						screen: "index",
					});
				}
				console.log("domething", JSON.stringify(response.data));
			}
		} catch (error) {
			console.log(error);
			console.log("could not fetch Events");
			console.log(token);
		}
	};

	const fetchHallData = async () => {
		try {
			const tokenFromStorage = await getData("token");
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/user/getUserHall",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token: tokenFromStorage }),
				}
			);
			const data = await response.json();

			if (data.code === 0) {
				setHallData(data);
				
			} else if (data.code === 2) {
				clearData();
				setUser(null);
				setIsLoggedIn(false);
				navigator.replace("(auth)", {
					screen: "index",
				});
			}
		} catch (err) {
			console.log("Failed to fetch hall data", JSON.stringify(err));
			ToastAndroid.show("Failed To Get Hall Data", ToastAndroid.SHORT);
		}
	};

	const fetchUserData = async () => {
		try {
			const tokenFromStorage = await getData("token");
			const response = await fetch(
				"https://masterapi-springfest.vercel.app/api/user/getUser",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token: tokenFromStorage }),
				}
			);
			const data = await response.json();

			if (data.code === 0) {
				setUser(data.data);
			} else if (data.code === 2) {
				clearData();
				setUser(null);
				setIsLoggedIn(false);
				navigator.replace("(auth)", {
					screen: "index",
				});
			}
		} catch (err) {
			console.error("Failed to fetch hall data", JSON.stringify(err));
		}
	};

	const fetchEvents = async () => {
		try {
			const res = await axios.get("/event");
			let data = await res.data.data;

			// let data = details.data;

			const filteredData = data
				.map((event: any) => ({
					...event,
					events: event.events.filter(
						(subevent: any) =>
							subevent.event_status &&
							subevent.genre !== "Accommodation"
					),
				}))
				.filter((event: any) => event.events.length > 0);
			setEventsData(filteredData);
		} catch (err) {
			console.log(err);
			let data = details.data;
			const filteredData = data
				.map((event: any) => ({
					...event,
					events: event.events.filter(
						(subevent: any) =>
							subevent.event_status &&
							subevent.genre !== "Accommodation"
					),
				}))
				.filter((event: any) => event.events.length > 0);
			setEventsData(filteredData);
		}
	};

	useEffect(() => {
		fetchEvents();
		fetchHallData();
	}, []);

	useEffect(() => {
		getData("userData").then((data) => {
			if (data) {
				setUser(data);
			}
		});
		getData("token").then((data) => {
			if (data) {
				setToken(data);
				setIsLoggedIn(true);
				getEvents();
			}
		});
	}, [token]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				token,
				setToken,
				isLoggedIn,
				setIsLoggedIn,
				hallData,
				setHallData,
				fetchHallData,
				eventsData,
				setEventsData,
				merchInCart,
				setMerchInCart,
				soloEvents,
				setSoloEvents,
				groupEvents,
				setGroupEvents,
				getEvents,
				fetchUserData,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserContextProvider };

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUserContext must be used within an UserProvider");
	}
	return context;
};
