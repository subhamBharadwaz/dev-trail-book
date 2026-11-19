import type { VisualCatalog } from "../types";
export const visuals = {
  "ai-streaming": {
    kind: "walkthrough",
    title: "Partial output is a state, not a finished answer.",
    intro:
      "Compare completion with an intentional stop. These are simulated application text chunks.",
    scenarios: [
      {
        id: "complete",
        label: "Complete response",
        code: [
          "// call your server endpoint; keep provider secrets on the server",
          'const response = await fetch("/api/answer", { signal });',
          "// decode and parse the stream protocol; append application text",
          "// finish, stop intentionally, or show a real failure",
        ],
        steps: [
          {
            title: "Idle",
            detail: "There is no active request and no response yet.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-idle",
                    label: "idle",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [],
              },
            ],
            line: 0,
          },
          {
            title: "Connect",
            detail: "Begin the server request and make cancellation available.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-connecting",
                    label: "connecting",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [],
              },
            ],
            line: 1,
          },
          {
            title: "Receive useful text",
            detail:
              "The UI can display partial text while marking the answer as streaming.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-streaming",
                    label: "streaming",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [
                  {
                    id: "output-0-A closure retains",
                    label: "A closure retains",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "More text arrives",
            detail:
              "Append decoded application text rather than replacing the draft with an unrelated response.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-streaming",
                    label: "streaming",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [
                  {
                    id: "output-0-A closure retains access to lexical bindings.",
                    label: "A closure retains access to lexical bindings.",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "The stream completes",
            detail:
              "Only the completed response enters any final parsing/validation step.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-completed",
                    label: "completed",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [
                  {
                    id: "output-0-A closure retains access to lexical bindings.",
                    label: "A closure retains access to lexical bindings.",
                  },
                ],
              },
            ],
            line: 3,
            result: "Completed answer · validate if structured",
          },
        ],
      },
      {
        id: "stop",
        label: "Stop early",
        code: [
          "// call your server endpoint; keep provider secrets on the server",
          'const response = await fetch("/api/answer", { signal });',
          "// decode and parse the stream protocol; append application text",
          "// finish, stop intentionally, or show a real failure",
        ],
        steps: [
          {
            title: "Idle",
            detail: "There is no active request and no response yet.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-idle",
                    label: "idle",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [],
              },
            ],
            line: 0,
          },
          {
            title: "Connect",
            detail: "Begin the server request and make cancellation available.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-connecting",
                    label: "connecting",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [],
              },
            ],
            line: 1,
          },
          {
            title: "Receive useful text",
            detail:
              "The UI can display partial text while marking the answer as streaming.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-streaming",
                    label: "streaming",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [
                  {
                    id: "output-0-A closure retains",
                    label: "A closure retains",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "More text arrives",
            detail:
              "Append decoded application text rather than replacing the draft with an unrelated response.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-streaming",
                    label: "streaming",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [
                  {
                    id: "output-0-A closure retains access to lexical bindings.",
                    label: "A closure retains access to lexical bindings.",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Stop requested",
            detail:
              "Abort the active request and retain a clearly marked partial answer.",
            panels: [
              {
                id: "state",
                label: "Status",
                tokens: [
                  {
                    id: "state-0-stopped",
                    label: "stopped",
                  },
                ],
              },
              {
                id: "output",
                label: "Visible response",
                tokens: [
                  {
                    id: "output-0-A closure retains access to lexical bindings.",
                    label: "A closure retains access to lexical bindings.",
                  },
                ],
              },
            ],
            line: 3,
            result: "Partial answer · stopped",
          },
        ],
      },
    ],
    takeaway:
      "Real network chunks may split protocol messages or characters. Parse the actual protocol and distinguish stopped, failed, and completed outcomes.",
  },
  "sql-joins": {
    kind: "walkthrough",
    title: "One parent can produce several joined rows.",
    intro:
      "Compare INNER JOIN and LEFT JOIN using the same two notes and two tags.",
    scenarios: [
      {
        id: "inner",
        label: "INNER JOIN",
        code: [
          "SELECT notes.id, notes.title, tags.id",
          "FROM notes INNER JOIN tags ON tags.note_id = notes.id;",
          "-- for counts: GROUP BY note; COUNT(tags.id)",
        ],
        steps: [
          {
            title: "Start with two notes",
            detail:
              "Note 1 has two tags. Note 2 has none. The relationship is one-to-many.",
            panels: [
              {
                id: "notes",
                label: "notes",
                tokens: [
                  {
                    id: "notes-0-id 1: React",
                    label: "id 1: React",
                  },
                  {
                    id: "notes-1-id 2: SQL",
                    label: "id 2: SQL",
                  },
                ],
              },
              {
                id: "tags",
                label: "tags",
                tokens: [
                  {
                    id: "tags-0-note 1: hooks",
                    label: "note 1: hooks",
                  },
                  {
                    id: "tags-1-note 1: state",
                    label: "note 1: state",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Match note 1",
            detail:
              "Each matching child produces an output row, so React appears twice.",
            panels: [
              {
                id: "output",
                label: "Joined rows",
                tokens: [
                  {
                    id: "output-0-1 | React | hooks",
                    label: "1 | React | hooks",
                  },
                  {
                    id: "output-1-1 | React | state",
                    label: "1 | React | state",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Inspect note 2",
            detail:
              "No child matches note 2. INNER JOIN omits this unmatched parent.",
            panels: [
              {
                id: "output",
                label: "Joined rows",
                tokens: [
                  {
                    id: "output-0-1 | React | hooks",
                    label: "1 | React | hooks",
                  },
                  {
                    id: "output-1-1 | React | state",
                    label: "1 | React | state",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Count at the intended level",
            detail:
              "Group by the note before displaying a per-note tag count. The unmatched note is already absent from the joined relation.",
            panels: [
              {
                id: "aggregate",
                label: "COUNT(tag.id)",
                tokens: [
                  {
                    id: "aggregate-0-React → 2",
                    label: "React → 2",
                  },
                ],
              },
            ],
            line: 2,
            result: "1 parent result",
          },
        ],
      },
      {
        id: "left",
        label: "LEFT JOIN",
        code: [
          "SELECT notes.id, notes.title, tags.id",
          "FROM notes LEFT JOIN tags ON tags.note_id = notes.id;",
          "-- for counts: GROUP BY note; COUNT(tags.id)",
        ],
        steps: [
          {
            title: "Start with two notes",
            detail:
              "Note 1 has two tags. Note 2 has none. The relationship is one-to-many.",
            panels: [
              {
                id: "notes",
                label: "notes",
                tokens: [
                  {
                    id: "notes-0-id 1: React",
                    label: "id 1: React",
                  },
                  {
                    id: "notes-1-id 2: SQL",
                    label: "id 2: SQL",
                  },
                ],
              },
              {
                id: "tags",
                label: "tags",
                tokens: [
                  {
                    id: "tags-0-note 1: hooks",
                    label: "note 1: hooks",
                  },
                  {
                    id: "tags-1-note 1: state",
                    label: "note 1: state",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Match note 1",
            detail:
              "Each matching child produces an output row, so React appears twice.",
            panels: [
              {
                id: "output",
                label: "Joined rows",
                tokens: [
                  {
                    id: "output-0-1 | React | hooks",
                    label: "1 | React | hooks",
                  },
                  {
                    id: "output-1-1 | React | state",
                    label: "1 | React | state",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Inspect note 2",
            detail:
              "No child matches note 2. LEFT JOIN keeps a row with NULL tag fields.",
            panels: [
              {
                id: "output",
                label: "Joined rows",
                tokens: [
                  {
                    id: "output-0-1 | React | hooks",
                    label: "1 | React | hooks",
                  },
                  {
                    id: "output-1-1 | React | state",
                    label: "1 | React | state",
                  },
                  {
                    id: "output-2-2 | SQL | NULL",
                    label: "2 | SQL | NULL",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Count at the intended level",
            detail:
              "Group by the note before displaying a per-note tag count. The NULL child contributes zero to COUNT(tag.id).",
            panels: [
              {
                id: "aggregate",
                label: "COUNT(tag.id)",
                tokens: [
                  {
                    id: "aggregate-0-React → 2",
                    label: "React → 2",
                  },
                  {
                    id: "aggregate-1-SQL → 0",
                    label: "SQL → 0",
                  },
                ],
              },
            ],
            line: 2,
            result: "2 parent results",
          },
        ],
      },
    ],
    takeaway:
      "LEFT JOIN preserves unmatched left rows. COUNT(tag.id) ignores their NULL child; COUNT(*) still counts the preserved row.",
    drawing: "sql-relationship",
  },
} satisfies VisualCatalog;
