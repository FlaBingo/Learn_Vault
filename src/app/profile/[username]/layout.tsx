import { metadata } from "@/app/layout";
import type { Metadata } from "next";

metadata.title = "Profile Page";

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
