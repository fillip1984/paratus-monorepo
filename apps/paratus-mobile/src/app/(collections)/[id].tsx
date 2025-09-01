import React from "react";
import { SafeAreaView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import CollectionView from "~/components/collection/CollectionView";
import LoadOrRetry from "~/components/shared/LoadOrRetry";
import TopActionsBar from "~/components/shared/TopActionBar";
import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
import { Colors } from "~/styles/colors";
import { trpc } from "~/utils/api";

export default function CollectionScreen() {
  const { id } = useLocalSearchParams();
  const collection = useQuery(
    trpc.collection.readOne.queryOptions(
      { id: id as string },
      { enabled: !!id },
    ),
  );
  useRefreshOnFocus(collection.refetch);

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View className="h-screen bg-background">
        <TopActionsBar />

        <LoadOrRetry
          isLoading={collection.isLoading}
          isError={collection.isError}
          retry={collection.refetch}
        />

        {collection.data && <CollectionView collection={collection.data} />}
      </View>
    </SafeAreaView>
  );
}
