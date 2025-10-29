import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Coming Soon!",
  subtitle = "We're working hard to bring you something amazing.",
  showBackButton = true,
}) => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={["#8F6AF8", "#7054BE"]}
      className="flex-1 justify-center items-center px-6"
    >
      {/* Rocket Animation Container */}
      <View className="w-40 h-40 mb-8 items-center justify-center">
        <MaterialIcons name="rocket-launch" size={100} color="white" />
      </View>

      {/* Text Content */}
      <View className="items-center">
        <Text className="text-3xl font-bold text-white mb-4 text-center">
          {title}
        </Text>
        <Text className="text-white/80 text-center text-lg mb-8">
          {subtitle}
        </Text>
      </View>

      {/* Back Button */}
      {showBackButton && (
        <Pressable
          onPress={() => navigation.goBack()}
          className="bg-white/20 px-6 py-3 rounded-full flex-row items-center"
        >
          <MaterialIcons 
            name="arrow-back" 
            size={24} 
            color="white" 
            style={{ marginRight: 8 }} 
          />
          <Text className="text-white font-semibold text-lg">
            Go Back
          </Text>
        </Pressable>
      )}
    </LinearGradient>
  );
};

export default ComingSoon; 