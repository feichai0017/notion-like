"use client";

import {Id} from "@/convex/_generated/dataModel";
import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {Toolbar} from "@/components/toolbar";

interface DocumentIdPageProps {
    params: {
        documentId: Id<"documents">;
    }
}

const DocumentIdPage = ({params} : DocumentIdPageProps) => {
    const document = useQuery(api.documents.getById, {
        documentId: params.documentId,
    });

    if (document === undefined) {
        return <div>Loading...</div>
    };

    if (document === null) {
        return <div>Document not found</div>
    };

    return (
        <div className="pb-40">
            {/*<Cover url={document.coverImage}/>*/}
            <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
                <Toolbar initialData={document}/>
                {/*<Editor onChange={onChange} initialContent={document.content}/>*/}
            </div>
        </div>
    );
};


export default DocumentIdPage;