import { Link } from "@remix-run/react";
import { SearchIcon, BellIcon } from "lucide-react";

interface TopBarProps {
  title: string;
  breadcrumb?: string;
  breadcrumbTo?: string;
}

export function TopBar({ title, breadcrumb, breadcrumbTo }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {breadcrumb && breadcrumbTo ? (
          <div className="flex items-center text-sm text-slate-500">
            <Link
              to={breadcrumbTo}
              className="hover:text-blue-600 transition-colors"
            >
              {breadcrumb}
            </Link>
            <span className="mx-2">/</span>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>
        ) : (
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Suchen..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-64"
          />
        </div>

        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-50">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
