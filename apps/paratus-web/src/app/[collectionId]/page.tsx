"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import { api } from "~/trpc/react";
import CollectionView from "../_components/collection/CollectionView";
import LoadOrRetry from "../_components/shared/LoadOrRetry";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = use(params);
  console.log({ collectionId });
  // const trpc = api.useUtils();
  // const {
  //   data: collection,
  //   isLoading,
  //   isError,
  //   refetch: retry,
  // } = useQuery(trpc.collection.readOne.queryOptions({ id: collectionId }));
  const {
    data: collection,
    isLoading,
    isError,
    refetch: retry,
  } = api.collection.readOne.useQuery({ id: collectionId });

  if (isLoading || isError) {
    return (
      <LoadOrRetry isLoading={isLoading} isError={isError} retry={retry} />
    );
  } else if (collection) {
    return <CollectionView collection={collection} />;
  } else {
    return notFound();
  }
}
