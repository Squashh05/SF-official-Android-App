import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	Dimensions,
	Linking,
	BackHandler,
	TextInput,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import MapData from "@/constants/map-data";
import Fuse from 'fuse.js';

import { WebView } from "react-native-webview";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";

const { width } = Dimensions.get("window");

export default function Location() {
	const navigator = useNavigation<any>();

	const [mapData, setMapData] = useState<any>(null);

	const { id } = useLocalSearchParams<{ id: string }>();

	const [selectedLocation, setSelectedLocation] = useState(MapData[0]);
	const webViewRef = useRef<any>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const horizontalScrollRef = useRef<ScrollView>(null);

	const fetchMapData = async () => {
		try {
			const response = await axios.get("/content/mapData");
			if (response.data.code === 0) setMapData(response.data.data);
			else setMapData(MapData);
		} catch (error) {
			console.error("Error fetching map data", error);
			setMapData(MapData);
		}
	};

	// Function to move the map to a specific location
	const flyToLocation = (location: any) => {
		setSelectedLocation(location);

		// Post a message to the WebView to update the map's center
		webViewRef.current?.injectJavaScript(`
			map.flyTo([${location.coordinate.latitude}, ${location.coordinate.longitude}], 16);
			marker.setLatLng([${location.coordinate.latitude}, ${location.coordinate.longitude}])
				.bindPopup('${location.title}')
				.openPopup();
		`);
	};

	// Open Google Maps for navigation
	const openInGoogleMaps = (location: any) => {
		const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinate.latitude},${location.coordinate.longitude}`;
		Linking.openURL(url).catch((err) =>
			console.error("Error opening Google Maps", err)
		);
	};

	const openStreetMapHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>OpenStreetMap</title>
            <style>
                html, body, #map {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }
            </style>
            <script
                src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"
            ></script>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
            />
        </head>
        <body>
            <div id="map"></div>
            <script>
                // Create custom icon with larger size
                var customIcon = L.icon({
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                    iconSize: [35, 55], // Increased from default [25, 41]
                    iconAnchor: [17, 45],
                    popupAnchor: [0, -45]
                });

                var map = L.map('map', {
                    attributionControl: false
                }).setView([22.3199, 87.3097], 17); // IIT KGP coordinates
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: ''
                }).addTo(map);

                // Apply larger font size to map container
                map.getContainer().style.fontSize = '32px';

                var marker = L.marker([22.3199, 87.3097], {icon: customIcon}).addTo(map)
                    .bindPopup('<div style="font-size: 32px;">IIT Kharagpur</div>')
                    .openPopup();
            </script>
        </body>
        </html>
    `;

	// Initialize Fuse.js
	const fuse = new Fuse(MapData, {
		keys: ['title'],
		threshold: 0.3,
	});

	// Handle search
	const handleSearch = (text: string) => {
		setSearchQuery(text);
		if (text.length > 0) {
			const results = fuse.search(text).map(result => result.item);
			setSearchResults(results);
			setShowDropdown(true);
		} else {
			setSearchResults([]);
			setShowDropdown(false);
		}
	};

	// Scroll to selected location
	const scrollToLocation = (location: any) => {
		const index = MapData.findIndex(item => item.id === location.id);
		if (index !== -1 && horizontalScrollRef.current) {
			horizontalScrollRef.current.scrollTo({
				x: index * (width * 0.6 + 16), // card width + margin
				animated: true
			});
		}
	};

	useEffect(() => {
		if (id) {
			setSelectedLocation(
				MapData.find((location) => location.id === parseInt(id)) ??
				MapData[0]
			);
			flyToLocation(
				MapData.find((location) => location.id === parseInt(id)) ??
				MapData[0]
			);
		}
	}, [id]);

	useEffect(() => {
		fetchMapData();

		const backAction = () => {
			// Assuming 'navigator' is available in your scope,
			// otherwise, you might need to use a hook like useNavigation() from expo-router
			navigator.replace("(tabs)", {
				screen: "index",
			});
			// Return true to prevent the default back button action
			return true;
		};

		// 1. Save the subscription object that is returned by addEventListener
		const subscription = BackHandler.addEventListener(
			"hardwareBackPress",
			backAction
		);

		// 2. Return a cleanup function that calls .remove() on the subscription
		return () => subscription.remove();

	}, []); // The empty array ensures this effect runs only once when the component mounts

	// Auto scroll when selected location changes
	useEffect(() => {
		if (selectedLocation) {
			scrollToLocation(selectedLocation);
		}
	}, [selectedLocation]);

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<LinearGradient
				colors={["#8F6AF8", "#7054BE"]}
				className="px-6 py-8 rounded-b-3xl"
			>
				<View className="flex-row justify-between items-center">
					<TouchableOpacity
						onPress={() =>
							navigator.replace("(tabs)", {
								screen: "index",
							})
						}
						className="bg-white/20 p-3 rounded-full"
					>
						<MaterialIcons
							name="arrow-back"
							size={24}
							color="white"
						/>
					</TouchableOpacity>
					<View>
						<Text className="text-2xl text-center font-bold text-white mb-1">
							Campus Map
						</Text>
						<Text className="text-white/80 text-center">
							Find your way around IIT KGP
						</Text>
					</View>
					<View className="bg-white/20 p-3 rounded-full">
						<MaterialIcons name="map" size={24} color="white" />
					</View>
				</View>

				{/* Search Bar */}
				<View className="mt-4">
					<View className="flex-row items-center bg-white/20 rounded-xl px-4 py-2">
						<MaterialIcons name="search" size={24} color="white" />
						<TextInput
							placeholder="Search locations..."
							placeholderTextColor="rgba(255,255,255,0.7)"
							value={searchQuery}
							onChangeText={handleSearch}
							className="flex-1 ml-2 text-white"
						/>
					</View>

					{/* Search Dropdown */}
					{showDropdown && searchResults.length > 0 && (
						<View className="absolute top-full left-0 right-0 bg-white rounded-b-xl shadow-lg z-50 mt-1">
							<ScrollView className="max-h-48">
								{searchResults.map((location, index) => (
									<TouchableOpacity
										key={index}
										onPress={() => {
											flyToLocation(location);
											setSearchQuery('');
											setShowDropdown(false);
										}}
										className="p-3 border-b border-gray-100"
									>
										<Text className="text-gray-800">{location.title}</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						</View>
					)}
				</View>
			</LinearGradient>

			{/* Map */}
			<View className="flex-1 bg-gray-50">
				<WebView
					ref={webViewRef}
					originWhitelist={["*"]}
					source={{ html: openStreetMapHTML }}
					style={{ flex: 1 }}
					javaScriptEnabled={true}
					domStorageEnabled={true}
				/>
			</View>

			{/* Location List */}
			<ScrollView
				ref={horizontalScrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				className="absolute bottom-6 left-0 right-0"
				contentContainerStyle={{ paddingHorizontal: 16 }}
			>
				{MapData.map((location, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => flyToLocation(location)}
						className={`mr-4 bg-white rounded-xl overflow-hidden shadow-md ${selectedLocation === location
								? "border-2 border-[#8F6AF8]"
								: ""
							}`}
						style={{ width: width * 0.6 }}
					>
						<Image
							source={
								location.img ??
								"@/assets/images/home/card-bg.jpg"
							}
							className="w-full h-32"
							resizeMode="cover"
						/>
						<LinearGradient
							colors={["transparent", "rgba(0,0,0,0.7)"]}
							className="absolute bottom-0 left-0 right-0 p-4"
						>
							<Text className="text-white font-bold text-lg">
								{location.title}
							</Text>
							<View className="flex-row items-center">
								<MaterialIcons
									name="location-on"
									size={16}
									color="#8F6AF8"
								/>
								<Text className="text-white/80 ml-1">
									{location.coordinate.latitude.toFixed(4)},{" "}
									{location.coordinate.longitude.toFixed(4)}
								</Text>
							</View>
							<TouchableOpacity
								className="mt-2 bg-[#8F6AF8] rounded-full p-2"
								onPress={() => openInGoogleMaps(location)}
							>
								<Text className="text-white text-center text-sm">
									Open in Maps
								</Text>
							</TouchableOpacity>
						</LinearGradient>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}
