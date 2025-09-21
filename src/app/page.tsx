import { Navbar } from "@/components/Navbar";
import SignIn from "@/components/sign-in";
import { auth } from "@/services/auth";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  return (
    <>
      {session ? <div className="container mx-auto">{session.user?.name}</div> : <div className="container mx-auto">not logged in</div>}
    </>
  );
}
