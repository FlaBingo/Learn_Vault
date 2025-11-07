// src\lib\content-block-utils\date-formatter.ts

import { format } from "date-fns";

export function formatUpdateDate(dateString: string) {
  return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
}

export function formatCreateDate(dateString: string){
  return format(new Date(dateString), "dd MMM yyyy");
}