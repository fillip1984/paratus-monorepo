"use client";

import type { CollectionDetailType } from "~/trpc/types";
import SectionCard from "./section/SectionCard";

export default function CollectionListView({
  collection,
}: {
  collection: CollectionDetailType;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="snap-y snap-mandatory overflow-y-auto p-2 pb-12">
        <div className="flex w-full max-w-[800px] flex-col gap-2 lg:mx-auto">
          {collection.sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
