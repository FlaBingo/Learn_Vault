export default async function AboutRepo({name, status}: {name?: string, status?: string}) {
  return (
    <>
      <div>
        <h2 className="font-bold mb-2 text-2xl">About</h2>
        <ul>
          <li>Creater: {name}</li>
          <li>Status: {status}</li>
        </ul>
      </div>
      <div>collaborators</div>
    </>
  );
}
