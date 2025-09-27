import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Colors } from "~/styles/colors";
import { authClient } from "~/utils/auth";

export default function SocialSignIn() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // this will be converted to a deep link (eg. `myapp://dashboard`) on native
    });
  };
  return (
    <SafeAreaView style={{ backgroundColor: Colors.background }}>
      <View className="mt-8 flex h-screen items-center bg-background">
        <Text className="mb-12 text-3xl text-white">Sign in with</Text>
        <TouchableOpacity
          onPress={handleLogin}
          className="flex flex-row items-center justify-center gap-8 rounded-lg border border-white p-6"
        >
          <AntDesign name="google" size={48} color={Colors.white} />
          <Text className="text-4xl font-bold text-white">Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
