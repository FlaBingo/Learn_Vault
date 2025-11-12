"use client";
import React from "react";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";

export const Navbar = () => {
  const { data } = useSession();
  const email = data?.user?.email;
  const username = email?.substring(0, Number(email.indexOf("@")));
  return (
    <div className="container mx-auto px-5 py-3 shadow flex justify-between items-center sticky top-0 backdrop-blur-lg bg-opacity-30 z-50">
      <div className="font-extrabold cursor-pointer">
        <Link href={"/"}>LearnVault</Link>
      </div>
      <div className="flex gap-3">
        <ModeToggle />
        {data ? (
          <>
            <Button
              variant={"outline"}
              className="mr-3"
              asChild
              title="New Repo"
            >
              <Link href={"/repo-details"}>
                <Plus size={4} />
                <span className="hidden sm:block">Repository</span>
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none m-auto">
                <Image
                  className="cursor-pointer rounded-[50%]"
                  src={data.user?.image ?? ""}
                  width={40}
                  height={40}
                  alt="profile image"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href={`/profile/${username}`}>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href={"/my-repos"}>
                  <DropdownMenuItem>Repositories</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>
                  Collabs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut />
                  {" "}
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Link href={"/login"}>
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
