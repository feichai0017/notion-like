"use client";

import {useConvexAuth} from "convex/react";
import {Spinner} from "@/components/spinner";
import {redirect} from "next/navigation";
import {Navigation} from "@/app/(main)/_components/navigation";

const MainLayout = ({
  children
}: {
    children: React.ReactNode
    }) => {
    const {isAuthenticated, isLoading} = useConvexAuth();

    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center">
                <Spinner size="md" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }
    return (
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <main className="flex-1 h-full overflow-y-auto">
                <Navigation/>
                {children}
            </main>
        </div>
    );
}


export default MainLayout