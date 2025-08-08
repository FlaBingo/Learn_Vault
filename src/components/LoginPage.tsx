"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { Github } from "lucide-react";

export default function LoginPage() {
  const { data } = useSession();
  if(data) return <div>Get out of here</div>
  if(!data) return (
    <>
      <div className="sm:w-[600px] grid grid-cols-2">
        <Card className="rounded-none px-1">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <form action="">
              <Label htmlFor="name" className="p-2">Name</Label>
              <Input id="name" type="text" placeholder="John Doe" />

              <label htmlFor="email" className="p-2">Email</label>
              <Input id="email" type="email" placeholder="johndoe@gmail.com" />

              <label htmlFor="password" className="p-2">Password</label>
              <Input id="password" type="password" placeholder="********" />
            </form> */}
            <div className="flex justify-between">
              <button
                className="bg-white py-2 px-4 shadow cursor-pointer"
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
                {/* <Image
                  src={"/google_logo.webp"}
                  width={20}
                  height={3}
                  alt="google"
                /> */}
              </button>
            </div>
          </CardContent>
        </Card>
        <div className="w-full">
          <Image src={"/login.jpg"} width={250} height={400} alt="logo" />
        </div>
      </div>
    </>
  );
}
