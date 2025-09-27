import { useEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Link, useSegments } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { format, isPast } from "date-fns";

import type { TaskDetailType } from "@paratus/api";

import SectionPicker from "~/components/shared/SectionPicker";
import { Colors } from "~/styles/colors";

export default function TaskCard({ task }: { task: TaskDetailType }) {
  const routeName = useSegments();
  const [complete, setComplete] = useState(false);
  const [isOverdue, setIsOverdue] = useState(false);
  useEffect(() => {
    setIsOverdue(task.dueDate ? isPast(task.dueDate) : false);
  }, [task]);
  return (
    <Link
      asChild
      href={{
        pathname: "/(task)/[id]",
        params: { id: task.id },
      }}
    >
      <Pressable className="flex flex-row gap-2 py-2">
        {/* checkbox */}
        <TouchableOpacity onPress={() => setComplete((prev) => !prev)}>
          <View
            className={`h-6 w-6 rounded-full ${complete ? "bg-primary" : "border border-primary"}`}
          ></View>
        </TouchableOpacity>

        {/* TODO: couldn't keep text on screen, it was flowing off, had to use shrink to prevent that... any better options? */}
        <View className="flex w-full flex-1 border-b border-b-white/30 pb-2">
          {/* Text/description */}
          <View className="flex shrink">
            <Text className={`text-white ${complete ? "line-through" : ""}`}>
              {task.text}
            </Text>
            {task.description && (
              <Text className="shrink text-sm text-gray" numberOfLines={2}>
                {/* NOTE: couldn't get line-clamp-n to work... but luckily there's a numberOfLines option built into text */}
                {task.description}
              </Text>
            )}
          </View>
          {/* other details */}
          <View className="flex flex-row gap-2">
            {task.children.length > 0 && (
              <View className="flex flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="file-tree-outline"
                  size={14}
                  color={Colors.gray}
                />
                <Text className="text-gray">
                  {task.children.filter((t) => t.complete).length}/
                  {task.children.length}
                </Text>
              </View>
            )}
            {task.dueDate && (
              <View className="flex flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="calendar"
                  size={14}
                  color={isOverdue ? Colors.danger : Colors.gray}
                />
                <Text className={`${isOverdue ? "text-danger" : "text-gray"}`}>
                  {format(task.dueDate, "MMM d")}
                </Text>
              </View>
            )}
            {/* {task.parentId && <TbProgressCheck />} */}
            {task.comments.length > 0 && (
              <View className="flex-row items-center gap-1">
                <FontAwesome6
                  name="comment-dots"
                  size={14}
                  color={Colors.gray}
                />
                <Text className="text-gray">{task.comments.length}</Text>
              </View>
            )}
            {routeName.join("/") !== "(collections)/[id]" && (
              <SectionPicker sectionId={task.sectionId} />
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
