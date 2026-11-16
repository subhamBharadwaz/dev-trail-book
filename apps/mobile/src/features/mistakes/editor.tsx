import { useState } from "react";
import { View } from "react-native";
import { validDate, type Mistake } from "@trailbook/learning/mistakes";
import { Text } from "@/components/text";
import { Field } from "@/components/field";
import { Action } from "@/components/action";
import { space } from "@/theme";
export function MistakeEditor({
  initial,
  save,
  cancel,
}: {
  initial: Mistake;
  save(m: Mistake): void;
  cancel(): void;
}) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  return (
    <View style={{ gap: space.lg }}>
      <Text variant="title">Reflect on the gap.</Text>
      {(
        [
          ["question", "Question or problem"],
          ["answer", "Correct answer"],
          ["yourAnswer", "What I answered"],
          ["explanation", "Why I missed it / what I’ll do differently"],
        ] as const
      ).map(([key, label]) => (
        <Field
          key={key}
          label={label}
          multiline
          maxLength={8000}
          value={draft[key]}
          onChangeText={(value) =>
            setDraft((current) => ({ ...current, [key]: value }))
          }
        />
      ))}
      <Field
        label="Retry date (YYYY-MM-DD)"
        value={draft.due}
        autoCapitalize="none"
        maxLength={10}
        onChangeText={(due) => setDraft((current) => ({ ...current, due }))}
      />
      {!!error && <Text accessibilityRole="alert">{error}</Text>}
      <Action
        label="Save reflection"
        onPress={() => {
          if (
            !draft.question.trim() ||
            !draft.answer.trim() ||
            !validDate(draft.due)
          ) {
            setError(
              "Add a question, a correct answer, and a valid retry date.",
            );
            return;
          }
          save({
            ...draft,
            question: draft.question.trim(),
            answer: draft.answer.trim(),
            updatedAt: new Date().toISOString(),
          });
        }}
      />
      <Action secondary label="Cancel editing" onPress={cancel} />
    </View>
  );
}
