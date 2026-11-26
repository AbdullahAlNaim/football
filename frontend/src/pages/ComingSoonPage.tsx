export function ComingSoonPage({ title, message = "Coming soon." }: { title: string; message?: string }) {
  return (
    <section className="rounded-3xl bg-card p-10 text-center shadow-lg shadow-black/30">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-slate-400">{message}</p>
    </section>
  );
}
