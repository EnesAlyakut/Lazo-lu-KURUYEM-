import Link from "next/link";

export default function InfoPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Array<{ title: string; content: string }>;
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-16">
      <article className="container-main max-w-4xl">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
          <p className="mt-4 leading-7 text-gray-600">{intro}</p>
          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-xl font-bold text-gray-900">{section.title}</h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">{section.content}</p>
              </section>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-brand-50 p-5 text-sm text-gray-700">
            Sorularınız için{" "}
            <Link href="/iletisim" className="font-semibold text-brand-700 underline">
              iletişim formunu
            </Link>{" "}
            kullanabilirsiniz.
          </div>
        </div>
      </article>
    </div>
  );
}
