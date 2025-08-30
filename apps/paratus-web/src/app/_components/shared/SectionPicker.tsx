import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { RxSection } from "react-icons/rx";

import PopupMenu from "~/app/_components/ui/popupMenu";
import { api } from "~/trpc/react";

interface SectionPickerType {
  id: string;
  selectedLabel: React.ReactNode;
  dropDownLabel: React.ReactNode;
  searchableLabel: string;
  value: string;
  indented: boolean;
}

export default function SectionPicker({
  value,
  setValue,
}: {
  value: string | null;
  setValue: (sectionId: string) => void;
}) {
  const [sectionPickerValue, setSectionPickerValue] =
    useState<SectionPickerType | null>(null);
  const [sectionPickerOptions, setSectionPickerOptions] = useState<
    SectionPickerType[]
  >([]);

  const { data: collections } = api.collection.readAll.useQuery();
  useEffect(() => {
    // console.log("Initializing section options");
    if (!collections) return;

    const options = collections.map((c) => {
      const sections: SectionPickerType[] = [];
      c.sections.forEach((s) => {
        if (s.name === "Uncategorized") {
          sections.push({
            id: s.id,
            dropDownLabel: `# ${c.name}`,
            selectedLabel: `# ${c.name}`,
            searchableLabel: `# ${c.name}`.toLowerCase(),
            value: s.id,
            indented: false,
          });
        } else {
          sections.push({
            id: s.id,
            dropDownLabel: (
              <div className="flex items-center gap-2">
                <RxSection />
                {s.name}
              </div>
            ),
            selectedLabel: (
              <div className="flex items-center gap-2">
                # {c.name} <RxSection />
                {s.name}
              </div>
            ),
            searchableLabel: `# ${c.name} ${s.name}`.toLowerCase(),
            value: s.id,
            indented: true,
          });
        }
      });
      return sections;
    });
    setSectionPickerOptions(options.flat());
  }, [collections]);

  useEffect(() => {
    // console.log("Setting section Picker option initially on first visit");
    if (sectionPickerOptions.length === 0) return;
    const sectionPickerOption = sectionPickerOptions.find(
      (s) => s.id === value,
    );
    if (sectionPickerOption) {
      setSectionPickerValue(sectionPickerOption);
    }
  }, [sectionPickerOptions, value]);

  // filter state
  const [search, setSearch] = useState("");
  const [filteredSectionPickerOptions, setFilteredSectionPickerOptions] =
    useState<SectionPickerType[]>([]);
  useEffect(() => {
    if (!search) {
      setFilteredSectionPickerOptions(sectionPickerOptions);
    } else {
      const searchLowercase = search.toLowerCase();
      // console.log(`Filtering down to:`, searchLowercase);
      setFilteredSectionPickerOptions(
        sectionPickerOptions.filter((s) => {
          return s.searchableLabel.includes(searchLowercase);
        }),
      );
    }
  }, [search, sectionPickerOptions]);

  const [isOpen, setIsOpen] = useState(false);
  const handleUpdate = (section: SectionPickerType | null) => {
    if (section && section.value !== value) {
      setSectionPickerValue(section);
      setValue(section.value);
      setIsOpen(false);
    }
  };

  return (
    <PopupMenu
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      button={
        <button
          type="button"
          className="flex items-center gap-2 rounded border border-white/30 px-2 py-1 text-sm text-white/60"
        >
          <span className="truncate text-ellipsis whitespace-nowrap">
            {sectionPickerValue?.selectedLabel}
          </span>{" "}
          <FaAngleDown />
        </button>
      }
      content={
        <div className="bg-foreground flex flex-col gap-1 rounded-lg p-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded border"
          />
          {filteredSectionPickerOptions.map((section, i) => (
            <div key={`${section.id}-${i}`} className="w-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdate(section);
                }}
                className={`hover:bg-secondary/30 flex w-full rounded px-2 py-1 text-xs ${section.indented ? "pl-4" : ""}`}
              >
                {section.dropDownLabel}
              </button>
            </div>
          ))}
        </div>
      }
    ></PopupMenu>
  );
}
