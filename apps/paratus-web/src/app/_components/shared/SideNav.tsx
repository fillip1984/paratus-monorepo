"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaCalendarDay,
  FaCalendarWeek,
  FaInbox,
  FaPlus,
  FaX,
} from "react-icons/fa6";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Modal from "../ui/modal";
import type { CollectionSummaryType } from "~/trpc/types";

export default function SideNav() {
  const path = usePathname();
  const { data: collections } = api.collection.readAll.useQuery();
  const { data: today } = api.task.today.useQuery();

  const [inboxCollection, setInboxCollection] = useState<
    CollectionSummaryType | undefined
  >();
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  useEffect(() => {
    const possibleInboxCollection = collections?.find(
      (c) => c.name === "Inbox",
    );
    if (possibleInboxCollection) {
      console.log(possibleInboxCollection);
      setInboxCollection(possibleInboxCollection);
    }
  }, [collections]);

  const navItems = [
    // {
    // 	to: "/search",
    // 	label: "Search",
    // 	icon: FaSearch,
    // },
    {
      to: "/inbox",
      label: "Inbox",
      icon: FaInbox,
      count: (
        <span className="ml-auto text-xs text-gray-300">
          {inboxCollection?.sections.reduce(
            (acc, section) => acc + section._count.tasks,
            0,
          )}
        </span>
      ),
    },
    {
      to: "/today",
      label: "Today",
      icon: FaCalendarDay,
      count: (
        <span className="text-gray ml-auto text-xs">
          {today?.length && today.length > 0 ? today.length : ""}
        </span>
      ),
    },
    { to: "/upcoming", label: "Upcoming", icon: FaCalendarWeek },
  ];
  return (
    <>
      <nav className="bg-foreground m-2 flex min-w-[250px] flex-col gap-2 rounded-xl py-2 transition duration-150">
        {navItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className={` ${path.startsWith(item.to) ? "bg-background text-primary font-semibold" : "hover:bg-background/60"} mx-2 flex items-center rounded-xl p-2 transition duration-200 select-none`}
          >
            <item.icon className="mr-2" />
            {item.label}
            {item.count}
          </Link>
        ))}

        <div className="flex items-center justify-between px-2">
          <h4>Collections</h4>
          <button
            onClick={() => setIsAddCollectionOpen(true)}
            className="text-primary"
          >
            <FaPlus />
          </button>
        </div>
        <div className="flex flex-col gap-1 px-3 text-sm">
          {collections
            ?.filter((collection) => collection.name !== "Inbox")
            .map((collection) => (
              <Link
                href={`/${collection.id}`}
                key={collection.id}
                data-label={collection.id}
                className={`[&.active]:text-primary [&.active]:bg-background hover:bg-background/60 mx-2 flex items-center justify-between rounded-xl p-2 transition duration-200 select-none`}
              >
                <span># {collection.name}</span>
                <span className="text-xs text-gray-300">
                  {collection.sections.reduce(
                    (acc, section) => acc + section._count.tasks,
                    0,
                  )}
                  {/* {collection.taskCount > 0 && collection.taskCount} */}
                </span>
              </Link>
            ))}
        </div>
      </nav>

      <AddCollectionModal
        isOpen={isAddCollectionOpen}
        close={() => setIsAddCollectionOpen(false)}
      />
    </>
  );
}

const AddCollectionModal = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  const [name, setName] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    setIsValid(name.trim() !== "");
  }, [name]);

  useEffect(() => {
    if (isOpen) {
      nameInputRef.current?.focus();
    }
  }, [isOpen]);

  const router = useRouter();
  const trpc = api.useUtils();
  const { mutate: createCollection } = api.collection.create.useMutation({
    onSuccess: async (data) => {
      void trpc.collection.invalidate();
      close();
      setName("");
      router.push(`/${data.id}`);
    },
  });
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === "") {
      return;
    }
    createCollection({ name });
  };

  return (
    <Modal isOpen={isOpen} close={close}>
      <form
        onSubmit={handleCreateCollection}
        className="bg-foreground flex min-w-[400px] flex-col rounded-lg text-white"
      >
        <div className="flex items-center justify-between border-b border-b-white/30 px-4 py-1">
          <h4>Add collection</h4>
          <button type="button" onClick={close} className="text-primary">
            <FaX />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-2">
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name..."
            className="rounded border p-2"
          />
        </div>
        <div className="ml-auto flex gap-2 p-2">
          <button type="button" onClick={close} className="button-secondary">
            Cancel
          </button>
          <button type="submit" disabled={!isValid} className="button-primary">
            Add
          </button>
        </div>
      </form>
    </Modal>
  );
};
