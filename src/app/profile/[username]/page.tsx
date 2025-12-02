import { metadata } from "@/app/layout";
import { getUserByEmail } from "@/features/user/actions/userAction";
import UserProfilePage from "@/features/user/components/UserProfile";
import { auth } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  metadata.title = `${username}`;

  const session = await auth();
  const logedInUserId = session?.user?.id;

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
        <UserProfilePage />
      </div>
    </>
  );
}
