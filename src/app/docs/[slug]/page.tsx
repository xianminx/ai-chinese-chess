import { formatDate, getDocs } from "../utils";
import { notFound } from "next/navigation";
import { baseUrl } from "@/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  // const docsDirectory = getMdxDir();
  // const filePath = path.join(docsDirectory, `${slug}.mdx`);

  const doc = getDocs().find((doc) => doc.slug === slug);

  if (!doc) {
    notFound();
  }

  const { default: Content } = await import(`@/app/docs/content/${slug}.mdx`);

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: doc.metadata.title,
            datePublished: doc.metadata.publishedAt,
            dateModified: doc.metadata.updatedAt || doc.metadata.publishedAt,
            description: doc.metadata.summary,
            image: doc.metadata.image
              ? `${baseUrl}${doc.metadata.image}`
              : `/og?title=${encodeURIComponent(doc.metadata.title)}`,
            url: `${baseUrl}/docs/${doc.slug}`,
            author: {
              "@type": "Person",
              name: "Houkui",
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {doc.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(doc.metadata.publishedAt)}
        </p>
      </div>
      <article>
         <Content />
      </article>
    </section>
  );
}

export async function generateStaticParams() {
  return getDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocs().find((doc) => doc.slug === slug);
  if (!doc) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = doc.metadata;
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/docs/${doc.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
export const dynamicParams = true;

