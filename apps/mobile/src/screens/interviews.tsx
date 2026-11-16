import { View } from "react-native";
import { Text } from "@/components/text";
import { useInterviews } from "@/features/interviews/use-interviews";
import { InterviewSetup } from "@/features/interviews/setup";
import { InterviewSession } from "@/features/interviews/session";
export default function Interviews() {
  const data = useInterviews();
  return (
    <View style={{ flex: 1 }}>
      {data.storageError && (
        <Text accessibilityRole="alert">
          Device storage could not be updated. Check Your space for sync status.
        </Text>
      )}
      {data.selected ? (
        <InterviewSession
          key={data.selected.id}
          session={data.selected}
          values={data.values}
          actions={data.actions}
          now={data.now}
        />
      ) : (
        <InterviewSetup
          sessions={data.sessions}
          values={data.values}
          actions={data.actions}
          now={data.now}
        />
      )}
    </View>
  );
}
