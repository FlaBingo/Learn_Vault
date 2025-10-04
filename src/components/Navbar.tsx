"use client";
import React from "react";
import { ModeToggle } from "./theme-toggle";
import SignIn from "./sign-in";
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
  return (
    <div className="container mx-auto px-5 py-3 shadow flex justify-between items-center">
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
            {/* <Button onClick={() => signOut()} title="Logout">
              <LogOut />
            </Button> */}
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
                <Link href={"/repositories"}>
                  <DropdownMenuItem>All Repository</DropdownMenuItem>
                </Link>
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
