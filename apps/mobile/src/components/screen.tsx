import { UpdateNotice } from "./update-notice";
import { ScrollView, View, type ViewProps } from "react-native";
import { useTheme, space } from "@/theme";
export function Screen({ children, ...props }: ViewProps) {
  const { colors } = useTheme();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        {...props}
        style={[
          {
            width: "100%",
            maxWidth: 840,
            alignSelf: "center",
            padding: space.page,
            paddingBottom: space.section,
            gap: space.xl,
          },
          props.style,
        ]}
      >
        <UpdateNotice />
        {children}
      </View>
    </ScrollView>
  );
}
