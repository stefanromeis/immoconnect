import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  SearchIcon,
  MailIcon,
  ShieldIcon,
  UserIcon,
  BuildingIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { mockUsers } from "~/data/mockUsers.server";
import type { PlatformUser, UserStatus } from "~/types";

export async function loader() {
  return json({ users: mockUsers });
}

type FilterType = "Alle" | UserStatus;

export default function AdminUsersPage() {
  const { users: initialUsers } = useLoaderData<typeof loader>();
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [filter, setFilter] = useState<FilterType>("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesFilter = filter === "Alle" || user.status === filter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCount = (status: FilterType) => {
    if (status === "Alle") return users.length;
    return users.filter((u) => u.status === status).length;
  };

  const filters: FilterType[] = [
    "Alle",
    "Ausstehend",
    "Aktiv",
    "Eingeladen",
    "Deaktiviert",
  ];

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const getStatusBadge = (status: UserStatus) => {
    const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "Aktiv":
        return <span className={`${base} bg-emerald-100 text-emerald-800`}>Aktiv</span>;
      case "Ausstehend":
        return <span className={`${base} bg-amber-100 text-amber-800`}>Ausstehend</span>;
      case "Eingeladen":
        return <span className={`${base} bg-blue-100 text-blue-800`}>Eingeladen</span>;
      case "Deaktiviert":
        return <span className={`${base} bg-slate-100 text-slate-800`}>Deaktiviert</span>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldIcon className="w-4 h-4 text-purple-500" />;
      case "vermieter":
        return <UserIcon className="w-4 h-4 text-blue-500" />;
      case "verwalter":
        return <BuildingIcon className="w-4 h-4 text-emerald-500" />;
      default:
        return <UserIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateString));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Benutzerverwaltung
          </h1>
          <p className="text-slate-500">
            Verwalten Sie Zugänge und Berechtigungen der Plattform.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <MailIcon className="w-4 h-4" />
          Benutzer einladen
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                  filter === f
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                    : "text-slate-600 hover:bg-slate-100 border border-transparent"
                }`}
              >
                {f}
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    filter === f
                      ? "bg-slate-100 text-slate-600"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {getCount(f)}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Benutzer</th>
                <th className="px-6 py-3 font-medium">Rolle</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Registriert am</th>
                <th className="px-6 py-3 font-medium">Letzte Aktivität</th>
                <th className="px-6 py-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700 capitalize">
                      {getRoleIcon(user.role)}
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {formatDate(user.registeredAt)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {user.lastActive ? formatDate(user.lastActive) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {user.status === "Ausstehend" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(user.id, "Aktiv")}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Freischalten"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(user.id, "Deaktiviert")
                            }
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Ablehnen"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {user.status === "Aktiv" && (
                        <button
                          onClick={() =>
                            handleStatusChange(user.id, "Deaktiviert")
                          }
                          className="text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          Deaktivieren
                        </button>
                      )}
                      {user.status === "Deaktiviert" && (
                        <button
                          onClick={() => handleStatusChange(user.id, "Aktiv")}
                          className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                          Reaktivieren
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Keine Benutzer gefunden.
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Benutzer einladen
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Eine Einladung wird per E-Mail versendet.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  E-Mail Adresse
                </label>
                <input
                  type="email"
                  placeholder="benutzer@beispiel.de"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Rolle
                </label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm">
                  <option value="vermieter">Vermieter</option>
                  <option value="verwalter">Hausverwalter</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                Abbrechen
              </button>
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Einladung senden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
