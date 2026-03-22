import { useState } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  BuildingIcon,
  EuroIcon,
  PercentIcon,
  FileTextIcon,
  UsersIcon,
  AlertCircleIcon,
} from "lucide-react";
import { fetchProperty } from "~/services/api.server";
import { StatusBadge } from "~/components/StatusBadge";

export async function loader({ params }: LoaderFunctionArgs) {
  const property = await fetchProperty(params.propertyId!);
  return json({ property });
}

type TabType = "Wohnungen" | "Finanzen" | "Dokumente";

export default function PropertyDetailPage() {
  const { property } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<TabType>("Wohnungen");

  const isFullyRented = property.occupancyRate === 100;
  const totalArrears = property.units.reduce(
    (sum, unit) => sum + unit.arrears,
    0
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8 shadow-sm"
      >
        <div className={`h-32 w-full ${property.imageUrl} relative`}>
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="p-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {property.address}
                </h1>
                <StatusBadge
                  status={isFullyRented ? "Vollvermietet" : "Teilvermietet"}
                />
              </div>
              <div className="flex items-center text-slate-500">
                <MapPinIcon className="w-4 h-4 mr-1.5" />
                {property.zip} {property.city}
              </div>
            </div>

            <div className="flex gap-6 bg-slate-50 px-6 py-3 rounded-xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center">
                  <EuroIcon className="w-3.5 h-3.5 mr-1" /> Soll-Miete
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {property.totalRent.toLocaleString("de-DE")} €
                </p>
              </div>
              <div className="w-px bg-slate-200"></div>
              <div>
                <p className="text-xs text-slate-500 mb-1 flex items-center">
                  <PercentIcon className="w-3.5 h-3.5 mr-1" /> Vermietet
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {property.occupancyRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        {(["Wohnungen", "Finanzen", "Dokumente"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {tab === "Wohnungen" && <BuildingIcon className="w-4 h-4" />}
              {tab === "Finanzen" && <EuroIcon className="w-4 h-4" />}
              {tab === "Dokumente" && <FileTextIcon className="w-4 h-4" />}
              {tab}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "Wohnungen" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Einheit</th>
                    <th className="px-6 py-4 font-medium">Fläche</th>
                    <th className="px-6 py-4 font-medium">Mieter</th>
                    <th className="px-6 py-4 font-medium">Kaltmiete</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">
                      Rückstand
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {property.units.map((unit) => (
                    <tr
                      key={unit.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {unit.number}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {unit.area} m²
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                            <UsersIcon className="w-3 h-3" />
                          </div>
                          <span
                            className={
                              unit.status === "Leerstehend"
                                ? "text-slate-400 italic"
                                : "text-slate-700"
                            }
                          >
                            {unit.tenant}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {unit.kaltmiete > 0 ? `${unit.kaltmiete} €` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={unit.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {unit.arrears > 0 ? (
                          <span className="text-red-600 font-medium flex items-center justify-end gap-1">
                            <AlertCircleIcon className="w-3.5 h-3.5" />
                            {unit.arrears} €
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalArrears > 0 && (
              <div className="bg-red-50 border-t border-red-100 px-6 py-4 flex justify-between items-center">
                <span className="text-sm font-medium text-red-800">
                  Gesamtrückstand
                </span>
                <span className="text-lg font-bold text-red-700">
                  {totalArrears.toLocaleString("de-DE")} €
                </span>
              </div>
            )}
          </div>
        )}

        {activeTab === "Finanzen" && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <EuroIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Finanzübersicht
            </h3>
            <p className="text-slate-500">
              Die detaillierte Finanzübersicht wird in Kürze verfügbar sein.
            </p>
          </div>
        )}

        {activeTab === "Dokumente" && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <FileTextIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Dokumentenarchiv
            </h3>
            <p className="text-slate-500">
              Das Dokumentenarchiv wird in Kürze verfügbar sein.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
