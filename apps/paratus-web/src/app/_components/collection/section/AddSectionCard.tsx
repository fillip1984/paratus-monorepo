import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { api } from "~/trpc/react";

export default function AddSectionCard({
  collectionId,
  addAfter,
}: {
  collectionId: string;
  addAfter: number;
}) {
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const trpc = api.useUtils();
  const { mutate: addSection } = api.section.create.useMutation({
    onSuccess: () => {
      void trpc.collection.invalidate();
      setSectionName("");
    },
  });
  const handleAddSection = () => {
    addSection({ name: sectionName, collectionId });
  };
  return (
    <div className="my-2 flex">
      {!isAddSectionOpen ? (
        <button
          type="button"
          onClick={() => setIsAddSectionOpen(true)}
          className="mx-auto text-sm opacity-10 transition duration-300 hover:opacity-100"
        >
          Add Section
        </button>
      ) : (
        <div className="mx-8 flex h-fit min-w-[300px] snap-center rounded border">
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="New Section Name..."
            className="w-full p-1"
          />
          <button
            className="flex items-center justify-center gap-2 border p-2"
            onClick={handleAddSection}
          >
            <FaPlus />
          </button>
          <button
            className="flex items-center justify-center gap-2 border p-2"
            onClick={() => setIsAddSectionOpen(false)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}
