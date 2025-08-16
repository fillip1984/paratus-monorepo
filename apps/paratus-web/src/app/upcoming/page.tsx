"use client";

import {
  eachDayOfInterval,
  format,
  isSunday,
  nextSaturday,
  previousSunday,
  startOfDay,
} from "date-fns";
import { useState } from "react";

import { api } from "~/trpc/react";
import type { CollectionDetailType, SectionDetailType } from "~/trpc/types";
import CollectionView from "../_components/collection/CollectionView";

export default function UpcomingPage() {
  const [today] = useState(new Date());
  const [lastSunday] = useState(
    isSunday(today) ? today : previousSunday(today),
  );
  const [upcomingSaturday] = useState(nextSaturday(today));
  const [_week] = useState(
    eachDayOfInterval({ start: lastSunday, end: upcomingSaturday }),
  );

  const { data: inboxId } = api.collection.inboxId.useQuery();
  const { data: tasks } = api.task.upcoming.useQuery();

  const overdueSection: SectionDetailType = {
    id: "Overdue",
    name: "Overdue",
    position: 0,
    collectionId: inboxId ?? "InboxId",
    tasks: tasks ?? [],
    _count: {
      tasks: tasks?.length ?? 0,
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
    sections: [overdueSection, ...daysAsSections],
    position: -1,
  } satisfies CollectionDetailType;

  return <CollectionView collection={upcoming} />;
}
