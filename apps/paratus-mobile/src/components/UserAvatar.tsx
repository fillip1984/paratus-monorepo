import { Image, Text, View } from "react-native";

export default function UserAvatar({
  user,
}: {
  user: { name: string; image?: string | null | undefined };
}) {
  return (
    <View>
      {user.image ? (
        <Image src={user.image} className="h-14 w-14 rounded-full" />
      ) : (
        <View className="h-20 w-20 rounded-full bg-primary">
          <Text className="m-auto text-2xl text-white">
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}
