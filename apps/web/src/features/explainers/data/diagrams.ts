import type { VisualCatalog } from "../types";
export const visuals = {
  "ts-generics-constraints": {
    kind: "diagram",
    title: "Generics, constraints & inference.",
    intro: "Preserve relationships between inputs and outputs without casts.",
    drawing: {
      kind: "flow",
      title: "Preserve relationships between inputs and outputs without casts.",
      stages: [
        {
          label: "Caller",
          value: "{ title: string; completed: boolean }",
        },
        {
          label: "Constraint",
          value: "K extends keyof T",
        },
        {
          label: "Result",
          value: "T[K] preserves the selected property type",
        },
      ],
      note: "Prefer the smallest constraint that expresses the relationship.",
    },
    example: {
      input: 'get({ title: "Unions", completed: false }, "completed")',
      output: "false at runtime; inferred return type: boolean",
      explanation:
        "A generic parameter describes a relationship across values. Unlike any, T preserves the caller’s specific type. A constraint limits which inputs are accepted without replacing the inferred type with that constraint.",
    },
    takeaway:
      "Do not assert an arbitrary object to T. Constraints grant access only to the constrained members. Avoid specifying generic arguments when inference already expresses the intended relationship.",
  },
  "ts-mapped-utility-types": {
    kind: "diagram",
    title: "Mapped types, utility types & key remapping.",
    intro: "Derive focused contracts from existing types.",
    drawing: {
      kind: "flow",
      title: "Derive focused contracts from existing types.",
      stages: [
        {
          label: "Source",
          value: "Note: id, title, ownerId",
        },
        {
          label: "Allowlist",
          value: 'Pick<Note, "title">',
        },
        {
          label: "Derived contract",
          value: "RenameNote: title only",
        },
      ],
      note: "Record<K,V> describes keys and values, not runtime key existence checks.",
    },
    example: {
      input: "Note = { id: string; title: string; ownerId: string }",
      output:
        'Pick<Note, "title"> = { title: string }; no runtime fields are removed',
      explanation:
        "Mapped types iterate over a key union. Utility types such as Pick, Omit, Partial, Required, Readonly and Record express common transformations without duplicating every field.",
    },
    takeaway:
      'Do not use Omit<User, "password"> as your only public-data policy: a future secret field could leak. Build and validate a deliberate DTO allowlist. Avoid deep recursive utility types without a concrete requirement.',
  },
  "ts-conditional-infer": {
    kind: "diagram",
    title: "Conditional types, infer & distribution.",
    intro: "Read type-level branches without turning code into a puzzle.",
    drawing: {
      kind: "flow",
      title: "Read type-level branches without turning code into a puzzle.",
      stages: [
        {
          label: "Input union",
          value: "string | number",
        },
        {
          label: "Distribute",
          value: "IsString<string> | IsString<number>",
        },
        {
          label: "Output union",
          value: '"yes" | "no"',
        },
      ],
      note: "Prefer readable built-in utilities over unnecessary type puzzles.",
    },
    example: {
      input: 'IsString<string | number> with T extends string ? "yes" : "no"',
      output: 'Distributed result: "yes" | "no"',
      explanation:
        "A conditional type selects a type based on assignability. infer introduces a type variable within the matched pattern, useful for extracting function results, array elements and other nested relationships.",
    },
    takeaway:
      "infer does not inspect runtime values. A complicated type that passes compilation can still sit over an unvalidated payload. Avoid clever conditional types where a simple named union is clearer.",
  },
  "ts-literals-satisfies": {
    kind: "diagram",
    title: "Literal inference, as const & satisfies.",
    intro: "Check configuration while preserving useful inferred types.",
    drawing: {
      kind: "flow",
      title: "Check configuration while preserving useful inferred types.",
      stages: [
        {
          label: "Value",
          value: "routes object literal",
        },
        {
          label: "Compile-time check",
          value: "satisfies Record<string, Route>",
        },
        {
          label: "Preserved information",
          value: 'keyof routes = "notes" | "login"',
        },
      ],
      note: "Large template-literal unions can become expensive.",
    },
    example: {
      input:
        'routes.notes.path is "/notes" with as const satisfies Record<string, Route>',
      output: 'Inferred path type: "/notes"; routes keys: "notes" | "login"',
      explanation:
        "Type annotations check a value but can broaden its apparent type. satisfies checks assignability while retaining the expression’s useful inferred type. as const prevents literal widening and gives object properties and array positions readonly types.",
    },
    takeaway:
      "Do not replace validation of dynamic configuration with satisfies. An assertion can hide an invalid object; satisfies reports a mismatch. Excess-property checking is strongest on fresh literals and is not exact-object validation.",
  },
  "ts-narrowing-never": {
    kind: "diagram",
    title: "Advanced narrowing, exhaustiveness & branded IDs.",
    intro: "Make invalid branches and mixed identifiers harder to use.",
    drawing: {
      kind: "flow",
      title: "Make invalid branches and mixed identifiers harder to use.",
      stages: [
        {
          label: "Unknown or union",
          value: "Check the value or its discriminant",
        },
        {
          label: "Narrowed branch",
          value: "Only fields supported by evidence",
        },
        {
          label: "Exhaustive result",
          value: "Unhandled alternative fails a never check",
        },
      ],
      note: "Assertions do not establish runtime facts.",
    },
    example: {
      input: 'label({ status: "ready", count: 3 })',
      output:
        '"3 notes"; adding an unhandled status makes assertNever(state) fail compilation',
      explanation:
        "Control-flow analysis narrows types after checks. A discriminant makes alternatives explicit; never can enforce exhaustive handling. User-defined predicates and assertion functions are promises to the compiler, so their implementations must actually establish their claims.",
    },
    takeaway:
      "A predicate returning true unconditionally can make unsafe code compile. A branded string cast from untrusted JSON remains untrusted. Keep ownership checks on the server even when IDs have distinct types.",
  },
  "ts-strictness-modules": {
    kind: "diagram",
    title: "Strict TypeScript, nullability & module boundaries.",
    intro: "Use compiler settings to expose real edge cases.",
    drawing: {
      kind: "flow",
      title: "Use compiler settings to expose real edge cases.",
      stages: [
        {
          label: "Potential absence",
          value: "array[index] or dictionary[key]",
        },
        {
          label: "Compiler evidence",
          value: "value | undefined",
        },
        {
          label: "Runtime handling",
          value: "Check, default deliberately, or return an error",
        },
      ],
      note: "Typechecking does not replace runtime tests.",
    },
    example: {
      input: "const values: string[] = []; const first = values[0]",
      output:
        "undefined at runtime; string | undefined with noUncheckedIndexedAccess",
      explanation:
        "Strict checking makes assumptions visible before runtime. strictNullChecks distinguishes null and undefined from present values. noUncheckedIndexedAccess adds undefined to unchecked indexed reads; exactOptionalPropertyTypes distinguishes an absent optional property from explicitly assigning undefined when it is not part of the declared value type.",
    },
    takeaway:
      "Non-null ! assertions are erased and can hide a missing array element. Do not copy Node module resolution settings into a Vite app blindly. Run the actual app and package typechecks, not an empty solution config.",
  },
  "ts-react-contracts": {
    kind: "diagram",
    title: "Advanced React contracts & reusable generic components.",
    intro:
      "Express component relationships without impossible prop combinations.",
    drawing: {
      kind: "flow",
      title:
        "Express component relationships without impossible prop combinations.",
      stages: [
        {
          label: "Caller items",
          value: "readonly Note[]",
        },
        {
          label: "Generic relationship",
          value: "ListProps<Note>",
        },
        {
          label: "Callback inference",
          value: "renderItem receives Note, not any",
        },
      ],
      note: "Types do not verify focus behavior or accessible names.",
    },
    example: {
      input:
        'List items are [{ id: "n1", title: "Unions" }] and getKey reads id',
      output:
        'renderItem receives { id: string; title: string }; the row key is "n1"',
      explanation:
        "Component contracts should express valid UI configurations. A discriminated union can require an onChange callback for a controlled input and forbid a conflicting defaultValue. Generics can preserve the relationship between list items and render callbacks.",
    },
    takeaway:
      "Optional callbacks combined with an always-present value can leave a controlled input unable to update. Do not make every component polymorphic just because the type system can express it. Preserve native semantics and forward relevant props.",
  },
  "zod-runtime-contracts": {
    kind: "diagram",
    title: "Zod: schemas, safeParse & inferred contracts.",
    intro: "Turn unknown input into validated application data.",
    drawing: {
      kind: "flow",
      title: "Turn unknown input into validated application data.",
      stages: [
        {
          label: "Untrusted boundary",
          value: "unknown JSON, form values or storage",
        },
        {
          label: "Runtime schema",
          value: "safeParse checks shape and constraints",
        },
        {
          label: "Application value",
          value: "result.data with inferred output type",
        },
      ],
      note: "Validation is not authorization.",
    },
    example: {
      input: 'NoteInput.safeParse({ title: "  Unions  ", tags: ["ts"] })',
      output: 'success: true; data: { title: "Unions", tags: ["ts"] }',
      explanation:
        "A Zod schema is executable validation. TypeScript checks your code; Zod checks values when code runs. Define a schema once and infer its output type instead of maintaining a separate interface that can drift.",
    },
    takeaway:
      "Do not use raw after parsing: transformations such as trim are reflected in result.data. Default z.object strips unknown keys; strictObject rejects them. Neither policy grants access to a resource. Avoid logging complete sensitive payloads in validation errors.",
  },
  "zod-transforms-refinements": {
    kind: "diagram",
    title: "Zod transforms, refinements & schema composition.",
    intro: "Separate raw input, normalized output and business rules.",
    drawing: {
      kind: "flow",
      title: "Separate raw input, normalized output and business rules.",
      stages: [
        {
          label: "Wire value",
          value: '"45" as a string',
        },
        {
          label: "Check and normalize",
          value: "digits → Number → integer range 1–180",
        },
        {
          label: "Parsed output",
          value: "45 as a number",
        },
      ],
      note: "Database constraints enforce rules under concurrent writes.",
    },
    example: {
      input: 'Minutes.safeParse("45") then Minutes.safeParse("0")',
      output: '"45" produces number 45; "0" fails the minimum of 1',
      explanation:
        "Input and output types can differ when a schema transforms a value. z.input describes what the schema accepts at the type level; z.output and z.infer describe the parsed result. Refinements add checks; transforms normalize or convert data.",
    },
    takeaway:
      'Blind Number coercion accepts surprising inputs such as an empty string becoming zero. z.coerce.boolean() follows JavaScript truthiness, so the string "false" is truthy. Define the accepted wire format explicitly. A refinement cannot guarantee a future database write will remain unique under concurrency.',
  },
  "ts-ai-api-boundaries": {
    kind: "diagram",
    title: "Type-safe API & AI boundaries with Zod.",
    intro: "Validate model output before it becomes an application action.",
    drawing: {
      kind: "flow",
      title: "Validate model output before it becomes an application action.",
      stages: [
        {
          label: "External output",
          value: "Completed API or model response",
        },
        {
          label: "Validation boundary",
          value: "JSON syntax → schema → domain checks",
        },
        {
          label: "Authorized use",
          value: "Display safely; server checks before actions",
        },
      ],
      note: "Validate tool arguments and results; enforce authorization separately.",
    },
    example: {
      input: 'decode(\'{"topic":"Generics","minutes":30}\')',
      output:
        '{ ok: true, data: { topic: "Generics", minutes: 30 } }; truth and permissions still need checks',
      explanation:
        "External API data and model output remain unknown until checked. A schema can prove a shape and local constraints, but cannot prove factual accuracy, source grounding, ownership or permission. Keep those checks explicit.",
    },
    takeaway:
      "Never execute a model-supplied command merely because it matches a schema. Authorize each tool on the server using the real session. A valid topic string can still contain invented facts or hostile instructions. Do not render generated HTML unsafely or put private API keys into client bundles.",
  },
  "accessible-ui": {
    kind: "diagram",
    title: "A control communicates through more than its appearance.",
    intro:
      "Follow the contract between a person, a control, and assistive technology.",
    example: {
      input: "A bookmark icon toggles whether a lesson is saved.",
      output: "Named toggle: Save topic\nPressed: true after activation",
      explanation:
        "The visible icon and programmatic state describe the same action.",
    },
    takeaway:
      "Start with native semantics and tested composite controls; test keyboard and screen-reader behavior.",
    drawing: {
      kind: "accessibility",
      title: "A toggle’s anatomy: name, focus, and state",
      note: "The drawing illustrates a control’s contract. Native semantics and tested widget behavior still need real keyboard and assistive-technology testing.",
    },
  },
  "actions-route-handlers": {
    kind: "diagram",
    title: "Two entry points. One trusted business rule.",
    intro:
      "Actions and HTTP handlers are transports into the same protected server operation.",
    example: {
      input: "An app form and an external client both rename a note.",
      output: "Both call renameEntry(authenticatedUserId, validatedInput).",
      explanation:
        "Changing transport must not bypass authorization. A webhook needs its own appropriate authentication.",
    },
    takeaway:
      "Keep privileged rules in the server layer; choose the transport for the caller.",
    drawing: {
      kind: "fork",
      title: "Different transports converge on one protected operation",
      note: "Both entry points need authentication, validation, and authorization. Keep the business rule in a shared server layer.",
      inputs: [
        {
          label: "App form",
          value: "Server Action",
        },
        {
          label: "HTTP client",
          value: "Route Handler",
        },
      ],
      hub: {
        label: "Shared mutation",
        value: "authenticate → validate → authorize",
      },
      outputs: [
        {
          label: "Constrained database write",
          value: "WHERE id = noteId\nAND owner_id = userId",
          items: ["Return a safe view model"],
        },
      ],
    },
  },
  "ai-cost-boundaries": {
    kind: "diagram",
    title: "Measure the stages you can actually observe.",
    intro:
      "Separate application latency, provider work, and the data allowed to leave your app.",
    example: {
      input: "First useful output: 800 ms; completion: 2,400 ms.",
      output:
        "TTFU = 800 ms\nTotal latency = 2,400 ms\nCost: calculate from reported usage and current rates.",
      explanation:
        "One “response time” number would hide the benefit of early useful output.",
    },
    takeaway:
      "Do not store private prompts or credentials merely to measure performance.",
    drawing: {
      kind: "flow",
      title: "Separate the context boundary from useful output timing",
      note: "These are teaching timings, not measurements from this app. Calculate cost from actual usage and current provider rates; first-useful-output and total latency are different quantities.",
      stages: [
        {
          label: "Allowed context",
          value: "Authorized fields only",
          items: ["Private prompt logging excluded"],
        },
        {
          label: "Server request",
          value: "Bound input + output",
          items: ["Provider key stays here"],
        },
        {
          label: "First useful output",
          value: "800 ms",
          items: ["Illustrative TTFU"],
        },
        {
          label: "Completion",
          value: "2,400 ms",
          items: ["Use reported usage for accounting"],
        },
      ],
    },
  },
  "api-validation-errors": {
    kind: "diagram",
    title: "A request can fail at different boundaries.",
    intro:
      "Return a status and safe error that match the failure rather than collapsing everything into 500.",
    example: {
      input: 'POST /notes with {"title":""}',
      output:
        '400 {"error":{"code":"INVALID_TITLE","fields":{"title":"Required"}}}',
      explanation:
        "A server can safely explain the expected correction without leaking internal diagnostics.",
    },
    takeaway:
      "Validate on the server even if the browser already checked the form.",
    drawing: {
      kind: "states",
      title: "Different failures produce different response contracts",
      note: "This is an outcome map, not one interchangeable validation step. A missing resource may return 404; a successful 204 has no JSON body.",
      root: "What happened to the request?",
      branches: [
        {
          when: "Input is malformed",
          label: "400",
          value: "INVALID_TITLE\nfield: title",
        },
        {
          when: "Credentials are invalid",
          label: "401",
          value: "Sign-in required",
        },
        {
          when: "Action is forbidden",
          label: "403",
          value: "Permission denied",
        },
        {
          when: "Creation succeeds",
          label: "201",
          value: '{ id: 42, title: "Notes" }',
        },
      ],
    },
  },
  "application-scorecard": {
    kind: "diagram",
    title: "Find the stage where progress is getting stuck.",
    intro:
      "Separate outreach activity from interview outcomes and learning evidence.",
    example: {
      input:
        "12 applications → 3 screens → 1 technical round; two mocks reveal weak async explanations.",
      output:
        "Keep suitable applications active; schedule an async recall-and-build repair.",
      explanation:
        "More applications and more framework reading address different bottlenecks.",
    },
    takeaway:
      "These records guide decisions; they are not offer probabilities or a guarantee of employment.",
    drawing: {
      kind: "funnel",
      title: "Example: activity turns into outcomes at different rates",
      note: "Illustrative recorded counts, not targets, expected conversion rates, or promised offers. Investigate the stage where evidence shows a bottleneck.",
      stages: [
        {
          label: "Relevant applications",
          count: 12,
        },
        {
          label: "Screens",
          count: 3,
        },
        {
          label: "Technical rounds",
          count: 1,
        },
      ],
    },
  },
  "auth-sessions-oauth": {
    kind: "diagram",
    title: "Identity is an input to permission checks.",
    intro: "A valid session does not authorize access to every resource.",
    example: {
      input: "User A requests note 42, owned by user B.",
      output: "No authorized result, even though A has a valid session.",
      explanation:
        "Checking that someone is signed in is different from checking ownership.",
    },
    takeaway:
      "OAuth delegates access; OIDC adds identity conventions. A signed token is not encrypted data.",
    drawing: {
      kind: "sequence",
      title: "A valid session still needs an ownership check",
      note: "Authentication identifies A. It does not authorize A to read B’s note. This example uses an opaque session; OAuth/OIDC and JWT designs have additional protocol rules.",
      actors: ["Browser", "Server", "Database"],
      messages: [
        {
          from: 0,
          to: 1,
          label: "GET /notes/42 + session cookie",
        },
        {
          from: 1,
          to: 2,
          label: "Look up note 42 within user A’s scope",
        },
        {
          from: 2,
          to: 1,
          label: "No permitted row: note belongs to B",
        },
        {
          from: 1,
          to: 0,
          label: "404 · no note data disclosed",
        },
      ],
    },
  },
  "authenticated-mutations": {
    kind: "diagram",
    title: "Keep the owner condition in the actual write.",
    intro:
      "A client-supplied note ID is a lookup request, not proof of permission.",
    example: {
      input:
        'User A submits {id:42,title:"Renamed"}, but note 42 belongs to B.',
      output: "The owner-constrained update affects 0 rows.",
      explanation:
        "A hidden button or a prior browser check cannot protect the database operation.",
    },
    takeaway:
      "Repeat access checks at the trusted mutation boundary; use a transaction for related required writes.",
    drawing: {
      kind: "sequence",
      title: "Put the owner constraint in the write",
      note: "The server derives the caller from a verified session and validates the title. A client-provided ownerId is not authority; inspect the constrained write’s result.",
      actors: ["Client", "Server", "Database"],
      messages: [
        {
          from: 0,
          to: 1,
          label: 'Rename note 42 → "Notes"',
        },
        {
          from: 1,
          to: 2,
          label: "UPDATE note WHERE id=42 AND owner=A",
        },
        {
          from: 2,
          to: 1,
          label: "0 affected rows: ownership did not match",
        },
        {
          from: 1,
          to: 0,
          label: "Safe failure · no false success",
        },
      ],
    },
  },
  "behavior-testing": {
    kind: "diagram",
    title: "Test the failure and the recovery, not just the first render.",
    intro:
      "A useful test follows a user-visible interaction across an external boundary.",
    example: {
      input: "Save “Closures” → network failure → retry succeeds.",
      output:
        "Draft remains “Closures”; error clears only after successful retry.",
      explanation:
        "A test of internal state alone could pass while the user loses their input.",
    },
    takeaway:
      "Use accessible queries and wait for meaningful UI changes rather than arbitrary sleeps.",
    drawing: {
      kind: "cycle",
      title: "Prove failure and recovery in one user journey",
      note: "Arrange the external boundary to fail once and then succeed. Assert the retained input and the recovery behavior, not private component state. Repeat the test for future changes.",
      stages: [
        {
          label: "Submit",
          value: "Draft: Closures",
        },
        {
          label: "Fail",
          value: "Save rejects: offline",
        },
        {
          label: "Retain",
          value: "Draft + error remain",
        },
        {
          label: "Retry",
          value: "Save confirms → success",
        },
      ],
    },
  },
  "browser-rendering": {
    kind: "diagram",
    title: "Different changes require different browser work.",
    intro:
      "This is a simplified dependency pipeline, not a promise that every frame performs every stage.",
    example: {
      input:
        "Loop: change width, read bounding box, change width, read bounding box.",
      output:
        "Batch geometry reads, then batch writes; measure the interaction again.",
      explanation:
        "Interleaving writes and geometry reads can repeatedly force layout.",
    },
    takeaway:
      "Measure in browser tools; do not assume that every transform is automatically free or GPU-accelerated.",
    drawing: {
      kind: "flow",
      title: "A width change can require more than compositing",
      note: "This simplified dependency pipeline does not mean every frame runs every stage. Some transform/opacity updates can avoid layout, depending on the page; verify with a browser trace.",
      stages: [
        {
          label: "DOM + style",
          value: "width: 100 → 120",
          items: ["Determine affected styles"],
        },
        {
          label: "Layout",
          value: "New geometry",
          items: ["Positions + dimensions"],
        },
        {
          label: "Paint",
          value: "Changed pixels",
          items: ["Drawing work"],
        },
        {
          label: "Composite",
          value: "Assemble layers",
          items: ["Present the result"],
        },
      ],
    },
  },
  "caching-revalidation": {
    kind: "diagram",
    title: "Ask what may be reused, and for whom.",
    intro:
      "Caches at different layers have different scopes and invalidation rules.",
    example: {
      input:
        "A public reference list and a private account balance are both fetched.",
      output:
        "Choose explicit freshness and sharing policies for each; never reuse private data across users.",
      explanation:
        "A cache hit at one layer says nothing by itself about another layer.",
    },
    takeaway:
      "Framework caching defaults change: check your exact Next.js version and enabled features before applying an API.",
    drawing: {
      kind: "cache",
      title: "Reuse decisions live at different scopes",
      note: "Policies and invalidation depend on your framework version and configuration. Shared reuse must respect authorization; a private account balance cannot become a public cached response.",
    },
  },
  "daily-learning-loop": {
    kind: "diagram",
    title: "Turn reading into evidence of understanding.",
    intro:
      "Choose a sustainable routine, then follow the same small learning loop.",
    example: {
      input: "Only 20 minutes available today.",
      output: "5 min explanation + 10 min code + 5 min next action.",
      explanation:
        "A minimum session preserves continuity without pretending it replaces a full study day.",
    },
    takeaway:
      "Resume normally after a difficult day; avoid turning missed hours into an unmanageable debt.",
    drawing: {
      kind: "cycle",
      title: "Close the loop between recall and explanation",
      note: "The arrows show the repeatable learning loop, not a fixed timetable. On a difficult day, use the 5-minute explanation + 10-minute code + 5-minute next-action minimum.",
      stages: [
        {
          label: "Recall",
          value: "Explain before reading",
        },
        {
          label: "Build",
          value: "Implement one proof",
        },
        {
          label: "Challenge",
          value: "Try a boundary case",
        },
        {
          label: "Explain",
          value: "Record gap + next retry",
        },
      ],
    },
  },
  "debug-build-spec": {
    kind: "diagram",
    title: "A small verified slice beats an unfinished collection of parts.",
    intro: "Use acceptance states to direct both implementation and debugging.",
    example: {
      input: "Search fails when the network returns responses out of order.",
      output:
        "Reproduce slow A / fast B; add a stale-result guard; repeat the race.",
      explanation:
        "Rewriting the entire search component does not identify which assumption failed.",
    },
    takeaway: "Make the failure reproducible before choosing the repair.",
    drawing: {
      kind: "cycle",
      title: "Trace a failure back to the first wrong assumption",
      note: "For an async search race, debounce alone is not the fix. A stale-result guard must protect every continuation that could update the current view.",
      stages: [
        {
          label: "Specify",
          value: "Inputs + required states",
        },
        {
          label: "Build",
          value: "One complete slice",
        },
        {
          label: "Reproduce",
          value: "Slow A / fast B race",
        },
        {
          label: "Verify",
          value: "Guard + repeat the test",
        },
      ],
    },
  },
  "december-buffer": {
    kind: "diagram",
    title: "Choose the next action from the current situation.",
    intro:
      "A target date helps allocate effort; it does not control employer decisions.",
    example: {
      input: "No offer yet, but two interviews and a take-home are active.",
      output:
        "Prepare the active rounds, clarify take-home expectations, and continue targeted outreach.",
      explanation:
        "Restarting every topic would ignore the evidence about what currently needs attention.",
    },
    takeaway:
      "Review written terms and clarify uncertainties before making a decision.",
    drawing: {
      kind: "states",
      title: "Choose the action that matches the current situation",
      note: "A target date helps allocate effort but does not determine employer decisions. Continue suitable applications and clarify written terms before deciding.",
      root: "What needs attention now?",
      branches: [
        {
          when: "A round is booked",
          label: "Prepare",
          value: "Format + project evidence",
        },
        {
          when: "A gap repeats",
          label: "Repair",
          value: "One focused skill block",
        },
        {
          when: "An employer is silent",
          label: "Follow up",
          value: "Use the agreed timeline",
        },
        {
          when: "The target date passes",
          label: "Continue",
          value: "Active processes + bottleneck review",
        },
      ],
    },
  },
  "discriminated-unions": {
    kind: "diagram",
    title: "Let the status select the valid shape.",
    intro:
      "A shared literal field connects each state to the data available in that branch.",
    example: {
      input: 'state = {status:"success", data:["React","SQL"]}',
      output: 'if (state.status === "success") state.data.length // 2',
      explanation:
        "The discriminant narrows the union. Independent loading/error/data flags allow contradictory combinations.",
    },
    takeaway:
      "TypeScript can check modeled alternatives; it does not validate an unknown network response.",
    drawing: {
      kind: "states",
      title: "The status determines which fields exist",
      note: "The literal status narrows the union. For example, state.data is available in the success branch, not every branch. External data still needs runtime validation.",
      root: "LoadState<T>",
      branches: [
        {
          when: "No request yet",
          label: "idle",
          value: '{ status: "idle" }',
        },
        {
          when: "Work is pending",
          label: "loading",
          value: '{ status: "loading" }',
        },
        {
          when: "Data is available",
          label: "success",
          value: '{ status: "success",\n  data: T }',
        },
        {
          when: "The request failed",
          label: "error",
          value: '{ status: "error",\n  message: string }',
        },
      ],
    },
  },
  "dsa-40-problem-bank": {
    kind: "diagram",
    title: "A solved problem should survive a delayed retry.",
    intro:
      "Use a bounded inventory as practice material, not as a score by itself.",
    example: {
      input: "A problem passed immediately after reading its solution.",
      output: "Record assisted practice; re-solve later without the solution.",
      explanation:
        "An accepted submission and independent recall are different evidence.",
    },
    takeaway:
      "Forty problem titles are an inventory, not forty worked solutions or guaranteed readiness.",
    drawing: {
      kind: "cycle",
      title: "A solved problem must survive a delayed re-solve",
      note: "The inventory is bounded practice material, not a count of mastered solutions. Mark assisted work honestly and use delayed attempts to test retention.",
      stages: [
        {
          label: "Contract",
          value: "Inputs + edge cases",
        },
        {
          label: "Solve",
          value: "Invariant + independent code",
        },
        {
          label: "Inspect",
          value: "Hints + mistakes + cost",
        },
        {
          label: "Re-solve",
          value: "Recall after a delay",
        },
      ],
    },
  },
  "dsa-method-complexity": {
    kind: "diagram",
    title: "Name the growing quantity before counting work.",
    intro: "Distinguish input size, repeated operations, and extra storage.",
    example: {
      input: "Two Sum scans n values and remembers earlier indices.",
      output:
        "Expected O(n) time; O(n) extra space under usual hash-map assumptions.",
      explanation:
        "A single loop alone does not prove linear cost if its body performs expensive growing work.",
    },
    takeaway:
      "Separate auxiliary space from output size, and state assumptions about operations.",
    drawing: {
      kind: "complexity",
      title: "How does work grow when input size doubles?",
      note: "The shapes compare growth functions, not wall-clock speed. State operation assumptions and distinguish auxiliary storage from output size.",
    },
  },
  "frontend-system-design": {
    kind: "diagram",
    title: "Draw boundaries around ownership and failure.",
    intro: "A search feature has several kinds of state with different owners.",
    example: {
      input:
        "Draft = “rea”; active query = “react”; cached results belong to “react”.",
      output:
        "Keep those identities distinct; do not label old results as fresh matches for the draft.",
      explanation:
        "One global loading boolean cannot explain which request or result it belongs to.",
    },
    takeaway:
      "Start from the user task and expected scale; a diagram should explain a decision, not merely list technologies.",
    drawing: {
      kind: "fork",
      title: "Separate query ownership from remote work and UI states",
      note: "The draft, active query, and results need distinct identities. Only a current response may replace the visible results; request and view paths are related responsibilities, not independent data sources.",
      inputs: [
        {
          label: "Input draft",
          value: '"rea"',
          items: ["Local editing"],
        },
        {
          label: "Active query",
          value: '"react"',
          items: ["Identity + debounce policy"],
        },
      ],
      hub: {
        label: "Query coordinator",
        value: "request ID + abort + stale guard",
      },
      outputs: [
        {
          label: "Server contract",
          value: "GET /search?q=react",
          items: ["Validate + authorize + bound"],
        },
        {
          label: "Result view",
          value: "loading | empty | data | error",
          items: ["Label stale data honestly"],
        },
      ],
    },
  },
  "hashmap-practice": {
    kind: "diagram",
    title: "Membership and frequency answer different questions.",
    intro: "Choose the information that must survive the next iteration.",
    example: {
      input: 'Contains Duplicate: [4,1,4]\nValid Anagram: "tea", "eat"',
      output:
        "Set detects the second 4.\nFrequency counts for both words are {t:1,e:1,a:1}.",
      explanation:
        "The collection is not the algorithm: its stored information must support the invariant.",
    },
    takeaway:
      "Define the alphabet, normalization, and missing-result contract before coding.",
    drawing: {
      kind: "collections",
      title: "Store the information the next iteration needs",
      note: "These ASCII examples distinguish membership from frequency. A complement map for Two Sum adds a third need: remembering earlier positions.",
    },
  },
  "http-basics": {
    kind: "diagram",
    title: "A response status is part of the data contract.",
    intro: "Follow a request across a client/server boundary.",
    example: {
      input: "DELETE /notes/42 → 204 No Content",
      output:
        "Treat the operation as successful without calling response.json().",
      explanation:
        "A network failure has no ordinary HTTP response status; an HTTP error response still needs handling.",
    },
    takeaway: "Check status and body expectations separately.",
    drawing: {
      kind: "sequence",
      title: "A 204 response has no JSON body",
      note: "The later GET is optional application behavior, not required by DELETE. Check the response contract before parsing; a network failure is different from an HTTP error response.",
      actors: ["Browser", "Server"],
      messages: [
        {
          from: 0,
          to: 1,
          label: "DELETE /notes/42 + request headers",
        },
        {
          from: 1,
          to: 0,
          label: "204 No Content + response headers",
        },
        {
          from: 0,
          to: 1,
          label: "Later request: GET /notes",
        },
        {
          from: 1,
          to: 0,
          label: "200 + JSON list",
        },
      ],
    },
  },
  "hydration-rsc": {
    kind: "diagram",
    title: "HTML, the RSC payload, and client code play different roles.",
    intro:
      "This describes an initial route load in a compatible React/Next server framework.",
    example: {
      input:
        "Server initial text = “Ready”; browser initial text = a random number.",
      output: "The first browser render does not match the server markup.",
      explanation:
        "Use stable initial output, then synchronize browser-specific data at the appropriate boundary.",
    },
    takeaway:
      "RSC is not another name for HTML or hydration; Client Components can also contribute to initial server-rendered HTML.",
    drawing: {
      kind: "payloads",
      title: "Three representations support one initial route experience",
      note: "This is a conceptual initial-load picture for a compatible server React framework. Delivery, streaming, and later navigation differ by route and framework version.",
    },
  },
  idempotency: {
    kind: "diagram",
    title: "A timeout does not prove that a write failed.",
    intro:
      "Preserve request identity so a safe retry cannot duplicate the intended effect.",
    example: {
      input:
        "Create note with K succeeds, but the client times out and retries with K.",
      output: "One note; the retry returns the recorded result.",
      explanation:
        "A disabled button cannot prevent transport retries or another client from submitting the same logical operation.",
    },
    takeaway:
      "Idempotence concerns the intended effect, not necessarily identical response bodies or statuses.",
    drawing: {
      kind: "sequence",
      title: "Retry the logical operation, not the side effect",
      note: "The lost response is an observed failure path, not a delivered application response. Concurrent requests need constraints/transactions; reject reuse of K with different parameters.",
      actors: ["Client", "Server", "Database"],
      messages: [
        {
          from: 0,
          to: 1,
          label: "Create note · key K · payload P",
        },
        {
          from: 1,
          to: 2,
          label: "Atomically store K + request identity + result",
        },
        {
          from: 2,
          to: 1,
          label: "Created note 42",
        },
        {
          from: 1,
          to: 0,
          label: "Response lost / client times out",
        },
        {
          from: 0,
          to: 1,
          label: "Retry same K + same P",
        },
        {
          from: 1,
          to: 2,
          label: "Find the recorded operation",
        },
        {
          from: 1,
          to: 0,
          label: "Return note 42 · do not create another",
        },
      ],
    },
  },
  "layout-form-details": {
    kind: "diagram",
    title: "Make long content fit the layout, not the other way around.",
    intro:
      "Follow the constraints from the outer container to a long code example.",
    example: {
      input: "A 300-character URL sits inside a flexible grid column.",
      output: "The column shrinks; only the code region scrolls horizontally.",
      explanation:
        "A breakpoint alone does not fix intrinsic sizing or missing overflow containment.",
    },
    takeaway:
      "Test narrow screens, zoom, long labels, keyboard navigation, and validation states.",
    drawing: "box-model",
  },
  "mock-company-prep": {
    kind: "diagram",
    title: "Prepare the round that is actually scheduled.",
    intro:
      "Map the role’s stated needs to specific practice and project evidence.",
    example: {
      input: "The role emphasizes React forms and reliable API integration.",
      output:
        "Practice a timed form with pending/error/retry states and explain an async race you repaired.",
      explanation:
        "Memorizing an unrelated list of technologies is weaker than evidence aligned with the round.",
    },
    takeaway:
      "Company preparation improves relevance; it cannot predict every question.",
    drawing: {
      kind: "cycle",
      title: "Match the practice to the actual round",
      note: "Clarify the interview format where possible. This loop improves relevance; it does not predict every question or guarantee an outcome.",
      stages: [
        {
          label: "Role",
          value: "React forms + APIs",
        },
        {
          label: "Evidence",
          value: "Async race repair",
        },
        {
          label: "Mock",
          value: "Timed form + retry",
        },
        {
          label: "Debrief",
          value: "Repair recurring gaps",
        },
      ],
    },
  },
  "next-request-trace": {
    kind: "diagram",
    title: "Separate where work runs from what crosses the network.",
    intro:
      "Trace an initial App Router request without treating server rendering and hydration as synonyms.",
    example: {
      input:
        "Server page reads entries and passes safe rows to an interactive filter.",
      output:
        "Server owns privileged reading; the client filter owns the browser interaction.",
      explanation:
        "“Client Component” does not imply that initial HTML must be blank.",
    },
    takeaway:
      "Explain SSR, CSR, RSC, and hydration as separate mechanisms; verify framework-version details.",
    drawing: {
      kind: "sequence",
      title: "An initial route request crosses several different boundaries",
      note: "Client JavaScript attaches interactive behavior to compatible initial HTML. Server execution, SSR, the RSC payload, and hydration are distinct mechanisms; later navigation can follow a different delivery path.",
      actors: ["Browser", "Next server", "Database"],
      messages: [
        {
          from: 0,
          to: 1,
          label: "Request /journal",
        },
        {
          from: 1,
          to: 2,
          label: "Authenticated, authorized entry read",
        },
        {
          from: 2,
          to: 1,
          label: "Permitted entries",
        },
        {
          from: 1,
          to: 0,
          label: "HTML + RSC payload + required client assets",
        },
        {
          from: 0,
          to: 1,
          label: "Later navigation / refresh as needed",
        },
      ],
    },
  },
  "next-route-states": {
    kind: "diagram",
    title: "Different route outcomes deserve different UI.",
    intro:
      "A pending route is not an empty successful result or an unexpected exception.",
    example: {
      input: "Entry lookup succeeds but returns no permitted entry.",
      output:
        "Use the route’s missing-resource behavior; do not render a “server crashed” message.",
      explanation:
        "Expected form validation belongs in form/action state rather than an unexpected-error boundary.",
    },
    takeaway:
      "Model loading, empty, missing, expected validation, and unexpected error separately.",
    drawing: {
      kind: "states",
      title: "Pending, missing, empty, and failed are different views",
      note: "Expected form validation belongs in form/action state. A valid empty result is not a missing resource, and an error boundary is not the loading state.",
      root: "Route outcome",
      branches: [
        {
          when: "Work is incomplete",
          label: "loading.tsx",
          value: "Skeleton / pending boundary",
        },
        {
          when: "Read succeeds",
          label: "page.tsx",
          value: "Rows OR a deliberate empty view",
        },
        {
          when: "Resource is missing",
          label: "not-found.tsx",
          value: "Missing-resource view",
        },
        {
          when: "Unexpected failure",
          label: "error.tsx",
          value: "Safe recovery + retry",
        },
      ],
    },
  },
  "pdf-coverage-checklist": {
    kind: "diagram",
    title: "A coverage checklist is a map, not proof of mastery.",
    intro:
      "Connect a named topic to practice and evidence before treating it as comfortable.",
    example: {
      input:
        "Event loop is marked as read, but callback ordering is still hard to explain.",
      output:
        "Practice an unseen ordering example and revisit the missed reasoning.",
      explanation:
        "A reading flag records reading; it does not certify interview performance.",
    },
    takeaway:
      "Use coverage to find missing work and evidence to assess understanding.",
    drawing: {
      kind: "flow",
      title: "Reading and demonstrated understanding are separate records",
      note: "The checklist locates work. Reading flags record reading; independent recall and delayed practice provide different evidence. The visual does not mark any topic complete automatically.",
      stages: [
        {
          label: "Located",
          value: "Event-loop lesson",
        },
        {
          label: "Read",
          value: "reading = true",
        },
        {
          label: "Recall tested",
          value: "Order explained unaided?",
        },
        {
          label: "Evidence",
          value: "Miss → notebook + retry",
        },
      ],
    },
  },
  "performance-investigation": {
    kind: "diagram",
    title: "One measured hypothesis at a time.",
    intro: "Keep conditions comparable so an apparent improvement has meaning.",
    example: {
      input:
        "Two independent 300 ms reads are accidentally awaited sequentially.",
      output:
        "Start both before awaiting; compare the critical path under the same test conditions.",
      explanation:
        "The approximate 600 ms vs 300 ms dependency picture is a hypothesis, not a measured result.",
    },
    takeaway:
      "Measure the actual production experience; adding memoization everywhere is not a diagnosis.",
    drawing: {
      kind: "waterfall",
      title: "See an accidental waterfall before changing code",
      note: "Each read takes an illustrative 300 ms. Independent reads can overlap; true dependencies cannot. Compare real measurements under equivalent conditions before claiming an improvement.",
    },
  },
  "performance-profiling": {
    kind: "diagram",
    title: "Choose a tool for the work that is slow.",
    intro:
      "A component render, a network request, and layout work require different evidence.",
    example: {
      input: "A filter feels slow after every keypress.",
      output:
        "Record the interaction; determine whether filtering computation, network, or rendering dominates.",
      explanation:
        "Reducing render count may not help a delay dominated by request latency.",
    },
    takeaway: "Optimize the measured bottleneck, then repeat the measurement.",
    drawing: {
      kind: "tool-map",
      title: "A different bottleneck calls for a different instrument",
      note: "These are illustrative trace shapes, not measurements of Trailbook. First reproduce the interaction under meaningful conditions, then use the tool that measures the suspected work.",
    },
  },
  "project-stories": {
    kind: "diagram",
    title: "Make the decision and its evidence easy to follow.",
    intro:
      "Structure a project explanation around one real problem rather than a technology inventory.",
    example: {
      input: "An old search request replaced a newer result.",
      output:
        "Explain the race, the identity guard, the failure test, and why debounce was insufficient.",
      explanation:
        "A precise repair story demonstrates reasoning more clearly than saying “I used React and APIs”.",
    },
    takeaway:
      "Do not invent metrics or imply ownership of work you did not do.",
    drawing: {
      kind: "cycle",
      title: "Build an explanation around a decision and its evidence",
      note: "Tell one concrete story with your actual role, verification, and trade-offs. Do not invent metrics or replace the explanation with a technology list.",
      stages: [
        {
          label: "Constraint",
          value: "New query must stay current",
        },
        {
          label: "Decision",
          value: "Abort + request identity",
        },
        {
          label: "Challenge",
          value: "Obsolete finally handler",
        },
        {
          label: "Evidence",
          value: "Race test + retained result",
        },
      ],
    },
  },
  "read-only-tools": {
    kind: "diagram",
    title: "Read-only still needs a trust boundary.",
    intro:
      "Constrain what the caller may inspect and what retrieved content may influence.",
    example: {
      input: "Tool arguments ask for another user’s private note ID.",
      output:
        "Reject or return no permitted result before exposing note content.",
      explanation:
        "A read can leak data even when it cannot change a database row.",
    },
    takeaway:
      "Enforce access in the application, not just in the tool description.",
    drawing: {
      kind: "sequence",
      title: "Read-only does not mean unrestricted",
      note: "A read can disclose private data even without a mutation. Retrieved instructions remain data; they cannot expand the caller’s permissions or override application rules.",
      actors: ["Tool caller", "App server", "Data store"],
      messages: [
        {
          from: 0,
          to: 1,
          label: "Read note 42 with bounded arguments",
        },
        {
          from: 1,
          to: 2,
          label: "Read only within the verified user scope",
        },
        {
          from: 2,
          to: 1,
          label: "Permitted fields OR no result",
        },
        {
          from: 1,
          to: 0,
          label: "Validated, size-limited response",
        },
      ],
    },
  },
  "redirect-errors": {
    kind: "diagram",
    title: "A successful save can still hit the wrong catch.",
    intro:
      "Keep framework redirect control flow outside the mutation error handler.",
    example: {
      input:
        'await saveEntry(); redirect("/entries"); both run inside one broad try/catch.',
      output: "Move redirect after a catch that returns the save failure.",
      explanation:
        "A redirect may use a thrown framework signal; a broad catch can intercept it after the save already succeeded.",
    },
    takeaway:
      "Finally runs on both success and failure, so it is not the place for success-only navigation.",
    drawing: {
      kind: "states",
      title: "Navigation belongs only on the successful mutation path",
      note: "Framework redirect control flow can use a thrown signal. Keeping redirect outside the mutation catch prevents a successful save being reported as a failure.",
      root: "Save inside a bounded try/catch",
      branches: [
        {
          when: "The mutation throws",
          label: "catch → return",
          value: "Safe save error\nNo redirect",
        },
        {
          when: "The mutation succeeds",
          label: "after try/catch",
          value: 'redirect("/entries")',
        },
        {
          when: "Finally runs",
          label: "both outcomes",
          value: "Do not place success-only\nnavigation here",
        },
      ],
    },
  },
  "rest-pagination": {
    kind: "diagram",
    title: "Page by a stable order, not by a vague “next” row.",
    intro: "Compare offset navigation with an explicit cursor contract.",
    example: {
      input: "Order: created_at DESC, id DESC; page ends at (T, 42).",
      output:
        "Next page uses a cursor predicate consistent with that ordering.",
      explanation:
        "A timestamp alone may not uniquely order records; a tie-breaker makes the contract deterministic.",
    },
    takeaway:
      "Define behavior under concurrent inserts and deletes. Cursor pagination is not automatically a snapshot.",
    drawing: {
      kind: "pagination",
      title: "A stable cursor survives this insertion; an offset shifts",
      note: "This example uses a unique descending ID and a limit of two. For another order, use the matching cursor tuple, tie-breaker, authorization, and bounds.",
    },
  },
  "retrieval-evaluation": {
    kind: "diagram",
    title: "A citation must support the claim it accompanies.",
    intro:
      "Retrieval is selection; grounding requires checking whether the selected source is sufficient.",
    example: {
      input:
        "Question: “What is the refund deadline?”\nRetrieved passage only describes shipping times.",
      output: "Say the provided material does not establish a refund deadline.",
      explanation:
        "Attaching the shipping citation to an invented refund date would not make the answer grounded.",
    },
    takeaway:
      "Keep retrieved instructions as data and evaluate unsupported-answer behavior explicitly.",
    drawing: {
      kind: "states",
      title: "A retrieved passage must support the answer",
      note: "Citation presence is not proof of support. Evaluate absent facts, irrelevant retrieval, conflicts, access controls, and malicious text—not only successful examples.",
      root: "Does the source establish the requested fact?",
      branches: [
        {
          when: "Question: refund deadline\nSource: shipping times",
          label: "Unsupported",
          value: "Say the material does not\nestablish the deadline",
        },
        {
          when: "Source explicitly states\nthe requested fact",
          label: "Supported",
          value: "Answer + supporting source ID",
        },
        {
          when: "Passages conflict",
          label: "Uncertain",
          value: "Expose the conflict;\ndo not invent certainty",
        },
        {
          when: "Document says “ignore rules”",
          label: "Untrusted instruction",
          value: "Treat it as source text,\nnot permission",
        },
      ],
    },
  },
  "rsc-boundaries": {
    kind: "diagram",
    title: "Keep privileged reads behind the server boundary.",
    intro: "Pass a small safe view model into the interactive part of the UI.",
    example: {
      input:
        "Database entry contains title, ownerId, and internal audit fields.",
      output:
        "Pass {id, title} to the interactive list when those are the only required fields.",
      explanation:
        "The client cannot authorize itself by hiding a button or by receiving a filtered initial view.",
    },
    takeaway:
      "“use client” defines a module boundary; it is not an instruction to fetch all initial data in an Effect.",
    drawing: "server-boundary",
  },
  "security-boundary-drills": {
    kind: "diagram",
    title: "Match the threat to the boundary it crosses.",
    intro:
      "Different attacks require different controls; one header cannot solve all of them.",
    example: {
      input:
        "A malicious title contains HTML-looking text and SQL punctuation.",
      output:
        "It remains inert text in the UI and a bound value in the database query.",
      explanation:
        "CORS controls browser cross-origin access; it does not authenticate arbitrary API clients.",
    },
    takeaway:
      "Verify controls with adversarial examples instead of relying on an attack-name checklist.",
    drawing: {
      kind: "security",
      title: "Follow the attempted crossing, then name its control",
      note: "These mechanisms solve different threats. CORS is browser cross-origin access control, not identity or ownership verification.",
      rows: [
        {
          input: "Untrusted text: <script>…</script>",
          gate: "Rendering boundary",
          output: "Inert text; intentional HTML needs vetted sanitization",
        },
        {
          input: "Cookie-authenticated unwanted mutation",
          gate: "Request protections",
          output: "Framework-appropriate origin/token checks + cookie policy",
        },
        {
          input: "Title value: ' OR 1=1 --",
          gate: "Query boundary",
          output: "Bound parameter, not concatenated SQL syntax",
        },
        {
          input: "User A requests user B’s note",
          gate: "Authorization boundary",
          output: "Owner/tenant constraint refuses access",
        },
      ],
    },
  },
  "semantic-responsive": {
    kind: "diagram",
    title: "Meaning first. Layout second.",
    intro:
      "Use the right element, then let available space determine the arrangement.",
    example: {
      input:
        "A collection card opens another lesson; Save changes local state.",
      output: "Use a link for the card and a button/toggle for Save.",
      explanation:
        "Visual resemblance does not replace the semantic behavior people and assistive technology expect.",
    },
    takeaway: "Test content extremes and zoom, not only a few device presets.",
    drawing: "box-model",
  },
  "server-data-fetching": {
    kind: "diagram",
    title: "Start a server-owned page near its data.",
    intro:
      "Keep privileged initial reads close to the authenticated server route.",
    example: {
      input: "Entries and tags are independent initial reads.",
      output: "await Promise.all([getEntriesForUser(id), getTagsForUser(id)])",
      explanation:
        "Calling your own HTTP endpoint from a Server Component can add an unnecessary round trip when server data functions already exist.",
    },
    takeaway:
      "Choose cache freshness explicitly and repeat authorization at any independently callable endpoint.",
    drawing: {
      kind: "fork",
      title: "Start independent authorized reads before waiting",
      note: "Authenticate before these reads. They are server data functions, not a reason to make an extra HTTP call to your own API.",
      inputs: [
        {
          label: "Entries read",
          value: "getEntriesForUser(id)",
          items: ["Owner-constrained rows"],
        },
        {
          label: "Tags read",
          value: "getTagsForUser(id)",
          items: ["Owner-constrained rows"],
        },
      ],
      hub: {
        label: "Server page",
        value: "await Promise.all([entries, tags])",
      },
      outputs: [
        {
          label: "Interactive client filter",
          value: "Safe serialized view model",
          items: ["Browser owns query state"],
        },
      ],
    },
  },
  "sql-indexes-transactions": {
    kind: "diagram",
    title: "Performance and atomicity solve different problems.",
    intro:
      "An index, a transaction, and batching can be useful together without replacing one another.",
    example: {
      input:
        "Create a note and its initial tag links; later list 20 notes with tags.",
      output:
        "Use a transaction for creation; batch/join the related read; measure suitable indexes.",
      explanation:
        "A transaction alone does not turn 21 queries into two, and an index does not make two required writes atomic.",
    },
    takeaway: "Select each mechanism for its invariant or measured bottleneck.",
    drawing: {
      kind: "sql-systems",
      title: "An index, a transaction, and batching solve different problems",
      note: "Indexes have write/storage costs, transactions follow isolation rules, and fewer round trips do not by themselves prove a faster query. Measure plans and protect each required invariant.",
    },
  },
  "sql-query-debugging": {
    kind: "diagram",
    title: "Keep unmatched parents and count the right thing.",
    intro: "A right-side WHERE filter can undo the purpose of a LEFT JOIN.",
    example: {
      input:
        "List all notes with the count of approved comments, including notes with none.",
      output:
        "Put the approved-child restriction in ON; GROUP BY the note; COUNT(comment.id).",
      explanation:
        "Putting comment.approved = true in WHERE removes the null-extended unmatched rows.",
    },
    takeaway:
      "Check relation cardinality before joining multiple child tables; their combinations can multiply counts.",
    drawing: "sql-relationship",
  },
  "structured-output": {
    kind: "diagram",
    title: "Parsing JSON is not the same as validating a result.",
    intro:
      "Treat model output as untrusted input until it satisfies the application contract.",
    example: {
      input:
        "Expected {title:string, facts:string[]}; received {title:7, facts:[true]}.",
      output:
        "Valid JSON, invalid application result: show a safe failure/retry path.",
      explanation:
        "A TypeScript assertion would silence the compiler without fixing the invalid runtime values.",
    },
    takeaway:
      "Structured output support can constrain generation, but the application still owns its validation and failure behavior.",
    drawing: {
      kind: "states",
      title: "JSON syntax and application shape are different gates",
      note: "Type assertions do not run validation. Validate required nested content before using model output, even when generation is constrained by a schema.",
      root: "Parse, then validate the schema",
      branches: [
        {
          when: "Malformed JSON",
          label: "Parse failure",
          value: "Retry / safe failure",
        },
        {
          when: "Valid JSON, wrong fields",
          label: "Schema failure",
          value: "{ title: 7, facts: [true] }",
        },
        {
          when: "Required fields pass",
          label: "Validated value",
          value: '{ title: "Notes",\n  facts: ["…"] }',
        },
        {
          when: "Refusal or timeout",
          label: "Other failure path",
          value: "Handle explicitly;\ndo not pretend success",
        },
      ],
    },
  },
  "tailwind-tokens": {
    kind: "diagram",
    title: "Change a meaning once, reuse it everywhere.",
    intro:
      "Semantic names connect themes to components without duplicating color decisions.",
    example: {
      input: "A diagram card uses bg-surface, text-ink, border-line.",
      output:
        "Paper and night themes supply different values to the same class names.",
      explanation:
        "Hardcoding a new palette inside each lesson would create inconsistent contrast and maintenance work.",
    },
    takeaway:
      "Use a small consistent token system; verify contrast in both themes.",
    drawing: {
      kind: "tokens",
      title: "Theme values flow through names into one component",
      note: "The palettes are illustrative token values. Real components should reuse semantic roles and verify readable contrast in each supported theme.",
    },
  },
  "typed-props-api": {
    kind: "diagram",
    title: "Establish a runtime fact before narrowing the type.",
    intro:
      "Unknown input crosses into trusted component data only after validation.",
    example: {
      input: 'API returns [{id:1,name:"Ada"},{id:"oops",name:null}].',
      output:
        "Reject the array unless every item satisfies the runtime User contract.",
      explanation:
        "Declaring response.json() as User[] does not check any incoming value.",
    },
    takeaway:
      "Compile-time types describe your code’s assumptions; runtime validation establishes facts about external data.",
    drawing: {
      kind: "flow",
      title: "Establish runtime facts before trusting a typed prop",
      note: "The invalid item never becomes trusted User data merely because code asserts User[]. Compile-time types describe assumptions; runtime checks establish the incoming shape.",
      stages: [
        {
          label: "Unknown response",
          value: '[{ id: "oops", name: null }]',
          items: ["External data"],
        },
        {
          label: "Runtime guard",
          value: "isUser(value) → false",
          items: ["Check every item"],
        },
        {
          label: "Application decision",
          value: "Reject invalid data",
          items: ["Safe error + retry"],
        },
      ],
    },
  },
  "vercel-deploy": {
    kind: "diagram",
    title: "The host needs build output, not your source entry file.",
    intro:
      "Separate dependency installation, compilation, and serving static assets.",
    example: {
      input: "Cloudflare reports “Output directory dist not found”.",
      output:
        "Verify that the build command ran successfully and that output is relative to the configured root.",
      explanation:
        "Pointing a setting at dist does not create it. This monorepo’s root build copies website assets to root dist.",
    },
    takeaway:
      "Check the actual project scripts and framework settings; a different repository can have a different output path.",
    drawing: {
      kind: "flow",
      title: "A static host serves the files your build actually emits",
      note: "The configured output directory does not create itself. This monorepo’s root build prepares root dist; another project may use a different root or output path.",
      stages: [
        {
          label: "Repository",
          value: "package.json + lockfile",
          items: ["Source + public build config"],
        },
        {
          label: "Build",
          value: "bun run build",
          items: ["Install must succeed first"],
        },
        {
          label: "Output",
          value: "dist/",
          items: ["index.html", "assets/*.js"],
        },
        {
          label: "Static host",
          value: "Serve generated assets",
          items: ["Route setup must match"],
        },
      ],
    },
  },
  "vite-mdx": {
    kind: "diagram",
    title: "Write one lesson, generate the representations it needs.",
    intro:
      "Trusted MDX is source content that becomes website code and searchable/native data.",
    example: {
      input: "Add a new lesson with category, slug, facts, and questions.",
      output:
        "Run content generation and checks; navigation/search derive from the content collection.",
      explanation:
        "The mobile representation and web compilation have different outputs even though their source is shared.",
    },
    takeaway:
      "MDX may execute JavaScript: compile trusted repository content, not arbitrary user uploads.",
    drawing: {
      kind: "fork",
      title: "One trusted lesson source, several generated outputs",
      note: "Compile only trusted repository MDX. The website and native app consume different generated representations; content generation must run after source edits.",
      inputs: [
        {
          label: "Canonical lesson",
          value: "topic.mdx",
          items: ["Metadata + prose + questions"],
        },
      ],
      hub: {
        label: "Build pipeline",
        value: "Compile + extract + index",
      },
      outputs: [
        {
          label: "Website",
          value: "Lazy lesson module",
          items: ["Searchable text + metadata"],
        },
        {
          label: "Native app",
          value: "Structured lesson bundle",
          items: ["Bundled offline content"],
        },
      ],
    },
  },
  "web-security": {
    kind: "diagram",
    title: "Keep data from becoming authority or executable syntax.",
    intro:
      "Follow four separate trust boundaries rather than treating security as one switch.",
    example: {
      input:
        "A signed-in user changes a request’s note ID to someone else’s ID.",
      output: "An owner-constrained server read/write refuses the operation.",
      explanation:
        "Escaping HTML and configuring CORS do not establish ownership of that database row.",
    },
    takeaway:
      "Never ship private server credentials in public frontend variables; each boundary needs its own control.",
    drawing: {
      kind: "security",
      title: "Neither a header nor escaping solves every trust boundary",
      note: "Keep private server credentials out of public frontend bundles. Rate limiting reduces abuse pressure but does not replace any of these controls.",
      rows: [
        {
          input: "Untrusted text: <script>…</script>",
          gate: "Rendering boundary",
          output: "Inert text; intentional HTML needs vetted sanitization",
        },
        {
          input: "Cookie-authenticated unwanted mutation",
          gate: "Request protections",
          output: "Framework-appropriate origin/token checks + cookie policy",
        },
        {
          input: "Title value: ' OR 1=1 --",
          gate: "Query boundary",
          output: "Bound parameter, not concatenated SQL syntax",
        },
        {
          input: "User A requests user B’s note",
          gate: "Authorization boundary",
          output: "Owner/tenant constraint refuses access",
        },
      ],
    },
  },
} satisfies VisualCatalog;
