import type { VisualCatalog } from "../types";
export const visuals = {
  closures: {
    kind: "walkthrough",
    title: "The outer call ends. The binding remains reachable.",
    intro: "Follow a returned function back to the environment it closes over.",
    scenarios: [
      {
        id: "retained",
        label: "Retained binding",
        code: [
          "function createCounter() {",
          "  let count = 0;",
          "  return () => ++count;",
          "}",
          "const a = createCounter();",
          "a(); a(); a();",
        ],
        steps: [
          {
            title: "Create an environment",
            detail:
              "Calling the factory creates a fresh lexical binding named count.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "refs",
                label: "Returned functions",
                tokens: [],
              },
            ],
            line: 1,
          },
          {
            title: "Return a function, retain access",
            detail:
              "The factory returns. The inner function still references the environment; it does not copy count into a disconnected snapshot.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "refs",
                label: "Returned functions",
                tokens: [
                  {
                    id: "refs-0-a → environment A",
                    label: "a → environment A",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Call a once",
            detail: "The function reads and updates the same retained binding.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 1",
                    label: "count = 1",
                  },
                ],
              },
              {
                id: "out",
                label: "Return values",
                tokens: [
                  {
                    id: "out-0-1",
                    label: "1",
                  },
                ],
              },
            ],
            line: 5,
          },
          {
            title: "Call a again",
            detail:
              "This is the same closure and the same environment, so the count continues.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 2",
                    label: "count = 2",
                  },
                ],
              },
              {
                id: "out",
                label: "Return values",
                tokens: [
                  {
                    id: "out-0-1",
                    label: "1",
                  },
                  {
                    id: "out-1-2",
                    label: "2",
                  },
                ],
              },
            ],
            line: 5,
          },
          {
            title: "Call a a third time",
            detail:
              "The closure retains access for as long as it remains reachable.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 3",
                    label: "count = 3",
                  },
                ],
              },
              {
                id: "out",
                label: "Return values",
                tokens: [
                  {
                    id: "out-0-1",
                    label: "1",
                  },
                  {
                    id: "out-1-2",
                    label: "2",
                  },
                  {
                    id: "out-2-3",
                    label: "3",
                  },
                ],
              },
            ],
            line: 5,
            result: "1 → 2 → 3",
          },
        ],
      },
      {
        id: "independent",
        label: "Independent counters",
        code: [
          "function createCounter() {",
          "  let count = 0;",
          "  return () => ++count;",
          "}",
          "const a = createCounter();",
          "a(); a();",
          "const b = createCounter();",
          "b();",
        ],
        steps: [
          {
            title: "Create an environment",
            detail:
              "Calling the factory creates a fresh lexical binding named count.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "refs",
                label: "Returned functions",
                tokens: [],
              },
            ],
            line: 1,
          },
          {
            title: "Return a function, retain access",
            detail:
              "The factory returns. The inner function still references the environment; it does not copy count into a disconnected snapshot.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "refs",
                label: "Returned functions",
                tokens: [
                  {
                    id: "refs-0-a → environment A",
                    label: "a → environment A",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Call a once",
            detail: "The function reads and updates the same retained binding.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 1",
                    label: "count = 1",
                  },
                ],
              },
              {
                id: "out",
                label: "Return values",
                tokens: [
                  {
                    id: "out-0-1",
                    label: "1",
                  },
                ],
              },
            ],
            line: 5,
          },
          {
            title: "Call a again",
            detail:
              "This is the same closure and the same environment, so the count continues.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 2",
                    label: "count = 2",
                  },
                ],
              },
              {
                id: "out",
                label: "Return values",
                tokens: [
                  {
                    id: "out-0-1",
                    label: "1",
                  },
                  {
                    id: "out-1-2",
                    label: "2",
                  },
                ],
              },
            ],
            line: 5,
          },
          {
            title: "Create counter B",
            detail:
              "Another factory call creates an independent environment with its own count.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 2",
                    label: "count = 2",
                  },
                ],
              },
              {
                id: "b",
                label: "Counter B environment",
                tokens: [
                  {
                    id: "b-0-count = 0",
                    label: "count = 0",
                  },
                ],
              },
              {
                id: "refs",
                label: "Returned functions",
                tokens: [
                  {
                    id: "refs-0-a → A",
                    label: "a → A",
                  },
                  {
                    id: "refs-1-b → B",
                    label: "b → B",
                  },
                ],
              },
            ],
            line: 6,
          },
          {
            title: "Call b",
            detail:
              "Counter B starts at zero; it does not reuse counter A’s binding.",
            panels: [
              {
                id: "a",
                label: "Counter A environment",
                tokens: [
                  {
                    id: "a-0-count = 2",
                    label: "count = 2",
                  },
                ],
              },
              {
                id: "b",
                label: "Counter B environment",
                tokens: [
                  {
                    id: "b-0-count = 1",
                    label: "count = 1",
                  },
                ],
              },
            ],
            line: 7,
            result: "a: 1, 2; b: 1",
          },
        ],
      },
    ],
    takeaway:
      "A closure keeps access to lexical bindings. Two factory calls create two environments.",
    source:
      "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures",
  },
  "scope-hoisting": {
    kind: "walkthrough",
    title: "Created is not the same as initialized.",
    intro:
      "Inspect function, var, and let bindings before and after execution.",
    scenarios: [
      {
        id: "bindings",
        label: "Bindings",
        code: [
          "greet();",
          "console.log(score);",
          "var score = 10;",
          "let ready = true;",
          'function greet() { return "hello"; }',
        ],
        steps: [
          {
            title: "Enter the scope",
            detail:
              "Before these statements run, the function is initialized, var is undefined, and let is uninitialized.",
            panels: [
              {
                id: "bindings",
                label: "Bindings",
                tokens: [
                  {
                    id: "bindings-0-greet → function",
                    label: "greet → function",
                  },
                  {
                    id: "bindings-1-score → undefined",
                    label: "score → undefined",
                  },
                  {
                    id: "bindings-2-ready → uninitialized (TDZ)",
                    label: "ready → uninitialized (TDZ)",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Call the declared function",
            detail: "A function declaration is available early in this scope.",
            panels: [
              {
                id: "bindings",
                label: "Bindings",
                tokens: [
                  {
                    id: "bindings-0-greet → function",
                    label: "greet → function",
                  },
                ],
              },
              {
                id: "output",
                label: "Result",
                tokens: [
                  {
                    id: "output-0-hello",
                    label: "hello",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Read var before assignment",
            detail: "Reading score produces undefined, not a ReferenceError.",
            panels: [
              {
                id: "bindings",
                label: "Bindings",
                tokens: [
                  {
                    id: "bindings-0-score → undefined",
                    label: "score → undefined",
                  },
                ],
              },
              {
                id: "output",
                label: "Console",
                tokens: [
                  {
                    id: "output-0-undefined",
                    label: "undefined",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Assign score",
            detail:
              "The assignment runs when execution reaches this statement.",
            panels: [
              {
                id: "bindings",
                label: "Bindings",
                tokens: [
                  {
                    id: "bindings-0-score → 10",
                    label: "score → 10",
                  },
                  {
                    id: "bindings-1-ready → uninitialized (TDZ)",
                    label: "ready → uninitialized (TDZ)",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Initialize ready",
            detail:
              "Only now is this let binding readable. A read before this line would throw a ReferenceError and stop that execution path.",
            panels: [
              {
                id: "bindings",
                label: "Bindings",
                tokens: [
                  {
                    id: "bindings-0-score → 10",
                    label: "score → 10",
                  },
                  {
                    id: "bindings-1-ready → true",
                    label: "ready → true",
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
      "Hoisting is a description of binding behavior; source lines are not physically moved.",
  },
  "this-binding": {
    kind: "walkthrough",
    title: "Follow the receiver at the call site.",
    intro:
      "Compare an ordinary method call, an extracted call, and a bound call.",
    scenarios: [
      {
        id: "receiver",
        label: "Strict-mode calls",
        code: [
          '"use strict";',
          'const account = { name: "Trailbook", describe() { return this.name; } };',
          "account.describe();",
          "const detached = account.describe;",
          "try { detached(); } catch { /* inspect the TypeError */ }",
          "const bound = detached.bind(account);",
          "bound();",
        ],
        steps: [
          {
            title: "Store a method",
            detail:
              "The function is stored on account. Ordinary functions do not permanently capture that object as this.",
            panels: [
              {
                id: "object",
                label: "Object",
                tokens: [
                  {
                    id: "object-0-account.name = Trailbook",
                    label: "account.name = Trailbook",
                  },
                ],
              },
              {
                id: "function",
                label: "Function",
                tokens: [
                  {
                    id: "function-0-describe → ordinary function",
                    label: "describe → ordinary function",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Call through the object",
            detail:
              "The member call account.describe() supplies account as this.",
            panels: [
              {
                id: "call",
                label: "Call site",
                tokens: [
                  {
                    id: "call-0-account.describe()",
                    label: "account.describe()",
                  },
                ],
              },
              {
                id: "receiver",
                label: "Receiver",
                tokens: [
                  {
                    id: "receiver-0-this → account",
                    label: "this → account",
                  },
                ],
              },
            ],
            line: 2,
            result: "Trailbook",
          },
          {
            title: "Extract the function",
            detail:
              "Copying the function reference does not copy the receiver.",
            panels: [
              {
                id: "call",
                label: "Call site",
                tokens: [
                  {
                    id: "call-0-const detached = account.describe",
                    label: "const detached = account.describe",
                  },
                ],
              },
              {
                id: "receiver",
                label: "Receiver",
                tokens: [
                  {
                    id: "receiver-0-not bound",
                    label: "not bound",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "Call without a receiver",
            detail:
              "For this strict-mode ordinary call, this is undefined. Reading this.name throws a TypeError; the demo catches it before continuing.",
            panels: [
              {
                id: "call",
                label: "Call site",
                tokens: [
                  {
                    id: "call-0-detached()",
                    label: "detached()",
                  },
                ],
              },
              {
                id: "receiver",
                label: "Receiver",
                tokens: [
                  {
                    id: "receiver-0-this → undefined",
                    label: "this → undefined",
                  },
                ],
              },
            ],
            line: 4,
            result: "TypeError",
          },
          {
            title: "Bind the receiver explicitly",
            detail:
              "bind creates a new function with its this fixed to account.",
            panels: [
              {
                id: "call",
                label: "Call site",
                tokens: [
                  {
                    id: "call-0-bound()",
                    label: "bound()",
                  },
                ],
              },
              {
                id: "receiver",
                label: "Receiver",
                tokens: [
                  {
                    id: "receiver-0-this → account",
                    label: "this → account",
                  },
                ],
              },
            ],
            line: 6,
            result: "Trailbook",
          },
        ],
      },
    ],
    takeaway:
      "Arrows instead inherit this lexically. This example deliberately uses an ordinary function in strict mode.",
  },
  "prototypes-classes": {
    kind: "walkthrough",
    title: "Look locally, then follow the prototype.",
    intro: "Trace the lookup of an instance field and a shared method.",
    scenarios: [
      {
        id: "lookup",
        label: "Property lookup",
        code: [
          "class User {",
          "  constructor(name) { this.name = name; }",
          "  greet() { return this.name; }",
          "}",
          'const user = new User("Ada");',
          "user.greet();",
        ],
        steps: [
          {
            title: "Construct an instance",
            detail:
              "The constructor adds an own name property. The shared greet method lives on User.prototype.",
            panels: [
              {
                id: "instance",
                label: "user",
                tokens: [
                  {
                    id: "instance-0-name: Ada",
                    label: "name: Ada",
                  },
                ],
              },
              {
                id: "prototype",
                label: "User.prototype",
                tokens: [
                  {
                    id: "prototype-0-greet: function",
                    label: "greet: function",
                  },
                ],
              },
            ],
            line: 4,
          },
          {
            title: "Read greet on user",
            detail:
              "No own greet property exists, so lookup follows the prototype link.",
            panels: [
              {
                id: "instance",
                label: "user",
                tokens: [
                  {
                    id: "instance-0-greet: absent",
                    label: "greet: absent",
                  },
                ],
              },
              {
                id: "prototype",
                label: "User.prototype",
                tokens: [
                  {
                    id: "method",
                    label: "greet: function",
                  },
                ],
              },
            ],
            line: 5,
          },
          {
            title: "Find the inherited method",
            detail:
              "The method is found on the prototype. The receiver of user.greet() is still user.",
            panels: [
              {
                id: "call",
                label: "Method call",
                tokens: [
                  {
                    id: "method",
                    label: "greet: function",
                  },
                ],
              },
              {
                id: "receiver",
                label: "Receiver",
                tokens: [
                  {
                    id: "receiver-0-this → user",
                    label: "this → user",
                  },
                ],
              },
            ],
            line: 5,
          },
          {
            title: "Read this.name",
            detail: "The name property is found directly on the instance.",
            panels: [
              {
                id: "instance",
                label: "user",
                tokens: [
                  {
                    id: "instance-0-name: Ada",
                    label: "name: Ada",
                  },
                ],
              },
              {
                id: "return",
                label: "Returned value",
                tokens: [
                  {
                    id: "return-0-Ada",
                    label: "Ada",
                  },
                ],
              },
            ],
            line: 2,
            result: "Ada",
          },
        ],
      },
    ],
    takeaway:
      "Property ownership and the receiver are different questions: a method may be inherited while this still refers to the instance.",
  },
  "async-await": {
    kind: "walkthrough",
    title: "Await pauses a function, not the browser.",
    intro:
      "Compare waiting for dependent work with starting independent work together.",
    scenarios: [
      {
        id: "sequential",
        label: "Sequential",
        code: [
          "async function load() {",
          "  const profile = await getProfile();",
          "  const projects = await getProjects();",
          "  return { profile, projects };",
          "}",
          'load(); console.log("still responsive");',
        ],
        steps: [
          {
            title: "Enter load",
            detail:
              "The async function starts and returns a promise to its caller.",
            panels: [
              {
                id: "requests",
                label: "Requests",
                tokens: [],
              },
              {
                id: "caller",
                label: "Caller",
                tokens: [
                  {
                    id: "caller-0-load() → pending promise",
                    label: "load() → pending promise",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Wait for profile",
            detail:
              "getProfile has started. The function suspends; its caller can continue.",
            panels: [
              {
                id: "requests",
                label: "Requests",
                tokens: [
                  {
                    id: "profile",
                    label: "profile: pending",
                  },
                ],
              },
              {
                id: "caller",
                label: "Caller",
                tokens: [
                  {
                    id: "caller-0-still responsive",
                    label: "still responsive",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Resume, then start projects",
            detail:
              "Only after profile settles does this sequential example start getProjects.",
            panels: [
              {
                id: "results",
                label: "Resolved data",
                tokens: [
                  {
                    id: "profile",
                    label: "profile: ready",
                  },
                ],
              },
              {
                id: "requests",
                label: "Requests",
                tokens: [
                  {
                    id: "projects",
                    label: "projects: pending",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Both results are ready",
            detail: "The async function fulfills its returned promise.",
            panels: [
              {
                id: "results",
                label: "Resolved data",
                tokens: [
                  {
                    id: "profile",
                    label: "profile: ready",
                  },
                  {
                    id: "projects",
                    label: "projects: ready",
                  },
                ],
              },
            ],
            line: 3,
            result: "Total waiting ≈ profile time + projects time",
          },
        ],
      },
      {
        id: "parallel",
        label: "Independent reads",
        code: [
          "async function load() {",
          "  const both = [getProfile(), getProjects()];",
          "  const [profile, projects] = await Promise.all(both);",
          "  return { profile, projects };",
          "}",
        ],
        steps: [
          {
            title: "Start both operations",
            detail:
              "Calling both functions starts independent work before awaiting either result.",
            panels: [
              {
                id: "requests",
                label: "Requests",
                tokens: [
                  {
                    id: "profile",
                    label: "profile: pending",
                  },
                  {
                    id: "projects",
                    label: "projects: pending",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "One operation finishes",
            detail: "Promise.all still needs every input to fulfill.",
            panels: [
              {
                id: "results",
                label: "Resolved data",
                tokens: [
                  {
                    id: "profile",
                    label: "profile: ready",
                  },
                ],
              },
              {
                id: "requests",
                label: "Requests",
                tokens: [
                  {
                    id: "projects",
                    label: "projects: pending",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "The second operation finishes",
            detail:
              "The result array preserves input order, not completion order.",
            panels: [
              {
                id: "results",
                label: "Resolved data",
                tokens: [
                  {
                    id: "profile",
                    label: "profile: ready",
                  },
                  {
                    id: "projects",
                    label: "projects: ready",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Return both results",
            detail:
              "For independent work, overlap can shorten the wait. A rejection does not automatically cancel other operations.",
            panels: [
              {
                id: "return",
                label: "Return",
                tokens: [
                  {
                    id: "return-0-{ profile, projects }",
                    label: "{ profile, projects }",
                  },
                ],
              },
            ],
            line: 3,
            result:
              "Total waiting ≈ max(profile time, projects time) + overhead",
          },
        ],
      },
    ],
    takeaway:
      "Parallelize independent operations. Keep true dependencies sequential; measure actual latency rather than treating these estimates as timings.",
  },
  "promise-chains": {
    kind: "walkthrough",
    title: "Values, rejections, and recovery travel through the chain.",
    intro:
      "Watch how a thrown error skips a success handler and reaches catch.",
    scenarios: [
      {
        id: "chain",
        label: "Recovery",
        code: [
          "Promise.resolve(2)",
          "  .then(x => x * 3)",
          '  .then(() => { throw new Error("offline"); })',
          "  .then(x => x + 1)",
          "  .catch(() => 0)",
          "  .then(x => console.log(x));",
        ],
        steps: [
          {
            title: "Begin fulfilled",
            detail:
              "Promise.resolve creates a fulfilled promise with value 2. Its handlers still run asynchronously.",
            panels: [
              {
                id: "settlement",
                label: "Current settlement",
                tokens: [
                  {
                    id: "settlement-0-fulfilled: 2",
                    label: "fulfilled: 2",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Return a plain value",
            detail: "Returning 6 fulfills the next promise with 6.",
            panels: [
              {
                id: "settlement",
                label: "Current settlement",
                tokens: [
                  {
                    id: "settlement-0-fulfilled: 6",
                    label: "fulfilled: 6",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Throw an error",
            detail: "The throw rejects the next promise in the chain.",
            panels: [
              {
                id: "settlement",
                label: "Current settlement",
                tokens: [
                  {
                    id: 'settlement-0-rejected: Error("offline")',
                    label: 'rejected: Error("offline")',
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Skip the success-only handler",
            detail: "A fulfilled handler is not invoked for this rejection.",
            panels: [
              {
                id: "settlement",
                label: "Current settlement",
                tokens: [
                  {
                    id: 'settlement-0-rejected: Error("offline")',
                    label: 'rejected: Error("offline")',
                  },
                ],
              },
              {
                id: "skipped",
                label: "Skipped",
                tokens: [
                  {
                    id: "skipped-0-x => x + 1",
                    label: "x => x + 1",
                  },
                ],
              },
            ],
            line: 3,
          },
          {
            title: "Recover in catch",
            detail:
              "Returning 0 from catch converts this path into fulfillment.",
            panels: [
              {
                id: "settlement",
                label: "Current settlement",
                tokens: [
                  {
                    id: "settlement-0-fulfilled: 0",
                    label: "fulfilled: 0",
                  },
                ],
              },
            ],
            line: 4,
          },
          {
            title: "Continue with the recovery value",
            detail: "The following success handler receives 0.",
            panels: [
              {
                id: "console",
                label: "Console",
                tokens: [
                  {
                    id: "console-0-0",
                    label: "0",
                  },
                ],
              },
            ],
            line: 5,
            result: "0",
          },
        ],
      },
    ],
    takeaway:
      "Every then/catch returns a new promise. Returning a promise adopts its outcome; throwing continues a rejection path.",
  },
  "debounce-throttle": {
    kind: "walkthrough",
    title: "Same input events. Different scheduling rules.",
    intro:
      "Compare a trailing debounce with a leading-only throttle at 300 ms.",
    scenarios: [
      {
        id: "debounce",
        label: "Trailing debounce",
        code: [
          'input("r");     // t = 0 ms',
          'input("re");    // t = 100 ms',
          'input("react"); // t = 200 ms',
          "// trailing debounce delay = 300 ms",
        ],
        steps: [
          {
            title: "Input r at 0 ms",
            detail: "Schedule work for 300 ms. No request runs yet.",
            panels: [
              {
                id: "timer",
                label: "Pending timer",
                tokens: [
                  {
                    id: "timer-0-r → t=300",
                    label: "r → t=300",
                  },
                ],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [],
              },
            ],
            line: 0,
          },
          {
            title: "Input re at 100 ms",
            detail:
              "Cancel the old timer. Schedule the latest arguments for 400 ms.",
            panels: [
              {
                id: "timer",
                label: "Pending timer",
                tokens: [
                  {
                    id: "timer-0-re → t=400",
                    label: "re → t=400",
                  },
                ],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [],
              },
            ],
            line: 1,
          },
          {
            title: "Input react at 200 ms",
            detail: "Restart the quiet-period timer again, now due at 500 ms.",
            panels: [
              {
                id: "timer",
                label: "Pending timer",
                tokens: [
                  {
                    id: "timer-0-react → t=500",
                    label: "react → t=500",
                  },
                ],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [],
              },
            ],
            line: 2,
          },
          {
            title: "Reach 500 ms with no more input",
            detail:
              "The quiet period has elapsed, so run once with the latest query.",
            panels: [
              {
                id: "timer",
                label: "Pending timer",
                tokens: [],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [
                  {
                    id: 'requests-0-search("react") at t=500',
                    label: 'search("react") at t=500',
                  },
                ],
              },
            ],
            line: 3,
            result: "1 request; older timers were canceled",
          },
        ],
      },
      {
        id: "throttle",
        label: "Leading-only throttle",
        code: [
          'input("r");     // t = 0 ms',
          'input("re");    // t = 100 ms',
          'input("react"); // t = 200 ms',
          'input("react!");// t = 400 ms',
          "// leading-only throttle interval = 300 ms",
        ],
        steps: [
          {
            title: "Input r at 0 ms",
            detail: "Run immediately and close the throttle gate until t=300.",
            panels: [
              {
                id: "gate",
                label: "Gate",
                tokens: [
                  {
                    id: "gate-0-closed until t=300",
                    label: "closed until t=300",
                  },
                ],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [
                  {
                    id: "requests-0-r at t=0",
                    label: "r at t=0",
                  },
                ],
              },
            ],
            line: 0,
          },
          {
            title: "Input re at 100 ms",
            detail:
              "The gate is closed. This leading-only variant drops the call.",
            panels: [
              {
                id: "gate",
                label: "Gate",
                tokens: [
                  {
                    id: "gate-0-closed until t=300",
                    label: "closed until t=300",
                  },
                ],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [
                  {
                    id: "requests-0-r at t=0",
                    label: "r at t=0",
                  },
                ],
              },
            ],
            line: 1,
          },
          {
            title: "Input react at 200 ms",
            detail:
              "This call is also dropped. This variant has no trailing timer.",
            panels: [
              {
                id: "gate",
                label: "Gate",
                tokens: [
                  {
                    id: "gate-0-closed until t=300",
                    label: "closed until t=300",
                  },
                ],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [
                  {
                    id: "requests-0-r at t=0",
                    label: "r at t=0",
                  },
                ],
              },
            ],
            line: 2,
          },
          {
            title: "Input react! at 400 ms",
            detail:
              "Enough time has passed; execute and begin another interval.",
            panels: [
              {
                id: "gate",
                label: "Gate",
                tokens: [
                  {
                    id: "gate-0-closed until t=700",
                    label: "closed until t=700",
                  },
                ],
              },
              {
                id: "requests",
                label: "Executed work",
                tokens: [
                  {
                    id: "requests-0-r at t=0",
                    label: "r at t=0",
                  },
                  {
                    id: "requests-1-react! at t=400",
                    label: "react! at t=400",
                  },
                ],
              },
            ],
            line: 3,
            result: "2 calls executed; no trailing call",
          },
        ],
      },
    ],
    takeaway:
      "Debouncing reduces call frequency; it does not prevent stale responses. Throttle behavior depends on leading/trailing options.",
  },
} satisfies VisualCatalog;
