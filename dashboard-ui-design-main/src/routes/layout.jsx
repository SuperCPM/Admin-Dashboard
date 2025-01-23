import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="relative flex min-h-screen">
                <div
                    className={cn(
                        "fixed top-0 left-0 z-20 w-64 h-full bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out",
                        isCollapsed && "-translate-x-48"
                    )}
                >
                    <Sidebar />
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "absolute -right-3 top-10 z-10 rounded-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-0 transition-all duration-300 ease-in-out hover:opacity-100",
                            isCollapsed && "rotate-180"
                        )}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                </div>
                <main
                    className={cn(
                        "flex-1 w-[calc(100%-256px)] ml-64 transition-all duration-300 ease-in-out",
                        isCollapsed && "ml-16 w-[calc(100%-64px)]"
                    )}
                >
                    <Header />
                    <div className="h-[calc(100vh-57px)] overflow-auto">
                        <div className="p-6">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
