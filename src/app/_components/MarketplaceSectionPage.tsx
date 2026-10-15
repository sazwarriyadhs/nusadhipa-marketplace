import Link from "next/link";

type SectionPageProps = {
  title: string;
  eyebrow: string;
  description: string;
  items: { title: string; description: string }[];
  cta?: { label: string; href: string };
};

export default function MarketplaceSectionPage({
  title,
  eyebrow,
  description,
  items,
  cta = { label: "Jelajahi Produk", href: "/search" },
}: SectionPageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8">
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-red-600">
          Beranda
        </Link>
        {" / "}
        <span>{title}</span>
      </nav>

      <section className="rounded-3xl border border-gray-200 bg-white p-7 sm:p-12">
        <p className="text-sm font-bold uppercase tracking-wider text-red-600">
          {eyebrow}
        </p>

        <h1 className="mt-3 break-words text-3xl font-bold text-gray-900 sm:text-4xl">
          {title}
        </h1>

        <p className="mt-4 max-w-3xl break-words leading-7 text-gray-600">
          {description}
        </p>

        <Link
          href={cta.href}
          className="mt-7 inline-flex max-w-full rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
        >
          {cta.label}
        </Link>
      </section>

      <section className="mt-9">
        <h2 className="text-xl font-bold text-gray-900">
          Jelajahi {title}
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={`${item.title}-${index}`}
              className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6"
            >
              <h3 className="break-words font-bold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-3 break-words text-sm leading-6 text-gray-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}