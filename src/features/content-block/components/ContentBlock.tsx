// src\features\content-block\components\ContentBlock.tsx

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { collaboratorRole, ContentBlockTable } from "@/drizzle/schema";
import {
  getYouTubeId,
  isValidImageUrl,
} from "@/lib/content-block-utils/validations";
import { CodeIcon, FileTextIcon, Folder, LinkIcon, MessageCircleQuestionMark, NotepadText, Video } from "lucide-react";
import Image from "next/image";
import CollageBlock from "./CollageBlock";
import { ContentActionButtons } from "./ContentActionButtons";
import Link from "next/link";
import { auth } from "@/services/auth";
import { userRepoRole } from "../actions/content-block";
import { getRepoById } from "@/features/repo/actions/repo";
import QnABlock from "./QnABlock";
import NoteBlock from "./NoteBlock";

type ContentBlockProps = {
  input: typeof ContentBlockTable.$inferSelect;
  slug?: string[];
};

const PLACEHOLDER_IMAGE = `/default_image.jpg`;

export default async function ContentBlock({ input, slug }: ContentBlockProps) {
  // const color = BLOCK_OPTIONS.filter((option) => input.type === option.id)[0].color;
  const session = await auth();
  const userId = session?.user?.id;
  let role: collaboratorRole | undefined;
  if (userId) {
    role = (await userRepoRole(userId, input.repoId)).data?.role;
  }
  const repo = await getRepoById(input.repoId);
  const owner: boolean = !!userId && repo.data?.userId === userId;

  // const selectedType = BLOCK_OPTIONS.filter((option) => option.id === input.type)[0]; // doesn't work here
  switch (input.type) {
    /**
     * Renders a simple text block.
     * `content` is the main title/text.
     * `description` is the supporting text.
     */
    case "note":
      return (
        <Card
          className={`my-2 mx-[-10px] md:mx-0 rounded-sm shadow-sm hover:border-primary selection:bg-[#FDE68A] selection:text-black`}
        >
          <CardContent className="px-4 flex gap-3">
            <NotepadText className="flex-shrink-0"/>
            <NoteBlock input={input}/>
          </CardContent>
          <CardFooter className="flex text-sm justify-between items-center">
            <ContentActionButtons
              input={input}
              userId={userId}
              role={role}
              owner={owner}
            />
          </CardFooter>
        </Card>
      );
    /**
     * Renders a simple text block.
     * `content` is the main title/text.
     * `description` is the supporting text.
     */

    case "h1":
      return (
          <div className="my-4 mt-6 flex items-center justify-between selection:bg-[#A5B4FC] selection:text-black">
          <div className="">
            <div className="text-5xl font-extrabold">{input.content}</div>
            <div className="text-xs text-muted-foreground">
              {input.description}
            </div>
          </div>
          <ContentActionButtons
            input={input}
            userId={userId}
            role={role}
            owner={owner}
          />
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
        <Card className="my-2 mx-[-10px] md:mx-0 rounded-lg shadow-sm hover:border-primary selection:bg-[#FCA5A5] selection:text-black">
          <CardContent className="p-0 m-0">
            <div className="md:max-h-[500px] w-full flex items-center justify-center overflow-auto">
              <Image
                src={imageUrl}
                alt={input.description || "LearnVault resource image"}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full md:h-full md:w-auto object-contain"
              />
            </div>
            {input.description && (
              <div className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 dark:bg-gray-900 border-t">
                {input.description}
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm flex justify-between items-center">
            <ContentActionButtons
              input={input}
              userId={userId}
              role={role}
              owner={owner}
            />
          </CardFooter>
        </Card>
      );

    case "collage": {
      let urls: string[] = [];

      try {
        if (input.content?.startsWith("[") && input.content?.endsWith("]")) {
          urls = JSON.parse(input.content);
        } else {
          urls =
            input.content
              ?.split("\n")
              .map((u) => u.trim())
              .filter(Boolean) || [];
        }
      } catch (error) {
        console.error("Error parsing collage URLs:", error);
        urls = [];
      }

      return (
        <Card className="my-2 mx-[-10px] md:mx-0 rounded-lg shadow-sm hover:border-primary selection:bg-[#FDBA74] selection:text-black">
          <CardContent className="p-0">
            <CollageBlock urls={urls} />
            {input.description && (
              <div className="text-sm text-muted-foreground mt-2 p-3 bg-gray-50 dark:bg-gray-900 border-t">
                {input.description}
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm flex justify-between items-center">
            <ContentActionButtons
              input={input}
              userId={userId}
              role={role}
              owner={owner}
            />
          </CardFooter>
        </Card>
      );
    }

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
          <Card className="my-2 mx-[-10px] md:mx-0 overflow-hidden rounded-lg shadow-sm hover:border-primary selection:bg-[#93C5FD] selection:text-black">
            {/* <Video /> */}
            <div className="aspect-video w-full max-h-[300px] bg-black">
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
              <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t">
                <div className="text-sm text-muted-foreground">
                  {input.description}
                </div>
              </div>
            )}
            <CardFooter className="text-sm flex justify-between items-center">
              <ContentActionButtons
                input={input}
                userId={userId}
                role={role}
                owner={owner}
              />
            </CardFooter>
          </Card>
        );
      }

      // It's a direct video link (e.g., .mp4)
      return (
        <Card className="my-2 mx-[-10px] md:mx-0 overflow-hidden rounded-lg shadow-sm hover:border-primary selection:bg-[#93C5FD] selection:text-black">
          <CardContent className="p-0 max-h-[300px]">
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
            {input.description && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t">
                <div className="text-sm text-muted-foreground">
                  {input.description}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm flex justify-between items-center">
            <ContentActionButtons
              input={input}
              userId={userId}
              role={role}
              owner={owner}
            />
          </CardFooter>
        </Card>
      );

    /**
     * Renders a clickable link block.
     * `content` is the URL.
     * `description` is the title/display text for the link.
     */
    case "link":
      return (
        <Card className="w-full min-w-0 my-2 mx-[-10px] md:mx-0 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:border-primary selection:bg-[#86EFAC] selection:text-black">
          <div className="flex justify-between">
            <a
              href={input.content}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-4 px-4 overflow-hidden"
            >
              <LinkIcon className="size-6 text-gray-400 flex-shrink-0" />
              <div className="flex-grow overflow-hidden min-w-0">
                <div className="text-base font-medium">
                  {input.description || "External Link"}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400 truncate break-all">
                  {input.content}
                </div>
              </div>
            </a>
          </div>
          <CardFooter className="text-sm flex justify-between items-center">
            <ContentActionButtons
              input={input}
              userId={userId}
              role={role}
              owner={owner}
            />
          </CardFooter>
        </Card>
      );

    /**
     * Renders a block that links to a PDF.
     * `content` is the PDF URL.
     * `description` is the title/display text.
     */
    case "pdf":
      return (
        <Card className="my-2 mx-[-10px] md:mx-0 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:border-primary">
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
        <Card className="my-2 mx-[-10px] md:mx-0 overflow-hidden rounded-lg shadow-sm hover:border-primary selection:bg-[#C084FC] selection:text-black">
          {input.description && (
            <CardHeader className="flex flex-row items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 border-b">
              <CodeIcon className="size-4 text-muted-foreground flex-shrink-0" />
              <div className="text-sm font-medium text-muted-foreground">
                {input.description}
              </div>
            </CardHeader>
          )}
          <CardContent className="p-0">
            <pre className="p-4 overflow-x-auto">
              <code className="font-mono text-sm">{input.content}</code>
            </pre>
          </CardContent>
          <CardFooter className="text-sm flex justify-between items-center">
            <ContentActionButtons
              input={input}
              userId={userId}
              role={role}
              owner={owner}
            />
          </CardFooter>
        </Card>
      );

    case "folder": {
      const folderIds = slug?.join("/");
      // console.log(folderIds);
      return (
        <>
          <Card className="my-2 mx-[-10px] md:mx-0 overflow-hidden rounded-lg shadow-sm hover:border-primary selection:bg-[#FBBF24] selection:text-black">
            <CardContent>
              <Link
                href={`/repo/${input.repoId}/${folderIds ? folderIds : ""}/${
                  input.id
                }`}
              >
                <div className="text-3xl font-extrabold flex items-center gap-4">
                  <Folder className="inline size-8 flex-shrink-0" />
                  {input.content}
                </div>
                <div className="text-sm text-muted-foreground my-0.5">
                  {input.description}
                </div>
              </Link>
            </CardContent>
            <CardFooter className="text-sm flex justify-between items-center">
              <ContentActionButtons
                input={input}
                userId={userId}
                role={role}
                owner={owner}
              />
            </CardFooter>
          </Card>
        </>
      );
    }

    case "qna": {
      return (
        <>
          <Card className={`my-2 mx-[-10px] md:mx-0 overflow-hidden rounded-lg shadow-sm hover:border-primary selection:bg-[#2DD4BF] selection:text-black`}>
            <CardHeader className="flex gap-4">
              <MessageCircleQuestionMark className="flex-shrink-0"/>
              <CardTitle className="font-semibold">{input.content}</CardTitle>
            </CardHeader>
            <QnABlock input={input} />
            <CardFooter className="text-sm flex justify-between items-center">
              <ContentActionButtons
                input={input}
                userId={userId}
                role={role}
                owner={owner}
              />
            </CardFooter>
          </Card>
        </>
      );
    }

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
