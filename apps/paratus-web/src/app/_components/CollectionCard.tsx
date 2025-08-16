"use client";
import React from "react";
import { api } from "~/trpc/react";

export default function CollectionCard() {
  const { data: collection } = api.collection.readOne.useQuery({ id: "inbox" });

  return <div>CollectionCard for - ${collection?.name}</div>;
}
