import {
  Heading1,
  Image,
  Link,
  FileText,
  Type,
  Video,
  Folder,
  Code,
  Images,
  LucideIcon,
} from "lucide-react";
import { ContentType } from "@/drizzle/schema";

export const BLOCK_OPTIONS: {
  id: ContentType;
  label: string;
  contentEl: string;
  contentPlaceholder: string;
  contentMessage?: string;
  descPlaceholder: string;
  descMessage?: string;
  icon: LucideIcon;
  color: string;
  acceptsFile: boolean;
}[] = [
  {
    id: "note",
    label: "Note",
    contentEl: "textarea",
    contentPlaceholder: "Start writing your note...",
    contentMessage: "Plain text area for general notes.",
    descPlaceholder: "Add a short summary...",
    descMessage: "Keep it concise and clear.",
    icon: Type,
    color: "#FDE68A",
    acceptsFile: false,
  },
  {
    id: "h1",
    label: "Heading 1",
    contentEl: "input",
    contentPlaceholder: "Enter main heading...",
    contentMessage: "Use for large section titles.",
    descPlaceholder: "Describe what this section covers...",
    descMessage: "Optional short context.",
    icon: Heading1,
    color: "#A5B4FC",
    acceptsFile: false,
  },
  {
    id: "image",
    label: "Image",
    contentEl: "input",
    contentPlaceholder: "Paste image URL or upload file...",
    contentMessage: "Supports URL or image upload.",
    descPlaceholder: "Describe this image...",
    descMessage: "Explain what the image represents.",
    icon: Image,
    color: "#FCA5A5",
    acceptsFile: true,
  },
  {
    id: "collage",
    label: "Image Collage",
    contentEl: "textarea",
    contentPlaceholder: "Paste multiple image URLs (one per line)...",
    contentMessage: "Add multiple image URLs to create a collage.",
    descPlaceholder: "Describe this collage...",
    descMessage: "Mention what these images collectively represent.",
    icon: Images,
    color: "#FDBA74", // orange
    acceptsFile: true,
  },
  {
    id: "video",
    label: "Video",
    contentEl: "input",
    contentPlaceholder: "Paste YouTube or Vimeo link...",
    contentMessage: "Embed videos via URL.",
    descPlaceholder: "Add a short video description...",
    descMessage: "Summarize what this video shows.",
    icon: Video,
    color: "#93C5FD",
    acceptsFile: false,
  },
  {
    id: "link",
    label: "Web Bookmark/Link",
    contentEl: "input",
    contentPlaceholder: "Paste website URL...",
    contentMessage: "Displays a rich bookmark preview.",
    descPlaceholder: "Describe what this link leads to...",
    descMessage: "Mention why it’s useful or related.",
    icon: Link,
    color: "#86EFAC",
    acceptsFile: false,
  },
  {
    id: "pdf",
    label: "PDF",
    contentEl: "input",
    contentPlaceholder: "Paste PDF link or upload file...",
    contentMessage: "Embeds or links to a PDF document.",
    descPlaceholder: "Add a description of this PDF...",
    descMessage: "Summarize what it contains.",
    icon: FileText,
    color: "#F9A8D4",
    acceptsFile: true,
  },
  {
    id: "folder",
    label: "Folder Name",
    contentEl: "input",
    contentPlaceholder: "Enter folder name...",
    contentMessage: "Create a folder to organize items.",
    descPlaceholder: "Describe the folder contents...",
    descMessage: "Give explanation for organization.",
    icon: Folder,
    color: "#FBBF24",
    acceptsFile: false,
  },
  {
    id: "code",
    label: "Code Block",
    contentEl: "textarea",
    contentPlaceholder: "Write or paste code here...",
    contentMessage: "Supports multiple programming languages.",
    descPlaceholder: "Describe what this code does...",
    descMessage: "Explain logic or purpose.",
    icon: Code,
    color: "#C084FC",
    acceptsFile: false,
  },
];

export type BlockOption = (typeof BLOCK_OPTIONS)[number];
