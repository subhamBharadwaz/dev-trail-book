export interface InterviewPrompt {
  id: string;
  kind: "technical" | "coding" | "behavioral";
  question: string;
  reference: string;
  criteria: string[];
  topicSlug: string;
  topicTitle: string;
  category: string;
}
export const codingPrompts: InterviewPrompt[] = [
  {
    id: "code-search",
    kind: "coding",
    category: "react",
    topicSlug: "search-abort-races",
    topicTitle: "Search races",
    question:
      "Build a React search component that fetches results as the query changes. Handle loading, empty results, errors, and responses that arrive out of order. Write code and explain how you would test it.",
    reference:
      "Keep query and request state separate. Start the request in an Effect keyed by query, pass an AbortController signal to fetch, and abort during cleanup. Ignore results from obsolete requests. Check response.ok, distinguish abort from failure, and render clear loading, empty, and error states. Debouncing can reduce requests but does not prevent response races by itself.",
    criteria: [
      "Prevents stale results and cleans up on unmount",
      "Handles HTTP failures and distinguishes cancellation",
      "Tests delayed responses, empty input, and unmount",
    ],
  },
  {
    id: "code-debounce",
    kind: "coding",
    category: "javascript",
    topicSlug: "closures",
    topicTitle: "Closures",
    question:
      "Implement debounce(fn, delay) in JavaScript, preserving the latest arguments and call-site this. Add a cancel method. Explain the closure and show tests for repeated calls and cancellation.",
    reference:
      "Keep one timer in the returned function's closure. Clear the previous timer on each call, capture the current receiver and arguments, and schedule fn.apply(receiver, args). cancel clears the timer and any retained arguments. Use fake timers to test that only the final call runs, that arguments and receiver are preserved, and that cancellation prevents invocation.",
    criteria: [
      "Uses a stable closure and clears the previous timer",
      "Preserves arguments and this",
      "Tests cancellation and repeated calls",
    ],
  },
  {
    id: "code-types",
    kind: "coding",
    category: "typescript",
    topicSlug: "discriminated-unions",
    topicTitle: "Discriminated unions",
    question:
      "Model idle, loading, success, and error states for a request in TypeScript. Implement a renderer that handles every state and a parser that validates an unknown API response before success.",
    reference:
      "Use a discriminated union with a status field, putting data only on success and an error message only on error. Narrow using a switch and an exhaustive never check. Treat external JSON as unknown and validate object shape and field types at runtime before returning typed data; an assertion alone does not validate anything.",
    criteria: [
      "Makes invalid state combinations unrepresentable",
      "Handles states exhaustively",
      "Validates unknown values without unsafe assertions",
    ],
  },
  {
    id: "code-two-sum",
    kind: "coding",
    category: "dsa",
    topicSlug: "two-sum-hashmap",
    topicTitle: "Two Sum",
    question:
      "Given an array of integers and a target, return two distinct indices whose values add to the target, or null. Implement an O(n) solution. Walk through duplicates, negative values, and a no-solution case.",
    reference:
      "Scan once with a Map from value to a previously seen index. Before storing the current value, look up target - value. If present, return the previous index and current index. Looking up before inserting avoids using the same item twice. Time is O(n) expected and additional space O(n). For [3,3] and 6, return [0,1]; for [1,2] and 9, return null.",
    criteria: [
      "Uses two distinct indices and handles duplicates",
      "Explains time and space complexity",
      "Tests no match, negatives, and an empty array",
    ],
  },
  {
    id: "code-form",
    kind: "coding",
    category: "web",
    topicSlug: "accessible-ui",
    topicTitle: "Accessible forms",
    question:
      "Build an accessible sign-up form with email and password fields, inline validation, and an asynchronous submit. Explain keyboard behavior, duplicate submissions, and how you would test it.",
    reference:
      "Use a semantic form, visible labels, appropriate input types and autocomplete, and a submit button. Associate error messages with their fields and expose invalid state. Validate on submit, focus the first invalid field, and retain entered values after a failure. Prevent duplicate in-flight submissions, announce success or errors, and never render an account password back to the page.",
    criteria: [
      "Labels, errors, and focus work with a keyboard",
      "Prevents duplicate submissions and retains input on error",
      "Tests invalid input, network failure, and successful submit",
    ],
  },
  {
    id: "code-list",
    kind: "coding",
    category: "react",
    topicSlug: "rendering-keys",
    topicTitle: "List identity",
    question:
      "Implement an editable task list with add, remove, and reorder actions. Preserve each task's input state when rows move. Explain your keys, state ownership, and a regression test.",
    reference:
      "Give each task a stable id when it is created and use that id as the React key. Update the task array immutably and address edits and removal by id. Avoid array-index or generated-on-render keys. A regression test edits a task, reorders the list, and verifies that the edited value still belongs to the same task.",
    criteria: [
      "Uses stable ids across edits and reordering",
      "Keeps state in the appropriate owner",
      "Tests input identity after reordering",
    ],
  },
];
export const behavioralPrompts: InterviewPrompt[] = [
  {
    id: "behavior-bug",
    kind: "behavioral",
    category: "behavioral",
    topicSlug: "",
    topicTitle: "Debugging story",
    question:
      "Tell me about a difficult bug you investigated. How did you narrow it down, prove the cause, and prevent it from returning?",
    reference:
      "Use a real example: situation, your responsibility, evidence you collected, the hypothesis you tested, the fix, and the outcome. Distinguish your actions from the team's. Explain a regression test or monitoring improvement and what you would change next time. Do not invent metrics.",
    criteria: [
      "Gives a specific real example and personal contribution",
      "Explains investigation with evidence",
      "Describes outcome, prevention, and learning",
    ],
  },
  {
    id: "behavior-tradeoff",
    kind: "behavioral",
    category: "behavioral",
    topicSlug: "",
    topicTitle: "Engineering trade-offs",
    question:
      "Describe a time you chose a simpler implementation under a deadline. What did you leave out, how did you communicate the risk, and what happened?",
    reference:
      "Name the constraint, alternatives, trade-off, and the decision you owned. Explain the minimum quality bar, how you communicated scope and risks, and what evidence showed the choice was appropriate. Include a follow-up plan rather than claiming there was no downside.",
    criteria: [
      "Names a concrete constraint and alternatives",
      "Explains communication and ownership",
      "Acknowledges trade-offs and follow-up",
    ],
  },
  {
    id: "behavior-feedback",
    kind: "behavioral",
    category: "behavioral",
    topicSlug: "",
    topicTitle: "Feedback and collaboration",
    question:
      "Tell me about feedback on your code that changed your approach. How did you respond, resolve disagreement, and apply what you learned?",
    reference:
      "Choose a real review. Explain your initial reasoning, what feedback revealed, how you clarified the issue respectfully, and what changed in the implementation. Describe the lesson and a later example where you applied it.",
    criteria: [
      "Shows openness without losing technical judgment",
      "Explains how disagreement was resolved",
      "Connects feedback to a concrete improvement",
    ],
  },
  {
    id: "behavior-project",
    kind: "behavioral",
    category: "behavioral",
    topicSlug: "",
    topicTitle: "Project ownership",
    question:
      "Walk me through a project you built. Who was it for, which decisions did you own, and how did you know it worked? What would you improve now?",
    reference:
      "Explain the user's problem before the stack. Describe your architecture and one difficult decision, show how you validated real behavior, and separate completed functionality from future plans. Name a meaningful limitation and a practical next improvement.",
    criteria: [
      "Connects the project to a user need",
      "Explains decisions and personal ownership",
      "Supports claims with tests or user feedback",
    ],
  },
];
