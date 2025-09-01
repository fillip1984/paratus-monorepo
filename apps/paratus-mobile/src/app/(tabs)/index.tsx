import { SafeAreaView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay, startOfDay } from "date-fns";

import type { CollectionDetailType, SectionDetailType } from "@paratus/api";

import CollectionView from "~/components/collection/CollectionView";
import LoadOrRetry from "~/components/shared/LoadOrRetry";
import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
import { Colors } from "~/styles/colors";
import { trpc } from "~/utils/api";

export default function TodayScreen() {
  const tasks = useQuery(trpc.task.today.queryOptions());
  useRefreshOnFocus(tasks.refetch);

  const overdueSection: SectionDetailType = {
    id: "Overdue",
    name: "Overdue",
    position: 0,
    collectionId: "Today",
    tasks:
      tasks.data?.filter(
        (task) =>
          task.dueDate &&
          startOfDay(new Date()).getTime() > task.dueDate.getTime(),
      ) ?? [],
    _count: {
      tasks: tasks.data?.length ?? 0,
    },
  };
  const todaySection: SectionDetailType = {
    id: "Today",
    name: format(new Date(), "MMM do '- Today - ' EEEE"),
    position: 1,
    collectionId: "Today",
    tasks:
      tasks.data?.filter(
        (task) => task.dueDate && isSameDay(task.dueDate, new Date()),
      ) ?? [],
    _count: {
      tasks: tasks.data?.length ?? 0,
    },
  };
  const today = {
    name: "Today",
    id: "Today",
    preferredView: "list",
    sections: [overdueSection, todaySection],
  } as CollectionDetailType;

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View className="h-screen bg-background">
        <LoadOrRetry
          isLoading={tasks.isLoading}
          isError={tasks.isError}
          retry={tasks.refetch}
        />

        {tasks.data && <CollectionView collection={today} />}
      </View>
    </SafeAreaView>
  );
}
