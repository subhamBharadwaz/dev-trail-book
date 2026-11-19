export function boxDimensions(
  width: number,
  padding: number,
  border: number,
  margin: number,
  sizing: "content-box" | "border-box",
) {
  const content =
    sizing === "content-box"
      ? width
      : Math.max(0, width - 2 * padding - 2 * border);
  const borderBox = content + 2 * padding + 2 * border;
  return { content, borderBox, outer: borderBox + 2 * margin };
}

export const exampleNotes = [
  { id: 1, title: "React" },
  { id: 2, title: "SQL" },
];
export const exampleTags = [
  { id: 10, noteId: 1, label: "hooks" },
  { id: 11, noteId: 1, label: "state" },
];
export interface JoinedRow {
  noteId: number;
  title: string;
  tag: string | null;
  tagId: number | null;
}
export function leftJoinExample(): JoinedRow[] {
  return exampleNotes.flatMap<JoinedRow>((note) => {
    const tags = exampleTags.filter((tag) => tag.noteId === note.id);
    return tags.length
      ? tags.map((tag) => ({
          noteId: note.id,
          title: note.title,
          tag: tag.label,
          tagId: tag.id,
        }))
      : [{ noteId: note.id, title: note.title, tag: null, tagId: null }];
  });
}
