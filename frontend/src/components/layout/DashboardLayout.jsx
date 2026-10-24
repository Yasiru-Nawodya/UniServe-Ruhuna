
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Bell, Menu, Search, UserRound, X } from "lucide-react";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the mobile sidebar when navigating to another page.
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden shrink-0 lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/60"
            onClick={closeSidebar}
          />

          <div className="relative h-full w-64">
            <Sidebar />

            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-lg bg-slate-800 p-2 text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-700 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Student Workspace
              </p>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                UniServe-Ruhuna
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
              <Search size={17} className="text-slate-400" />
              <span className="text-sm text-slate-400">
                Search requests
              </span>
            </div>

            <div className="rounded-xl p-2.5 text-slate-600">
              <Bell size={21} />
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <UserRound size={20} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
