import { SafeAreaView, Text, View } from "react-native";

import { Colors } from "~/styles/colors";

// import { useQuery } from "@tanstack/react-query";

// import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
// import { trpc } from "~/utils/api";

export default function UpcomingScreen() {
  // const collections = useQuery(trpc.collection.readAll.queryOptions());
  // useRefreshOnFocus(collections.refetch);

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View className="h-screen bg-background">
        <Text className="text-white">Upcoming</Text>
      </View>
    </SafeAreaView>
  );
}
