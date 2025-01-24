import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const DOCS_DIR = "src/app/docs/content";
export const FILE_BASED_ROUTING_DIR = "src/app/docs/file-based-routing";

export const MdxDir = path.join(process.cwd(), ...DOCS_DIR.split("/"));

export type Metadata = {
    title: string;
    publishedAt: string;
    updatedAt?: string;
    summary: string;
    author?: string;
    image?: string;
};
export type Doc = {
    metadata: Metadata;
    slug: string;
    content: string;
    routePath: string;
};

function parseFrontmatter(fileContent: string) {
    const { data, content } = matter(fileContent);

    return {
        metadata: {
            title: data.title || "Untitled",
            publishedAt:
                data.publishedAt || new Date().toISOString().split("T")[0],
            updatedAt:
                data.updatedAt ||
                data.publishedAt ||
                new Date().toISOString().split("T")[0],
            summary: data.summary || "No summary available",
            ...(data.author && { author: data.author }),
            ...(data.image && { image: data.image }),
        } as Metadata,
        content: content.trim(),
    };
}

function getMDXFiles(dir: string) {
    try {
        return fs
            .readdirSync(dir)
            .filter((file) => path.extname(file) === ".mdx");
    } catch (error) {
        console.warn(`Warning: Could not read directory ${dir}:`, error);
        return [];
    }
}

function readMDXFile(filePath: string) {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter(rawContent);
}

function getMDXData(dir: string) {
    const mdxFiles = getMDXFiles(dir);
    return mdxFiles.map((file) => {
        const { metadata, content } = readMDXFile(path.join(dir, file));
        const slug = path.basename(file, path.extname(file));

        return {
            metadata,
            slug,
            content,
        };
    });
}

export function getDocs() {
    const fileBasedRoutingDocPath = path.join(
        process.cwd(),
        FILE_BASED_ROUTING_DIR,
        "page.mdx"
    );
    const { metadata, content } = readMDXFile(fileBasedRoutingDocPath);

    const routingDoc = {
        metadata,
        slug: "file-based-routing",
        content,
        routePath: `/docs/file-based-routing`,
    };

    const contentDocs = getMDXData(MdxDir)
        .map((doc) => ({
            ...doc,
            routePath: `/docs/${doc.slug}`,
        }))
        .sort((a, b) => {
            const dateA = a?.metadata?.publishedAt
                ? new Date(a.metadata.publishedAt)
                : new Date(0);
            const dateB = b?.metadata?.publishedAt
                ? new Date(b.metadata.publishedAt)
                : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

    return [routingDoc, ...contentDocs];
}

export function formatDate(date: string | Date) {
    const dateObj = dayjs(date);

    if (!dateObj.isValid()) {
        return "Invalid date";
    }

    const fullDate = dateObj.format("MMMM D, YYYY");
    return fullDate;
}

export function toRelative(date: string | Date) {
  const dateObj = dayjs(date);

  if (!dateObj.isValid()) {
    return '';
  }
  return dateObj.fromNow();
}
