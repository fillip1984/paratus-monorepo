import { useState } from "react";
import { SafeAreaView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { addDays, eachDayOfInterval, format, startOfDay } from "date-fns";

import type { CollectionDetailType, SectionDetailType } from "@paratus/api";

import CollectionView from "~/components/collection/CollectionView";
import LoadOrRetry from "~/components/shared/LoadOrRetry";
import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
import { Colors } from "~/styles/colors";
import { trpc } from "~/utils/api";

export default function UpcomingScreen() {
  const [today] = useState(new Date());
  const [_week] = useState(
    eachDayOfInterval({
      start: today,
      end: addDays(today, 7),
    }),
  );

  const inboxId = useQuery(trpc.collection.inboxId.queryOptions());
  const tasks = useQuery(trpc.task.upcoming.queryOptions());
  useRefreshOnFocus(tasks.refetch);

  const overdueSection: SectionDetailType = {
    id: "Overdue",
    name: "Overdue",
    position: 0,
    collectionId: inboxId.data ?? "InboxId",
    tasks:
      tasks.data?.filter(
        (t) => t.dueDate && startOfDay(t.dueDate) < startOfDay(today),
      ) ?? [],
    _count: {
      tasks:
        tasks.data?.filter(
          (t) => t.dueDate && startOfDay(t.dueDate) < startOfDay(today),
        ).length ?? 0,
    },
  };

  const daysAsSections: SectionDetailType[] = _week.map((day) => {
    const dayTasks =
      tasks.data?.filter((task) => {
        if (!task.dueDate) return false;
        return startOfDay(day).getTime() === startOfDay(task.dueDate).getTime();
      }) ?? [];

    return {
      id: day.getTime().toString(),
      name: format(day, "MMM dd - EEE"),
      position: day.getTime(),
      tasks: dayTasks,
      collectionId: inboxId.data ?? "InboxId",
      _count: {
        tasks: dayTasks.length,
      },
    } satisfies SectionDetailType;
  });

  const upcoming = {
    name: "Upcoming",
    id: "Upcoming",
    preferredView: "list",
    sections: [overdueSection, ...daysAsSections],
    position: -1,
  } satisfies CollectionDetailType;

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View className="h-screen bg-background">
        <LoadOrRetry
          isLoading={tasks.isLoading}
          isError={tasks.isError}
          retry={tasks.refetch}
        />

        {tasks.data && <CollectionView collection={upcoming} />}
      </View>
    </SafeAreaView>
  );
}
