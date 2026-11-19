export interface StudyGuide {
  prerequisites: string[];
  next: string | null;
  recall: string;
  exercise: {
    task: string;
    hint: string;
    edgeCases: string;
    solutionNotes: string[];
    successCriteria: string[];
  };
  review: {
    revisedOn: string;
    reviewedOn: string | null;
    versionNote: string;
  };
}

export interface TopicMeta {
  study?: StudyGuide;
  category: string;
  slug: string;
  title: string;
  description: string;
  minutes: number;
  level: string;
  tags: string[];
  questions: { question: string; answer: string }[];
  facts: string[];
  source: string;
  code: string;
  codeLanguage?: string;
  origin?: "discussion" | "study-plan" | "foundation";
  planWeek?: number;
  planPages?: number[];
  planRecordedStatus?: "covered" | "pending";
  optional?: boolean;
  quizDistractors?: string[];
  discussionSource?: { title: string; url: string };
}

export interface MarkdownNode {
  type: string;
  value?: string;
  depth?: number;
  url?: string;
  lang?: string;
  ordered?: boolean;
  start?: number;
  checked?: boolean | null;
  children?: MarkdownNode[];
}
export interface NativeTopic extends TopicMeta {
  body: MarkdownNode;
  searchText: string;
}
