import { DocsIndex } from "./toc";
import { getDocs } from "./utils";

export default function DocsPage() {
    const docs = getDocs();

    return <DocsIndex docs={docs} />;
}
