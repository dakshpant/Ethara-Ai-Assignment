import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 selection:bg-indigo-600 selection:text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 lg:pl-64">
        <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl p-6 lg:p-8 animate-in fade-in duration-700">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
