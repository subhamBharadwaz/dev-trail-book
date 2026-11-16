import { View } from "react-native";
import { Text } from "./text";
import { space } from "@/theme";
export function SectionHeading({
  title,
  detail,
}: {
  title: string;
  detail?: string;
}) {
  return (
    <View style={{ gap: space.xs }}>
      <Text variant="heading">{title}</Text>
      {detail && (
        <Text variant="small" muted>
          {detail}
        </Text>
      )}
    </View>
  );
}
