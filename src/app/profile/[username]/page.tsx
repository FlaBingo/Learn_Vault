import { metadata } from "@/app/layout";
import { auth } from "@/services/auth";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  metadata.title = `${username}`;

  const session = await auth();
  const logedInUser = session?.user?.id;

  return (
    <>
      <div className="container mx-auto">
        <div>Profile page</div>
        <div> {username} </div>
      </div>
    </>
  );
}
