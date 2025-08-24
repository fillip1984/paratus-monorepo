"use client";

import type { PriorityOption } from "@prisma/client";
import { useState } from "react";
import { CgListTree } from "react-icons/cg";
import { RxDragHandleDots2 } from "react-icons/rx";
import { TbProgressCheck } from "react-icons/tb";

import type { TaskDetailType } from "@paratus/api";

import DatePicker from "~/app/_components/shared/DatePicker";
import PriorityPicker from "~/app/_components/shared/PriorityPicker";
import SectionPicker from "~/app/_components/shared/SectionPicker";
import Modal from "~/app/_components/ui/modal";
import { api } from "~/trpc/react";
import TaskModal from "./TaskModal";

export default function TaskCard({
  task,
  collectionId,
}: {
  task: TaskDetailType;
  collectionId: string;
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const trpc = api.useUtils();
  const { mutate: updateTask } = api.task.update.useMutation({
    onSuccess: () => {
      void trpc.collection.invalidate();
      void trpc.task.invalidate();
      void trpc.collection.readOne.invalidate({
        id: collectionId,
      });
    },
  });

  const [complete, setComplete] = useState(task.complete);

  const handleToggleComplete = () => {
    console.log("handling complete");
    setComplete(!complete);
    updateTask({ ...task, complete: !complete });
  };

  const handleTaskModal = () => {
    console.log("showing task modal");
    setIsTaskModalOpen(true);
  };

  const handleTaskDueDateChange = (dueDate: Date | null) => {
    updateTask({ ...task, dueDate });
  };

  const handlePriorityChange = (priority: PriorityOption | null) => {
    updateTask({ ...task, priority });
  };

  const handleSectionChange = (sectionId: string) => {
    updateTask({ ...task, sectionId });
  };
  return (
    <div>
      <div className="hover:bg-foreground/40 cursor-pointer border-b-1 border-b-white/30 py-2">
        <div>
          <div className="flex gap-2">
            <RxDragHandleDots2 className="drag-handle" />
            <input
              type="checkbox"
              checked={complete}
              onChange={handleToggleComplete}
              className={`border-secondary hover:bg-secondary/60 mt-[2px] h-4 w-4 cursor-pointer appearance-none rounded-full border-2 ${complete ? "bg-primary" : ""}`}
            />
            <div onClick={handleTaskModal} className="flex flex-1 flex-col">
              <span
                className={`text-sm ${task.complete ? "line-through" : ""}`}
              >
                {task.text}
              </span>
              <span className="line-clamp-2 text-xs">{task.description}</span>
              <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                {task.children.length > 0 && (
                  <div className="flex items-center gap-1">
                    <CgListTree />{" "}
                    {task.children.filter((t) => t.complete).length}/
                    {task.children.length}
                  </div>
                )}
                {task.parentId && <TbProgressCheck />}
                <DatePicker
                  value={task.dueDate}
                  setValue={handleTaskDueDateChange}
                />
                <PriorityPicker
                  value={task.priority}
                  setValue={handlePriorityChange}
                />
                {task.parentId === null && (
                  <div className="ml-auto">
                    <SectionPicker
                      value={task.sectionId}
                      setValue={handleSectionChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isTaskModalOpen} close={() => setIsTaskModalOpen(false)}>
        <TaskModal
          task={task}
          dismiss={() => setIsTaskModalOpen(false)}
          collectionId={collectionId}
        />
      </Modal>
    </div>
  );
}
