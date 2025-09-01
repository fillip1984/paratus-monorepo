import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

export default function SectionPicker({ sectionId }: { sectionId: string }) {
  const [sectionPickerValue, setSectionPickerValue] = useState("");

  const collection = useQuery(
    trpc.collection.findBySectionId.queryOptions({ sectionId }),
  );
  useEffect(() => {
    if (!collection.data) {
      return;
    }

    const collectionName = collection.data.name;
    const sectionName =
      collection.data.sections.find((s) => s.id === sectionId)?.name ?? "";
    if ("uncategorized" === sectionName.toLowerCase()) {
      setSectionPickerValue(collectionName);
    } else {
      setSectionPickerValue(`${collectionName} / ${sectionName}`);
    }
  }, [collection.data, sectionId]);

  // TODO: currently readonly
  return (
    <View className="ml-auto">
      <Text className="text-gray">{sectionPickerValue || "Loading..."}</Text>
    </View>
  );
}
