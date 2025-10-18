"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Github } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const isMobile = useIsMobile();
  const { data } = useSession();
  if (data) {
    redirect("/");
  }
  if (!data)
    return (
      <>
        <div className="sm:w-[600px] min-w-[275px] flex">
          <Card className={cn("w-full px-1", !isMobile && "rounded-tr-none rounded-br-none")}>
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <button
                  className="bg-white py-2 px-4 shadow cursor-pointer rounded-xl"
                  onClick={() => signIn("google", { redirectTo: "/" })}
                >
                  <Image
                    src={"/google_logo.webp"}
                    width={20}
                    height={3}
                    alt="google"
                  />
                </button>

                <button
                  className="bg-white py-2 px-4 shadow cursor-pointer"
                  onClick={() => signIn("github", { redirectTo: "/" })}
                >
                  <Github />
                </button>
              </div>
            </CardContent>
          </Card>
          {!isMobile && (
            <Image
              src={"/login.jpg"}
              width={250}
              height={400}
              alt="logo"
              className="rounded-tr-2xl rounded-br-2xl"
            />
          )}
        </div>
      </>
    );
}
