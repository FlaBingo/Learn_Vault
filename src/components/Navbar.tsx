"use client";
import React from "react";
import { ModeToggle } from "./theme-toggle";
import SignIn from "./sign-in";
import { Button } from "./ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { LogOut, Plus } from "lucide-react";

export const Navbar = () => {
  const { data } = useSession();
  return (
    <div className="container mx-auto px-5 py-3 shadow flex justify-between items-center">
      <div className="font-extrabold cursor-pointer">
        <Link href={"/"}>
          LearnVault
        </Link>
      </div>
      <div className="flex gap-3">
        <ModeToggle />
        {data ? (
          <>
          <div>
            <Button variant={"outline"} className="mr-3" asChild title="New Repo">
              <Link href={"/repo-details"}>
                <Plus size={4} />
                <span className="hidden sm:block">Repository</span>
              </Link>
            </Button>
            <Button onClick={() => signOut()} title="Logout">
              <LogOut />
            </Button>
          </div>
          </>
        ) : (
          <Link href={"/login"}>
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
