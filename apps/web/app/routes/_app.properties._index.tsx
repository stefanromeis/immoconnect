import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { PropertyCard } from "~/components/PropertyCard";
import { fetchProperties } from "~/services/api.server";

export async function loader() {
  const properties = await fetchProperties();
  return json({ properties });
}

type FilterType = "Alle" | "Vollvermietet" | "Teilvermietet" | "Leerstehend";

export default function PropertiesPage() {
  const { properties } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<FilterType>("Alle");

  const filteredProperties = properties.filter((p) => {
    if (filter === "Alle") return true;
    if (filter === "Vollvermietet") return p.occupancyRate === 100;
    if (filter === "Teilvermietet")
      return p.occupancyRate < 100 && p.occupancyRate > 0;
    if (filter === "Leerstehend") return p.occupancyRate === 0;
    return true;
  });

  const filters: FilterType[] = [
    "Alle",
    "Vollvermietet",
    "Teilvermietet",
    "Leerstehend",
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Meine Objekte
          </h1>
          <p className="text-slate-500">
            Verwalten Sie Ihr Immobilienportfolio
          </p>
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-lg">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProperties.map((property, index) => (
          <PropertyCard
            key={property.id}
            property={property}
            delay={index * 0.1}
          />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-500">
            Keine Objekte für diesen Filter gefunden.
          </p>
        </div>
      )}
    </div>
  );
}
