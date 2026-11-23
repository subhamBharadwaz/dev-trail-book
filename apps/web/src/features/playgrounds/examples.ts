export const examples = {
  closures: {
    title: "Make the counter yours",
    instruction:
      "Change the starting value or call each counter more times. Each call to createCounter creates independent state.",
    code: `function createCounter(start = 0) {
  let count = start;
  return () => ++count;
}

const next = createCounter();
console.log(next());
console.log(next());

const independent = createCounter();
console.log(independent());`,
    expected: ["1", "2", "1"],
  },
  "event-loop": {
    title: "Predict it. Then run it.",
    instruction:
      "Write the order you expect below. Try moving a log into a promise or a timer and predict again.",
    code: `console.log("A");
setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("promise"));
queueMicrotask(() => console.log("microtask"));
console.log("B");`,
    expected: ["A", "B", "promise", "microtask", "timer"],
  },
  "binary-search": {
    title: "Put your search to the test",
    instruction:
      "Edit lowerBound, then change its sorted array and target. Run calls your function and prints the returned index and whether it is an exact match.",
    code: `function lowerBound(nums, target) {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] < target) left = mid + 1;
    else right = mid;
  }
  return left;
}`,
    expected: [] as string[],
  },
} as const;
export type PlaygroundId = keyof typeof examples;
export function isPlayground(slug: string): slug is PlaygroundId {
  return Object.hasOwn(examples, slug);
}
export function binaryInput(array: string, targetText: string) {
  let nums: unknown;
  try {
    nums = JSON.parse(array);
  } catch {
    throw new Error("Enter the array as JSON, for example [1, 3, 3, 8].");
  }
  if (
    !Array.isArray(nums) ||
    nums.length > 500 ||
    !nums.every((value) => typeof value === "number" && Number.isFinite(value))
  )
    throw new Error("Use an array of at most 500 finite numbers.");
  if (nums.some((value, index) => index > 0 && value < nums[index - 1]))
    throw new Error(
      "Binary search needs an array sorted from smallest to largest.",
    );
  if (!targetText.trim() || !Number.isFinite(Number(targetText)))
    throw new Error("Enter a finite number for the target.");
  const target = Number(targetText);
  const found = nums.findIndex((value) => value >= target);
  const index = found < 0 ? nums.length : found;
  return {
    nums: nums as number[],
    target,
    expected: [
      `Index: ${index}`,
      `Exact match: ${index < nums.length && nums[index] === target}`,
    ],
  };
}
export const binaryHarness = `
const result = lowerBound(input.nums, input.target);
console.log("Index:", result);
console.log("Exact match:", result < input.nums.length && input.nums[result] === input.target);`;
