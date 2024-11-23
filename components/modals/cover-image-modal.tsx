"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useCoverImage} from "@/hooks/use-cover-image";
import {useState} from "react";
import {useEdgeStore} from "@/lib/edgestore";
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";
import {useParams} from "next/navigation";
import {Id} from "@/convex/_generated/dataModel";
import {SingleImageDropzone} from "@/components/single-image-dropzone";

export const CoverImageModal = () => {
    const params = useParams();
    const [file, setFile] = useState<File>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const coverImage = useCoverImage();
    const { edgestore } = useEdgeStore();

    const update = useMutation(api.documents.update);

    const onClose = () => {
        setFile(undefined);
        setIsSubmitting(false);
        coverImage.onClose();
    }

    const onChange = async (file?: File) => {
        if (file) {
            setIsSubmitting(true);
            setFile(file);

            const res = await edgestore.publicFiles.upload({
                file,
            });

            await update({
                id: params.documentId as Id<"documents">,
                coverImage: res.url,
            });
        }
    }

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
            <DialogTitle hidden={true} />
            <DialogContent>
                <DialogHeader>
                    <h2 className="text-center text-lg font-semibold">
                        Cover Image
                    </h2>
                </DialogHeader>
                <SingleImageDropzone
                    className="w-full outline-none"
                    disabled={isSubmitting}
                    onChange={onChange}
                    value={file}
                />
            </DialogContent>
        </Dialog>
    )
}