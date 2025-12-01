import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type aboutPageProps = {
  ownerUser: {
    image: string | null;
    id: string;
    email: string;
    name: string;
    isVerified: boolean;
    emailVerified: Date | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  repo:
    | {
        title: string;
        id: string;
        status: "public" | "private";
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
      }
    | null
    | undefined;
};

export default async function AboutRepo({ ownerUser, repo }: aboutPageProps) {
  return (
    <>
      <div>
        <h2 className="font-bold mb-2 text-2xl">About</h2>
        <ul className="pl-3">
          <li>Creater: {ownerUser?.name}</li>
          <li>Status: {repo?.status}</li>
          <li>Created: {repo?.createdAt.toDateString()}</li>
        </ul>
      </div>
      <div>
        <div className="mt-4 text-2xl font-bold">Collaborators</div>
        <div className="pl-3 mt-4">
          <div className="flex flex-row flex-wrap items-center gap-5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
