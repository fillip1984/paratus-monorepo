"use client";

import { useState } from "react";
import { addDays, eachDayOfInterval, format, startOfDay } from "date-fns";

import type { CollectionDetailType, SectionDetailType } from "@paratus/api";

import { api } from "~/trpc/react";
import CollectionView from "../_components/collection/CollectionView";

export default function UpcomingPage() {
  const [today] = useState(new Date());
  const [_week] = useState(
    eachDayOfInterval({
      start: today,
      end: addDays(today, 7),
    }),
  );

  const { data: inboxId } = api.collection.inboxId.useQuery();
  const { data: tasks } = api.task.upcoming.useQuery();

  const overdueSection: SectionDetailType = {
    id: "Overdue",
    name: "Overdue",
    position: 0,
    collectionId: inboxId ?? "InboxId",
    tasks:
      tasks?.filter(
        (t) => t.dueDate && startOfDay(t.dueDate) < startOfDay(today),
      ) ?? [],
    _count: {
      tasks:
        tasks?.filter(
          (t) => t.dueDate && startOfDay(t.dueDate) < startOfDay(today),
        ).length ?? 0,
    },
  };

  const daysAsSections: SectionDetailType[] = _week.map((day) => {
    const dayTasks =
      tasks?.filter((task) => {
        if (!task.dueDate) return false;
        return startOfDay(day).getTime() === startOfDay(task.dueDate).getTime();
      }) ?? [];

    return {
      id: day.getTime().toString(),
      name: format(day, "MMM dd - EEE"),
      position: day.getTime(),
      tasks: dayTasks,
      collectionId: inboxId ?? "InboxId",
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

  return <CollectionView collection={upcoming} />;
}
