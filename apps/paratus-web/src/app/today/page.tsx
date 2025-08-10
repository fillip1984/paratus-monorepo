"use client";

import { format, isSameDay, startOfDay } from "date-fns";

import { api } from "~/trpc/react";
import type { SectionDetailType, CollectionDetailType } from "~/trpc/types";
import CollectionView from "../_components/collection/CollectionView";

export default function TodayPage() {
  const { data: tasks } = api.task.today.useQuery();
  const overdueSection: SectionDetailType = {
    id: "Overdue",
    name: "Overdue",
    position: 0,
    collectionId: "Today",
    tasks:
      tasks?.filter(
        (task) =>
          task.dueDate &&
          startOfDay(new Date()).getTime() > task.dueDate.getTime(),
      ) ?? [],
    _count: {
      tasks: tasks?.length ?? 0,
    },
  };
  const todaySection: SectionDetailType = {
    id: "Today",
    name: format(new Date(), "MMM do '- Today - ' EEEE"),
    position: 1,
    collectionId: "Today",
    tasks:
      tasks?.filter(
        (task) => task.dueDate && isSameDay(task.dueDate, new Date()),
      ) ?? [],
    _count: {
      tasks: tasks?.length ?? 0,
    },
  };
  const today = {
    name: "Today",
    id: "Today",
    sections: [overdueSection, todaySection],
  } as CollectionDetailType;

  return <CollectionView collection={{ ...today, name: "Today" }} />;
}
