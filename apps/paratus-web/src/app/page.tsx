import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import CollectionCard from "./_components/CollectionCard";

export default async function Home() {
  const collections = await api.collection.readAll();

  return (
    <HydrateClient>
      <main>
        <h1>Collections</h1>
        <ul>
          {collections.map((collection) => (
            <li key={collection.id}>{collection.name}</li>
          ))}
        </ul>
        <CollectionCard />
      </main>
    </HydrateClient>
  );
}
