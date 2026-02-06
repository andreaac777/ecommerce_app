import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface HeaderProps {
  header?: string;
}

export function Header({
  header,
}: HeaderProps) {
  if (!header) return null;
  return (
    <View className="bg-ui-background px-6 pt-5 pb-5 flex-row items-center">
      <TouchableOpacity onPress={() => router.back()} className="mr-4">
        <Ionicons name="arrow-back" size={28} color="#5B3A29" />
      </TouchableOpacity>
      <Text className="text-brand-secondary text-2xl font-bold">{header}</Text>
    </View>
  );
}