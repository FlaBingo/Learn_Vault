// src/app/page.tsx

import ExplorePublicRepos from "@/components/ExplorePublicRepo";
import { Navbar } from "@/components/Navbar";
import SignIn from "@/components/sign-in";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { auth } from "@/services/auth";
import { LoaderCircle } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  searchParams?: Record<string, string | string[] | undefined>;
}


export default async function Home({
  searchParams,
}: Props) {
  const session = await auth();
  const validatedSearchParams = await searchParams;

  // if (!session) {
  //   return (
  //     <div className="h-10 flex justify-center items-center">Please login</div>
  //   );
  // }

  return (
    <div className="container mx-auto my-5">
      <Card className="mb-5 flex flex-row justify-between px-5">
        <div>
          {session ? (
            <div className="flex gap-3">
              <Image
                src={session?.user?.image as string}
                className="rounded-[50%]"
                width={40}
                height={40}
                alt="profile image"
              />
              <span className="my-auto">{session.user?.name}</span>
            </div>
          ) : (
            <span>not logged in</span>
          )}
        </div>
        <Button asChild>
          <Link href={"/my-repos"}>My Repositories</Link>
        </Button>
      </Card>

      <ExplorePublicRepos searchParams={validatedSearchParams}/>
    </div>
  );
}
