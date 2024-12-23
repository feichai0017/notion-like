"use client";

import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import {useMutation, useQuery} from "convex/react";
import { Toolbar } from "@/components/toolbar";
import {Skeleton} from "@/components/ui/skeleton";
import {Cover} from "@/components/cover";
import {useMemo} from "react";
import dynamic from "next/dynamic";
import { EditorProps } from "@/components/editor";

interface Props {
    documentId: Id<"documents">;
}

export const DocumentIdContent = ({ documentId }: Props) => {
    const Editor = useMemo(
        () => dynamic<EditorProps>(() => import("@/components/editor").then(mod => mod.Editor), {
            ssr: false
        }),
        []
    );


    const update = useMutation(api.documents.update);

    const document = useQuery(api.documents.getById, {
        documentId
    });

    const onChange = (content: string) => {
        update({
            id: documentId,
            content: content,
        });
    }

    if (document === undefined) {
        return (
            <div>
                <Cover.Skeleton />
                <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
                    <div className="space-y-4 pl-8 pt-4">
                        <Skeleton className="h-14 w-1/2" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-2/5" />
                        <Skeleton className="h-4 w-3/5" />
                    </div>
                </div>
            </div>
        );
    }

    if (document === null) {
        return <div>Not found</div>;
    }

    return (
        <div className="pb-40">
            <Cover url={document.coverImage} />
            <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
                <Toolbar initialData={document} />
                <Editor onChange={onChange} initialContent={document.content} />
            </div>
        </div>
    );
};