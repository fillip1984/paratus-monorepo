import { Pressable, Text, View } from "react-native";
import { Circle } from "react-native-animated-spinkit";

export default function LoadOrRetry({
  isLoading,
  isError,
  retry,
}: {
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}) {
  if (!isLoading && !isError) return null;

  return (
    <View className="flex h-screen items-center justify-center">
      {isLoading && <Circle size={80} color="#fff" />}
      {isError && (
        <View className="flex items-center justify-center gap-2">
          <Text className="text2xl font-bold text-white">
            An error has occurred, would you like to retry?
          </Text>
          <Pressable
            onPress={retry}
            className="bg-primary flex items-center justify-center rounded px-2 py-4"
          >
            <Text className="text-3xl text-white">Retry</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
