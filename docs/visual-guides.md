# Lesson visual guides

Every current website lesson has a visual guide in its Overview tab: 29 interactive lessons (including the event loop) and 55 static diagrams with concrete examples. The original MDX notes, Q&A, and reading state remain independent. The guide can be hidden with the UI SDK disclosure control.

## Selection rules

Use interaction when execution order, identity, mutable state, or an algorithm invariant changes step by step. Use a static diagram when a boundary, contract, ownership decision, or process is clearer as a complete picture. Avoid decorative looping animations.

Interactive guides provide previous/next, play/pause/replay, reset, highlighted code, explanatory states, and contrasting examples where useful. Changing the example resets playback. Closing the guide or leaving its mounted view cancels its timer. Hidden browser tabs pause playback. Reduced motion removes spatial movement; keyboard stepping updates immediately. Animations use transform/opacity, 240 ms, and the same ease-out curve as the event-loop prototype. Fast repeated steps cancel motion and show the latest state.

These are curated teaching models, not arbitrary-code execution or a full browser/React/database emulator. Dataset and environment assumptions are stated in the guide. Generated algorithm traces cover the displayed input; the original lesson contains fuller implementation context. No remote requests, API credentials, or paid services are required by the guides.

## Code organization

- `registry.ts`: explicit topic-to-catalog decisions; the requested catalog loads on demand.
- `types.ts`: shared schema for scenes, panels, tokens, array pointers, binary trees, and diagrams.
- `data/javascript.ts`, `data/react.ts`, `data/platform.ts`: curated execution and state examples.
- `data/algorithms.ts`: deterministic traces derived from the displayed input.
- `data/diagrams.ts`: topic-specific flow, layer, and comparison diagrams with input/result examples.
- `shared/`: playback, controls, accessible binary-tree drawing, and reduced-motion-aware animation.
- `topic-visual.tsx`: lazy loading and the hide/show disclosure.

To add a lesson visual, add its definition and registry entry, then run `bun run check`. The coverage test checks current lesson slugs, unique token identities, source-line bounds, and scenario structure. Behavior tests cover keyboard/agent controls, example changes, hiding/reopening, and playback cleanup. Algorithm tests compare relevant outputs with independent reference reasoning.

## Coverage

| Lesson                    | Visual type             | Focus                                                           |
| ------------------------- | ----------------------- | --------------------------------------------------------------- |
| event-loop                | Interactive walkthrough | Browser stack, timers, microtasks, tasks, and console order     |
| accessible-ui             | Diagram + example       | A control communicates through more than its appearance.        |
| actions-route-handlers    | Diagram + example       | Two entry points. One trusted business rule.                    |
| ai-cost-boundaries        | Diagram + example       | Measure the stages you can actually observe.                    |
| ai-streaming              | Interactive walkthrough | Partial output is a state, not a finished answer.               |
| api-validation-errors     | Diagram + example       | A request can fail at different boundaries.                     |
| application-scorecard     | Diagram + example       | Find the stage where progress is getting stuck.                 |
| async-await               | Interactive walkthrough | Await pauses a function, not the browser.                       |
| auth-sessions-oauth       | Diagram + example       | Identity is an input to permission checks.                      |
| authenticated-mutations   | Diagram + example       | Keep the owner condition in the actual write.                   |
| behavior-testing          | Diagram + example       | Test the failure and the recovery, not just the first render.   |
| binary-search             | Interactive walkthrough | Shrink the interval without losing the answer.                  |
| browser-rendering         | Diagram + example       | Different changes require different browser work.               |
| caching-revalidation      | Diagram + example       | Ask what may be reused, and for whom.                           |
| closures                  | Interactive walkthrough | The outer call ends. The binding remains reachable.             |
| controlled-inputs         | Interactive walkthrough | The DOM edit reports back to the state owner.                   |
| daily-learning-loop       | Diagram + example       | Turn reading into evidence of understanding.                    |
| debounce-throttle         | Interactive walkthrough | Same input events. Different scheduling rules.                  |
| debug-build-spec          | Diagram + example       | A small verified slice beats an unfinished collection of parts. |
| december-buffer           | Diagram + example       | Choose the next action from the current situation.              |
| discriminated-unions      | Diagram + example       | Let the status select the valid shape.                          |
| dsa-40-problem-bank       | Diagram + example       | A solved problem should survive a delayed retry.                |
| dsa-method-complexity     | Diagram + example       | Name the growing quantity before counting work.                 |
| effects                   | Interactive walkthrough | Start synchronizing. Clean up. Synchronize again.               |
| frontend-system-design    | Diagram + example       | Draw boundaries around ownership and failure.                   |
| group-anagrams            | Interactive walkthrough | Different words, the same signature.                            |
| hashmap-practice          | Diagram + example       | Membership and frequency answer different questions.            |
| heap-basics               | Interactive walkthrough | Repair one path up a min-heap.                                  |
| http-basics               | Diagram + example       | A response status is part of the data contract.                 |
| hydration-rsc             | Diagram + example       | HTML, the RSC payload, and client code play different roles.    |
| idempotency               | Diagram + example       | A timeout does not prove that a write failed.                   |
| layout-form-details       | Diagram + example       | Make long content fit the layout, not the other way around.     |
| merge-intervals           | Interactive walkthrough | Sort first, then merge one neighbor at a time.                  |
| mock-company-prep         | Diagram + example       | Prepare the round that is actually scheduled.                   |
| next-request-trace        | Diagram + example       | Separate where work runs from what crosses the network.         |
| next-route-states         | Diagram + example       | Different route outcomes deserve different UI.                  |
| optimistic-forms          | Interactive walkthrough | Show the prediction, then reconcile with the server.            |
| pdf-coverage-checklist    | Diagram + example       | A coverage checklist is a map, not proof of mastery.            |
| performance-investigation | Diagram + example       | One measured hypothesis at a time.                              |
| performance-profiling     | Diagram + example       | Choose a tool for the work that is slow.                        |
| project-stories           | Diagram + example       | Make the decision and its evidence easy to follow.              |
| promise-chains            | Interactive walkthrough | Values, rejections, and recovery travel through the chain.      |
| prototypes-classes        | Interactive walkthrough | Look locally, then follow the prototype.                        |
| react-render-debugging    | Interactive walkthrough | Inspect identity before adding memoization.                     |
| read-only-tools           | Diagram + example       | Read-only still needs a trust boundary.                         |
| redirect-errors           | Diagram + example       | A successful save can still hit the wrong catch.                |
| reducers-context-refs     | Interactive walkthrough | An action updates state; a ref write does not render.           |
| rendering-keys            | Interactive walkthrough | State follows identity, not a row number.                       |
| rest-pagination           | Diagram + example       | Page by a stable order, not by a vague “next” row.              |
| retrieval-evaluation      | Diagram + example       | A citation must support the claim it accompanies.               |
| rsc-boundaries            | Diagram + example       | Keep privileged reads behind the server boundary.               |
| scope-hoisting            | Interactive walkthrough | Created is not the same as initialized.                         |
| search-abort-races        | Interactive walkthrough | A newer query must own the results.                             |
| security-boundary-drills  | Diagram + example       | Match the threat to the boundary it crosses.                    |
| semantic-responsive       | Diagram + example       | Meaning first. Layout second.                                   |
| server-data-fetching      | Diagram + example       | Start a server-owned page near its data.                        |
| sliding-window            | Interactive walkthrough | Keep the window unique.                                         |
| sql-indexes-transactions  | Diagram + example       | Performance and atomicity solve different problems.             |
| sql-joins                 | Interactive walkthrough | One parent can produce several joined rows.                     |
| sql-query-debugging       | Diagram + example       | Keep unmatched parents and count the right thing.               |
| stack-patterns            | Interactive walkthrough | The most recent opener closes first.                            |
| stale-closures            | Interactive walkthrough | A callback remembers the render that created it.                |
| streaming-suspense        | Interactive walkthrough | Reveal one section without waiting for every section.           |
| structured-output         | Diagram + example       | Parsing JSON is not the same as validating a result.            |
| tailwind-tokens           | Diagram + example       | Change a meaning once, reuse it everywhere.                     |
| thinking-in-react         | Interactive walkthrough | Own the query once. Derive the visible list.                    |
| this-binding              | Interactive walkthrough | Follow the receiver at the call site.                           |
| tree-bfs-dfs              | Interactive walkthrough | Same tree. Different frontier.                                  |
| two-pointers              | Interactive walkthrough | Let sorted order decide the next move.                          |
| two-sum-hashmap           | Interactive walkthrough | Find a complement, then remember the value.                     |
| typed-props-api           | Diagram + example       | Establish a runtime fact before narrowing the type.             |
| vercel-deploy             | Diagram + example       | The host needs build output, not your source entry file.        |
| vite-mdx                  | Diagram + example       | Write one lesson, generate the representations it needs.        |
| web-security              | Diagram + example       | Keep data from becoming authority or executable syntax.         |

## Specialized non-interactive drawings

The first three diagram patterns now use topic-specific drawings rather than the generic text-node flow:

- `rsc-boundaries`: distinct server/browser zones, sample private fields, the permitted view model, and a rendered browser preview.
- `layout-form-details` and `semantic-responsive`: nested margin/border/padding/content regions and calculated content-box versus border-box dimensions. The illustration is labeled as a schematic rather than a scale drawing.
- `sql-query-debugging`: related source tables, highlighted primary/foreign keys, the derived LEFT JOIN rows, and the preserved NULL row. `sql-joins` offers the same drawing as an optional reference without resetting the selected interactive example.

Components live in `drawings/`; calculations and sample relational data live in `drawing-models.ts`. Set a visual definition’s optional `drawing` field to choose a drawing. Static diagrams retain semantic HTML labels, tables, captions, and responsive stacking; they do not require motion or color alone to communicate their meaning.

## Complete non-interactive drawing coverage

All 55 static lesson guides now require a drawing. The old prose-node/card fallback and its unused node data have been removed. `drawings/schematic-types.ts` defines the supported diagram vocabulary, and each definition in `data/diagrams.ts` supplies a topic-specific drawing and concrete values.

The vocabulary includes request sequences, artifact pipelines, converging/diverging architecture maps, outcome/state branches, clockwise learning cycles, trust-boundary checks, latency waterfalls, and outcome funnels. Dedicated scenes cover cache scopes, HTML/RSC/client assets, cursor versus offset pagination, theme tokens, sets versus frequency maps, growth functions, profiling tools, and indexes/transactions/query batching. The previously reviewed server/browser zones, nested box model, and SQL join tables remain available.

Labels are HTML text at readable sizes. SVG carries lines, shapes, and timing bars without shrinking label text. Sequence messages have readable sender/receiver descriptions; figures have accessible captions. Examples labeled schematic or illustrative are not actual app measurements. Diagram tests render every static lesson, validate graph references and cycle structure, and check pagination, growth values, timing comparisons, and safe literal rendering of security examples.
