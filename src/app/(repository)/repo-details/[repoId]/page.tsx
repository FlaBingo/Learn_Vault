import { getRepoById } from "@/features/repo/actions/repo";
import NewRepoForm from "@/features/repo/components/NewRepoForm";

export default async function Repository({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const { repoId } = await params;
  const initialData = await getRepoById(repoId);
  return (
    <>
      <div className="container mx-auto">
        <NewRepoForm initialData={initialData.data} />
      </div>
    </>
  );
}
