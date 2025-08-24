"use client";

import type { PriorityOption } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { FaChevronDown, FaChevronUp, FaTrash } from "react-icons/fa";
import { FaEllipsis, FaPlus, FaX } from "react-icons/fa6";
import TextareaAutosize from "react-textarea-autosize";

import type { TaskDetailType } from "@paratus/api";

import DatePicker from "~/app/_components/shared/DatePicker";
import PriorityPicker from "~/app/_components/shared/PriorityPicker";
import SectionPicker from "~/app/_components/shared/SectionPicker";
import PopupMenu from "~/app/_components/ui/popupMenu";
import { api } from "~/trpc/react";
import AddTaskCard from "./AddTaskCard";
import TaskCard from "./TaskCard";

export default function TaskModal({
  collectionId,
  task,
  dismiss,
}: {
  collectionId: string;
  task: TaskDetailType;
  dismiss: () => void;
}) {
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

  return (
    <div className="flex min-h-[500px] w-xl flex-col">
      {/* modal header */}
      <Header task={task} collectionId={collectionId} dismiss={dismiss} />

      {/* modal content */}
      <div className="flex flex-1 overflow-hidden border-t">
        <MainContent
          task={task}
          updateTask={updateTask}
          collectionId={collectionId}
        />
        <SideContent task={task} updateTask={updateTask} />
      </div>
    </div>
  );
}

const Header = ({
  task,
  collectionId,
  dismiss,
}: {
  task: TaskDetailType;
  collectionId: string;
  dismiss: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const trpc = api.useUtils();
  const { mutate: deleteTask } = api.task.delete.useMutation({
    onSuccess: () => {
      console.log("task deleted");
      void trpc.collection.invalidate();
      void trpc.task.invalidate();
      void trpc.collection.readOne.invalidate({
        id: collectionId,
      });
      dismiss();
    },
  });
  return (
    <div className="flex items-center justify-between p-2">
      {/* leading */}
      <div>
        <span>List name</span>
      </div>
      {task.parentId && (
        <button className="button-secondary button-compact">
          Go to parent
        </button>
      )}

      {/* trailing */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <FaChevronUp />
          <FaChevronDown />
        </span>
        <PopupMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          button={
            <span>
              <FaEllipsis />
            </span>
          }
          content={
            <div className="bg-background flex w-[100px] flex-col gap-1 p-1">
              <span
                className="flex cursor-pointer items-center gap-2 rounded p-1 text-white hover:bg-white/10"
                onClick={() => deleteTask({ id: task.id })}
              >
                <FaTrash className="text-danger flex-shrink-0" /> Delete
              </span>
            </div>
          }
        />

        <span onClick={dismiss} className="cursor-pointer">
          <FaX />
        </span>
      </div>
    </div>
  );
};

const MainContent = ({
  task,
  updateTask,
  collectionId,
}: {
  task: TaskDetailType;
  updateTask: (task: TaskDetailType) => void;
  collectionId: string;
}) => {
  const textEditingRef = useRef<HTMLInputElement>(null);
  const descriptionEditingRef = useRef<HTMLTextAreaElement>(null);

  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    setText(task.text);
    setDescription(task.description ?? "");
  }, [task]);

  const [
    isEditingTextOrDescriptionTarget,
    setIsEditingTextOrDescriptionTarget,
  ] = useState("");
  useEffect(() => {
    if (isEditingTextOrDescriptionTarget === "text") {
      textEditingRef.current?.focus();
    } else if (isEditingTextOrDescriptionTarget === "description") {
      descriptionEditingRef.current?.focus();
      descriptionEditingRef.current?.setSelectionRange(
        descriptionEditingRef.current.value.length,
        descriptionEditingRef.current.value.length,
      );
    }
  }, [isEditingTextOrDescriptionTarget]);

  const [isAddingSubTask, setIsAddingSubTask] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleComplete = () => {
    console.log("handling complete");
    updateTask({ ...task, complete: true });
  };

  const handleUpdateTextAndDescription = () => {
    updateTask({ ...task, text, description });
    setIsEditingTextOrDescriptionTarget("");
  };

  // DnD
  const [draggableParentRef, draggableSubTasks, setValues] = useDragAndDrop<
    HTMLDivElement,
    TaskDetailType
  >([], {
    dragHandle: ".drag-handle",
    group: "section",
    onDragend: (data) => {
      reorderTasks(
        data.values.map((updatedSubTask, index) => ({
          id: (updatedSubTask as TaskDetailType).id,
          position: index,
          sectionId: task.sectionId,
        })),
      );
    },
  });
  useEffect(() => {
    console.warn("Need to figure out how to strip out children of children");
    const subtasks = task.children.map((c) => ({ ...c, children: [] }));
    setValues(subtasks);
  }, [task.children, setValues]);
  const { mutate: reorderTasks } = api.task.reorder.useMutation({
    onSuccess: async () => {
      // await queryClient.invalidateQueries({
      //   queryKey: trpc.collection.readAll.queryKey(),
      // });
      // await queryClient.invalidateQueries({
      //   queryKey: trpc.collection.readOne.queryKey({
      //     id: collectionId,
      //   }),
      // });
      // await queryClient.invalidateQueries({
      //   queryKey: trpc.task.today.queryKey(),
      // });
      // await queryClient.invalidateQueries({
      //   queryKey: trpc.collection.inbox.queryKey(),
      // });
    },
  });

  return (
    <div className="flex flex-1 flex-col overflow-x-auto p-2 pb-4">
      <div className="flex gap-2">
        <input
          type="checkbox"
          onClick={handleComplete}
          className="mt-1 rounded-full bg-inherit"
        />
        <div className="flex flex-1 flex-col">
          {isEditingTextOrDescriptionTarget ? (
            <div className="flex flex-col rounded-lg border border-white/30 p-1">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                ref={textEditingRef}
                placeholder="Task..."
              />
              <TextareaAutosize
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                ref={descriptionEditingRef}
                placeholder="Description..."
                className="text-muted m-0 border-0 bg-inherit p-0 text-xs"
              ></TextareaAutosize>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="button-secondary button-compact"
                  onClick={() => setIsEditingTextOrDescriptionTarget("")}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="button-primary button-compact"
                  onClick={handleUpdateTextAndDescription}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <span onClick={() => setIsEditingTextOrDescriptionTarget("text")}>
                {text}
              </span>
              <span
                onClick={() =>
                  setIsEditingTextOrDescriptionTarget("description")
                }
                className="text-muted m-0 border-0 bg-inherit p-0 text-xs"
              >
                {description.length > 0 ? description : "Description..."}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 ml-6 flex flex-col">
        {/* {task.children.length > 0 && ( */}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="flex items-center gap-1"
        >
          <FaChevronDown
            className={`transition ${isCollapsed ? "-rotate-90" : ""}`}
          />
          Sub-tasks
          <span className="text-muted text-xs">
            {task.children.filter((t) => t.complete).length}/
            {task.children.length}
          </span>
        </button>
        {/* )} */}
        {!isCollapsed && (
          <div ref={draggableParentRef} className="ml-2 flex flex-col gap-1">
            {draggableSubTasks.map((subtask) => (
              <TaskCard
                key={subtask.id}
                task={subtask}
                collectionId={collectionId}
              />
            ))}
          </div>
        )}
        <div className="my-1">
          {isAddingSubTask ? (
            <AddTaskCard
              currentCollectionId={collectionId}
              parentTaskId={task.id}
              defaultDueDate={null}
              defaultSectionId={task.sectionId}
              dismiss={() => setIsAddingSubTask((prev) => !prev)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingSubTask((prev) => !prev)}
              className="flex w-fit items-center gap-2 rounded p-1 text-sm hover:bg-white/30"
            >
              <FaPlus /> Add sub-task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SideContent = ({
  task,
  updateTask,
}: {
  task: TaskDetailType;
  updateTask: (task: TaskDetailType) => void;
}) => {
  const handleSectionUpdate = (newSectionId: string) => {
    updateTask({ ...task, sectionId: newSectionId });
  };

  const handleDueDate = (date: Date | null) => {
    updateTask({ ...task, dueDate: date ?? null });
  };

  const handlePriorityUpdate = (priority: PriorityOption | null) => {
    updateTask({ ...task, priority: priority });
  };

  return (
    <aside className="col-span-2 flex flex-col gap-2 rounded-br-xl bg-white/10 p-2">
      <div className="border-b-muted flex flex-col gap-1 border-b-1 p-2">
        <span className="text-sm font-bold">Collection</span>
        <SectionPicker value={task.sectionId} setValue={handleSectionUpdate} />
      </div>
      <div className="border-b-muted flex flex-col gap-1 border-b-1 p-2">
        <span className="text-sm font-bold">Due Date</span>
        <DatePicker value={task.dueDate} setValue={handleDueDate} />
      </div>
      <div className="border-b-muted flex flex-col gap-1 border-b-1 p-2">
        <span className="text-sm font-bold">Priority</span>
        <PriorityPicker
          value={task.priority}
          setValue={(priority) => handlePriorityUpdate(priority)}
        />
      </div>
    </aside>
  );
};
