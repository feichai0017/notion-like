import {Id} from "@/convex/_generated/dataModel";
import {DocumentIdContent} from "@/app/(main)/(routes)/documents/[documentId]/document-id-content";
import { Suspense, use} from "react";


interface PageProps {
    params: Promise<{
        documentId: Id<"documents">;
    }>;
}

const DocumentIdPage = ({params}: PageProps) => {
    const resolvedParams = use(params);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DocumentIdContent documentId={resolvedParams.documentId} />
        </Suspense>
    );
};


export default DocumentIdPage;