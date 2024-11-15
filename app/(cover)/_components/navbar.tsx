"use client";

import {useScrollTop} from "@/hooks/use-scroll-top";
import {cn} from "@/lib/utils";
import {Logo} from "@/app/(cover)/_components/logo";
import {ModeToggle} from "@/components/mode-toggle";

export const Navbar = () => {
    const scrolled = useScrollTop();
    return (
        <div className={cn(
            "z-50 bg-ground fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-md"
        )}>
            <Logo/>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                <ModeToggle/>
            </div>
        </div>
    )
}
