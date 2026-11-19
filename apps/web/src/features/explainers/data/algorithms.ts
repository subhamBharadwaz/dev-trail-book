import {
  panel,
  scene,
  type Cell,
  type Scenario,
  type VisualCatalog,
  type VisualStep,
  type Walkthrough,
} from "../types";
function cells(
  values: (string | number)[],
  markers: Record<string, number> = {},
  range?: [number, number],
): Cell[] {
  return values.map((value, index) => ({
    id: `value-${index}`,
    value: String(value),
    markers: Object.entries(markers)
      .filter(([, at]) => at === index)
      .map(([label]) => label),
    muted: range
      ? (index < range[0] || index >= range[1]) &&
        !Object.values(markers).includes(index)
      : false,
  }));
}
function frame(
  title: string,
  detail: string,
  values: (string | number)[],
  markers: Record<string, number>,
  memory: string[],
  result: string,
  line: number,
  range?: [number, number],
): VisualStep {
  return {
    title,
    detail,
    line,
    cells: cells(values, markers, range),
    panels: [panel("memory", "Working memory", memory)],
    result,
  };
}
export function twoSum(values: number[], target: number): Scenario {
  const steps: VisualStep[] = [];
  const seen = new Map<number, number>();
  const memory = () =>
    [...seen].map(([value, index]) => `${value} → index ${index}`);
  steps.push(
    frame(
      "Remember earlier values",
      `Find two different indices summing to ${target}. The map is initially empty.`,
      values,
      {},
      [],
      `target = ${target}`,
      0,
    ),
  );
  for (let i = 0; i < values.length; i++) {
    const needed = target - values[i];
    steps.push(
      frame(
        `Inspect index ${i}`,
        `The value is ${values[i]}; its complement is ${needed}. Look up the complement before inserting this index.`,
        values,
        { i },
        memory(),
        `${target} − ${values[i]} = ${needed}`,
        2,
      ),
    );
    if (seen.has(needed)) {
      steps.push(
        frame(
          "A pair of distinct indices",
          `The complement was stored at index ${seen.get(needed)}. Checking first permits duplicates without reusing one element.`,
          values,
          { i, match: seen.get(needed)! },
          memory(),
          `return [${seen.get(needed)}, ${i}]`,
          3,
        ),
      );
      break;
    }
    seen.set(values[i], i);
    steps.push(
      frame(
        "Store this value for later",
        `${needed} was absent. Future iterations may use index ${i}; this iteration cannot match itself.`,
        values,
        { i },
        memory(),
        "No pair found yet",
        4,
      ),
    );
    if (i === values.length - 1)
      steps.push(
        frame(
          "No pair exists",
          "All complements were checked against earlier indices. This contract returns null.",
          values,
          {},
          memory(),
          "return null",
          5,
        ),
      );
  }
  if (values.length === 0)
    steps.push(
      frame(
        "No values to pair",
        "Two distinct positions are required.",
        values,
        {},
        [],
        "return null",
        5,
      ),
    );
  for (const step of steps) step.panels[0].label = "Earlier values → index";
  return {
    id: `${values.join("-")}-${target}`,
    label: `[${values.join(", ")}], target ${target}`,
    code: [
      "const seen = new Map();",
      "for (let i = 0; i < nums.length; i++) {",
      "  const needed = target - nums[i];",
      "  if (seen.has(needed)) return [seen.get(needed), i];",
      "  seen.set(nums[i], i);",
      "} // return null if no pair was found",
    ],
    steps,
  };
}
export function binarySearch(values: number[], target: number): Scenario {
  const steps: VisualStep[] = [];
  let left = 0,
    right = values.length;
  steps.push(
    frame(
      "Start with [left, right)",
      "The right boundary is excluded. Values before left are known to be too small.",
      values,
      { L: left },
      [],
      `left = 0, right = ${right} (excluded), target = ${target}`,
      0,
      [left, right],
    ),
  );
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    steps.push(
      frame(
        `Inspect midpoint ${mid}`,
        `nums[${mid}] is ${values[mid]}. Compare it with ${target}; the remaining interval is [${left}, ${right}).`,
        values,
        { L: left, M: mid, ...(right < values.length ? { R: right } : {}) },
        [],
        `left = ${left}, right = ${right} (excluded)`,
        2,
        [left, right],
      ),
    );
    if (values[mid] < target) {
      left = mid + 1;
      steps.push(
        frame(
          "Discard the lower portion",
          "The midpoint is too small, and so are all values before it in this sorted array.",
          values,
          { L: left },
          [],
          `left = ${left}, right = ${right}`,
          3,
          [left, right],
        ),
      );
    } else {
      right = mid;
      steps.push(
        frame(
          "Keep the midpoint as a candidate",
          "This value is at least the target. Search to its left for an earlier qualifying index.",
          values,
          { L: left, R: right },
          [],
          `left = ${left}, right = ${right} (excluded)`,
          4,
          [left, right],
        ),
      );
    }
  }
  steps.push(
    frame(
      "The interval is empty",
      `Lower bound is index ${left}. ${values[left] === target ? "The value equals the target, so it is also an exact match." : "This is an insertion boundary, not an exact match."}`,
      values,
      left < values.length ? { answer: left } : {},
      [],
      `lowerBound = ${left}; exactMatch = ${values[left] === target}`,
      5,
      [left, left],
    ),
  );
  for (const step of steps) step.panels = [];
  return {
    id: `binary-${target}`,
    label: `Target ${target}`,
    code: [
      "let left = 0, right = nums.length;",
      "while (left < right) {",
      "  const mid = left + Math.floor((right - left) / 2);",
      "  if (nums[mid] < target) left = mid + 1;",
      "  else right = mid;",
      "} // left is the lower bound; check equality separately",
    ],
    steps,
  };
}
export function twoPointers(values: number[], target: number): Scenario {
  let left = 0,
    right = values.length - 1;
  const steps: VisualStep[] = [];
  steps.push(
    frame(
      "Sorted input is the precondition",
      "Keep one pointer at each end. Every move must rule out pairs, not just guess.",
      values,
      { L: left, R: right },
      [],
      `target = ${target}`,
      0,
    ),
  );
  while (left < right) {
    const sum = values[left] + values[right];
    steps.push(
      frame(
        `Compare ${values[left]} + ${values[right]}`,
        `The sum is ${sum}. ${sum < target ? "Even this largest remaining partner is too small for the left value." : sum > target ? "Even this smallest remaining partner is too large for the right value." : "The target is reached using different indices."}`,
        values,
        { L: left, R: right },
        [],
        `sum = ${sum}`,
        2,
      ),
    );
    if (sum === target) {
      steps.push(
        frame(
          "Found the pair",
          "Return the positions in this already-sorted array. Sorting an unsorted array first would change the original index contract.",
          values,
          { L: left, R: right },
          [],
          `return [${left}, ${right}]`,
          3,
        ),
      );
      break;
    }
    if (sum < target) left++;
    else right--;
    steps.push(
      frame(
        sum < target ? "Move left rightward" : "Move right leftward",
        "The sorted order justifies discarding the old endpoint.",
        values,
        { L: left, R: right },
        [],
        `left = ${left}, right = ${right}`,
        4,
      ),
    );
  }
  if (left >= right)
    steps.push(
      frame(
        "The pointers meet",
        "No remaining pair uses two distinct positions.",
        values,
        {},
        [],
        "return null",
        5,
      ),
    );
  for (const step of steps) step.panels = [];
  return {
    id: `pair-${target}`,
    label: `Target ${target}`,
    code: [
      "let left = 0, right = nums.length - 1;",
      "while (left < right) {",
      "  const sum = nums[left] + nums[right];",
      "  if (sum === target) return [left, right];",
      "  if (sum < target) left++; else right--;",
      "} // no pair: return null",
    ],
    steps,
  };
}
export function slidingWindow(text: string): Scenario {
  let left = 0,
    best = 0;
  const last = new Map<string, number>();
  const steps: VisualStep[] = [];
  steps.push(
    frame(
      "An empty unique window",
      "Track the last index of each character. This example uses ASCII characters, so UTF-16 indexing does not split a character.",
      text.split(""),
      {},
      [],
      "best = 0",
      0,
    ),
  );
  for (let right = 0; right < text.length; right++) {
    const char = text[right],
      previous = last.get(char);
    if (previous !== undefined) left = Math.max(left, previous + 1);
    last.set(char, right);
    best = Math.max(best, right - left + 1);
    steps.push(
      frame(
        `Read '${char}' at ${right}`,
        previous === undefined
          ? "This character has not appeared before. Extend the unique window."
          : `Its last index was ${previous}. left = max(previous left, ${previous + 1}) prevents moving the window backward.`,
        text.split(""),
        { L: left, R: right },
        [...last].map(([c, i]) => `${c} → ${i}`),
        `window = "${text.slice(left, right + 1)}"; best length = ${best}`,
        previous === undefined ? 4 : 3,
        [left, right + 1],
      ),
    );
  }
  steps.push(
    frame(
      "The longest length is known",
      "The map keeps last positions, while the window keeps only a contiguous unique range. Expected linear time assumes efficient map operations.",
      text.split(""),
      { L: left },
      [],
      `return ${best}`,
      5,
    ),
  );
  steps.at(-1)!.panels = [
    panel(
      "memory",
      "Last-seen character indices",
      [...last].map(([char, index]) => `${char} → ${index}`),
    ),
  ];
  for (const step of steps)
    step.panels[0].label = "Last-seen character indices";
  return {
    id: `window-${text}`,
    label: `"${text}"`,
    code: [
      "const last = new Map(); let left = 0, best = 0;",
      "for (let right = 0; right < text.length; right++) {",
      "  const char = text[right];",
      "  if (last.has(char)) left = Math.max(left, last.get(char) + 1);",
      "  last.set(char, right); best = Math.max(best, right - left + 1);",
      "} // return best",
    ],
    steps,
  };
}
export function brackets(text: string): Scenario {
  const expected: string[] = [];
  const steps: VisualStep[] = [];
  const closers: Record<string, string> = { "(": ")", "[": "]", "{": "}" };
  let valid = true;
  const state = (title: string, detail: string, i: number, result: string) =>
    steps.push(
      frame(
        title,
        detail,
        text.split(""),
        i >= 0 ? { read: i } : {},
        expected.map(
          (x, index) => `${index === expected.length - 1 ? "top → " : ""}${x}`,
        ),
        result,
        2,
      ),
    );
  state(
    "Track the expected closer",
    "Opening a bracket pushes what must close next. The last expectation must be satisfied first.",
    -1,
    "stack = []",
  );
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (closers[c]) {
      expected.push(closers[c]);
      state(
        `Open ${c}`,
        `Push ${closers[c]}. Earlier expectations must wait below it.`,
        i,
        "continue",
      );
    } else if (![")", "]", "}"].includes(c) || expected.at(-1) !== c) {
      valid = false;
      state(
        "Mismatch: stop here",
        `Read ${c}, but expected ${expected.at(-1) ?? "no closer"}. A different closer cannot skip the top.`,
        i,
        "return false",
      );
      break;
    } else {
      expected.pop();
      state(
        `Close ${c}`,
        "The most recent expectation matches; remove it.",
        i,
        "pop matched closer",
      );
    }
  }
  if (valid)
    state(
      expected.length === 0 ? "Every bracket matched" : "An opener remains",
      expected.length === 0
        ? "The input ended with no unmatched expectations."
        : "Finishing the input is not enough when the stack still contains expected closers.",
      -1,
      `return ${expected.length === 0}`,
    );
  for (const step of steps)
    step.panels[0].label = "Expected closers · top is marked";
  return {
    id: `brackets-${text}`,
    label: text,
    code: [
      'const closing = { "(": ")", "[": "]", "{": "}" };',
      "const expected = [];",
      "for (const char of text) {",
      "  if (Object.hasOwn(closing, char)) expected.push(closing[char]);",
      '  else if (![")", "]", "}"].includes(char) || expected.pop() !== char) return false;',
      "}",
      "return expected.length === 0;",
    ],
    steps,
  };
}
export function traversal(mode: "BFS" | "DFS"): Scenario {
  const children: Record<string, string[]> = {
    A: ["B", "C"],
    B: ["D", "E"],
    C: ["F"],
    D: [],
    E: [],
    F: [],
  };
  const pending = ["A"],
    visited: string[] = [];
  const steps: VisualStep[] = [];
  const snap = (title: string, detail: string, current?: string) =>
    steps.push({
      title,
      detail,
      tree: {
        values: ["A", "B", "C", "D", "E", "F"],
        active: current ? ["ABCDEF".indexOf(current)] : [],
        visited: visited.map((node) => "ABCDEF".indexOf(node)),
      },
      line: title.startsWith("Start")
        ? 0
        : title.startsWith("Add")
          ? 4
          : title.startsWith("Visit")
            ? 2
            : 6,
      cells: cells(
        ["A", "B", "C", "D", "E", "F"],
        current ? { visit: "ABCDEF".indexOf(current) } : {},
      ),
      panels: [
        panel(
          "frontier",
          mode === "BFS" ? "Queue: next at left" : "Stack: top at right",
          [...pending],
        ),
        panel("visited", "Visit order", [...visited]),
      ],
      result: "Tree: A → B, C; B → D, E; C → F",
    });
  snap(
    `Start ${mode} at A`,
    mode === "BFS"
      ? "A queue visits nodes by distance from the root."
      : "A stack follows a branch. Push right children first so left children are visited first.",
  );
  while (pending.length) {
    const node = mode === "BFS" ? pending.shift()! : pending.pop()!;
    visited.push(node);
    snap(
      `Visit ${node}`,
      mode === "BFS"
        ? "Remove from the front of the queue."
        : "Pop the top of the stack.",
      node,
    );
    pending.push(
      ...(mode === "BFS" ? children[node] : [...children[node]].reverse()),
    );
    snap(
      `Add ${node}’s children`,
      children[node].length
        ? "Keep the pending frontier visible before the next visit."
        : "This is a leaf; no children are added.",
      node,
    );
  }
  snap(
    "Traversal finished",
    "Every node was reached once. This is a tree without cycles; general graphs also need visited tracking.",
  );
  for (const step of steps) delete step.cells;
  return {
    id: mode,
    label: mode,
    code: [
      "const pending = [root], order = [];",
      mode === "BFS"
        ? "for (let head = 0; head < pending.length; head++) {"
        : "while (pending.length) {",
      mode === "BFS"
        ? "  const node = pending[head];"
        : "  const node = pending.pop();",
      "  order.push(node.value);",
      mode === "BFS"
        ? "  pending.push(...children(node));"
        : "  pending.push(...children(node).slice().reverse());",
      "}",
      "return order; // children(node) returns left-to-right children",
    ],
    steps,
  };
}
export function mergeIntervals(input: number[][]): Scenario {
  const sorted = input.map((pair) => [...pair]).sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  const steps: VisualStep[] = [];
  const snap = (title: string, detail: string, index: number) =>
    steps.push({
      title,
      detail,
      line: 2,
      cells: cells(
        sorted.map((p) => `[${p}]`),
        index >= 0 ? { scan: index } : {},
      ),
      panels: [
        panel(
          "merged",
          "Merged output",
          merged.map((p) => `[${p.join(", ")}]`),
        ),
      ],
      result: "Closed intervals: touching endpoints count as overlap.",
    });
  snap(
    "Sort copies by start",
    "The visual array below is sorted; sorting costs O(n log n). The input’s nested arrays are not mutated.",
    -1,
  );
  sorted.forEach((pair, i) => {
    const last = merged.at(-1);
    if (last && pair[0] <= last[1]) {
      const old = last[1];
      last[1] = Math.max(last[1], pair[1]);
      snap(
        "Extend the current interval",
        `${pair[0]} ≤ ${old}, so merge and keep the farther end ${last[1]}.`,
        i,
      );
    } else {
      merged.push([...pair]);
      snap(
        "Begin a separate interval",
        last
          ? "A gap separates this start from the previous end."
          : "The first interval starts the output.",
        i,
      );
    }
  });
  snap(
    "Return the merged ranges",
    "The ordered scan is complete. Half-open interval contracts may use a different overlap comparison.",
    -1,
  );
  return {
    id: JSON.stringify(input),
    label: input.map((x) => `[${x}]`).join(" "),
    code: [
      "const sorted = input.map(p => [...p]).sort((a,b) => a[0]-b[0]);",
      "const merged = [];",
      "for (const [start, end] of sorted) {",
      "  const last = merged.at(-1);",
      "  if (last && start <= last[1]) last[1] = Math.max(last[1], end);",
      "  else merged.push([start, end]);",
      "}",
      "return merged;",
    ],
    steps,
  };
}
export function heapInsert(value: number): Scenario {
  const heap = [2, 5, 3, 9, 7];
  const steps: VisualStep[] = [];
  const snap = (title: string, detail: string, i: number, parent?: number) =>
    steps.push(
      frame(
        title,
        detail,
        [...heap],
        { child: i, ...(parent !== undefined ? { parent } : {}) },
        [],
        `heap = [${heap.join(", ")}]`,
        2,
      ),
    );
  snap(
    "A valid min-heap",
    "Each parent is no larger than its children. The array is not globally sorted; parent(i) = floor((i−1)/2).",
    0,
  );
  heap.push(value);
  let i = heap.length - 1;
  snap(
    `Append ${value}`,
    "Insertion starts at the next free array position.",
    i,
  );
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    snap(
      "Compare with the parent",
      `${heap[parent]} ≤ ${heap[i]}? Only this ancestor path may need repair.`,
      i,
      parent,
    );
    if (heap[parent] <= heap[i]) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]];
    i = parent;
    snap(
      "Swap upward",
      "The smaller value moves toward the root. Repeat until the parent invariant holds.",
      i,
    );
  }
  snap(
    "Heap order restored",
    "Insertion takes O(log n) in the worst case. This example does not implement removal or sift-down.",
    i,
  );
  for (const step of steps)
    step.tree = {
      values: step.cells!.map((cell) => cell.value),
      active: step.cells!.flatMap((cell, index) =>
        cell.markers?.length ? [index] : [],
      ),
    };
  for (const step of steps) step.panels = [];
  return {
    id: `heap-${value}`,
    label: `Insert ${value}`,
    code: [
      "heap.push(value);",
      "let i = heap.length - 1;",
      "while (i > 0) {",
      "  const parent = Math.floor((i - 1) / 2);",
      "  if (heap[parent] <= heap[i]) break;",
      "  [heap[parent], heap[i]] = [heap[i], heap[parent]];",
      "  i = parent;",
      "}",
    ],
    steps,
  };
}
export function anagrams(words: string[]): Scenario {
  const groups = new Map<string, string[]>();
  const steps: VisualStep[] = [];
  steps.push(
    scene(
      "Start with no groups",
      "Assume lowercase English strings. Equal sorted signatures belong in one bucket.",
      [panel("groups", "Signature → words", [])],
      0,
    ),
  );
  words.forEach((word, index) => {
    const key = word.split("").sort().join("");
    groups.set(key, [...(groups.get(key) ?? []), word]);
    steps.push({
      title: `Group ${word}`,
      detail: `Sorting its letters gives '${key}'. Append to that signature’s bucket, preserving duplicate words.`,
      line: 1,
      cells: cells(words, { word: index }),
      panels: [
        panel(
          "groups",
          "Signature → words",
          [...groups].map(([k, v]) => `${k}: ${v.join(", ")}`),
        ),
      ],
      result: `key = "${key}"`,
    });
  });
  steps.push(
    scene(
      "Return the grouped values",
      "Sorting-based keys cost roughly O(n k log k) for n words of maximum length k.",
      [
        panel(
          "groups",
          "Anagram groups",
          [...groups.values()].map((words) => words.join(", ")),
        ),
      ],
      2,
    ),
  );
  return {
    id: words.join("-"),
    label: words.join(", "),
    code: [
      "const groups = new Map();",
      "for (const word of words) {",
      '  const key = word.split("").sort().join("");',
      "  groups.set(key, [...(groups.get(key) ?? []), word]);",
      "}",
      "return [...groups.values()];",
    ],
    steps,
  };
}
function walk(
  title: string,
  intro: string,
  scenarios: Scenario[],
  takeaway: string,
): Walkthrough {
  return { kind: "walkthrough", title, intro, scenarios, takeaway };
}
export const visuals: VisualCatalog = {
  "two-sum-hashmap": walk(
    "Find a complement, then remember the value.",
    "Watch the map change while the scan moves forward.",
    [twoSum([2, 7, 11, 15], 9), twoSum([3, 3], 6), twoSum([1, 2, 4], 8)],
    "The map contains earlier indices only. Check before inserting so an element cannot match itself.",
  ),
  "binary-search": walk(
    "Shrink the interval without losing the answer.",
    "Lower bound uses [left, right); right is excluded.",
    [
      binarySearch([1, 3, 3, 5, 8, 12], 3),
      binarySearch([1, 3, 3, 5, 8, 12], 6),
      binarySearch([1, 3, 3, 5, 8, 12], 20),
    ],
    "A lower bound is an insertion index. Verify equality when the caller needs an exact match.",
  ),
  "two-pointers": walk(
    "Let sorted order decide the next move.",
    "Move one endpoint only after its possible pairs have been ruled out.",
    [
      twoPointers([1, 2, 4, 6, 9], 10),
      twoPointers([1, 2, 4, 6, 9], 8),
      twoPointers([1, 2, 4, 6, 9], 20),
    ],
    "This reasoning requires sorted input; it does not justify pointer moves in an arbitrary array.",
  ),
  "sliding-window": walk(
    "Keep the window unique.",
    "Follow the left boundary, right boundary, and last-seen map.",
    [slidingWindow("abcabcbb"), slidingWindow("abba")],
    "left must never move backward. A repeat outside the current window must not reopen discarded positions.",
  ),
  "stack-patterns": walk(
    "The most recent opener closes first.",
    "Compare a valid bracket sequence with an early mismatch.",
    [brackets("([])"), brackets("([)]"), brackets("(()")],
    "Matching every closer is not enough: the expected-closer stack must also be empty at the end.",
  ),
  "tree-bfs-dfs": walk(
    "Same tree. Different frontier.",
    "Switch between breadth-first and depth-first traversal.",
    [traversal("BFS"), traversal("DFS")],
    "BFS uses a FIFO queue; DFS uses a LIFO stack. The frontier determines which node comes next.",
  ),
  "merge-intervals": walk(
    "Sort first, then merge one neighbor at a time.",
    "See which interval extends the current range and which starts a new one.",
    [
      mergeIntervals([
        [8, 10],
        [1, 3],
        [2, 6],
        [15, 18],
      ]),
      mergeIntervals([
        [1, 2],
        [2, 3],
        [5, 7],
      ]),
    ],
    "The interval contract matters: these are closed ranges, so touching endpoints merge.",
  ),
  "heap-basics": walk(
    "Repair one path up a min-heap.",
    "Watch an appended value compare and swap with its parent.",
    [heapInsert(1), heapInsert(8)],
    "A heap is partially ordered, not sorted. Its root is the minimum because every parent-child edge obeys the invariant.",
  ),
  "group-anagrams": walk(
    "Different words, the same signature.",
    "Watch words collect into buckets by their sorted characters.",
    [
      anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]),
      anagrams(["a", "a", "b"]),
    ],
    "A canonical key must fit the input alphabet. Sorting is simple; frequency signatures require an unambiguous encoding.",
  ),
};
