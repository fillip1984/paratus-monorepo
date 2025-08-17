/**
 *
 * @param section Permanent sections are those that should not be deleted, renamed, resorted, etc...
 * @returns
 */
export const isPermanentSection = (sectionName: string): boolean => {
  return (
    sectionName === "Uncategorized" ||
    sectionName === "Inbox" ||
    sectionName === "Overdue"
  );
};
