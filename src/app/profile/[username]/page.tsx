import { metadata } from "@/app/layout";
import { getUserByEmail } from "@/features/user/actions/userAction";
import { auth } from "@/services/auth";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  metadata.title = `${username}`;

  const session = await auth();
  const logedInUserId = session?.user?.id;

  if (!session) {
    return (
      <>
        <div className="h-[80vh] flex justify-center items-center">
          Please Login
        </div>
      </>
    );
  }

  const userData = await getUserByEmail(username + "@gmail.com");
  if (!userData) {
    return (
      <>
        <div className="h-[80vh] flex justify-center items-center">
          User with {username} does not exist.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <div>Profile page</div>
        <div> {username} </div>
        <div> {userData.email} </div>
        <div> {userData.name} </div>
      </div>
    </>
  );
}
