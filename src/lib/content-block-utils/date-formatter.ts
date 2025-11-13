// src\lib\content-block-utils\date-formatter.ts

import { format } from "date-fns";

export function formatUpdateDate(dateString: string) {
  return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
}

export function formatCreateDate(dateString: string){
  return format(new Date(dateString), "dd MMM yyyy");
}

// A helper function to format time (e.g., "5 minutes ago")
export function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}