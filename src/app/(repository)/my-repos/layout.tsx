
export default function RepositoriesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="container mx-auto mt-7 px-6">
        {children}
      </main>
    </>
  )
}