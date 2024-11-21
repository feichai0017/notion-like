"use client";

import {ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash} from "lucide-react";
import React, {ElementRef, useEffect, useRef, useState} from "react";
import {useMediaQuery} from "usehooks-ts";
import {useParams, usePathname} from "next/navigation";
import {cn} from "@/lib/utils";
import {router} from "next/client";
import {UserItem} from "@/app/(main)/_components/user-item";
import {Item} from "@/app/(main)/_components/item";
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";
import {toast} from "sonner";
import {DocumentList} from "@/app/(main)/_components/document-list";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {TrashBox} from "@/app/(main)/_components/trash-box";
import {useSearch} from "@/hooks/use-search";
import {useSettings} from "@/hooks/use-settings";
import {Navbar} from "@/app/(main)/_components/navbar";

export const Navigation = () => {
    const pathname = usePathname();
    const search = useSearch();
    const params = useParams();
    const settings = useSettings();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const create = useMutation(api.documents.create);

    const isResizingRef = useRef(false);
    const sidebarRef  = useRef<ElementRef<"aside">>(null);
    const navbarRef = useRef<ElementRef<"div">>(null);
    const [ isResetting, setIsResetting ] = useState(false);
    const [ isCollapsed, setIsCollapsed ] = useState(isMobile);

    useEffect(() => {
        if (isMobile) {
            collapse();
        } else {
            resetWidth();
        }
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            collapse();
        };
    }, [pathname, isMobile]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();

        isResizingRef.current = true;
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizingRef.current) return;
        let newWidth = e.clientX;

        if (newWidth < 240) newWidth = 240;
        if (newWidth > 480) newWidth = 480;

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`;
            navbarRef.current.style.setProperty("left", `${newWidth}px`);
            navbarRef.current.style.setProperty(
                "width",
                `calc(100% - ${newWidth}px)`,
            );
        }
    };

    const handleMouseUp = () => {
        isResizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false);
            setIsResetting(true);

            sidebarRef.current.style.width = isMobile ? "100%" : "240px";
            navbarRef.current.style.removeProperty("width");
            navbarRef.current.style.setProperty(
                "width",
                isMobile ? "0" : "calc(100%-240px)",
            );
            navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true);
            setIsResetting(true);

            sidebarRef.current.style.width = "0";
            navbarRef.current.style.setProperty("width", "100%");
            navbarRef.current.style.setProperty("left", "0");
            setTimeout(() => setIsResetting(false), 300);
        }
    };

    const handleCreate = () => {
       const promise = create({ title: "Untitled" }).then((documentId) =>
           router.push(`/documents/${documentId}`),
       );

       toast.promise(promise, {
           loading: "Creating a new note....",
           success: "New note created.",
           error: "Failed to create a note.",
       });
    };

    return (
        <>
            <aside
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[50]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isMobile && "w-0"
                    )}
            >
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                        isMobile && "opacity-100"
                    )}
                >
                    <ChevronsLeft className="w-6 h-6"/>
                </div>
                <div>
                    <UserItem/>
                    <Item label="Search" isSearch onClick={search.onOpen} icon={Search}/>
                    <Item label="Settings" onClick={settings.onOpen} icon={Settings}/>
                    <Item onClick={handleCreate} label="New Page" icon={PlusCircle}/>
                </div>
                <div className="mt-4">
                    <DocumentList/>
                    <Item label="Add a Page" onClick={handleCreate} icon={Plus}/>
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash} onClick={() => {}}/>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-72" side={isMobile? "bottom" : "right"}>
                            <TrashBox/>
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"/>
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute left-60 top-0 z-[300] w-[calc(100%-240px)]",
                    isResetting && "transition-all duration-300 ease-in-out",
                    isMobile && "left-0 w-full",
                )}
            >
                {!!params.documentId? (
                    <Navbar
                        isCollapsed={isCollapsed}
                        onResetWidth={resetWidth}
                    />
                ) : (
                    <nav className="bg-transparent px-3 py-2 w-full">
                        {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                    </nav>
                )}
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon onClick={resetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                </nav>
            </div>
        </>
    )
}