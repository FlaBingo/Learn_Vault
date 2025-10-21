import { Heading1, Image, Link, FileText, Type, Video } from 'lucide-react';

// --- Configuration ---
// For this self-contained component, we define BLOCK_OPTIONS here.
// You can move this back to your utils file.
export const BLOCK_OPTIONS = [
    { id: 'text', tag: 'p', label: 'Text', description: 'Just start writing with plain text.', icon: Type },
    { id: 'h1', tag: 'h1', label: 'Heading 1', description: 'Big section heading.', icon: Heading1 },
    { id: 'image', tag: 'div', label: 'Image', description: 'Upload or embed with a link.', icon: Image },
    { id: 'video', tag: 'div', label: 'Video', description: 'Embed from YouTube, Vimeo...', icon: Video },
    { id: 'link', tag: 'div', label: 'Web Bookmark', description: 'A visual bookmark.', icon: Link },
    { id: 'pdf', tag: 'div', label: 'PDF', description: 'Embed a PDF file.', icon: FileText },
];
export type BlockOption = typeof BLOCK_OPTIONS[number];