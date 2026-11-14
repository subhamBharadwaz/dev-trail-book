import {
  Map,
  Route,
  GraduationCap,
  Bookmark,
  CircleHelp,
  Compass,
  FolderOpen,
  Lightbulb,
} from "lucide-react";
export const workspaceNavigation = [
  { href: "/", name: "Overview", Icon: Compass },
  { href: "/roadmap", name: "Study roadmap", Icon: Map },
  { href: "/paths", name: "Learning paths", Icon: Route },
  { href: "/practice", name: "Practice", Icon: GraduationCap },
  { href: "/topics", name: "All topics", Icon: FolderOpen },
  { href: "/saved", name: "Saved topics", Icon: Bookmark },
  { href: "/questions", name: "Questions & answers", Icon: CircleHelp },
  { href: "/facts", name: "Must-know facts", Icon: Lightbulb },
];
