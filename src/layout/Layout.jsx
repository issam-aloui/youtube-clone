import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";

const LayoutContent = () => {
  const { isCollapsed, collapseSidebar } = useSidebar();
  const location = useLocation();
  
  // Check if we're on the watch page to potentially use different layout
  const isWatchPage = location.pathname.startsWith('/watch');

  return (
    <div className="h-screen w-screen overflow-hidden bg-yt-black-12">
      {/* Header - 6% height on desktop, 8% on mobile */}
      <div className="h-[8vh] sm:h-[6vh] w-full">
        <Header />
      </div>

      {/* Main content area - 92% height on mobile, 94% on desktop */}
      <div className="h-[92vh] sm:h-[94vh] flex relative">
        {/* Mobile Sidebar Overlay - Full screen when expanded */}
        {!isCollapsed && (
          <div
            className="sm:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={collapseSidebar}>
            <div
              className="h-full w-[280px] bg-yt-black-12 border-r border-yt-black-32"
              onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Desktop Sidebar - Hidden on mobile, responsive widths on larger screens */}
        <div
          className={`hidden sm:block transition-all duration-300 ease-in-out ${
            isCollapsed 
              ? "w-[72px]" 
              : isWatchPage 
                ? "w-[240px] md:w-[280px]" 
                : "w-[240px] md:w-[280px] lg:w-[300px] xl:w-[320px]"
          } border-r border-yt-black-32 overflow-hidden`}>
          <Sidebar />
        </div>

        {/* Main Content - Takes remaining space */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const Layout = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default Layout;
