import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { RefObject, useState } from "react";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUserContext } from "@/context/userContext";

interface Props {
  bottomSheetRef: RefObject<BottomSheetModal>;
  onSuccess: () => void;
}

export default function AddContingentMembersModal({ bottomSheetRef, onSuccess }: Props) {
  const { token } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ sfId: string; email: string }[]>([
    { sfId: "", email: "" },
  ]);

  const handleMemberChange = (index: number, field: 'sfId' | 'email', value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    setMembers([...members, { sfId: "", email: "" }]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      const updatedMembers = [...members];
      updatedMembers.splice(index, 1);
      setMembers(updatedMembers);
    }
  };

  const handleSubmit = async () => {
    if (members.some(member => !member.sfId || !member.email)) {
      ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://masterapi-springfest.vercel.app/api/contingent/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, members }),
        }
      );
      const data = await response.json();
      
      if (data.code === 0) {
        ToastAndroid.show("Members added successfully", ToastAndroid.SHORT);
        bottomSheetRef.current?.dismiss();
        onSuccess();
      } else {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      }
    } catch (err) {
      ToastAndroid.show("Failed to add members", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={["80%"]}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: "#F8F9FA" }}
    >
      <BottomSheetScrollView>
        <LinearGradient
          colors={["#8F6AF8", "#7054BE"]}
          className="p-6 rounded-lg"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-white mb-1">
                Add Members
              </Text>
              <Text className="text-white/80">
                Add members to your contingent
              </Text>
            </View>
            <View className="bg-white/20 p-3 rounded-full">
              <MaterialIcons name="group-add" size={24} color="white" />
            </View>
          </View>
        </LinearGradient>

        <View className="p-6 space-y-6">
          {members.map((member, index) => (
            <View key={index} className="bg-white p-4 rounded-xl shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-800">
                  Member {index + 1}
                </Text>
                {members.length > 1 && (
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(index)}
                    className="bg-red-500/10 p-2 rounded-full"
                  >
                    <MaterialIcons name="person-remove" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>

              <View className="space-y-4">
                <View>
                  <Text className="text-gray-500 text-sm mb-1">SF ID</Text>
                  <TextInput
                    placeholder="Enter SF ID"
                    value={member.sfId}
                    onChangeText={(value) => handleMemberChange(index, 'sfId', value)}
                    className="bg-gray-50 p-3 rounded-lg text-gray-800"
                  />
                </View>

                <View>
                  <Text className="text-gray-500 text-sm mb-1">Email</Text>
                  <TextInput
                    placeholder="Enter Email"
                    value={member.email}
                    onChangeText={(value) => handleMemberChange(index, 'email', value)}
                    className="bg-gray-50 p-3 rounded-lg text-gray-800"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            </View>
          ))}

          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleAddMember}
              className="flex-row items-center justify-center bg-[#8F6AF8]/10 p-4 rounded-xl"
            >
              <MaterialIcons name="person-add" size={20} color="#8F6AF8" />
              <Text className="text-[#8F6AF8] font-medium ml-2">
                Add Another Member
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`bg-[#8F6AF8] p-4 rounded-xl ${loading ? 'opacity-50' : ''}`}
            >
              <Text className="text-white font-bold text-center">
                {loading ? "Adding Members..." : "Add Members"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
} 