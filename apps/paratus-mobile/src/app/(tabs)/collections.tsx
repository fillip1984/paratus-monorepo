import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import LoadOrRetry from "~/components/shared/LoadOrRetry";
import UserAvatar from "~/components/UserAvatar";
import { useRefreshOnFocus } from "~/hooks/useRefreshOnFocus";
import { Colors } from "~/styles/colors";
import { trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function CollectionsScreen() {
  const collections = useQuery(trpc.collection.readAll.queryOptions());
  useRefreshOnFocus(collections.refetch);

  const [search, setSearch] = useState("");
  const filteredCollections = collections.data?.filter((collection) =>
    collection.name.toLowerCase().includes(search.toLowerCase()),
  );

  const { data: session } = authClient.useSession();

  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <LoadOrRetry
        isLoading={collections.isLoading}
        isError={collections.isError}
        retry={collections.refetch}
      />

      {session?.user && (
        <View className="px-4">
          <Link
            href={{
              pathname: "/(profile)",
            }}
          >
            <UserAvatar user={session.user} />
          </Link>
        </View>
      )}

      <View className="h-screen bg-background p-4">
        <TextInput
          value={search}
          onChangeText={setSearch}
          className="rounded bg-gray/30 p-2 text-white placeholder:text-white/60"
          placeholder="Search collections..."
        />

        <ScrollView className="mt-4">
          {filteredCollections?.map((collection, index) => (
            <Link
              key={collection.id}
              asChild
              href={{
                pathname: "/(collections)/[id]",
                params: { id: collection.id },
              }}
              className={`${index === 0 ? "rounded-t-lg" : ""} ${index !== filteredCollections.length - 1 ? "border-b border-white/40" : "rounded-b-lg"} bg-foreground px-2 py-4 text-white`}
            >
              <Pressable>
                <Text key={collection.id} className="text-white">
                  {collection.name}
                </Text>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
