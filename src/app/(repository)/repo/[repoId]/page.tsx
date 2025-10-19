import { getRepoById } from "@/features/repo/actions/repo";

export default async function ContentPage({
  params,
}: {
  params: { repoId: string };
}) {

  const repo = await getRepoById(params.repoId);
  const { data } = repo;
  return (
    <>
      repo-{params.repoId}
      <div>
        {data?.title ? data.title : "You can't see me"}
      </div>
      asdfdf
    </>
  );
}
