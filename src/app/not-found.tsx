export default function NotFound() {
  return (
    <div className="grid grid-rows-[1fr_auto] items-center justify-items-center min-h-screen pb-8 gap-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <section>
          <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
            404 - Page Not Found
          </h1>
          <p className="mb-4">The page you are looking for does not exist.</p>
        </section>
      </main>
    </div>
  );
}
