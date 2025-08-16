"use client";

import { useState } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
import type { CollectionDetailType } from "~/trpc/types";
import CollectionListView from "./CollectionListView";
import PopupMenu from "../ui/popupMenu";
import { RiKanbanView2 } from "react-icons/ri";
import CollectionKanbanView from "./CollectionKanbanView";

export default function CollectionView({
  collection,
}: {
  collection: CollectionDetailType;
}) {
  const [selectedView, setSelectedView] = useState<"kanban" | "list">("list");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* heading */}
      <div className="flex items-center justify-between p-2">
        <h4>{collection.name}</h4>
        <PopupMenu
          button={<GiSettingsKnobs className="cursor-pointer text-2xl" />}
          content={
            <div className="bg-foreground rounded-lg p-2">
              <div className="flex flex-col items-center justify-center gap-2">
                <p>Layout</p>
                <div className="bg-background flex gap-1 rounded p-1">
                  <button
                    type="button"
                    className={`flex w-16 flex-col items-center rounded p-1 text-sm ${
                      selectedView === "kanban" ? "bg-white/10" : ""
                    }`}
                    onClick={() => setSelectedView("kanban")}
                  >
                    <RiKanbanView2 className="mr-1 inline-block" />
                    Kanban
                  </button>
                  <button
                    type="button"
                    className={`flex w-16 flex-col items-center rounded p-1 text-sm ${
                      selectedView === "list" ? "bg-white/10" : ""
                    }`}
                    onClick={() => setSelectedView("list")}
                  >
                    <RiKanbanView2 className="mr-1 inline-block rotate-90" />
                    List
                  </button>
                </div>
              </div>
            </div>
          }
        />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        {selectedView === "kanban" && (
          <CollectionKanbanView collection={collection} />
        )}

        {selectedView === "list" && (
          <CollectionListView collection={collection} />
        )}
      </div>
    </div>
  );
}
