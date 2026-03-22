import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { MapPinIcon, UsersIcon, EuroIcon } from "lucide-react";
import type { Property } from "~/types";
import { StatusBadge } from "./StatusBadge";

interface PropertyCardProps {
  property: Property;
  delay?: number;
}

export function PropertyCard({ property, delay = 0 }: PropertyCardProps) {
  const isFullyRented = property.occupancyRate === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link
        to={`/properties/${property.id}`}
        className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col block"
      >
        <div className={`h-24 w-full ${property.imageUrl} relative`}>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <StatusBadge
              status={isFullyRented ? "Vollvermietet" : "Teilvermietet"}
              className="bg-white/90 backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-1 line-clamp-1">
            {property.address}
          </h3>
          <div className="flex items-center text-slate-500 text-sm mb-4">
            <MapPinIcon className="w-3.5 h-3.5 mr-1" />
            {property.zip} {property.city}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-500 mb-1 flex items-center">
                <UsersIcon className="w-3.5 h-3.5 mr-1" />
                Einheiten
              </p>
              <p className="text-sm font-medium text-slate-900">
                {property.units.filter((u) => u.status === "Vermietet").length}{" "}
                / {property.units.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1 flex items-center">
                <EuroIcon className="w-3.5 h-3.5 mr-1" />
                Soll-Miete
              </p>
              <p className="text-sm font-medium text-slate-900">
                {property.totalRent.toLocaleString("de-DE")} €
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
