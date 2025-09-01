import React from "react";
import { ScrollView, Text, View } from "react-native";

import type { CollectionDetailType } from "@paratus/api";

import SectionCard from "./section/SectionCard";

export default function CollectionView({
  collection,
}: {
  collection: CollectionDetailType;
}) {
  return (
    <View className="p-4">
      <Text className="text-4xl font-bold text-white">{collection.name}</Text>
      <ScrollView>
        {collection.sections.map((section) => (
          <SectionCard
            key={section.id}
            collection={collection}
            section={section}
          />
        ))}
      </ScrollView>
    </View>
  );
}
