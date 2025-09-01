import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import type { CollectionDetailType, SectionDetailType } from "@paratus/api";

import { Colors } from "~/styles/colors";
import TaskCard from "./task/TaskCard";

export default function SectionCard({
  collection,
  section,
}: {
  collection: CollectionDetailType;
  section: SectionDetailType;
}) {
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
  // TODO: get rid of once we start using the collection prop
  console.log({ collection });
  return (
    <>
      {/* Section Heading */}
      <View
        key={section.id}
        className="flex flex-row items-center gap-2 border-b border-b-white/30 py-2"
      >
        <Text className="text-lg font-bold text-white">{section.name}</Text>
        <TouchableOpacity
          onPress={() => setIsSectionCollapsed((prev) => !prev)}
          className="ml-auto"
          //   className={`transition-transform duration-200 ${
          //     isSectionCollapsed ? "-rotate-90" : ""
          //   }`}
        >
          <FontAwesome
            name={isSectionCollapsed ? "angle-right" : "angle-down"}
            color={Colors.white}
            size={28}
          />
        </TouchableOpacity>
      </View>

      {/* Section Wrapper */}
      <View className="ml-2 flex gap-2">
        {!isSectionCollapsed &&
          section.tasks.map((task) => <TaskCard key={task.id} task={task} />)}
      </View>
    </>
  );
}
