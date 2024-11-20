"use client";

import {ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash} from "lucide-react";
import {Id} from "@/convex/_generated/dataModel";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useUser} from "@clerk/clerk-react";

interface ItemProps {
    id?: Id<"documents">;
    documentIcon?: string;
    active?: boolean;
    expanded?: boolean;
    isSearch?: boolean;
    level?: number;
    onExpand?: () => void;
    label: string;
    onClick: () => void;
    icon: LucideIcon;
}

export const Item = ({
    id,
    label,
    onClick,
    icon: Icon,
    active,
    documentIcon,
    isSearch,
    level = 0,
    expanded,
    onExpand,
}: ItemProps) => {
    const { user } = useUser();
    const router = useRouter();
    const create = useMutation(api.documents.create);
    const archive = useMutation(api.documents.archive);

    const onArchive = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        if (!id) return;
        const promise = archive({ id });

        toast.promise(promise, {
            loading: "Archiving document...",
            success: "Document archived",
            error: "Failed to archive document",
        });
    }

    const handleExpand = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        e.stopPropagation();
        onExpand?.();
    }

    const onCreate = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
        if (!id) return;
        const promise = create({ title: "Untitled", parentDocument: id })
            .then((documentId) => {
                if (!expanded) {
                    onExpand?.();
                }
                router.push(`/documents/${documentId}`);
            });
        toast.promise(promise, {
            loading: "Creating document...",
            success: "Document created",
            error: "Failed to create document",
        });
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    return (
        <div
            onClick={onClick}
            role="button"
            style={{ paddingLeft: level? `${level * 12 + 12}px` : "12px"}}
            className={cn(
                "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
                active && "bg-primary/5 text-primary",
            )}
        >
            {!!id && (
                <div role="button" className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1" onClick={handleExpand}>
                    <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50"/>
                </div>
            )}
            {documentIcon? (
                <div className="shrink-0 mr-2 text-[18px]">
                    {documentIcon}
                </div>
            ) : (
                <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground"/>
            )}
            <span className="truncate">
                {label}
            </span>
            {isSearch && (
                <kbd
                    className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[.625rem] font-medium text-muted-foreground opacity-100 dark:bg-neutral-700">
                    <span className="text-xs">⌘</span>K
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger onClick={(e) => {e.stopPropagation()}} asChild>
                            <div role="button" className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onArchive}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="p-2 text-xs text-muted-foreground">
                                Last edited by: {user?.fullName}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div role="button" onClick={onCreate} className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600">
                        <Plus className="h-4 w-4 text-muted-foreground"/>
                    </div>
                </div>
            )}
        </div>
    )
}
Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
    return (
        <div
            style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
            className="flex gap-x-2 py-[.1875rem]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    );
};