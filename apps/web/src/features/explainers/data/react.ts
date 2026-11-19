import type { VisualCatalog } from "../types";
export const visuals = {
  "stale-closures": {
    kind: "walkthrough",
    title: "A callback remembers the render that created it.",
    intro: "Compare a captured state value with a functional state updater.",
    scenarios: [
      {
        id: "captured",
        label: "Captured value",
        code: [
          "// render 1: count = 0",
          "setTimeout(() => setCount(count + 1), 300);",
          "setCount(5);",
          "// render 2: count = 5",
          "// old timer fires with count from render 1",
        ],
        steps: [
          {
            title: "Render with count = 0",
            detail: "The handler closes over this render’s count binding.",
            panels: [
              {
                id: "render",
                label: "Current UI",
                tokens: [
                  {
                    id: "render-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "callback",
                label: "Delayed callback",
                tokens: [
                  {
                    id: "callback-0-captured count = 0",
                    label: "captured count = 0",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Schedule the callback",
            detail: "The timer retains the function created by render 1.",
            panels: [
              {
                id: "render",
                label: "Current UI",
                tokens: [
                  {
                    id: "render-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "timer",
                label: "Timer",
                tokens: [
                  {
                    id: "timer-0-setCount(0 + 1) later",
                    label: "setCount(0 + 1) later",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "A separate update sets count to 5",
            detail:
              "React renders a new snapshot, but the older timer still refers to render 1.",
            panels: [
              {
                id: "render",
                label: "Current UI",
                tokens: [
                  {
                    id: "render-0-count = 5",
                    label: "count = 5",
                  },
                ],
              },
              {
                id: "timer",
                label: "Timer",
                tokens: [
                  {
                    id: "timer-0-still captures 0",
                    label: "still captures 0",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "The old timer fires",
            detail:
              "It requests the replacement value 1, so the UI moves from 5 to 1.",
            panels: [
              {
                id: "render",
                label: "Current UI",
                tokens: [
                  {
                    id: "render-0-count = 1",
                    label: "count = 1",
                  },
                ],
              },
            ],
            line: 4,
            result: "5 → 1",
          },
        ],
      },
      {
        id: "updater",
        label: "Functional updater",
        code: [
          "// render 1: count = 0",
          "setTimeout(() => setCount(current => current + 1), 300);",
          "setCount(5);",
          "// render 2: count = 5",
          "// old timer queues an updater",
        ],
        steps: [
          {
            title: "Render with count = 0",
            detail: "The timer’s function still comes from this render.",
            panels: [
              {
                id: "render",
                label: "Current UI",
                tokens: [
                  {
                    id: "render-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Queue an updater for later",
            detail:
              "The function describes a transformation instead of computing a replacement from captured count.",
            panels: [
              {
                id: "timer",
                label: "Timer",
                tokens: [
                  {
                    id: "timer-0-current => current + 1",
                    label: "current => current + 1",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Set count to 5",
            detail: "This independent update commits first in the example.",
            panels: [
              {
                id: "render",
                label: "Current UI",
                tokens: [
                  {
                    id: "render-0-count = 5",
                    label: "count = 5",
                  },
                ],
              },
              {
                id: "timer",
                label: "Timer",
                tokens: [
                  {
                    id: "timer-0-current => current + 1",
                    label: "current => current + 1",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "Apply the updater to current state",
            detail: "React passes the latest state through the queued updater.",
            panels: [
              {
                id: "render",
                label: "Current UI",
                tokens: [
                  {
                    id: "render-0-count = 6",
                    label: "count = 6",
                  },
                ],
              },
            ],
            line: 4,
            result: "5 → 6",
          },
        ],
      },
    ],
    takeaway:
      "Functional updaters solve previous-state calculations. They do not make every captured prop or Effect dependency fresh.",
    source: "https://react.dev/learn/state-as-a-snapshot",
  },
  effects: {
    kind: "walkthrough",
    title: "Start synchronizing. Clean up. Synchronize again.",
    intro:
      "Follow a subscription when roomId changes and the component unmounts.",
    scenarios: [
      {
        id: "subscription",
        label: "Room subscription",
        code: [
          "useEffect(() => {",
          "  const connection = connect(roomId);",
          "  return () => connection.disconnect();",
          "}, [roomId]);",
        ],
        steps: [
          {
            title: "Commit room A",
            detail: "The committed component needs a connection to A.",
            panels: [
              {
                id: "ui",
                label: "Committed prop",
                tokens: [
                  {
                    id: "ui-0-roomId = A",
                    label: "roomId = A",
                  },
                ],
              },
              {
                id: "external",
                label: "External system",
                tokens: [],
              },
            ],
            line: 0,
          },
          {
            title: "Set up A",
            detail:
              "The Effect synchronizes with A and returns its cleanup function.",
            panels: [
              {
                id: "ui",
                label: "Committed prop",
                tokens: [
                  {
                    id: "ui-0-roomId = A",
                    label: "roomId = A",
                  },
                ],
              },
              {
                id: "external",
                label: "External system",
                tokens: [
                  {
                    id: "external-0-A: connected",
                    label: "A: connected",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Commit room B",
            detail:
              "roomId changes. Before the next setup for changed dependencies, React runs the old cleanup.",
            panels: [
              {
                id: "ui",
                label: "Committed prop",
                tokens: [
                  {
                    id: "ui-0-roomId = B",
                    label: "roomId = B",
                  },
                ],
              },
              {
                id: "external",
                label: "External system",
                tokens: [
                  {
                    id: "external-0-A: disconnect",
                    label: "A: disconnect",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Set up B",
            detail:
              "The new Effect closes over B and creates a new connection.",
            panels: [
              {
                id: "ui",
                label: "Committed prop",
                tokens: [
                  {
                    id: "ui-0-roomId = B",
                    label: "roomId = B",
                  },
                ],
              },
              {
                id: "external",
                label: "External system",
                tokens: [
                  {
                    id: "external-0-B: connected",
                    label: "B: connected",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Unmount",
            detail:
              "The last cleanup disconnects B. In development, Strict Mode may also probe setup/cleanup with an extra cycle.",
            panels: [
              {
                id: "ui",
                label: "Component",
                tokens: [
                  {
                    id: "ui-0-unmounted",
                    label: "unmounted",
                  },
                ],
              },
              {
                id: "external",
                label: "External system",
                tokens: [
                  {
                    id: "external-0-B: disconnected",
                    label: "B: disconnected",
                  },
                ],
              },
            ],
            line: 2,
          },
        ],
      },
    ],
    takeaway:
      "Cleanup undoes the previous synchronization. Derive render-only data during render; do not use an Effect just to copy state.",
    source: "https://react.dev/learn/lifecycle-of-reactive-effects",
  },
  "search-abort-races": {
    kind: "walkthrough",
    title: "A newer query must own the results.",
    intro:
      "Compare an unguarded response with cancellation and a stale-result guard.",
    scenarios: [
      {
        id: "race",
        label: "Unguarded race",
        code: [
          '// query A = "re"; query B = "react"',
          'startRequest("re");',
          "// no cancellation or active-query check",
          'startRequest("react");',
          "// B finishes first; A finishes later",
          "setResults(data);",
        ],
        steps: [
          {
            title: "Start the older query",
            detail:
              "Request A starts first, but start order does not determine completion order.",
            panels: [
              {
                id: "network",
                label: "In flight",
                tokens: [
                  {
                    id: "request-a",
                    label: "A: re",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed query",
                tokens: [
                  {
                    id: "ui-0-re",
                    label: "re",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Type a newer query",
            detail: "Request B now represents what the user wants.",
            panels: [
              {
                id: "network",
                label: "In flight",
                tokens: [
                  {
                    id: "request-a",
                    label: "A: re",
                  },
                  {
                    id: "request-b",
                    label: "B: react",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed query",
                tokens: [
                  {
                    id: "ui-0-react",
                    label: "react",
                  },
                ],
              },
              {
                id: "cleanup",
                label: "Cleanup",
                tokens: [
                  {
                    id: "cleanup-0-none",
                    label: "none",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "The newer request finishes first",
            detail:
              "B’s result is relevant to the current query, so it is displayed.",
            panels: [
              {
                id: "network",
                label: "In flight",
                tokens: [
                  {
                    id: "request-a",
                    label: "A: re",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed results",
                tokens: [
                  {
                    id: "request-b",
                    label: "B: react",
                  },
                ],
              },
            ],
            line: 4,
          },
          {
            title: "The obsolete continuation settles",
            detail:
              "A finishes late and overwrites the newer results. Debouncing alone would not fix this race.",
            panels: [
              {
                id: "ui",
                label: "Displayed results",
                tokens: [
                  {
                    id: "request-a",
                    label: "A: re",
                  },
                ],
              },
              {
                id: "guard",
                label: "Decision",
                tokens: [
                  {
                    id: "guard-0-A overwrites B",
                    label: "A overwrites B",
                  },
                ],
              },
            ],
            line: 5,
            result: "Bug: results no longer match the query",
          },
        ],
      },
      {
        id: "guarded",
        label: "Abort + guard",
        code: [
          '// query A = "re"; query B = "react"',
          'startRequest("re");',
          'abortPrevious(); activeQuery = "react";',
          'startRequest("react");',
          "// B finishes first; A finishes later",
          "if (query === activeQuery) setResults(data);",
        ],
        steps: [
          {
            title: "Start the older query",
            detail:
              "Request A starts first, but start order does not determine completion order.",
            panels: [
              {
                id: "network",
                label: "In flight",
                tokens: [
                  {
                    id: "request-a",
                    label: "A: re",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed query",
                tokens: [
                  {
                    id: "ui-0-re",
                    label: "re",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Type a newer query",
            detail: "Request B now represents what the user wants.",
            panels: [
              {
                id: "network",
                label: "In flight",
                tokens: [
                  {
                    id: "request-b",
                    label: "B: react",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed query",
                tokens: [
                  {
                    id: "ui-0-react",
                    label: "react",
                  },
                ],
              },
              {
                id: "cleanup",
                label: "Cleanup",
                tokens: [
                  {
                    id: "cleanup-0-abort A; mark A obsolete",
                    label: "abort A; mark A obsolete",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "The newer request finishes first",
            detail:
              "B’s result is relevant to the current query, so it is displayed.",
            panels: [
              {
                id: "network",
                label: "In flight",
                tokens: [],
              },
              {
                id: "ui",
                label: "Displayed results",
                tokens: [
                  {
                    id: "request-b",
                    label: "B: react",
                  },
                ],
              },
            ],
            line: 4,
          },
          {
            title: "The obsolete continuation settles",
            detail:
              "Abort is expected cleanup. Ignore obsolete data/errors, and do not let A’s finally clear B’s pending state.",
            panels: [
              {
                id: "ui",
                label: "Displayed results",
                tokens: [
                  {
                    id: "request-b",
                    label: "B: react",
                  },
                ],
              },
              {
                id: "guard",
                label: "Decision",
                tokens: [
                  {
                    id: "guard-0-ignore A",
                    label: "ignore A",
                  },
                ],
              },
            ],
            line: 5,
            result: "Correct: react results remain",
          },
        ],
      },
    ],
    takeaway:
      "Debounce schedules requests; abort cancels supported work; an active/version guard protects every continuation, including finally.",
  },
  "rendering-keys": {
    kind: "walkthrough",
    title: "State follows identity, not a row number.",
    intro: "Reorder two editable rows and compare stable IDs with index keys.",
    scenarios: [
      {
        id: "ids",
        label: "Stable IDs",
        code: [
          "items.map((item, index) => <Row key={item.id} item={item} />);",
          "// edit Ada’s local draft",
          "setItems(current => [...current].reverse());",
          "// reconcile siblings, then commit",
        ],
        steps: [
          {
            title: "Render two rows",
            detail: "Ada starts at position 0 and Lin at position 1.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-a",
                    label: 'Ada: draft "Ada"',
                  },
                  {
                    id: "row-b",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
              {
                id: "keys",
                label: "Keys",
                tokens: [
                  {
                    id: "keys-0-a → Ada, b → Lin",
                    label: "a → Ada, b → Lin",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Edit Ada’s local draft",
            detail: "The text Ada! is local state inside Ada’s mounted row.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-a",
                    label: 'Ada: draft "Ada!"',
                  },
                  {
                    id: "row-b",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Reverse the data",
            detail: "The domain items now appear in the opposite order.",
            panels: [
              {
                id: "data",
                label: "New data order",
                tokens: [
                  {
                    id: "data-0-Lin",
                    label: "Lin",
                  },
                  {
                    id: "data-1-Ada",
                    label: "Ada",
                  },
                ],
              },
              {
                id: "keys",
                label: "Matching rule",
                tokens: [
                  {
                    id: "keys-0-match by stable ID",
                    label: "match by stable ID",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Commit the matched row state",
            detail: "State stays with the same logical items.",
            panels: [
              {
                id: "rows",
                label: "Committed rows",
                tokens: [
                  {
                    id: "row-b",
                    label: 'Lin: draft "Lin"',
                  },
                  {
                    id: "row-a",
                    label: 'Ada: draft "Ada!"',
                  },
                ],
              },
            ],
            line: 3,
            result: "Identity preserved",
          },
        ],
      },
      {
        id: "indices",
        label: "Index keys",
        code: [
          "items.map((item, index) => <Row key={index} item={item} />);",
          "// edit Ada’s local draft",
          "setItems(current => [...current].reverse());",
          "// reconcile siblings, then commit",
        ],
        steps: [
          {
            title: "Render two rows",
            detail: "Ada starts at position 0 and Lin at position 1.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-position-0",
                    label: 'Ada: draft "Ada"',
                  },
                  {
                    id: "row-position-1",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
              {
                id: "keys",
                label: "Keys",
                tokens: [
                  {
                    id: "keys-0-0 → Ada, 1 → Lin",
                    label: "0 → Ada, 1 → Lin",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Edit Ada’s local draft",
            detail: "The text Ada! is local state inside Ada’s mounted row.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-position-0",
                    label: 'Ada: draft "Ada!"',
                  },
                  {
                    id: "row-position-1",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Reverse the data",
            detail: "The domain items now appear in the opposite order.",
            panels: [
              {
                id: "data",
                label: "New data order",
                tokens: [
                  {
                    id: "data-0-Lin",
                    label: "Lin",
                  },
                  {
                    id: "data-1-Ada",
                    label: "Ada",
                  },
                ],
              },
              {
                id: "keys",
                label: "Matching rule",
                tokens: [
                  {
                    id: "keys-0-match by position",
                    label: "match by position",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Commit the matched row state",
            detail:
              "React reuses key 0 for Lin, so Lin inherits the local draft that belonged to Ada at that position.",
            panels: [
              {
                id: "rows",
                label: "Committed rows",
                tokens: [
                  {
                    id: "row-position-0",
                    label: 'Lin: draft "Ada!"',
                  },
                  {
                    id: "row-position-1",
                    label: 'Ada: draft "Lin"',
                  },
                ],
              },
            ],
            line: 3,
            result: "Wrong draft follows the position",
          },
        ],
      },
    ],
    takeaway:
      "Keys match siblings between renders. A stable domain ID preserves each row’s state; changing a key intentionally resets its subtree.",
    source: "https://react.dev/learn/preserving-and-resetting-state",
  },
  "react-render-debugging": {
    kind: "walkthrough",
    title: "Inspect identity before adding memoization.",
    intro:
      "Use a reorder to see whether local state follows the intended component.",
    scenarios: [
      {
        id: "ids",
        label: "Stable IDs",
        code: [
          "items.map((item, index) => <Row key={item.id} item={item} />);",
          "// edit Ada’s local draft",
          "setItems(current => [...current].reverse());",
          "// reconcile siblings, then commit",
        ],
        steps: [
          {
            title: "Render two rows",
            detail: "Ada starts at position 0 and Lin at position 1.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-a",
                    label: 'Ada: draft "Ada"',
                  },
                  {
                    id: "row-b",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
              {
                id: "keys",
                label: "Keys",
                tokens: [
                  {
                    id: "keys-0-a → Ada, b → Lin",
                    label: "a → Ada, b → Lin",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Edit Ada’s local draft",
            detail: "The text Ada! is local state inside Ada’s mounted row.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-a",
                    label: 'Ada: draft "Ada!"',
                  },
                  {
                    id: "row-b",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Reverse the data",
            detail: "The domain items now appear in the opposite order.",
            panels: [
              {
                id: "data",
                label: "New data order",
                tokens: [
                  {
                    id: "data-0-Lin",
                    label: "Lin",
                  },
                  {
                    id: "data-1-Ada",
                    label: "Ada",
                  },
                ],
              },
              {
                id: "keys",
                label: "Matching rule",
                tokens: [
                  {
                    id: "keys-0-match by stable ID",
                    label: "match by stable ID",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Commit the matched row state",
            detail: "State stays with the same logical items.",
            panels: [
              {
                id: "rows",
                label: "Committed rows",
                tokens: [
                  {
                    id: "row-b",
                    label: 'Lin: draft "Lin"',
                  },
                  {
                    id: "row-a",
                    label: 'Ada: draft "Ada!"',
                  },
                ],
              },
            ],
            line: 3,
            result: "Identity preserved",
          },
        ],
      },
      {
        id: "indices",
        label: "Index keys",
        code: [
          "items.map((item, index) => <Row key={index} item={item} />);",
          "// edit Ada’s local draft",
          "setItems(current => [...current].reverse());",
          "// reconcile siblings, then commit",
        ],
        steps: [
          {
            title: "Render two rows",
            detail: "Ada starts at position 0 and Lin at position 1.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-position-0",
                    label: 'Ada: draft "Ada"',
                  },
                  {
                    id: "row-position-1",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
              {
                id: "keys",
                label: "Keys",
                tokens: [
                  {
                    id: "keys-0-0 → Ada, 1 → Lin",
                    label: "0 → Ada, 1 → Lin",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Edit Ada’s local draft",
            detail: "The text Ada! is local state inside Ada’s mounted row.",
            panels: [
              {
                id: "rows",
                label: "Rows",
                tokens: [
                  {
                    id: "row-position-0",
                    label: 'Ada: draft "Ada!"',
                  },
                  {
                    id: "row-position-1",
                    label: 'Lin: draft "Lin"',
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Reverse the data",
            detail: "The domain items now appear in the opposite order.",
            panels: [
              {
                id: "data",
                label: "New data order",
                tokens: [
                  {
                    id: "data-0-Lin",
                    label: "Lin",
                  },
                  {
                    id: "data-1-Ada",
                    label: "Ada",
                  },
                ],
              },
              {
                id: "keys",
                label: "Matching rule",
                tokens: [
                  {
                    id: "keys-0-match by position",
                    label: "match by position",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Commit the matched row state",
            detail:
              "React reuses key 0 for Lin, so Lin inherits the local draft that belonged to Ada at that position.",
            panels: [
              {
                id: "rows",
                label: "Committed rows",
                tokens: [
                  {
                    id: "row-position-0",
                    label: 'Lin: draft "Ada!"',
                  },
                  {
                    id: "row-position-1",
                    label: 'Ada: draft "Lin"',
                  },
                ],
              },
            ],
            line: 3,
            result: "Wrong draft follows the position",
          },
        ],
      },
    ],
    takeaway:
      "Keys match siblings between renders. A stable domain ID preserves each row’s state; changing a key intentionally resets its subtree.",
    source: "https://react.dev/learn/preserving-and-resetting-state",
  },
  "optimistic-forms": {
    kind: "walkthrough",
    title: "Show the prediction, then reconcile with the server.",
    intro:
      "This model covers one isolated optimistic write. Compare confirmation and rollback.",
    scenarios: [
      {
        id: "success",
        label: "Server confirms",
        code: [
          "const previous = confirmedTitle;",
          "showOptimistic(draft);",
          "const outcome = await save(draft);",
          "// confirm on success; restore this operation on failure",
        ],
        steps: [
          {
            title: "Before submission",
            detail:
              "The server-confirmed title is Old. The user has typed New.",
            panels: [
              {
                id: "saved",
                label: "Confirmed value",
                tokens: [
                  {
                    id: "saved-0-Old",
                    label: "Old",
                  },
                ],
              },
              {
                id: "draft",
                label: "User draft",
                tokens: [
                  {
                    id: "draft-0-New",
                    label: "New",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Apply the optimistic value",
            detail:
              "The UI predicts success and marks this operation pending. It is not yet confirmed.",
            panels: [
              {
                id: "ui",
                label: "Displayed title",
                tokens: [
                  {
                    id: "ui-0-New · pending",
                    label: "New · pending",
                  },
                ],
              },
              {
                id: "request",
                label: "Request",
                tokens: [
                  {
                    id: "request-0-save New: in flight",
                    label: "save New: in flight",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Receive the server outcome",
            detail: "The server confirms New.",
            panels: [
              {
                id: "request",
                label: "Outcome",
                tokens: [
                  {
                    id: "request-0-confirmed New",
                    label: "confirmed New",
                  },
                ],
              },
              {
                id: "draft",
                label: "User draft",
                tokens: [
                  {
                    id: "draft-0-New",
                    label: "New",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Reconcile the UI",
            detail:
              "Replace the optimistic representation with authoritative data.",
            panels: [
              {
                id: "ui",
                label: "Displayed title",
                tokens: [
                  {
                    id: "ui-0-New · saved",
                    label: "New · saved",
                  },
                ],
              },
              {
                id: "draft",
                label: "User draft",
                tokens: [
                  {
                    id: "draft-0-New",
                    label: "New",
                  },
                ],
              },
            ],
            line: 3,
            result: "Saved",
          },
        ],
      },
      {
        id: "failure",
        label: "Save fails",
        code: [
          "const previous = confirmedTitle;",
          "showOptimistic(draft);",
          "const outcome = await save(draft);",
          "// confirm on success; restore this operation on failure",
        ],
        steps: [
          {
            title: "Before submission",
            detail:
              "The server-confirmed title is Old. The user has typed New.",
            panels: [
              {
                id: "saved",
                label: "Confirmed value",
                tokens: [
                  {
                    id: "saved-0-Old",
                    label: "Old",
                  },
                ],
              },
              {
                id: "draft",
                label: "User draft",
                tokens: [
                  {
                    id: "draft-0-New",
                    label: "New",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Apply the optimistic value",
            detail:
              "The UI predicts success and marks this operation pending. It is not yet confirmed.",
            panels: [
              {
                id: "ui",
                label: "Displayed title",
                tokens: [
                  {
                    id: "ui-0-New · pending",
                    label: "New · pending",
                  },
                ],
              },
              {
                id: "request",
                label: "Request",
                tokens: [
                  {
                    id: "request-0-save New: in flight",
                    label: "save New: in flight",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Receive the server outcome",
            detail: "The save fails. Preserve the input so the user can retry.",
            panels: [
              {
                id: "request",
                label: "Outcome",
                tokens: [
                  {
                    id: "request-0-failed: offline",
                    label: "failed: offline",
                  },
                ],
              },
              {
                id: "draft",
                label: "User draft",
                tokens: [
                  {
                    id: "draft-0-New",
                    label: "New",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Reconcile the UI",
            detail:
              "Restore Old for this isolated operation; keep New in the draft with a visible retry path.",
            panels: [
              {
                id: "ui",
                label: "Displayed title",
                tokens: [
                  {
                    id: "ui-0-Old · save failed",
                    label: "Old · save failed",
                  },
                ],
              },
              {
                id: "draft",
                label: "User draft",
                tokens: [
                  {
                    id: "draft-0-New",
                    label: "New",
                  },
                ],
              },
            ],
            line: 3,
            result: "Draft retained; retry available",
          },
        ],
      },
    ],
    takeaway:
      "Keep the draft on failure. Concurrent writes need per-operation tracking; rolling back one global snapshot can erase a different successful write.",
  },
  "controlled-inputs": {
    kind: "walkthrough",
    title: "The DOM edit reports back to the state owner.",
    intro: "Trace one keystroke through a controlled input.",
    scenarios: [
      {
        id: "controlled",
        label: "Controlled edit",
        code: [
          'const [name, setName] = useState("");',
          "<input value={name}",
          "  onChange={event => setName(event.target.value)} />",
        ],
        steps: [
          {
            title: "Render the initial value",
            detail:
              "State owns the input’s value. Starting with an empty string keeps it controlled.",
            panels: [
              {
                id: "state",
                label: "React state",
                tokens: [
                  {
                    id: 'state-0-name = ""',
                    label: 'name = ""',
                  },
                ],
              },
              {
                id: "dom",
                label: "Input",
                tokens: [
                  {
                    id: 'dom-0-value = ""',
                    label: 'value = ""',
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "The user types A",
            detail: "The browser reports the edited value in an input event.",
            panels: [
              {
                id: "event",
                label: "Change event",
                tokens: [
                  {
                    id: 'event-0-target.value = "A"',
                    label: 'target.value = "A"',
                  },
                ],
              },
              {
                id: "state",
                label: "React state",
                tokens: [
                  {
                    id: 'state-0-name = ""',
                    label: 'name = ""',
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Queue the state update",
            detail:
              "The handler requests name = A. The current handler’s state binding does not change in place.",
            panels: [
              {
                id: "update",
                label: "Queued update",
                tokens: [
                  {
                    id: 'update-0-setName("A")',
                    label: 'setName("A")',
                  },
                ],
              },
              {
                id: "state",
                label: "Current render snapshot",
                tokens: [
                  {
                    id: 'state-0-name = ""',
                    label: 'name = ""',
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Render and commit the new value",
            detail:
              "React supplies the updated state as value, keeping the input and state in sync.",
            panels: [
              {
                id: "state",
                label: "React state",
                tokens: [
                  {
                    id: 'state-0-name = "A"',
                    label: 'name = "A"',
                  },
                ],
              },
              {
                id: "dom",
                label: "Input",
                tokens: [
                  {
                    id: 'dom-0-value = "A"',
                    label: 'value = "A"',
                  },
                ],
              },
            ],
            line: 1,
            result: "State → value; event → state",
          },
        ],
      },
    ],
    takeaway:
      "A controlled input needs a synchronous change handler. Browser validation is useful feedback but does not replace server validation.",
  },
  "thinking-in-react": {
    kind: "walkthrough",
    title: "Own the query once. Derive the visible list.",
    intro: "Watch a shared parent pass data to its input and list.",
    scenarios: [
      {
        id: "filter",
        label: "Filter topics",
        code: [
          'const [query, setQuery] = useState("");',
          "const visible = topics.filter(t => t.title.includes(query));",
          "return <><Search query={query} onChange={setQuery} /><List topics={visible} /></>;",
        ],
        steps: [
          {
            title: "One common owner",
            detail:
              "The parent owns query. Both children receive what they need through props.",
            panels: [
              {
                id: "parent",
                label: "Parent state",
                tokens: [
                  {
                    id: 'parent-0-query = ""',
                    label: 'query = ""',
                  },
                ],
              },
              {
                id: "list",
                label: "Visible topics",
                tokens: [
                  {
                    id: "list-0-React",
                    label: "React",
                  },
                  {
                    id: "list-1-SQL",
                    label: "SQL",
                  },
                  {
                    id: "list-2-CSS",
                    label: "CSS",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "A child reports an edit",
            detail:
              "Search calls onChange with React. It does not directly modify the List child.",
            panels: [
              {
                id: "event",
                label: "Child event",
                tokens: [
                  {
                    id: 'event-0-onChange("React")',
                    label: 'onChange("React")',
                  },
                ],
              },
              {
                id: "parent",
                label: "Parent state",
                tokens: [
                  {
                    id: 'parent-0-query = ""',
                    label: 'query = ""',
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Render with the new query",
            detail:
              "Compute visible from topics and query. A second state variable for visible is unnecessary.",
            panels: [
              {
                id: "parent",
                label: "Parent state",
                tokens: [
                  {
                    id: 'parent-0-query = "React"',
                    label: 'query = "React"',
                  },
                ],
              },
              {
                id: "derived",
                label: "Derived data",
                tokens: [
                  {
                    id: "derived-0-[React]",
                    label: "[React]",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Commit the filtered list",
            detail:
              "Data flows down to List; the original topics remain unchanged.",
            panels: [
              {
                id: "list",
                label: "Visible topics",
                tokens: [
                  {
                    id: "list-0-React",
                    label: "React",
                  },
                ],
              },
              {
                id: "source",
                label: "Original data",
                tokens: [
                  {
                    id: "source-0-React",
                    label: "React",
                  },
                  {
                    id: "source-1-SQL",
                    label: "SQL",
                  },
                  {
                    id: "source-2-CSS",
                    label: "CSS",
                  },
                ],
              },
            ],
            line: 2,
            result: "One source of truth",
          },
        ],
      },
    ],
    takeaway:
      "Lift shared state to the nearest common owner, not automatically to global context. Derive values that can be calculated.",
  },
  "reducers-context-refs": {
    kind: "walkthrough",
    title: "An action updates state; a ref write does not render.",
    intro: "Contrast a reducer transition with an imperative timer reference.",
    scenarios: [
      {
        id: "state-ref",
        label: "Reducer vs ref",
        code: [
          "const [state, dispatch] = useReducer(reducer, { count: 0 });",
          "const timerRef = useRef(null);",
          "timerRef.current = 42;",
          'dispatch({ type: "increment" });',
        ],
        steps: [
          {
            title: "Initial render",
            detail:
              "Reducer state participates in rendering. The ref object persists across renders.",
            panels: [
              {
                id: "state",
                label: "Reducer state",
                tokens: [
                  {
                    id: "state-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "ref",
                label: "Mutable ref",
                tokens: [
                  {
                    id: "ref-0-current = null",
                    label: "current = null",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed count",
                tokens: [
                  {
                    id: "ui-0-0",
                    label: "0",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Assign the ref",
            detail: "Storing a timer handle does not request a render.",
            panels: [
              {
                id: "state",
                label: "Reducer state",
                tokens: [
                  {
                    id: "state-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "ref",
                label: "Mutable ref",
                tokens: [
                  {
                    id: "ref-0-current = 42",
                    label: "current = 42",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed count",
                tokens: [
                  {
                    id: "ui-0-0",
                    label: "0",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Dispatch an action",
            detail:
              "A pure reducer computes the next state from the previous state and the increment action.",
            panels: [
              {
                id: "reducer",
                label: "Transition",
                tokens: [
                  {
                    id: "reducer-0-{count:0} + increment → {count:1}",
                    label: "{count:0} + increment → {count:1}",
                  },
                ],
              },
              {
                id: "ref",
                label: "Mutable ref",
                tokens: [
                  {
                    id: "ref-0-current = 42",
                    label: "current = 42",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "Render the new state",
            detail:
              "The displayed count changes. Context could distribute this state, but context does not replace the reducer or make ref writes reactive.",
            panels: [
              {
                id: "state",
                label: "Reducer state",
                tokens: [
                  {
                    id: "state-0-count = 1",
                    label: "count = 1",
                  },
                ],
              },
              {
                id: "ui",
                label: "Displayed count",
                tokens: [
                  {
                    id: "ui-0-1",
                    label: "1",
                  },
                ],
              },
              {
                id: "ref",
                label: "Mutable ref",
                tokens: [
                  {
                    id: "ref-0-current = 42",
                    label: "current = 42",
                  },
                ],
              },
            ],
            line: 3,
          },
        ],
      },
    ],
    takeaway:
      "Reducers describe transitions, context distributes values, and refs store imperative information. Choose each tool for its own role.",
  },
  "streaming-suspense": {
    kind: "walkthrough",
    title: "Reveal one section without waiting for every section.",
    intro:
      "A slow activity section sits behind a meaningful Suspense boundary.",
    scenarios: [
      {
        id: "stream",
        label: "Independent reveal",
        code: [
          "<main>",
          "  <h1>Your journal</h1>",
          "  <Suspense fallback={<ActivitySkeleton />}>",
          "    <RecentActivity />",
          "  </Suspense>",
          "</main>",
        ],
        steps: [
          {
            title: "Start the route",
            detail:
              "The route begins work. RecentActivity waits for its data in a compatible streaming framework.",
            panels: [
              {
                id: "server",
                label: "Server work",
                tokens: [
                  {
                    id: "server-0-activity: pending",
                    label: "activity: pending",
                  },
                ],
              },
              {
                id: "browser",
                label: "Browser",
                tokens: [],
              },
            ],
            line: 0,
          },
          {
            title: "Send the available shell",
            detail:
              "The heading and fallback can be shown while the activity section is still pending.",
            panels: [
              {
                id: "server",
                label: "Server work",
                tokens: [
                  {
                    id: "server-0-activity: pending",
                    label: "activity: pending",
                  },
                ],
              },
              {
                id: "browser",
                label: "Visible UI",
                tokens: [
                  {
                    id: "browser-0-Your journal",
                    label: "Your journal",
                  },
                  {
                    id: "browser-1-ActivitySkeleton",
                    label: "ActivitySkeleton",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "The activity data resolves",
            detail:
              "The underlying data source finishes. Suspense did not make that source faster.",
            panels: [
              {
                id: "server",
                label: "Server work",
                tokens: [
                  {
                    id: "server-0-activity: ready",
                    label: "activity: ready",
                  },
                ],
              },
              {
                id: "browser",
                label: "Visible UI",
                tokens: [
                  {
                    id: "browser-0-Your journal",
                    label: "Your journal",
                  },
                  {
                    id: "browser-1-ActivitySkeleton",
                    label: "ActivitySkeleton",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "Reveal the activity section",
            detail:
              "The completed section replaces its fallback without discarding the surrounding route.",
            panels: [
              {
                id: "browser",
                label: "Visible UI",
                tokens: [
                  {
                    id: "browser-0-Your journal",
                    label: "Your journal",
                  },
                  {
                    id: "browser-1-Recent activity: 3 entries",
                    label: "Recent activity: 3 entries",
                  },
                ],
              },
            ],
            line: 3,
            result: "Shell first; section when ready",
          },
        ],
      },
    ],
    takeaway:
      "A boundary defines what may reveal independently. It does not automatically parallelize requests or make unsupported data fetching suspend.",
  },
} satisfies VisualCatalog;
