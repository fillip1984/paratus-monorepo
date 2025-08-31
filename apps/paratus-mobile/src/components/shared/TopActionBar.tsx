import { Pressable, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "~/styles/colors";

export default function TopActionsBar() {
  return (
    <View>
      <Pressable onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={32} color={Colors.primary} />
      </Pressable>
    </View>
  );
}
