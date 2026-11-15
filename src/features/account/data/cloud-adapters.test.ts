import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { progress } from "./progress-store";
import { useStoredList } from "@/hooks/use-stored-list";
import { usePreparation } from "@/features/preparation/hooks/use-preparation";
import { usePracticeSession } from "@/features/practice/hooks/use-practice-session";
import { flashcards } from "@/features/practice/data/practice-cards";
afterEach(() => progress.activate(null));
test("reading uses the active account without copying cloud data into guest storage", () => {
  localStorage.setItem("trailbook:read", JSON.stringify(["effects"]));
  progress.activate("alice");
  const { result } = renderHook(() => useStoredList("trailbook:read"));
  act(() =>
    progress.receive([
      { key: "reading/read/closures", value: true, revision: 1 },
    ]),
  );
  expect(result.current[0]).toEqual(["closures"]);
  act(() => result.current[1]("closures"));
  expect(result.current[0]).toEqual([]);
  expect(JSON.parse(localStorage.getItem("trailbook:read")!)).toEqual([
    "effects",
  ]);
  act(() => progress.activate("bob"));
  expect(result.current[0]).toEqual([]);
  act(() => progress.activate(null));
  expect(result.current[0]).toEqual(["effects"]);
});
test("cloud journal updates merge independent entries rather than replacing the whole journal", () => {
  const entry = {
    id: "a",
    kind: "dsa",
    title: "Two Sum",
    date: "2026-11-15",
    independent: false,
    notes: "",
    reviews: [],
    completedReviews: [],
  };
  progress.activate("alice");
  const { result } = renderHook(usePreparation);
  act(() =>
    progress.receive([{ key: "prep/entry/a", value: entry, revision: 1 }]),
  );
  act(() =>
    result.current.update((current) => ({
      ...current,
      entries: [
        ...current.entries,
        { ...current.entries[0], id: "b", title: "Local attempt" },
      ],
    })),
  );
  act(() =>
    progress.receive([
      {
        key: "prep/entry/c",
        value: { ...entry, id: "c", title: "Other device" },
        revision: 1,
      },
    ]),
  );
  expect(result.current.state.entries.map((item) => item.id).sort()).toEqual([
    "a",
    "b",
    "c",
  ]);
  expect(Object.keys(progress.getSnapshot().pending)).toEqual(["prep/entry/b"]);
});
test("practice can resume on its account while a different account starts independently", () => {
  progress.activate("alice");
  const cards = flashcards.slice(0, 1);
  const { result } = renderHook(() => usePracticeSession(cards, "cloud-test"));
  act(() => result.current.reveal());
  act(() => result.current.grade(true));
  expect(result.current.session.index).toBe(1);
  act(() => progress.activate("bob"));
  expect(result.current.session.index).toBe(0);
  act(() => progress.activate("alice"));
  expect(result.current.session.index).toBe(1);
});
