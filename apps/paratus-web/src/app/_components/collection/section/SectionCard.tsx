"use client";

import { startOfDay } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAngleDown, FaTrash } from "react-icons/fa";
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import { api } from "~/trpc/react";
import type { SectionDetailType } from "~/trpc/types";
import { isPermanentSection } from "~/utils/section";
import PopupMenu from "../../ui/popupMenu";
import AddSectionCard from "./AddSectionCard";
import AddTaskCard from "./task/AddTaskCard";
import TaskCard from "./task/TaskCard";

export default function SectionCard({
  section,
}: {
  section: SectionDetailType;
}) {
  // determine default due date
  const [defaultDueDate, setDefaultDueDate] = useState<Date | null>(null);
  const path = usePathname();
  useEffect(() => {
    if (path === "/today") {
      setDefaultDueDate(startOfDay(new Date()));
    } else if (path === "/upcoming") {
      const dd = new Date(Number(section.id));
      console.log(dd);
      setDefaultDueDate(dd);
    }
  }, [path, section.id]);

  const trpc = api.useUtils();
  const { mutate: deleteSection } = api.section.delete.useMutation({
    onSuccess: () => {
      void trpc.collection.invalidate();
    },
  });

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

  return (
    <div className="snap-start p-2">
      <div className="flex items-center justify-between border-b py-2">
        {/* leading */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsSectionCollapsed((prev) => !prev)}
            className={`transition-transform duration-200 ${
              isSectionCollapsed ? "-rotate-90" : ""
            }`}
          >
            <FaAngleDown />
          </button>
          <p className="font-bold">{section.name}</p>
        </div>
        {/* center */}

        {/* trailing */}
        {!isPermanentSection(section.name) && (
          <PopupMenu
            button={
              <button type="button">
                <FaEllipsisVertical />
              </button>
            }
            content={
              <div className="bg-foreground rounded-lg p-2">
                <div className="flex flex-col items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => deleteSection({ id: section.id })}
                    className={`text-danger flex items-center gap-2`}
                  >
                    <FaTrash /> Delete
                  </button>
                  {/* Add more actions here */}
                </div>
              </div>
            }
          />
        )}
      </div>
      {/* Add tasks or other content here */}
      <AnimatePresence initial={false}>
        {!isSectionCollapsed && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            initial={{ opacity: 0.2, height: 0.2 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div>
              {section.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  collectionId={section.collectionId}
                />
              ))}
            </div>
            <div>
              {isAddTaskOpen ? (
                <AddTaskCard
                  currentCollectionId={section.collectionId}
                  currentSectionId={section.id}
                  defaultDueDate={defaultDueDate}
                  dismiss={() => setIsAddTaskOpen((prev) => !prev)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded p-1 font-thin hover:bg-white/10"
                >
                  <FaPlus className="text-primary" /> Add task
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AddSectionCard
        collectionId={section.collectionId}
        addAfter={section.position}
      />
    </div>
  );
}
