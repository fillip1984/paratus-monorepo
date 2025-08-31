import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import LoadOrRetry from "~/components/shared/LoadOrRetry";
import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
import { trpc } from "~/utils/api";

export default function CollectionsScreen() {
  const collections = useQuery(trpc.collection.readAll.queryOptions());
  useRefreshOnFocus(collections.refetch);

  return (
    <SafeAreaView style={{ backgroundColor: "rgb(30 41 59)" }}>
      <LoadOrRetry
        isLoading={collections.isLoading}
        isError={collections.isError}
        retry={collections.refetch}
      />
      <View className="h-screen bg-black">
        {collections.data?.map((collection) => (
          <Text key={collection.id} className="text-white">
            {collection.name}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}
