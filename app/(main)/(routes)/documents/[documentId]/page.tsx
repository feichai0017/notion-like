import {Id} from "@/convex/_generated/dataModel";
import {DocumentIdContent} from "@/app/(main)/(routes)/documents/[documentId]/document-id-content";


const DocumentIdPage = async ({params}: {
    params: {
        documentId: Id<"documents">;
    }
}) => {
    return <DocumentIdContent documentId={params.documentId} />;
};

export default DocumentIdPage;