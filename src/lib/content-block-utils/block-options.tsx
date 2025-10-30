// src/lib/content-block-utils/block-options.tsx
import {
  Heading1,
  Image,
  Link,
  FileText,
  Type,
  Video,
  Folder,
  LucideIcon,
} from "lucide-react";
import { ContentType } from "@/drizzle/schema";
// --- Configuration ---


// i don't think i need action funtion
export const BLOCK_OPTIONS: {
  id: ContentType;
  tag: string;
  label: string;
  icon: LucideIcon;
  description: string;
  action: () => void;
}[] = [
  {
    id: "note",
    tag: "p",
    label: "Note",
    description: "Just start writing with plain text.",
    icon: Type,
    action: () => {
      console.log("action in text");
    },
  },
  {
    id: "h1",
    tag: "h1",
    label: "Heading 1",
    description: "Big section heading.",
    icon: Heading1,
    action: () => {
      console.log("action in h1");
    },
  },
  {
    id: "image",
    tag: "div",
    label: "Image",
    description: "Upload or embed with a link.",
    icon: Image,
    action: () => {
      console.log("action in text");
    },
  },
  {
    id: "video",
    tag: "div",
    label: "Video",
    description: "Embed from YouTube, Vimeo...",
    icon: Video,
    action: () => {
      console.log("action in text");
    },
  },
  {
    id: "link",
    tag: "div",
    label: "Web Bookmark/Link",
    description: "A visual bookmark.",
    icon: Link,
    action: () => {
      console.log("action in text");
    },
  },
  {
    id: "pdf",
    tag: "div",
    label: "PDF",
    description: "Embed a PDF file.",
    icon: FileText,
    action: () => {
      console.log("action in text");
    },
  },
  {
    id: "folder",
    tag: "div",
    label: "Folder Name",
    description: "Create a folder to store more specific content.",
    icon: Folder,
    action: () => {
      console.log("action in text");
    },
  },
  {
    id: "code",
    tag: "div",
    label: "Code Block",
    description: "Write the code for future reference.",
    icon: Folder,
    action: () => {
      console.log("action in text");
    },
  },
];
export type BlockOption = (typeof BLOCK_OPTIONS)[number];
