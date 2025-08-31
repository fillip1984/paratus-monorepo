import { SafeAreaView, Text, View } from "react-native";

// import { useQuery } from "@tanstack/react-query";

// import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
// import { trpc } from "~/utils/api";

export default function UpcomingScreen() {
  // const collections = useQuery(trpc.collection.readAll.queryOptions());
  // useRefreshOnFocus(collections.refetch);

  return (
    <SafeAreaView style={{ backgroundColor: "rgb(30 41 59)" }}>
      <View className="h-screen bg-black">
        <Text className="text-white">Upcoming</Text>
      </View>
    </SafeAreaView>
  );
}
