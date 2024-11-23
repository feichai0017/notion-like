"use client";

import Image from "next/image";
import {useUser} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const DocumentsPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`));

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "Note created successfully",
            error: "Failed to create note",
        });
    };

   return (
       <div className="h-full flex flex-col items-center justify-center space-y-4">
           <Image
               src="/empty.svg"
               alt="empty"
               height="300"
               width="300"
               priority
               className="h-auto dark:hidden"
           />
           <Image
               src="/empty-dark.svg"
               alt="empty"
               height="300"
               width="300"
               priority
               className="hidden h-auto dark:block"
           />
           <h2 className="text-lg font-medium">
               Welcome to {user?.firstName}&apos;s NoteLab
           </h2>
           <Button onClick={onCreate}>
               <PlusCircle className="h-4 w-4 mr-2"/>
               Create a new note
           </Button>
       </div>
   )
 }


 export default DocumentsPage