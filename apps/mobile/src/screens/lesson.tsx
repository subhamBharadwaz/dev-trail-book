import { useState } from "react";
import { Linking, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Stack } from "expo-router/stack";
import { topicBySlug, topics, categories } from "@trailbook/content/native";
import { Screen } from "@/components/screen";
import { Text } from "@/components/text";
import { Action, IconAction } from "@/components/action";
import { Choice } from "@/components/choice";
import { Markdown } from "@/components/markdown";
import { TopicRow } from "@/components/topic-row";
import { progress, useProgress } from "@/lib/progress";
import { useReadingSize } from "@/lib/use-reading-size";
import { space, useTheme } from "@/theme";
export default function Lesson() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const topic = topicBySlug.get(slug);
  const { values } = useProgress();
  const { colors } = useTheme();
  const [tab, setTab] = useState("lesson");
  const [size, setSize] = useReadingSize();
  if (!topic)
    return (
      <Screen>
        <Text variant="title">This lesson isn’t here.</Text>
        <Action
          label="Browse lessons"
          onPress={() => router.replace("/(tabs)/learn")}
        />
      </Screen>
    );
  const saved = values[`reading/saved/${slug}`] === true;
  const read = values[`reading/read/${slug}`] === true;
  const next = topics.find(
    (t) =>
      t.category === topic.category &&
      t.slug !== slug &&
      values[`reading/read/${t.slug}`] !== true,
  );
  return (
    <Screen>
      <Stack.Screen
        options={{
          title:
            categories.find((c) => c.id === topic.category)?.name ?? "Lesson",
          headerRight: () => (
            <IconAction
              name={saved ? "bookmark" : "bookmark-border"}
              label={saved ? "Remove bookmark" : "Bookmark lesson"}
              onPress={() =>
                progress.write({ [`reading/saved/${slug}`]: !saved })
              }
            />
          ),
        }}
      />
      <View style={{ gap: space.md }}>
        <Text variant="label" muted>
          {topic.level.toUpperCase()} · {topic.minutes} MIN READ
        </Text>
        <Text variant="display">{topic.title}</Text>
        <Text muted>{topic.description}</Text>
      </View>
      <Choice
        value={tab}
        onChange={setTab}
        label="Lesson sections"
        options={[
          { value: "lesson", label: "Lesson" },
          { value: "questions", label: `Q&A · ${topic.questions.length}` },
          { value: "facts", label: "Must know" },
        ]}
      />
      {tab === "lesson" && (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: space.sm,
            }}
          >
            <Text variant="small" muted style={{ flex: 1 }}>
              Reading size
            </Text>
            <IconAction
              label="Smaller reading text"
              name="text-decrease"
              onPress={() => setSize(Math.max(17, size - 1))}
            />
            <Text variant="small" muted>
              {size}
            </Text>
            <IconAction
              label="Larger reading text"
              name="text-increase"
              onPress={() => setSize(Math.min(23, size + 1))}
            />
          </View>
          <Markdown node={topic.body} size={size} />
        </>
      )}
      {tab === "questions" &&
        topic.questions.map((q, i) => (
          <View
            key={q.question}
            style={{
              gap: space.md,
              paddingBottom: space.xl,
              borderBottomWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Text variant="label" muted>
              QUESTION {i + 1}
            </Text>
            <Text variant="heading">{q.question}</Text>
            <Text selectable>{q.answer}</Text>
          </View>
        ))}
      {tab === "facts" &&
        topic.facts.map((fact, i) => (
          <View key={fact} style={{ flexDirection: "row", gap: space.lg }}>
            <Text variant="heading" style={{ color: colors.accent }}>
              {String(i + 1).padStart(2, "0")}
            </Text>
            <Text selectable style={{ flex: 1 }}>
              {fact}
            </Text>
          </View>
        ))}
      <Action
        label={read ? "Completed · mark as unread" : "Mark lesson complete"}
        secondary={read}
        onPress={() => progress.write({ [`reading/read/${slug}`]: !read })}
      />
      <Action
        secondary
        label="Open original reference"
        onPress={() => {
          if (/^https?:\/\//.test(topic.source))
            void Linking.openURL(topic.source);
        }}
      />
      {next && (
        <View style={{ gap: space.sm }}>
          <Text variant="label" muted>
            KEEP EXPLORING
          </Text>
          <TopicRow topic={next} />
        </View>
      )}
    </Screen>
  );
}
