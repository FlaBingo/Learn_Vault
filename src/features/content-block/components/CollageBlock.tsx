"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CollageBlockProps {
  urls: string[]; // array of image URLs
  description?: string | null;
}

export default function CollageBlock({ urls, description }: CollageBlockProps) {
  if (!urls || urls.length === 0) {
    return (
      <div className="rounded-xl border p-6 text-center text-muted-foreground bg-muted/30">
        No images added yet.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Carousel className="w-full">
        <CarouselContent>
          {urls.map((url, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[350px] sm:h-[400px] rounded-xl overflow-hidden">
                <Image
                  src={url}
                  alt={`Collage image ${index + 1}`}
                  fill
                  className="object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="hidden md:block"/>
        <CarouselNext className="hidden md:block"/> */}
      </Carousel>
    </div>
  );
}
