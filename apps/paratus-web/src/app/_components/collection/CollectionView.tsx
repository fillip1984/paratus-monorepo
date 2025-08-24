"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa6";
import { GiSettingsKnobs } from "react-icons/gi";
import { RiKanbanView2 } from "react-icons/ri";

import type { CollectionDetailType } from "@paratus/api";

import { api } from "~/trpc/react";
import { isPermanentCollection } from "~/utils/collection";
import PopupMenu from "../ui/popupMenu";
import CollectionKanbanView from "./CollectionKanbanView";
import CollectionListView from "./CollectionListView";

export default function CollectionView({
  collection,
}: {
  collection: CollectionDetailType;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* heading */}
      <div className="flex items-center justify-between p-2">
        <h4>{collection.name}</h4>
        <CollectionSettings collection={collection} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {collection.preferredView === "kanban" && (
          <CollectionKanbanView collection={collection} />
        )}

        {collection.preferredView === "list" && (
          <CollectionListView collection={collection} />
        )}
      </div>
    </div>
  );
}

const CollectionSettings = ({
  collection,
}: {
  collection: CollectionDetailType;
}) => {
  const trpc = api.useUtils();
  const { mutate: updateMutate } = api.collection.update.useMutation({
    onSuccess: () => {
      void trpc.collection.invalidate();
      setIsOpen(false);
    },
  });
  const handleViewToggle = () => {
    if (collection.preferredView === "kanban") {
      updateMutate({ ...collection, preferredView: "list" });
    } else {
      updateMutate({ ...collection, preferredView: "kanban" });
    }
  };

  const router = useRouter();
  const { mutate: deleteMutate } = api.collection.delete.useMutation({
    onSuccess: async () => {
      await trpc.collection.invalidate();
      router.push("/inbox");
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopupMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      button={<GiSettingsKnobs className="cursor-pointer text-2xl" />}
      content={
        <div className="bg-foreground rounded-lg p-2">
          <div className="flex flex-col items-center justify-center gap-2">
            <p>Layout</p>
            <div className="bg-background flex gap-1 rounded p-1">
              <button
                type="button"
                className={`flex w-16 flex-col items-center rounded p-1 text-sm ${
                  collection.preferredView === "kanban" ? "bg-white/10" : ""
                }`}
                onClick={handleViewToggle}
              >
                <RiKanbanView2 className="mr-1 inline-block" />
                Kanban
              </button>
              <button
                type="button"
                className={`flex w-16 flex-col items-center rounded p-1 text-sm ${
                  collection.preferredView === "list" ? "bg-white/10" : ""
                }`}
                onClick={handleViewToggle}
              >
                <RiKanbanView2 className="mr-1 inline-block rotate-90" />
                List
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            {!isPermanentCollection(collection.name) && (
              <button
                type="button"
                onClick={() => deleteMutate({ id: collection.id })}
                className="text-danger hover:bg-background/60 mt-4 flex cursor-pointer items-center gap-2 rounded p-2"
              >
                <FaTrash />
                Delete
              </button>
            )}
          </div>
        </div>
      }
    />
  );
};
