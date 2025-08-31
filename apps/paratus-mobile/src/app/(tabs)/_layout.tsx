import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { HapticTab } from "~/components/ui/HapticTab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "rgb(30 41 59)",
          borderBlockColor: "rgb(30 41 59)",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => (
            <Ionicons name="today-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upcoming"
        options={{
          title: "Upcoming",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="file-tray-stacked-outline"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
