"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { startOfDay } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { FaAngleDown, FaTrash } from "react-icons/fa";
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import { RxDragHandleDots2 } from "react-icons/rx";

import type {
  CollectionDetailType,
  SectionDetailType,
  TaskDetailType,
} from "@paratus/api";

import { api } from "~/trpc/react";
import { isNewSectionAvailable } from "~/utils/collection";
import { isAddTaskAvailable, isPermanentSection } from "~/utils/section";
import PopupMenu from "../../ui/popupMenu";
import AddSectionCard from "./AddSectionCard";
import AddTaskCard from "./task/AddTaskCard";
import TaskCard from "./task/TaskCard";

export default function SectionCard({
  collection,
  section,
}: {
  collection: CollectionDetailType;
  section: SectionDetailType;
}) {
  // determine default due date
  const [defaultDueDate, setDefaultDueDate] = useState<Date | null>(null);
  const [defaultSectionId, setDefaultSectionId] = useState<string>(section.id);
  const path = usePathname();
  useEffect(() => {
    if (path === "/today") {
      setDefaultDueDate(startOfDay(new Date()));
      setDefaultSectionId("inbox");
    } else if (path === "/upcoming") {
      console.log({ collectionName: collection.name, sectionId: section.id });
      const dd = new Date(Number(section.id));
      console.log(dd);
      setDefaultDueDate(dd);
      setDefaultSectionId("inbox");
    }
  }, [collection.name, path, section.id]);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);

  const [isEditingSection, setIsEditingSection] = useState(false);
  const currentSectionNameRef = useRef<HTMLInputElement | null>(null);
  const [currentSectionName, setCurrentSectionName] = useState(section.name);
  const trpc = api.useUtils();
  const { mutate: updateSectionName } = api.section.update.useMutation({
    onSuccess: async () => {
      setIsEditingSection(false);
      await trpc.section.invalidate();
      await trpc.collection.invalidate();
      await trpc.collection.readOne.invalidate({
        id: collection.id,
      });
    },
  });
  useEffect(() => {
    if (isEditingSection) {
      currentSectionNameRef.current?.focus();
    }
  }, [isEditingSection]);

  // DnD
  const [parentRef, draggableTasks, setValues] = useDragAndDrop<
    HTMLDivElement,
    TaskDetailType
  >([], {
    dragHandle: ".drag-handle",
    group: "section",
    onDragend: (data) => {
      const sectionId = data.parent.el.dataset.label;
      if (!sectionId) {
        console.error("No sectionId found for reorder");
        return;
      }
      reorderTasks(
        data.values.map((task, index) => ({
          id: (task as TaskDetailType).id,
          position: index,
          sectionId: sectionId,
        })),
      );
    },
  });
  useEffect(() => {
    // console.log('setting values for section', section.id)
    setValues(section.tasks.filter((t) => !t.parentId));
  }, [section, setValues]);

  const { mutate: reorderTasks } = api.task.reorder.useMutation({
    onSuccess: async () => {
      await trpc.task.invalidate();
      await trpc.collection.readAll.invalidate();
      // await trpc.collection.readOne.invalidate({
      //   id: currentCollectionId
      // });
      await trpc.task.today.invalidate();
      // await trpc.collection.inbox.invalidate();
    },
  });

  return (
    <div className="snap-start p-2">
      <div className="flex items-center justify-between border-b py-2">
        {/* leading */}
        <div className="flex items-center gap-1">
          <RxDragHandleDots2 className="drag-handle" />
          <button
            type="button"
            onClick={() => setIsSectionCollapsed((prev) => !prev)}
            className={`transition-transform duration-200 ${
              isSectionCollapsed ? "-rotate-90" : ""
            }`}
          >
            <FaAngleDown />
          </button>
          <div className="flex-1">
            {!isEditingSection ? (
              <div className={`flex items-center gap-2`}>
                <span
                  onClick={() => {
                    if (
                      !isPermanentSection(collection.name, currentSectionName)
                    ) {
                      setIsEditingSection((prev) => !prev);
                    }
                  }}
                  className={`rounded ${!isPermanentSection(collection.name, currentSectionName) ? "cursor-pointer" : ""} ${section.name === "Uncategorized" ? "text-white/60" : section.name === "Overdue" ? "text-danger" : ""}`}
                >
                  {currentSectionName}
                </span>
                {section._count.tasks > 0 && (
                  <span className="text-gray text-xs">
                    {section._count.tasks}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  ref={currentSectionNameRef}
                  value={currentSectionName}
                  onChange={(e) => setCurrentSectionName(e.target.value)}
                  onBlur={() =>
                    updateSectionName({
                      id: section.id,
                      name: currentSectionName,
                    })
                  }
                  className="rounded border p-1"
                />
              </div>
            )}
          </div>
        </div>
        {/* center */}

        {/* trailing */}
        <SectionAdditionalOptions collection={collection} section={section} />
      </div>
      {/* Add tasks or other content here */}
      <AnimatePresence initial={false}>
        {!isSectionCollapsed && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            initial={{ opacity: 0.2, height: 0.2 }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div ref={parentRef} data-label={section.id} className="min-h-4">
              {draggableTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  collectionId={section.collectionId}
                />
              ))}
            </div>
            {isAddTaskAvailable(collection.name, section.name) && (
              <div className="my-2">
                {isAddTaskOpen ? (
                  <AddTaskCard
                    currentCollectionId={section.collectionId}
                    defaultDueDate={defaultDueDate}
                    defaultSectionId={defaultSectionId}
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isNewSectionAvailable(collection) && (
        <AddSectionCard
          collectionId={section.collectionId}
          addAfter={section.position}
        />
      )}
    </div>
  );
}

const SectionAdditionalOptions = ({
  collection,
  section,
}: {
  collection: CollectionDetailType;
  section: SectionDetailType;
}) => {
  const trpc = api.useUtils();
  const { mutate: deleteSection } = api.section.delete.useMutation({
    onSuccess: () => {
      void trpc.collection.invalidate();
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isPermanentSection(collection.name, section.name) && (
        <PopupMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
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
    </>
  );
};
