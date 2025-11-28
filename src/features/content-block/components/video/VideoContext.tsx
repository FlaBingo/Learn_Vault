"use client";

import { createContext, useContext, useState } from "react";

const VideoContext = createContext({
  activeVideo: null as string | null,
  setActiveVideo: (id: string | null) => {},
});

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  return (
    <VideoContext.Provider value={{ activeVideo, setActiveVideo }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideoManager() {
  return useContext(VideoContext);
}
