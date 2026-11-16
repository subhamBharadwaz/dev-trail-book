import { useState } from "react";
import { View } from "react-native";
import { Host, Picker, Switch } from "@expo/ui";
import { router } from "expo-router";
import { randomUUID } from "expo-crypto";
import {
  dateKey,
  addDays,
  evidenceKinds,
  type EvidenceKind,
} from "@trailbook/learning/preparation";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action } from "@/components/action";
import { Field } from "@/components/field";
import { progress } from "@/lib/progress";
import { space, useTheme } from "@/theme";
export default function Evidence() {
  const { colors, mode } = useTheme();
  const [kind, setKind] = useState<EvidenceKind>("dsa");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [independent, setIndependent] = useState(true);
  const [error, setError] = useState("");
  function save() {
    if (!title.trim()) {
      setError("Give your practice a short title.");
      return;
    }
    try {
      const id = randomUUID();
      const date = dateKey();
      progress.write({
        [`prep/entry/${id}`]: {
          id,
          kind,
          title: title.trim(),
          notes: notes.trim(),
          independent,
          date,
          reviews:
            kind === "application"
              ? []
              : kind === "dsa"
                ? [addDays(date, 2), addDays(date, 7)]
                : [addDays(date, 1)],
          completedReviews: [],
        },
      });
      router.back();
    } catch {
      setError("Could not save this log on your device. Please try again.");
    }
  }
  return (
    <Screen>
      <Text variant="title">Small work. Real evidence.</Text>
      <Text muted>
        Record what you tried, what you learned, and what needs another attempt.
      </Text>
      <View style={{ gap: space.sm }}>
        <Text variant="small">Practice type</Text>
        <Host
          colorScheme={mode}
          seedColor={colors.accent}
          matchContents={{ vertical: true }}
          style={{ width: "100%" }}
        >
          <Picker
            accessibilityLabel="Practice type"
            selectedValue={kind}
            onValueChange={setKind}
          >
            {evidenceKinds.map((item) => (
              <Picker.Item
                key={item.value}
                value={item.value}
                label={item.label}
              />
            ))}
          </Picker>
        </Host>
      </View>
      <Field
        label="What did you practice?"
        placeholder="For example, solved Two Sum without hints"
        value={title}
        onChangeText={setTitle}
        maxLength={180}
      />
      <Field
        label="What did you learn?"
        placeholder="One gap, one insight, or the next thing to try…"
        value={notes}
        onChangeText={setNotes}
        multiline
        maxLength={4000}
        style={{ minHeight: 150 }}
      />
      <Host
        colorScheme={mode}
        seedColor={colors.accent}
        matchContents={{ vertical: true }}
        style={{ width: "100%" }}
      >
        <Switch
          label="Completed independently"
          value={independent}
          onValueChange={setIndependent}
        />
      </Host>
      <Text variant="small" muted>
        {kind === "dsa"
          ? "We’ll schedule another look in 2 days and 7 days."
          : kind === "application"
            ? "Applications are logged without an automatic review."
            : "We’ll schedule a review for tomorrow."}
      </Text>
      {!!error && (
        <Text accessibilityRole="alert" style={{ color: colors.danger }}>
          {error}
        </Text>
      )}
      <Action label="Save practice log" onPress={save} />
    </Screen>
  );
}
