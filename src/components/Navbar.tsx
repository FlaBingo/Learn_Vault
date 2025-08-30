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
      <div className="font-extrabold">LearnVault</div>
      <div className="flex gap-3">
        <ModeToggle />
        {data ? (
          <>
          <div className="hidden sm:block">
            <Button variant={"outline"} className="mr-3" asChild>
              <Link href={"/new_repo"}>
                <Plus size={4} />
                Repository
              </Link>
            </Button>
            <Button onClick={() => signOut()} title="Logout">
              <LogOut />
            </Button>
          </div>
          <div className="sm:hidden">
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
