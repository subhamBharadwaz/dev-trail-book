import { router } from "expo-router";
import { captureMistake } from "@trailbook/learning/mistakes";
import { View, Pressable } from "react-native";
import { Host, Picker } from "@expo/ui";
import { topics, categories } from "@trailbook/content/native";
import { buildPractice } from "@trailbook/learning/practice";
import {
  fresh,
  restoreSession,
  type Session,
} from "@trailbook/learning/practice-session";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Choice } from "@/components/choice";
import { Action } from "@/components/action";
import { Meter } from "@/components/meter";
import { Icon } from "@/components/icon";
import { progress, useProgress } from "@/lib/progress";
import { space, radius, useTheme } from "@/theme";
const bank = buildPractice(topics);
export default function Practice() {
  const { colors, mode: theme } = useTheme();
  const { values } = useProgress();
  const stored = values["practice/preferences/all"] as
    { category?: string; mode?: string } | undefined;
  const category = categories.some((c) => c.id === stored?.category)
    ? stored!.category!
    : "all";
  const mode = stored?.mode === "quiz" ? "quiz" : "flashcards";
  const cards = (mode === "quiz" ? bank.quizCards : bank.flashcards).filter(
    (card) => category === "all" || card.category === category,
  );
  const key = `practice/session/${category}:${mode}`;
  const session = restoreSession(cards, values[key]);
  const current = cards.find((card) => card.id === session.ids[session.index]);
  const answered = !!current && Object.hasOwn(session.results, current.id);
  const missed = session.ids.filter((id) => session.results[id] === false);
  const write = (next: Session, missedSource?: "quiz" | "flashcard") =>
    progress.write({
      [key]: JSON.parse(JSON.stringify(next)),
      ...(missedSource && current
        ? captureMistake(
            values,
            current,
            missedSource,
            missedSource === "quiz"
              ? (current.options.find((o) => o.id === session.selected)?.text ??
                  "")
              : "Could not recall",
          )
        : {}),
    });
  const next = () =>
    write({
      ...session,
      index: session.index + 1,
      selected: null,
      revealed: false,
    });
  return (
    <Screen>
      <Action
        secondary
        label="Practice a timed mock interview"
        onPress={() => router.push("/interviews")}
      />
      <View style={{ gap: space.md }}>
        <Text variant="display">Make it stick.</Text>
        <Text muted>Recall first. Check the gap. Come back stronger.</Text>
      </View>
      <Action
        secondary
        label="Open mistake notebook"
        onPress={() => router.push("/mistakes")}
      />
      <Choice
        value={mode}
        label="Practice mode"
        options={[
          { value: "flashcards", label: "Flashcards" },
          { value: "quiz", label: "Quiz" },
        ]}
        onChange={(value) =>
          progress.write({
            "practice/preferences/all": { category, mode: value },
          })
        }
      />
      <Host
        colorScheme={theme}
        seedColor={colors.accent}
        matchContents={{ vertical: true }}
        style={{ width: "100%" }}
      >
        <Picker
          accessibilityLabel="Practice category"
          selectedValue={category}
          onValueChange={(value) =>
            progress.write({
              "practice/preferences/all": { category: value, mode },
            })
          }
        >
          <Picker.Item value="all" label="All categories" />
          {categories.map((c) => (
            <Picker.Item key={c.id} value={c.id} label={c.name} />
          ))}
        </Picker>
      </Host>
      <Meter
        value={session.ids.length ? session.index / session.ids.length : 0}
        label="Practice session progress"
      />
      {current ? (
        <>
          <View
            style={{
              gap: space.xl,
              padding: space.xl,
              borderRadius: radius.large,
              backgroundColor: colors.surface,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text variant="label" muted>
                {session.index + 1} / {session.ids.length}
              </Text>
              <Icon name="psychology" />
            </View>
            <Text variant="small" muted>
              {current.topicTitle}
            </Text>
            <Text variant="title">{current.question}</Text>
            {mode === "quiz" &&
              current.options.map((option) => (
                <Pressable
                  key={option.id}
                  disabled={answered}
                  accessibilityRole="radio"
                  aria-checked={session.selected === option.id}
                  accessibilityState={{
                    checked: session.selected === option.id,
                    disabled: answered,
                  }}
                  onPress={() => write({ ...session, selected: option.id })}
                  style={({ pressed }) => ({
                    padding: space.lg,
                    borderRadius: radius.medium,
                    borderWidth: 1,
                    borderColor:
                      answered && option.id === current.correctId
                        ? colors.success
                        : session.selected === option.id
                          ? colors.accent
                          : colors.line,
                    backgroundColor:
                      pressed || session.selected === option.id
                        ? colors.tint
                        : colors.background,
                  })}
                >
                  <Text>{option.text}</Text>
                </Pressable>
              ))}
            {session.revealed && (
              <View
                style={{
                  gap: space.md,
                  paddingTop: space.lg,
                  borderTopWidth: 1,
                  borderColor: colors.line,
                }}
              >
                <Text variant="label" style={{ color: colors.accent }}>
                  {mode === "quiz"
                    ? session.results[current.id]
                      ? "THAT’S RIGHT"
                      : "LET’S REVISIT THIS"
                    : "THE ANSWER"}
                </Text>
                <Text selectable>{current.answer}</Text>
              </View>
            )}
          </View>
          {mode === "flashcards" ? (
            session.revealed ? (
              <>
                <Action
                  label="I knew this"
                  onPress={() =>
                    write({
                      ...session,
                      index: session.index + 1,
                      selected: null,
                      revealed: false,
                      results: { ...session.results, [current.id]: true },
                    })
                  }
                />
                <Action
                  secondary
                  label="Needs another look"
                  onPress={() =>
                    write(
                      {
                        ...session,
                        index: session.index + 1,
                        selected: null,
                        revealed: false,
                        results: { ...session.results, [current.id]: false },
                      },
                      "flashcard",
                    )
                  }
                />
              </>
            ) : (
              <Action
                label="Reveal answer"
                onPress={() => write({ ...session, revealed: true })}
              />
            )
          ) : answered ? (
            <Action label="Next question" onPress={next} />
          ) : (
            <Action
              label="Check answer"
              disabled={!session.selected}
              onPress={() =>
                write(
                  {
                    ...session,
                    revealed: true,
                    results: {
                      ...session.results,
                      [current.id]: session.selected === current.correctId,
                    },
                  },
                  session.selected === current.correctId ? undefined : "quiz",
                )
              }
            />
          )}
        </>
      ) : (
        <View style={{ gap: space.xl }}>
          <Icon name="task-alt" size={40} />
          <Text variant="title">
            {cards.length
              ? "A little stronger than before."
              : "No questions in this collection."}
          </Text>
          <Text muted>
            {Object.values(session.results).filter(Boolean).length} recalled ·{" "}
            {missed.length} to revisit
          </Text>
          {missed.length > 0 && (
            <Action
              label={`Review ${missed.length} missed`}
              onPress={() => write(fresh(missed))}
            />
          )}
          <Action
            secondary
            label="Start a fresh session"
            onPress={() => write(fresh(cards.map((card) => card.id)))}
          />
        </View>
      )}
      <Text variant="small" muted>
        Your session is saved as you go. You can leave and return anytime.
      </Text>
    </Screen>
  );
}
