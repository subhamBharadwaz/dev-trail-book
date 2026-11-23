# Lesson code playgrounds

The web lessons `/topic/closures`, `/topic/event-loop` and `/topic/binary-search` include an editable JavaScript playground beneath their explanation. Run is explicit; nothing executes on page load. Reset cancels the current run and restores the starter. Edits remain temporary and do not affect study records.

- Closures: change a counter and compare independent instances with the reference output.
- Event loop: enter a predicted order, run, then compare synchronous logs, microtasks and timers. Reference output can also be revealed before running.
- Binary search: edit `lowerBound`, the sorted number array and target. Presets cover an empty array, duplicates, an absent target and a single value. Expected results come from a separate reference calculation for the selected inputs.

## Execution boundary

Each run creates a dedicated worker inside an iframe with `sandbox="allow-scripts"`, without same-origin permission. The frame's CSP blocks network requests and external resources. Learner code is sent as a message, never inserted into the frame's HTML. It has no access to the application DOM, account storage or cookies. No server execution or external service is used.

The parent page removes the runtime after three seconds, on cancellation, on reset and on unmount. Output is capped at 100 lines and 12,000 characters, with each line capped at 1,000 characters. Repeating intervals are disabled. Syntax, runtime, timer and microtask errors produce visible feedback. Browser resource exhaustion cannot be given a hard memory quota; this is a small educational runner, not a general-purpose hostile-code hosting service.

## Validation

Tests cover reference outputs, binary-search input validation and edge cases, asynchronous failures, output limits, cancellation, message source validation and keyboard-accessible controls. The serialized runtime also runs in Node worker threads to verify that an infinite loop can be terminated without blocking the calling thread. DOM tests inspect the sandbox and message boundary.

A real browser is still needed to validate browser-specific sandboxed Blob worker support, responsive appearance and the complete execution path. These are not established by Node/jsdom tests. Unsupported browsers receive an explicit startup error.
