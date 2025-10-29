import { View, Text, TouchableOpacity, Modal } from "react-native";
import {
	BarcodeCreatorView,
	BarcodeFormat,
} from "react-native-barcode-creator";
import { MaterialIcons } from "@expo/vector-icons";

export default function QRCodeModal({
	visible,
	onClose,
	value,
	title,
}: {
	visible: boolean;
	onClose: () => void;
	value: string;
	title: string;
}) {
	return (
		<Modal
			transparent
			visible={visible}
			onRequestClose={onClose}
			animationType="fade"
		>
			<TouchableOpacity
				activeOpacity={1}
				onPress={onClose}
				className="flex-1 bg-black/80 justify-center items-center"
			>
				<TouchableOpacity
					activeOpacity={1}
					onPress={(e) => e.stopPropagation()}
					className="bg-white rounded-2xl p-6 w-[90%] max-w-[350px]"
				>
					<View className="flex-row justify-between items-center mb-4">
						<Text className="text-xl font-bold text-gray-800">
							{title}
						</Text>
						<TouchableOpacity
							onPress={onClose}
							className="bg-gray-100 p-2 rounded-full"
						>
							<MaterialIcons
								name="close"
								size={24}
								color="#1f2937"
							/>
						</TouchableOpacity>
					</View>
					<View className="items-center bg-white p-4 rounded-xl">
						<BarcodeCreatorView
							value={value}
							background={"#FFFFFF"}
							foregroundColor={"#000000"}
							format={BarcodeFormat.CODE128}
							style={{ width: 250, height: 150 }}
						/>
					</View>
					<View>
						<Text className="text-center text-lg font-bold">{value}</Text>
						<Text className="text-center text-gray-500 mt-4">
							Scan this QR Code to verify your identity
						</Text>
					</View>
				</TouchableOpacity>
			</TouchableOpacity>
		</Modal>
	);
}
