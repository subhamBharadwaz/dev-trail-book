export type Lane = "stack" | "browser" | "microtasks" | "tasks";
export type Phase = "ready" | "sync" | "microtasks" | "tasks" | "done";
export interface Frame {
  id: string;
  label: string;
}
export interface TraceStep {
  title: string;
  detail: string;
  line: number | null;
  phase: Phase;
  stack: Frame[];
  browser: Frame[];
  microtasks: Frame[];
  tasks: Frame[];
  output: string[];
}
export const source = [
  'console.log("A");',
  'setTimeout(() => console.log("timer"), 0);',
  'Promise.resolve().then(() => console.log("promise"));',
  'queueMicrotask(() => console.log("microtask"));',
  'console.log("B");',
];
const script = { id: "script", label: "script" };
const timer = { id: "timer", label: "timer callback" };
const promise = { id: "promise", label: "promise callback" };
const microtask = { id: "microtask", label: "microtask callback" };
const log = (label: string): Frame => ({
  id: `log-${label}`,
  label: `console.log("${label}")`,
});
const steps: TraceStep[] = [];
function step(title: string, detail: string, changes: Partial<TraceStep> = {}) {
  const previous = steps.at(-1) ?? {
    line: null,
    phase: "ready",
    stack: [],
    browser: [],
    microtasks: [],
    tasks: [],
    output: [],
  };
  steps.push({ ...previous, title, detail, ...changes });
}
step(
  "Ready when you are.",
  "Predict the console order, then press Next step. This is a guided browser trace, not a JavaScript interpreter.",
);
step(
  "The script takes the stack.",
  "The initial script runs as part of a task. Queued callbacks cannot interrupt its synchronous code.",
  { phase: "sync", line: 0, stack: [script] },
);
step(
  "A is printed immediately.",
  "console.log runs synchronously on top of the script’s frame, then returns.",
  { stack: [script, log("A")], output: ["A"] },
);
step(
  "A timer is registered.",
  "setTimeout asks the browser to schedule a callback after a delay threshold. Zero milliseconds does not mean ‘run now’.",
  { line: 1, stack: [script], browser: [timer] },
);
step(
  "The promise reaction joins a queue.",
  "This promise is already fulfilled. Calling .then queues its reaction as a microtask; the callback does not run inline.",
  { line: 2, microtasks: [promise] },
);
step(
  "Another microtask joins behind it.",
  "queueMicrotask adds its callback to the same FIFO microtask queue. The promise reaction was queued first.",
  { line: 3, microtasks: [promise, microtask] },
);
step(
  "B still runs before either callback.",
  "Synchronous work continues. Scheduling a callback never made the current script wait.",
  { line: 4, stack: [script, log("B")], output: ["A", "B"] },
);
step(
  "The script finishes.",
  "Its frame leaves the stack. At the microtask checkpoint, the browser drains microtasks before selecting another task.",
  { line: null, stack: [], phase: "microtasks" },
);
step(
  "The timer is ready, but must wait.",
  "For this trace, we now show the timer task becoming runnable. It could become ready earlier or later in a real browser; it still cannot jump ahead of this microtask checkpoint.",
  { browser: [], tasks: [timer] },
);
step(
  "The promise callback takes the stack.",
  "The first microtask is removed from its queue and executed. The timer remains waiting in the task queue.",
  { line: 2, microtasks: [microtask], stack: [promise] },
);
step(
  "promise is printed.",
  "console.log runs inside the promise reaction, producing the third console entry.",
  { stack: [promise, log("promise")], output: ["A", "B", "promise"] },
);
step(
  "That callback returns.",
  "An empty stack does not mean ‘run the timer’. There is still a microtask to drain.",
  { line: null, stack: [] },
);
step(
  "The next microtask takes the stack.",
  "The queueMicrotask callback is dequeued next. Microtasks added by microtasks would also run before this checkpoint ends.",
  { line: 3, microtasks: [], stack: [microtask] },
);
step(
  "microtask is printed.",
  "The fourth console entry appears. The timer has still not executed.",
  {
    stack: [microtask, log("microtask")],
    output: ["A", "B", "promise", "microtask"],
  },
);
step(
  "The microtask queue is drained.",
  "The checkpoint can finish. The browser may have a rendering opportunity before selecting the next task; a paint is not guaranteed on every turn.",
  { line: null, stack: [] },
);
step(
  "Now the timer can run.",
  "The browser selects the ready timer task. Its callback gets a fresh execution frame.",
  { phase: "tasks", line: 1, tasks: [], stack: [timer] },
);
step(
  "timer is printed last.",
  "Its callback logs only after the script and this script’s queued microtasks have finished.",
  {
    stack: [timer, log("timer")],
    output: ["A", "B", "promise", "microtask", "timer"],
  },
);
step(
  "One order. Three kinds of work.",
  "Synchronous code first, then this checkpoint’s microtasks, then the timer task. Browser task sources and Node.js scheduling have further rules beyond this small example.",
  { phase: "done", line: null, stack: [] },
);
export const trace: readonly TraceStep[] = steps;
