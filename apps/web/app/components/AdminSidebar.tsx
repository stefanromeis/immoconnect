import { NavLink, Form } from "@remix-run/react";
import {
  BuildingIcon,
  LayoutDashboardIcon,
  UsersIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

interface AdminSidebarProps {
  pendingUsersCount?: number;
}

const navItems = [
  { to: "/admin", label: "Übersicht", icon: LayoutDashboardIcon, exact: true },
  { to: "/admin/users", label: "Benutzerverwaltung", icon: UsersIcon },
  { to: "/admin/settings", label: "Einstellungen", icon: SettingsIcon },
];

export function AdminSidebar({ pendingUsersCount = 0 }: AdminSidebarProps) {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-semibold text-lg">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BuildingIcon className="w-5 h-5 text-white" />
          </div>
          ImmoConnect
          <span className="ml-1 px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider font-bold rounded">
            Admin
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 font-medium"
                  : "hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-slate-400"}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.to === "/admin/users" && pendingUsersCount > 0 && (
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      isActive ? "bg-blue-600 text-white" : "bg-amber-500 text-white"
                    }`}
                  >
                    {pendingUsersCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 font-medium border border-blue-700">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              System Admin
            </p>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
        </div>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
            Abmelden
          </button>
        </Form>
      </div>
    </div>
  );
}
