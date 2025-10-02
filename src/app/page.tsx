import { Navbar } from "@/components/Navbar";
import SignIn from "@/components/sign-in";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/services/auth";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <Card className="container mx-auto my-5 flex flex-row justify-between px-5">
        <div>
          {session ? (
          <span>{session.user?.name}</span>
        ) : (
          <span>not logged in</span>
        )}
        </div>
        <Button asChild>
          <Link href={"/repositories"}>
            All Repositories
          </Link>
        </Button>
      </Card>
    </>
  );
}
