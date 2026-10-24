
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
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Requests", path: "/student/requests", icon: ClipboardList },
  { label: "New Request", path: "/student/requests/new", icon: PlusCircle },
  { label: "Notifications", path: "/student/notifications", icon: Bell },
  { label: "Profile", path: "/student/profile", icon: UserRound },
  { label: "Settings", path: "/student/settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="flex h-full min-h-screen w-64 flex-col bg-slate-950 px-4 py-6 text-white">
      <div className="mb-10 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
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

      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Workspace
      </p>

      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/student/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 pt-5">
        <NavLink
          to="/login"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={19} />
          Back to Login
        </NavLink>
      </div>
    </aside>
  );
}

export default Sidebar;
