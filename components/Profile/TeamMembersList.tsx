import { View, Text } from 'react-native';
import { Checkbox } from "expo-checkbox";

interface TeamMembersListProps {
  members: any[];
  leaderId: number;
  selectedMembers: { [key: string]: boolean };
  onToggleSelect: (sfId: string) => void;
}

const formatLeaderId = (leaderId: number): string => {
  return `SF${leaderId.toString().padStart(5, "0")}`;
};

export default function TeamMembersList({ 
  members, 
  leaderId, 
  selectedMembers, 
  onToggleSelect 
}: TeamMembersListProps) {
  return (
    <View className="space-y-2">
      <Text className="text-gray-800 font-semibold mb-2">Team Members</Text>
      {members.map((member) => {
        const isLeader = formatLeaderId(leaderId) === member.user.sfId;
        return (
          <View
            key={member.user.sfId}
            className="flex-row items-center justify-between py-2 border-b border-gray-100"
          >
            <View className="flex-row items-center flex-1">
              {!isLeader && (
                <Checkbox
                  value={selectedMembers[member.user.sfId] || false}
                  onValueChange={() => onToggleSelect(member.user.sfId)}
                  color={selectedMembers[member.user.sfId] ? "#8F6AF8" : undefined}
                  className="mr-3"
                />
              )}
              <View className={!isLeader ? "" : "ml-3"}>
                <Text className="text-gray-800 font-medium">{member.user.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {member.user.sfId} • {member.user.college}
                </Text>
              </View>
            </View>
            {isLeader && (
              <View className="bg-purple-100 px-2 py-1 rounded-full">
                <Text className="text-[#8F6AF8] text-xs">Leader</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
} 