"use client";

import {useUser} from "@clerk/clerk-react";
import {useQuery} from "convex/react";
import {useRouter} from "next/navigation";
import {api} from "@/convex/_generated/api";
import {useSearch} from "@/hooks/use-search";
import {useEffect, useState} from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "@/components/ui/command";
import {File} from "lucide-react";
import {DialogTitle} from "@/components/ui/dialog";

export const SearchCommand = () => {
    const { user } = useUser();
    const router = useRouter();
    const documents = useQuery(api.documents.getSearch);
    const [isMounted, setIsMounted] = useState(false);

    const toggle = useSearch((store) => store.toggle);
    const isOpen = useSearch((store) => store.isOpen);
    const onClose= useSearch((store) => store.onClose);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                toggle();
            }
        }

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const onSelect = (id: string) => {
        router.push(`/documents/${id}`);
        onClose();
    }

    if (!isMounted) {
        return null;
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <DialogTitle className="hidden">Search</DialogTitle>
            <CommandInput
                placeholder={`Search ${user?.fullName}'s NoteLab...`}
            />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Documents">
                    {documents?.map((document) => (
                        <CommandItem
                            key={document._id}
                            value={`${document._id}-${document.title}`}
                            title={document.title}
                            onSelect={() => onSelect(document._id)}
                        >
                            {document.icon? (
                                <p className="mr-2 text-[18px]">
                                    {document.icon}
                                </p>
                            ) : (
                                <File className="mr-2 h-4 w-4"/>
                            )}
                            <span>
                                {document.title}
                            </span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );

};