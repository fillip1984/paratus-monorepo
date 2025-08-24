"use client";

import { useEffect } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";

import type { CollectionDetailType, SectionDetailType } from "@paratus/api";

import { api } from "~/trpc/react";
import SectionCard from "./section/SectionCard";

export default function CollectionListView({
  collection,
}: {
  collection: CollectionDetailType;
}) {
  // DnD
  const [parentRef, draggableSections, setValues] = useDragAndDrop<
    HTMLDivElement,
    SectionDetailType
  >([], {
    dragHandle: ".drag-handle",
    group: "collection",
    disabled: collection.name === "Today" || collection.name === "Upcoming",
    onDragend: (data) => {
      reorderSections(
        data.values.map((section, index) => ({
          id: (section as SectionDetailType).id,
          position: index,
        })),
      );
    },
  });
  useEffect(() => {
    setValues(collection.sections);
  }, [collection, setValues]);

  const trpc = api.useUtils();
  const { mutate: reorderSections } = api.section.reorder.useMutation({
    onSuccess: async () => {
      await trpc.collection.readAll.invalidate();
      await trpc.collection.readOne.invalidate({
        id: collection.id,
      });
      await trpc.task.today.invalidate();
    },
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="snap-y snap-mandatory overflow-y-auto p-2 pb-12">
        <div
          ref={parentRef}
          className="flex w-full max-w-[800px] flex-col gap-2 lg:mx-auto"
        >
          {draggableSections.map((section) => (
            <SectionCard
              key={section.id}
              collection={collection}
              section={section}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
