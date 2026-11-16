import { View } from "react-native";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { space } from "@/theme";
import {
  useReadiness,
  openReadinessAction,
} from "@/features/readiness/use-readiness";
import { WeeklySummary } from "@/features/readiness/summary";
import { ReadinessSection } from "@/features/readiness/section";
import { ReadinessSignals } from "@/features/readiness/signals";
export default function Readiness() {
  const { data: d, storageError, loading } = useReadiness();
  return (
    <Screen>
      <View style={{ gap: space.md }}>
        <Text variant="display">Make your next hour count.</Text>
        <Text muted>
          Your weekly readiness: practice, gaps, and the next useful attempt.
        </Text>
        <Text variant="small" muted>
          Last 7 days: {d.start} – {d.today}
        </Text>
      </View>
      {loading && <Text>Loading your account records…</Text>}
      {storageError && (
        <Text accessibilityRole="alert">
          Some device data could not be saved. Check Your space before closing
          the app.
        </Text>
      )}
      {!d.hasEvidence && (
        <Text muted>
          Your baseline starts with one real attempt. Record practice, finish a
          mock, or capture a mistake.
        </Text>
      )}
      <WeeklySummary data={d} />
      <Text variant="title">Your next three moves</Text>
      {d.actions.map((action, i) => (
        <ReadinessSection key={action.id} title={`0${i + 1} · ${action.title}`}>
          <Text muted>{action.detail}</Text>
          <Action
            secondary
            label="Start this"
            onPress={() => openReadinessAction(action)}
          />
        </ReadinessSection>
      ))}
      <ReadinessSignals data={d} />
      <ReadinessSection title="The work behind this week">
        {d.practice.map((kind) => (
          <View
            key={kind.value}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: space.md,
            }}
          >
            <Text variant="small" muted style={{ flex: 1 }}>
              {kind.label}
            </Text>
            <Text>{kind.count}</Text>
          </View>
        ))}
        <Text variant="small" muted>
          {d.independentAttempts} independent coding/build attempts logged. Mock
          journal logs are separate from timed sessions. Reviews and reading
          coverage show current saved state; the seven-day window applies to
          activity.
        </Text>
      </ReadinessSection>
    </Screen>
  );
}
