import { useDeferredValue, useState } from "react";
import { FlatList, TextInput, View, useWindowDimensions } from "react-native";
import { categories, filterTopics, topics } from "@trailbook/content/native";
import { Text } from "@/components/text";
import { Choice } from "@/components/choice";
import { TopicRow } from "@/components/topic-row";
import { Icon } from "@/components/icon";
import { useProgress } from "@/lib/progress";
import { space, radius, useTheme, type } from "@/theme";
export default function Learn() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { values } = useProgress();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [category, setCategory] = useState("all");
  const [collection, setCollection] = useState("all");
  const results = filterTopics(deferred).filter(
    (topic) =>
      (category === "all" || topic.category === category) &&
      (collection === "all" ||
        (collection === "saved" &&
          values[`reading/saved/${topic.slug}`] === true) ||
        (collection === "unread" &&
          values[`reading/read/${topic.slug}`] !== true)),
  );
  return (
    <FlatList
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{
        width: "100%",
        maxWidth: 840,
        alignSelf: "center",
        padding: space.page,
        paddingBottom: space.section,
      }}
      data={results}
      keyExtractor={(topic) => topic.slug}
      renderItem={({ item }) => <TopicRow topic={item} />}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={{ gap: space.lg, marginBottom: space.lg }}>
          <Text variant="display">Follow your curiosity.</Text>
          <Text muted>
            {topics.length} lessons. Small ideas that build real understanding.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: space.lg,
              gap: space.md,
              backgroundColor: colors.surface,
              borderColor: colors.line,
              borderWidth: 1,
              borderRadius: radius.medium,
            }}
          >
            <Icon name="search" color={colors.muted} />
            <TextInput
              accessibilityLabel="Search all lesson content"
              placeholder="Search concepts, code, questions…"
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              style={{
                ...type.body,
                flex: 1,
                minHeight: 56,
                minWidth: 0,
                color: colors.text,
              }}
            />
            <Text variant="small" muted>
              {width >= 600 ? "Search" : ""}
            </Text>
          </View>
          <Choice
            label="Lesson collection"
            value={collection}
            onChange={setCollection}
            options={[
              { value: "all", label: "All lessons" },
              { value: "saved", label: "Bookmarked" },
              { value: "unread", label: "To explore" },
            ]}
          />
          <Choice
            label="Topic category"
            value={category}
            onChange={setCategory}
            options={[
              { value: "all", label: "All topics" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Text variant="label" muted>
            {results.length} {results.length === 1 ? "LESSON" : "LESSONS"}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={{ paddingVertical: space.section, gap: space.md }}>
          <Icon
            name={collection === "saved" ? "bookmark-border" : "search-off"}
            size={32}
          />
          <Text variant="heading">
            {collection === "saved" && !query
              ? "Keep a good idea close."
              : "No lessons found."}
          </Text>
          <Text muted>
            {collection === "saved" && !query
              ? "Bookmark a lesson to find it here later."
              : "Try another search or choose a different category."}
          </Text>
        </View>
      }
    />
  );
}
