import { useRef, useState } from "react";
import { View, FlatList } from "react-native";
import { router } from "expo-router";
import {
  mistakesFromRecords,
  mistakeRecord,
  newMistake,
  type Mistake,
} from "@trailbook/learning/mistakes";
import { useToday } from "@/hooks/use-today";
import { Text } from "@/components/text";
import { Field } from "@/components/field";
import { Choice } from "@/components/choice";
import { Action } from "@/components/action";
import { progress, useProgress } from "@/lib/progress";
import { space, useTheme } from "@/theme";
import { MistakeEditor } from "@/features/mistakes/editor";
import { MistakeCard } from "@/features/mistakes/card";
export default function Mistakes() {
  const { values, storageError } = useProgress();
  const today = useToday();
  const { colors } = useTheme();
  const mistakes = mistakesFromRecords(values);
  const [filter, setFilter] = useState("due");
  const [search, setSearch] = useState("");
  const list = useRef<FlatList<Mistake>>(null);
  const [editing, setEditing] = useState<Mistake | null>(null);
  const due = mistakes.filter(
    (m) => m.status === "open" && m.due <= today,
  ).length;
  const visible = mistakes.filter(
    (m) =>
      (filter === "all" ||
        (filter === "mastered"
          ? m.status === "mastered"
          : m.status === "open" && (filter === "open" || m.due <= today))) &&
      `${m.question} ${m.topicTitle} ${m.explanation} ${m.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  const edit = (m: Mistake) => {
    setEditing(m);
    list.current?.scrollToOffset({ offset: 0, animated: false });
  };
  const save = (m: Mistake) => progress.write(mistakeRecord(m));
  return (
    <FlatList
      ref={list}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        width: "100%",
        maxWidth: 840,
        alignSelf: "center",
        padding: space.page,
        paddingBottom: space.section,
      }}
      keyboardShouldPersistTaps="handled"
      data={visible}
      keyExtractor={(m) => `${m.id}:${m.updatedAt}`}
      renderItem={({ item }) => (
        <MistakeCard mistake={item} save={save} edit={() => edit(item)} />
      )}
      ItemSeparatorComponent={() => <View style={{ height: space.lg }} />}
      ListHeaderComponent={
        <View style={{ gap: space.xl, marginBottom: space.xl }}>
          <View style={{ gap: space.md }}>
            <Text variant="display">Learn from the gap.</Text>
            <Text muted>
              Your mistake notebook. {due} due · {mistakes.length} saved.
            </Text>
            <Text muted>
              Missed answers appear here automatically. Three consecutive
              recalls mark a gap mastered. Retries are spaced 1, then 3 days
              apart.
            </Text>
          </View>
          {storageError && (
            <Text accessibilityRole="alert">
              Device storage could not be updated. Check Your space for sync
              status.
            </Text>
          )}
          {editing ? (
            <MistakeEditor
              key={editing.id}
              initial={editing}
              cancel={() => setEditing(null)}
              save={(m) => {
                save(m);
                setEditing(null);
              }}
            />
          ) : (
            <Action
              label="Add a personal mistake"
              onPress={() =>
                setEditing(
                  newMistake(
                    `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                  ),
                )
              }
            />
          )}
          <Field
            label="Search mistake notebook"
            value={search}
            onChangeText={setSearch}
            placeholder="Question, topic, or reflection"
          />
          <Choice
            label="Mistake status"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "due", label: "Due" },
              { value: "open", label: "Learning" },
              { value: "mastered", label: "Mastered" },
              { value: "all", label: "All" },
            ]}
          />
          {!visible.length && (
            <>
              <Text variant="title">
                {mistakes.length
                  ? "Nothing in this view."
                  : "Every gap is a place to grow."}
              </Text>
              <Text muted>
                Add a mistake, try another filter, or return after your next
                practice session.
              </Text>
              <Action
                secondary
                label="Go to practice"
                onPress={() => router.navigate("/(tabs)/practice")}
              />
            </>
          )}
        </View>
      }
    />
  );
}
