"use client";

import Image from "next/image";
import {useUser} from "@clerk/clerk-react";
import {Button} from "@/components/ui/button";
import {PlusCircle} from "lucide-react";

const DocumentsPage = () => {
    const { user } = useUser();

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
           <Button>
               <PlusCircle className="h-4 w-4 mr-2"/>
               Create a new note
           </Button>
       </div>
   )
 }


 export default DocumentsPage