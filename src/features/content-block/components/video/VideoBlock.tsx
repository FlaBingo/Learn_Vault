"use client";


import { useVideoManager } from "./VideoContext";
import Image from "next/image";

export default function VideoBlock({ videoId, description }: { videoId: string, description: string}) {
  const { activeVideo, setActiveVideo } = useVideoManager();
  const isActive = activeVideo === videoId;

  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const handlePlay = () => setActiveVideo(videoId);
  const handlePause = () => setActiveVideo(null);

  return (
    <div className="w-full">

      {!isActive ? (
        <div
          className="relative aspect-video bg-black cursor-pointer"
          onClick={handlePlay}
        >
          <Image
            width={300}
            height={300}
            src={thumbnail}
            alt="Video Thumbnail"
            className="w-full h-full object-cover opacity-90"
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-xl text-3xl">
              ▶
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>


          <button
            onClick={handlePause}
            className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs"
          >
            ✕
          </button>
        </div>
      )}


      {description && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t text-sm text-muted-foreground">
          {description}
        </div>
      )}
    </div>
  );
}
