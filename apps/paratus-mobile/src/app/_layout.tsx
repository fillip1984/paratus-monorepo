import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import "react-native-reanimated";

import type { AppStateStatus } from "react-native";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import * as Network from "expo-network";
import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from "@tanstack/react-query";

import "~/styles/global.css";

import { queryClient } from "~/utils/api";
import { authClient } from "~/utils/auth";

export default function RootLayout() {
  // refetch when network connection is restored
  onlineManager.setEventListener((setOnline) => {
    const eventSubscription = Network.addNetworkStateListener((state) => {
      setOnline(!!state.isConnected);
    });
    return () => eventSubscription.remove();
  });

  // refetch when app is made active again
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active");
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  //auth
  const { data: session } = authClient.useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(collections)/[id]"
            options={{
              title: "",
              headerShown: false,
              // headerBackButtonDisplayMode: "minimal",
              // presentation: "fullScreenModal",
              // headerBackButtonMenuEnabled: true,
            }}
          />
          <Stack.Screen
            name="(profile)/index"
            options={{
              title: "Profile",
              headerShown: false,
              presentation: "formSheet",
            }}
          />
          <Stack.Screen
            name="(task)/[id]"
            options={{
              title: "Task Details",
              headerShown: false,
              presentation: "formSheet",
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen
            name="social-sign-in"
            options={{
              title: "Social Sign In",
              headerShown: false,
            }}
          />
        </Stack.Protected>
      </Stack>
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
