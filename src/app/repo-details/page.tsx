import NewRepoForm from "@/features/repo/components/NewRepoForm";
import { SessionProvider } from "next-auth/react";

export default function NewRepo() {
  return (
    <div className="container mx-auto px-20 py-20">
      <SessionProvider>
        <NewRepoForm />
      </SessionProvider>
    </div>
  );
}
