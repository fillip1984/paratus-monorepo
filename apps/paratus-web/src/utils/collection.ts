import type { CollectionDetailType } from "@paratus/api";

export const isNewSectionAvailable = (
  collection: CollectionDetailType,
): boolean => {
  return collection.name !== "Today" && collection.name !== "Upcoming";
};

export const isPermanentCollection = (name: string): boolean => {
  return name === "Inbox" || name === "Today" || name === "Upcoming";
};
