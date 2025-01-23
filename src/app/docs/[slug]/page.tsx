import fs from "fs";
import { getMdxDir } from "../utils";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  // const docsDirectory = getMdxDir();
  // const filePath = path.join(docsDirectory, `${slug}.mdx`);

  const { default: Post } = await import('@/app/docs/mdx/' + slug + '.mdx');

  return <Post />;
}

export function generateStaticParams() {
  const files = fs
    .readdirSync(getMdxDir())
    .filter((file: string) => file.match(/\.(md|mdx)$/))
    .map((file: string) => ({
      slug: file.replace(/\.(md|mdx)$/, ""),
    }));
  console.log("files", files);
  return files;
}

export const dynamicParams = false;
