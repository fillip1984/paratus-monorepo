import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "~/styles/colors";

export default function TaskDetailScreen() {
  // const { id } = useLocalSearchParams();
  // const task = useQuery(
  //   trpc.collection.readOne.queryOptions(
  //     { id: id as string },
  //     { enabled: !!id },
  //   ),
  // );

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View className="h-screen bg-background">
        <Text className="text-white">Task Detail </Text>
      </View>
    </SafeAreaView>
  );
}
