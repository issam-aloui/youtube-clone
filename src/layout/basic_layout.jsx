import { useSidebar } from "../context/SidebarContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function Basic_layout({ children }) {
  const { isCollapsed, collapseSidebar } = useSidebar();

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
          className={`hidden sm:block ${
            isCollapsed
              ? "sm:w-[5%] md:w-[4%] lg:w-[5%]"
              : "sm:w-[20%] md:w-[15%] lg:w-[13%]"
          } transition-all duration-300`}>
          <Sidebar />
        </div>

        {/* Main content - Full width on mobile, remaining width on desktop */}
        <main
          className={`w-full ${
            isCollapsed
              ? "sm:w-[95%] md:w-[96%] lg:w-[95%]"
              : "sm:w-[80%] md:w-[85%] lg:w-[87%]"
          } bg-yt-black-12 overflow-y-auto transition-all duration-300`}>
          <div className="!p-4 sm:!p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
