import { SidebarProvider } from "../context/SidebarContext";
import Basic_layout from "../layout/basic_layout";
export default function HomePage() {
  return (
    <SidebarProvider>
      <Basic_layout>
        <h1 className="text-white text-xl">YouTube Clone Main Content</h1>
        <p className="text-gray-400 mt-2">
          This is the main content area with percentage-based layout
        </p>
      </Basic_layout>
    </SidebarProvider>
  );
}
