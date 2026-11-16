const istOffset = 330 * 60_000;
export const studyLines = [
  "Your interview will expose what you skipped. Do one real attempt.",
  "Plans do not count as practice. Explain one answer without notes.",
  "December will not wait for your mood. Start your twenty minutes.",
  "Stop collecting topics. Solve a problem and test an edge case.",
  "Scrolling is easy. Clear explanations take practice. Choose practice.",
  "An unread lesson cannot answer for you. Open it and do the work.",
  "Confidence needs evidence. Finish one thing you can explain.",
  "You do not need another perfect plan. You need the next honest attempt.",
];
export function studyLine(now = Date.now()) {
  return studyLines[Math.floor(now / (4 * 60 * 60_000)) % studyLines.length];
}
export function reminderSchedule(now = Date.now(), days = 14) {
  const shifted = new Date(now + istOffset),
    midnight =
      Date.UTC(
        shifted.getUTCFullYear(),
        shifted.getUTCMonth(),
        shifted.getUTCDate(),
      ) - istOffset;
  const slots = [];
  for (let d = 0; d < days; d++)
    for (const [slot, hour] of [9, 13, 17, 21].entries()) {
      const at = midnight + d * 86400000 + hour * 3600000;
      if (at > now + 60_000)
        slots.push({
          id: `trailbook-study-${at}`,
          at,
          line: studyLines[
            (Math.floor(midnight / 86400000) * 4 + d * 4 + slot) %
              studyLines.length
          ],
        });
    }
  return slots;
}
