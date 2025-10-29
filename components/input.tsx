import { Href, Link } from "expo-router";
import {
	Image,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TextInput,
	View,
	TouchableOpacity,
} from "react-native";

import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker, { DateType } from "react-native-ui-datepicker";
import Modal from "react-native-modal";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useState } from "react";
import { format } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
	icon?: ImageSourcePropType | string | undefined;
	placeholder: string;
	link?: string;
	name?: string;
	style?: object;
	onChangeText: (e: any) => void;
	itemTypes?: string[];
	value?: string | number;
	error?: string;
	secureTextEntry?: boolean;
};

const Input = ({
	icon,
	placeholder,
	link,
	style,
	name,
	onChangeText,
	itemTypes,
	value,
	error,
	secureTextEntry,
}: Props) => {
	const [isDatePickerVisible, setDatePickerVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const handleDateConfirm = (date: Date) => {
		setSelectedDate(date);
		let newDate = format(new Date(date), "yyyy-MM-dd");
		onChangeText(newDate);
		setDatePickerVisible(false);
	};

	return (
		<View className="space-y-1">
			{name && (
				<Text className="text-base font-medium text-gray-700">
					{name}
				</Text>
			)}

			<View
				className={`flex-row items-center bg-gray-50 rounded-xl overflow-hidden border ${
					error ? "border-red-400" : "border-gray-200"
				}`}
			>
				{icon && (
					<View className="px-3">
						{typeof icon === "string" ? (
							<FontAwesome
								name={icon as any}
								size={20}
								color="#8F6AF8"
							/>
						) : (
							<Image
								source={icon}
								style={{ width: 20, height: 20 }}
							/>
						)}
					</View>
				)}

				{name === "Date of Birth" ? (
					<>
						<TouchableOpacity
							onPress={() => setDatePickerVisible(true)}
							style={styles.dateInput}
						>
							{selectedDate ? (
								<Text className="text-base">
									{new Date(selectedDate).toDateString()}
								</Text>
							) : (
								<Text className="text-base text-[#8F8A7F]">
									{placeholder}
								</Text>
							)}
						</TouchableOpacity>
						<Modal
							isVisible={isDatePickerVisible}
							onBackdropPress={() => setDatePickerVisible(false)}
							backdropOpacity={0.5}
						>
							<View style={styles.modalContent}>
								<DateTimePicker
									mode="single"
									date={selectedDate || new Date()}
									onChange={(params: { date: DateType }) => {
										if (params.date !== undefined) {
											handleDateConfirm(
												params.date as Date
											);
										}
									}}
								/>
							</View>
						</Modal>
					</>
				) : !itemTypes ? (
					<TextInput
						placeholder={placeholder}
						value={value as string}
						onChangeText={onChangeText}
						secureTextEntry={secureTextEntry}
						className="flex-1 px-4 py-3 text-base text-gray-800"
						placeholderTextColor="#9CA3AF"
						autoCapitalize="none"
					/>
				) : (
					<SelectDropdown
						data={itemTypes as any[]}
						onSelect={(selectedItem, index) => {
							onChangeText(selectedItem);
						}}
						renderButton={(selectedItem, isOpened) => {
							return (
								<View style={styles.dropdownButtonStyle}>
									{selectedItem ? (
										<Text className="text-base">
											{selectedItem}
										</Text>
									) : (
										<Text className="text-[#8F8A7F] text-base">
											{placeholder}
										</Text>
									)}

									<FontAwesome6
										name="angle-down"
										style={{
											...styles.dropdownButtonArrowStyle,
											transform: [
												{
													rotate: isOpened
														? "180deg"
														: "0deg",
												},
											],
										}}
									/>
								</View>
							);
						}}
						renderItem={(item, index, isSelected) => {
							return (
								<View
									style={{
										...styles.dropdownItemStyle,
										...(isSelected && {
											backgroundColor: "#D2D9DF",
										}),
									}}
								>
									<Text style={styles.dropdownItemTxtStyle}>
										{item}
									</Text>
								</View>
							);
						}}
						showsVerticalScrollIndicator={true}
						dropdownStyle={styles.dropdownMenuStyle}
					/>
				)}

				{link && (
					<Link href={link as any}>
						<Text className="text-[#8F6AF8] px-4">Forgot?</Text>
					</Link>
				)}
			</View>

			{error && (
				<Text className="text-red-500 text-sm pl-1">{error}</Text>
			)}
		</View>
	);
};

export default Input;

const styles = StyleSheet.create({
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#FAF3DE",
		gap: 10,
		padding: 10,
		borderRadius: 10,
	},
	dateInput: {
		flex: 1,
		paddingVertical: 8,
	},
	inputField: {
		fontSize: 16,
		color: "#333",
		flex: 1,
	},
	modalContent: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	dropdownButtonStyle: {
		flex: 1,
		borderRadius: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 8,
	},
	dropdownButtonArrowStyle: {
		width: 16,
		height: 16,
	},
	dropdownMenuStyle: {
		backgroundColor: "#E9ECEF",
		borderRadius: 8,
		transform: [{ translateY: -40 }],
	},
	dropdownItemStyle: {
		flexDirection: "row",
		paddingHorizontal: 12,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 8,
	},
	dropdownItemTxtStyle: {
		color: "#151E26",
	},
	forgotPassword: {
		color: "#D5715B",
		marginLeft: "auto",
	},
});
