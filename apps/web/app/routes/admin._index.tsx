import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  UsersIcon,
  UserCheckIcon,
  UserPlusIcon,
  ActivityIcon,
  ArrowRightIcon,
} from "lucide-react";
import { MetricCard } from "~/components/MetricCard";
import { mockUsers } from "~/data/mockUsers.server";

export async function loader() {
  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === "Aktiv").length;
  const pendingUsers = mockUsers.filter((u) => u.status === "Ausstehend").length;
  const recentPending = mockUsers
    .filter((u) => u.status === "Ausstehend")
    .slice(0, 3);

  return json({ totalUsers, activeUsers, pendingUsers, recentPending });
}

export default function AdminDashboardPage() {
  const { totalUsers, activeUsers, pendingUsers, recentPending } =
    useLoaderData<typeof loader>();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Admin Übersicht
          </h1>
          <p className="text-slate-500">
            Plattform-Statistiken und anstehende Freischaltungen.
          </p>
        </div>
        <Link
          to="/admin/users"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
        >
          Benutzerverwaltung
          <ArrowRightIcon className="w-4 h-4 ml-1.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Gesamtbenutzer"
          value={totalUsers}
          icon={UsersIcon}
          delay={0.1}
        />
        <MetricCard
          title="Aktive Benutzer"
          value={activeUsers}
          icon={UserCheckIcon}
          delay={0.2}
        />
        <MetricCard
          title="Ausstehende Freigaben"
          value={pendingUsers}
          icon={UserPlusIcon}
          delay={0.3}
        />
        <MetricCard
          title="Systemstatus"
          value="Online"
          icon={ActivityIcon}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Anstehende Freischaltungen
            </h2>
            {pendingUsers > 0 && (
              <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {pendingUsers} neu
              </span>
            )}
          </div>

          {recentPending.length > 0 ? (
            <div className="space-y-3">
              {recentPending.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/admin/users"
                    className="text-sm text-blue-600 font-medium hover:text-blue-700"
                  >
                    Prüfen
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              Keine ausstehenden Freischaltungen.
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <UserPlusIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Neuen Benutzer einladen
          </h3>
          <p className="text-slate-500 text-sm mb-6 max-w-xs">
            Laden Sie Vermieter oder Hausverwalter direkt per E-Mail zur
            Plattform ein.
          </p>
          <Link
            to="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Einladung senden
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
