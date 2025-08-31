import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import LoadOrRetry from "~/components/shared/LoadOrRetry";
import TopActionsBar from "~/components/shared/TopActionBar";
import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
import { Colors } from "~/styles/colors";
import { trpc } from "~/utils/api";

// import { useQuery } from "@tanstack/react-query";

// import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
// import { trpc } from "~/utils/api";

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
      <TopActionsBar />

      {collection.isLoading ||
        (collection.isError && (
          <LoadOrRetry
            isLoading={collection.isLoading}
            isError={collection.isError}
            retry={collection.refetch}
          />
        ))}

      {collection.data && (
        <View className="h-screen bg-background">
          <Text className="text-white">{collection.data.name}</Text>
          <ScrollView>
            {collection.data.sections.map((section) => (
              <View key={section.id} className="p-4">
                <Text className="text-white">{section.name}</Text>
                {section.tasks.map((task) => (
                  <Text key={task.id} className="text-white">
                    {task.text}
                  </Text>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}
