// src\features\content-block\components\ContentBlock.tsx

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ContentBlockTable } from "@/drizzle/schema";
import {
  getYouTubeId,
  isValidImageUrl,
} from "@/lib/content-block-utils/validations";
import { CodeIcon, FileTextIcon, LinkIcon, Video } from "lucide-react";
import Image from "next/image";

type ContentBlockProps = {
  input: typeof ContentBlockTable.$inferSelect;
};

const PLACEHOLDER_IMAGE = `/default_image.jpg`;

export default async function ContentBlock({ input }: ContentBlockProps) {
  switch (input.type) {
    /**
     * Renders a simple text block.
     * `content` is the main title/text.
     * `description` is the supporting text.
     */
    case "note":
      return (
        <Card
          className="rounded-sm shadow-sm"
          style={{ backgroundColor: input.bgColor || undefined }}
        >
          <CardContent className="p-4">
            <div className="text-lg font-semibold">{input.content}</div>
            {input.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {input.description}
              </div>
            )}
          </CardContent>
        </Card>
      );
    /**
     * Renders a simple text block.
     * `content` is the main title/text.
     * `description` is the supporting text.
     */

    case "h1":
      return (
        <div className="my-4">
          <div className="text-3xl font-extrabold">{input.content}</div>
          <div className="text-xs text-muted-foreground">
            {input.description}
          </div>
        </div>
      );

    /**
     * Renders an image.
     * `content` is the image URL.
     * `description` is the alt text and optional caption.
     */
    case "image":
      const isServerValid = await isValidImageUrl(input.content);
      const imageUrl = isServerValid ? input.content : PLACEHOLDER_IMAGE;
      return (
        <Card className="my-0 rounded-lg shadow-sm">
          <CardContent className="p-0 m-0 flex items-center justify-center">
            <div className="max-h-[300px] w-full flex items-center justify-center overflow-auto">
              <Image
                src={imageUrl}
                alt={input.description || "LearnVault resource image"}
                width={0}
                height={0}
                sizes="100vw"
                className="h-full w-auto object-contain"
              />
            </div>
          </CardContent>
          {input.description && (
            <CardFooter className="p-3 bg-gray-50 dark:bg-gray-900 border-t">
              <div className="text-sm text-muted-foreground">
                {input.description}
              </div>
            </CardFooter>
          )}
        </Card>
      );

    /**
     * Renders a video.
     * Automatically detects YouTube links and embeds them.
     * Falls back to a standard <video> tag for direct links (.mp4, .webm).
     */
    case "video":
      const videoId = getYouTubeId(input.content);

      if (videoId) {
        // It's a YouTube video
        return (
          <Card className="my-2 overflow-hidden rounded-lg shadow-sm">
            <Video />
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={input.description || "YouTube video player"}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            {input.description && (
              <CardFooter className="p-3 bg-gray-50 dark:bg-gray-900 border-t">
                <div className="text-sm text-muted-foreground">
                  {input.description}
                </div>
              </CardFooter>
            )}
          </Card>
        );
      }

      // It's a direct video link (e.g., .mp4)
      return (
        <Card className="my-2 overflow-hidden rounded-lg shadow-sm">
          <CardContent className="p-0">
            <video
              className="w-full h-auto bg-black"
              controls
              preload="metadata" // Loads metadata (duration, dimensions)
            >
              <source src={input.content} type="video/mp4" />
              <source src={input.content} type="video/webm" />
              <source src={input.content} type="video/ogg" />
              Your browser does not support the video tag.
            </video>
          </CardContent>
          {input.description && (
            <CardFooter className="p-3 bg-gray-50 dark:bg-gray-900 border-t">
              <div className="text-sm text-muted-foreground">
                {input.description}
              </div>
            </CardFooter>
          )}
        </Card>
      );

    /**
     * Renders a clickable link block.
     * `content` is the URL.
     * `description` is the title/display text for the link.
     */
    case "link":
      return (
        <Card className="my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <a
            href={input.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4"
          >
            <LinkIcon className="size-6 text-gray-400 flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
              <div className="text-base font-medium truncate">
                {input.description || "External Link"}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400 truncate">
                {input.content}
              </div>
            </div>
          </a>
        </Card>
      );

    /**
     * Renders a block that links to a PDF.
     * `content` is the PDF URL.
     * `description` is the title/display text.
     */
    case "pdf":
      return (
        <Card className="my-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <a
            href={input.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4"
          >
            <FileTextIcon className="size-6 text-red-600 flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
              <div className="text-base font-medium truncate">
                {input.description || "PDF Document"}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {input.content}
              </div>
            </div>
          </a>
        </Card>
      );

    /**
     * Renders a code block.
     * `content` is the code snippet.
     * `description` is the language (e.g., "JavaScript", "Python").
     */
    case "code":
      return (
        <Card className="my-2 overflow-hidden rounded-lg shadow-sm">
          {input.description && (
            <CardHeader className="flex flex-row items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 border-b">
              <CodeIcon className="size-4 text-muted-foreground" />
              <div className="text-sm font-medium text-muted-foreground">
                {input.description}
              </div>
            </CardHeader>
          )}
          <CardContent className="p-0">
            <pre className="p-4 bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-200 overflow-x-auto">
              <code className="font-mono text-sm">{input.content}</code>
            </pre>
          </CardContent>
        </Card>
      );

    /**
     * Fallback for any unknown content types.
     * This helps with debugging if a new type is added but not rendered.
     */
    default:
      return (
        <Card className="my-2 rounded-lg shadow-sm border-red-500 border">
          <CardHeader>
            <div className="font-bold text-red-600">
              Unknown Content Block Type: &quot;{input.type}&quot;
            </div>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono p-2 rounded">
              {JSON.stringify(input, null, 2)}
            </pre>
          </CardContent>
        </Card>
      );
  }
}
