import { NavLink, Form, useLocation } from "@remix-run/react";
import {
  BuildingIcon,
  LayoutDashboardIcon,
  HomeIcon,
  InboxIcon,
  MessageSquareIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { to: "/properties", label: "Objekte", icon: HomeIcon },
  { to: "/requests", label: "Anfragen", icon: InboxIcon, badge: 4 },
  { to: "/messages", label: "Nachrichten", icon: MessageSquareIcon, badge: 2 },
  { to: "/settings", label: "Einstellungen", icon: SettingsIcon },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-semibold text-lg">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <BuildingIcon className="w-5 h-5 text-white" />
          </div>
          ImmoConnect
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/");
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 font-medium"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-slate-400"}`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Johannes Doe
            </p>
            <p className="text-xs text-slate-400 truncate">Vermieter</p>
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
