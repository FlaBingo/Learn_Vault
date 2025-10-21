import { getRepoById } from "@/features/repo/actions/repo";
import NewRepoForm from "@/features/repo/components/NewRepoForm";

export default async function Repository({
  params,
}: {
  params: { repoId: string };
}) {
  const initialData = await getRepoById(params.repoId);
  return (
    <>
      <div className="container mx-auto">
        <NewRepoForm initialData={initialData.data} />
      </div>
    </>
  );
}
