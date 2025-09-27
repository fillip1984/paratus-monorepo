import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import UserAvatar from "~/components/UserAvatar";
import { Colors } from "~/styles/colors";
import { authClient } from "~/utils/auth";

export default function ProfileScreen() {
  const { data: session } = authClient.useSession();

  if (!session) {
    return (
      <SafeAreaView style={{ backgroundColor: Colors.background }}>
        <View className="flex h-screen flex-row gap-4">
          <Text className="text-2xl text-white">Not signed in</Text>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={{ backgroundColor: Colors.background }}>
        <View className="flex h-screen">
          <View className="flex flex-row items-center gap-4">
            <UserAvatar user={session.user} />
            <View className="flex">
              <Text className="text-2xl text-white">{session.user.name}</Text>
              <TouchableOpacity
                onPress={() => authClient.signOut()}
                className="flex items-center justify-center rounded bg-primary px-4 py-2"
              >
                <Text className="text-xl font-bold text-white">Sign out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
