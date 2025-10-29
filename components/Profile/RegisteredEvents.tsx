import {
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useUserContext } from "@/context/userContext";
import axios from "axios";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AddMembersModal from "@/components/Profile/AddMembersModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import EventCard from "./EventCard";
import TeamMembersList from "./TeamMembersList";
import TeamActionButtons from "./TeamActionButtons";
import { clearData } from "@/utils/storage";
import { useNavigation } from "expo-router";

const formatLeaderId = (leaderId: number): string => {
  return `SF${leaderId.toString().padStart(5, "0")}`;
};

export default function RegisteredEvents() {
  const {
    token,
    isLoggedIn,
    user,
    soloEvents,
    setSoloEvents,
    groupEvents,
    setGroupEvents,
  } = useUserContext();

  const [selectedMembers, setSelectedMembers] = useState<{
    [key: string]: { [key: string]: boolean };
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isDeregistering, setIsDeregistering] = useState<{
    [key: number]: boolean;
  }>({});

  const addMembersModalRef = useRef<BottomSheetModal>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const navigator = useNavigation<any>();

  const getEvents = async () => {
    try {
      setIsLoading(true);
      let url = "/user/registered_events";

      const response = await axios.post(url, {
        token,
      });

      if (response.data.code === 0) {
        setSoloEvents(response.data.soloEventData);
        setGroupEvents(response.data.groupEventData);
      } else {
        // console.error(JSON.stringify(response.data));
        if (response.data.message.includes("Unauthorized")) {
          clearData();
          navigator.navigate("(auth)", {
            screen: "index",
          });
        }
        console.log(JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
      console.log("could not fetch Events");
      console.log(token);
      ToastAndroid.show("Could not fetch events", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeRegisterMemberSolo = async (event_id: number) => {
    try {
      setIsDeregistering((prev) => ({ ...prev, [event_id]: true }));
      const url = "/event/deregister/member";
      const response = await axios.post(url, {
        token,
        eventId: event_id,
        memberToDeregister: [
          {
            email: user.email,
            sfId: user.sfId,
          },
        ],
      });

      if (response.data.code === 0) {
        // createToast("Successfully Deregistered", "success");
        ToastAndroid.show(
          "Successfully Deregistered",
          ToastAndroid.SHORT
        );
        getEvents();
      }
    } catch (error) {
      console.log("Error in deregistering Check your Network");
      ToastAndroid.show("Error in deregistering", ToastAndroid.SHORT);
    } finally {
      setIsDeregistering((prev) => ({ ...prev, [event_id]: false }));
    }
  };

  const handleDeRegisterTeam = async (event_id: number) => {
    try {
      const url = "/event/deregister/team";
      const response = await axios.post(url, {
        token,
        eventId: event_id,
      });

      console.log(response.data);
      if (response.data.code === 0) {
        // createToast("Successfully Deregistered", "success");
        ToastAndroid.show(
          "Successfully Deregistered",
          ToastAndroid.SHORT
        );
        getEvents();
      } else {
        // createToast(response.data.message, "error");
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error in deregistering", ToastAndroid.SHORT);
    }
  };

  const handleDeRegisterMemberFromTeam = async (
    event_id: number,
    membersToDeregister: { sfId: string; email: string }[]
  ) => {
    try {
      const url = "/event/deregister/member";
      const response = await axios.post(url, {
        token,
        eventId: event_id,
        memberToDeregister: membersToDeregister,
      });

      console.log(response.data);
      if (response.data.code === 0) {
        // createToast("Successfully Deregistered", "success");
        ToastAndroid.show(
          "Successfully Deregistered Members",
          ToastAndroid.SHORT
        );
        getEvents();
      } else {
        // createToast(response.data.message, "error");
        ToastAndroid.show(response.data.message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Error in deregistering members",
        ToastAndroid.SHORT
      );
    }
  };

  const toggleMemberSelection = (eventId: number, sfId: string) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || {}),
        [sfId]: !(prev[eventId]?.[sfId] || false),
      },
    }));
  };

  const handleDeregisterSelectedMembers = async (eventId: number) => {
    const selectedMembersForEvent = selectedMembers[eventId] || {};
    const membersToDeregister = Object.entries(selectedMembersForEvent)
      .filter(([_, isSelected]) => isSelected)
      .map(([sfId]) => {
        const member = groupEvents
          .find(
            (e: { event: { id: number } }) => e.event.id === eventId
          )
          ?.GroupMembers.find(
            (m: { user: { sfId: string; email: string } }) =>
              m.user.sfId === sfId
          );
        return {
          sfId,
          email: member?.user.email || "",
        };
      });

    if (membersToDeregister.length === 0) {
      ToastAndroid.show(
        "Please select members to deregister",
        ToastAndroid.SHORT
      );
      return;
    }

    await handleDeRegisterMemberFromTeam(eventId, membersToDeregister);
    setSelectedMembers((prev) => ({
      ...prev,
      [eventId]: {},
    }));
  };

  const handleAddMemberToTeam = async (
    event_id: number,
    teamMembers: { sfId: string; email: string }[]
  ) => {
    try {
      const url = "/event/addMember";
      const response = await axios.post(url, {
        token,
        eventId: event_id,
        teamMembers,
      });

      console.log(response.data);
      if (response.data.code === 0) {
        // createToast("Successfully Deregistered", "success");
        ToastAndroid.show(
          "Successfully Added Members",
          ToastAndroid.SHORT
        );
        getEvents();
      } else {
        // createToast(response.data.message, "error");
        ToastAndroid.show(response.data.message, ToastAndroid.LONG);
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Error in adding members", ToastAndroid.SHORT);
    }
  };

  return (
    <ScrollView
      className="space-y-6 mb-12"
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={getEvents}
        />
      }
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <LinearGradient
        colors={["#8F6AF8", "#7054BE"]}
        className="rounded-2xl p-6 mb-4"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold mb-2">
              My Events
            </Text>
            <Text className="text-white/80">
              Total Events:{" "}
              {soloEvents.length + groupEvents.length}
            </Text>
          </View>
          <View className="bg-white/20 p-3 rounded-full">
            <FontAwesome5
              name="trophy"
              size={24}
              color="white"
            />
          </View>
        </View>
      </LinearGradient>

      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#8F6AF8" />
          <Text className="text-gray-500 mt-4">
            Loading events...
          </Text>
        </View>
      ) : (
        <View>
          {/* Solo Events Section */}
          <View className="space-y-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons
                name="person"
                size={24}
                color="#8F6AF8"
              />
              <Text className="text-lg font-bold ml-2 text-gray-800">
                Solo Events
              </Text>
            </View>

            {soloEvents.length === 0 ? (
              <View className="bg-gray-50 p-6 rounded-xl items-center">
                <MaterialIcons
                  name="event-busy"
                  size={48}
                  color="#CBD5E1"
                />
                <Text className="text-gray-400 mt-2 text-center">
                  No solo events registered
                </Text>
              </View>
            ) : (
              soloEvents.map((event: any) => (
                <EventCard
                  key={event.event.id}
                  event={event}
                  isDeregistering={
                    isDeregistering[event.event.id]
                  }
                  onDeregister={() =>
                    handleDeRegisterMemberSolo(
                      event.event.id
                    )
                  }
                />
              ))
            )}
          </View>

          {/* Group Events Section */}
          <View className="space-y-4 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialIcons
                name="groups"
                size={24}
                color="#8F6AF8"
              />
              <Text className="text-lg font-bold ml-2 text-gray-800">
                Group Events
              </Text>
            </View>

            {groupEvents.length === 0 ? (
              <View className="bg-gray-50 p-6 rounded-xl items-center">
                <MaterialIcons
                  name="event-busy"
                  size={48}
                  color="#CBD5E1"
                />
                <Text className="text-gray-400 mt-2 text-center">
                  No group events registered
                </Text>
              </View>
            ) : (
              groupEvents.map((event: any) => (
                <View
                  key={event.event.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <EventCard
                    event={event}
                    isDeregistering={
                      isDeregistering[event.event.id]
                    }
                    onDeregister={() =>
                      handleDeRegisterTeam(
                        event.event.id
                      )
                    }
                  />

                  <View className="p-4 space-y-4">
                    <TeamMembersList
                      members={event.GroupMembers}
                      leaderId={event.leader_id}
                      selectedMembers={
                        selectedMembers[
                        event.event.id
                        ] || {}
                      }
                      onToggleSelect={(sfId) =>
                        toggleMemberSelection(
                          event.event.id,
                          sfId
                        )
                      }
                    />

                    <TeamActionButtons
                      isDeregistering={
                        isDeregistering[
                        event.event.id
                        ]
                      }
                      onDeregisterSelected={() =>
                        handleDeregisterSelectedMembers(
                          event.event.id
                        )
                      }
                      onAddMembers={() => {
                        setSelectedEvent(event);
                        addMembersModalRef.current?.present();
                      }}
                      onDeregisterTeam={() =>
                        handleDeRegisterTeam(
                          event.event.id
                        )
                      }
                    />
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      )}

      {selectedEvent && (
        <AddMembersModal
          modalRef={addMembersModalRef}
          event={selectedEvent}
          onAddMembers={(members) =>
            handleAddMemberToTeam(
              selectedEvent.event.id,
              members
            )
          }
        />
      )}
    </ScrollView>
  );
}
