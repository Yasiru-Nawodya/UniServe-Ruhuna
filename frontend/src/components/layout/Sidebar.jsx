import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Bell,
  UserRound,
  Settings,
  GraduationCap,
  LogOut,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    path: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Requests",
    path: "/student/requests",
    icon: ClipboardList,
  },
  {
    label: "New Request",
    path: "/student/requests/new",
    icon: PlusCircle,
  },
  {
    label: "Notifications",
    path: "/student/notifications",
    icon: Bell,
  },
  {
    label: "Profile",
    path: "/student/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    path: "/student/settings",
    icon: Settings,
  },
];

function Sidebar({ mobileOpen = false, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 px-4 py-6 text-white shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="mb-8 flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <GraduationCap size={24} />
            </div>

            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                UniServe<span className="text-blue-400">.</span>
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-slate-400">
                Student Portal
              </p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Workspace Label */}
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
          Workspace
        </p>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/student/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-5">
          <NavLink
            to="/login"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={19} />
            <span>Back to Login</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;