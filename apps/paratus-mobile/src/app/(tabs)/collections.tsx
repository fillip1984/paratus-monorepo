import { SafeAreaView, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
import { trpc } from "~/utils/api";

export default function CollectionsScreen() {
  const collections = useQuery(trpc.collection.readAll.queryOptions());
  useRefreshOnFocus(collections.refetch);

  return (
    <SafeAreaView>
      <View>
        <Text>Collections</Text>
      </View>
    </SafeAreaView>
  );
}
