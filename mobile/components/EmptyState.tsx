import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Header } from "./Header";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  title: string;
  description?: string;
  header?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon = "folder-open-outline",
  iconSize = 80,
  title,
  description,
  header,
  children,
}: EmptyStateProps) {
  return (
    <View className="flex-1 bg-ui-background">
      {header && <Header header={header} />}
      <View className="flex-1 items-center justify-center">
        <Ionicons name={icon} size={iconSize} color="#666" />
        <Text className="text-text-primary font-semibold text-xl mt-4">{title}</Text>
        {description && <Text className="text-text-secondary text-center mt-2">{description}</Text>}
        {children && <View className="mt-6">{children}</View>}
      </View>
    </View>
  );
}