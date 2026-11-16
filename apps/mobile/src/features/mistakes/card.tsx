import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import {
  day,
  afterDays,
  reviewMistake,
  type Mistake,
} from "@trailbook/learning/mistakes";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { space, radius, useTheme } from "@/theme";
export function MistakeCard({
  mistake: m,
  save,
  edit,
}: {
  mistake: Mistake;
  save(m: Mistake): void;
  edit(): void;
}) {
  const { colors } = useTheme();
  const [revealed, setRevealed] = useState(false);
  return (
    <View
      style={{
        gap: space.lg,
        padding: space.xl,
        borderRadius: radius.large,
        backgroundColor: colors.surface,
      }}
    >
      <Text variant="small" muted>
        {m.topicTitle} · {m.source}
      </Text>
      <Text variant="title">{m.question}</Text>
      <Text muted>
        {m.status === "mastered"
          ? "Mastered"
          : m.due <= day()
            ? "Ready to retry"
            : `Retry ${m.due}`}{" "}
        · {m.streak}/3 recalls · {m.misses} misses
      </Text>
      {revealed ? (
        <>
          <Text variant="label">CORRECT ANSWER</Text>
          <Text selectable>{m.answer}</Text>
          {!!m.yourAnswer && (
            <>
              <Text variant="label">YOUR PREVIOUS ANSWER</Text>
              <Text>{m.yourAnswer}</Text>
            </>
          )}
          <Text variant="label">YOUR REFLECTION</Text>
          <Text>
            {m.explanation || "Add what confused you and a rule for next time."}
          </Text>
          {m.status === "open" && (
            <>
              <Action
                label="Recalled it"
                disabled={m.due > day()}
                onPress={() => {
                  save(reviewMistake(m, true));
                  setRevealed(false);
                }}
              />
              <Action
                secondary
                label="Retry tomorrow"
                onPress={() => {
                  save(reviewMistake(m, false));
                  setRevealed(false);
                }}
              />
            </>
          )}
        </>
      ) : (
        <Action label="Reveal answer" onPress={() => setRevealed(true)} />
      )}
      <Action secondary label="Edit reflection" onPress={edit} />
      {m.status === "mastered" ? (
        <Action
          secondary
          label="Reopen for review"
          onPress={() =>
            save({
              ...m,
              status: "open",
              streak: 0,
              due: day(),
              updatedAt: new Date().toISOString(),
            })
          }
        />
      ) : (
        <Action
          secondary
          label="Snooze one day"
          onPress={() =>
            save({
              ...m,
              due: afterDays(1),
              updatedAt: new Date().toISOString(),
            })
          }
        />
      )}
      {!!m.topicSlug && (
        <Action
          secondary
          label="Read lesson"
          onPress={() =>
            router.push({
              pathname: "/topic/[slug]",
              params: { slug: m.topicSlug },
            })
          }
        />
      )}
    </View>
  );
}
