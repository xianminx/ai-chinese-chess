import fs from "fs";
import path from "path";
import matter from "gray-matter";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const DOCS_DIR = "src/app/docs";
export const CONTENT_DIR = "src/app/docs/content";
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

export type DocType = 'page' | 'content';

export type Doc = {
    metadata: Metadata;
    slug: string;
    content: string;
    routePath: string;
    type: DocType;
    filePath: string;
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
            summary: data.summary,
            ...(data.author && { author: data.author }),
            ...(data.image && { image: data.image }),
        } as Metadata,
        content: content.trim(),
    };
}

function readMDXFile(filePath: string) {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    return parseFrontmatter(rawContent);
}

function getStaticPages(baseDir: string): Doc[] {
    const results: Doc[] = [];
    
    function scanDirectory(dir: string) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip the content directory as it's for dynamic routes
                if (item === 'content') continue;
                
                // Check for page.mdx in this directory
                const pageMdxPath = path.join(fullPath, 'page.mdx');
                const pageMdPath = path.join(fullPath, 'page.md'); // Check for .md as well
                if (fs.existsSync(pageMdxPath) || fs.existsSync(pageMdPath)) {
                    const existingPath = fs.existsSync(pageMdxPath) ? pageMdxPath : pageMdPath;
                    const { metadata, content } = readMDXFile(existingPath);
                    // Calculate relative path from docs directory
                    const relativePath = path.relative(baseDir, fullPath);
                    const routePath = relativePath ? `/docs/${relativePath}` : '/docs';
                    
                    results.push({
                        metadata,
                        slug: relativePath || 'index',
                        content,
                        routePath,
                        type: 'page' as DocType,
                        filePath: existingPath, // Added filePath
                    });
                }
                
                // Recursively scan subdirectories
                scanDirectory(fullPath);
            }
        }
    }
    
    scanDirectory(baseDir);
    return results;
}

function getContentPages(): Doc[] {
    const contentDir = path.join(process.cwd(), CONTENT_DIR);
    const files = fs.readdirSync(contentDir)
        .filter(file => /\.(mdx?|md)$/.test(file));
    
    return files.map(file => {
        const filePath = path.join(contentDir, file); // Get the full path
        const { metadata, content } = readMDXFile(filePath);
        const slug = path.basename(file, path.extname(file));
        
        return {
            metadata,
            slug,
            content,
            routePath: `/docs/${slug}`,
            type: 'content' as DocType,
            filePath, // Added filePath
        };
    }).sort((a, b) => {
        const dateA = new Date(a.metadata.publishedAt);
        const dateB = new Date(b.metadata.publishedAt);
        return dateB.getTime() - dateA.getTime();
    });
}

export function getDocs() {
    const docsDir = path.join(process.cwd(), DOCS_DIR);
    
    // Get all static pages (file-based routing)
    const staticPages = getStaticPages(docsDir);
    
    // Get all dynamic content pages
    const contentPages = getContentPages();

    const allDocs = [...staticPages, ...contentPages];

    return allDocs.sort((a, b) => {
        const dateA = new Date(a.metadata.publishedAt);
        const dateB = new Date(b.metadata.publishedAt);
        return dateB.getTime() - dateA.getTime();
    });
}

/**
 * Formats a date string or Date object into a human-readable format.
 * Returns both display text and full datetime for tooltip.
 * 
 * @param date - The date to format (string or Date object)
 * @param options - Optional configuration object
 * @param options.threshold - Number of days to use relative time format (default: 7)
 * @returns Object containing display text and full datetime
 */
export function formatDate(date: string | Date, options?: { threshold?: number }) {
    const dateObj = dayjs(date);

    if (!dateObj.isValid()) {
        return {
            display: "Invalid date",
            full: "Invalid date"
        };
    }

    // Default threshold is 7 days
    const threshold = options?.threshold ?? 7;
    const now = dayjs();
    const diffInDays = now.diff(dateObj, 'day');

    // Full datetime for tooltip
    const fullDateTime = dateObj.format("MMMM D, YYYY, h:mm A");

    // If the date is within the threshold, show relative time
    if (diffInDays < threshold) {
        return {
            display: dateObj.fromNow(),
            full: fullDateTime
        };
    }

    // Otherwise show the full date
    return {
        display: dateObj.format("MM/DD/YYYY"),
        full: fullDateTime
    };
}
