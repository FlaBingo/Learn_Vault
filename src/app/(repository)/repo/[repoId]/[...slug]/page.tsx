export default async function FolderPage({
  params,
}: {
  params: { repoId: string; slug: string[] };
}) {
  const {repoId, slug} = await params;

  return (
    <>
      <div>{repoId}</div>
      <div>{slug}</div>
      {slug.map((s) => (
        <div key={s}>{s}</div>
      ))}
    </>
  );
}
