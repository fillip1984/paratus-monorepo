/**
 *
 * @param section Permanent sections are those that should not be deleted, renamed, resorted, etc...
 * @returns
 */
export const isPermanentSection = (
  collectionName: string,
  sectionName: string,
): boolean => {
  return (
    collectionName === "Today" ||
    sectionName === "Uncategorized" ||
    sectionName === "Overdue"
  );
};
