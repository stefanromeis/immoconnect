import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RequestCard } from "~/components/RequestCard";
import { fetchRequests, fetchProperties } from "~/services/api.server";
import type { RequestStatus } from "~/types";

export async function loader() {
  const [requests, properties] = await Promise.all([
    fetchRequests(),
    fetchProperties(),
  ]);
  return json({ requests, properties });
}

type FilterType = "Alle" | RequestStatus;

export default function RequestsPage() {
  const { requests, properties } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<FilterType>("Alle");

  const filteredRequests = requests.filter((r) => {
    if (filter === "Alle") return true;
    return r.status === filter;
  });

  const getCount = (status: FilterType) => {
    if (status === "Alle") return requests.length;
    return requests.filter((r) => r.status === status).length;
  };

  const filters: FilterType[] = [
    "Alle",
    "Ausstehend",
    "Genehmigt",
    "Abgelehnt",
    "Rückruf erbeten",
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Anfragen & Freigaben
        </h1>
        <p className="text-slate-500">
          Verwalten Sie anstehende Entscheidungen und Workflows.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
              filter === f
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {f}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                filter === f
                  ? "bg-slate-700 text-slate-200"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {getCount(f)}
            </span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request, index) => {
          const property = properties.find(
            (p) => p.id === request.propertyId
          );
          return (
            <RequestCard
              key={request.id}
              request={request}
              property={property}
              delay={index * 0.05}
            />
          );
        })}

        {filteredRequests.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
            <p className="text-slate-500">
              Keine Anfragen in dieser Kategorie gefunden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
