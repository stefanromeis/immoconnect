import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  WrenchIcon,
  UserPlusIcon,
  TrendingUpIcon,
  HammerIcon,
  CalendarIcon,
  MapPinIcon,
} from "lucide-react";
import type { Request, Property } from "~/types";
import { StatusBadge } from "./StatusBadge";

interface RequestCardProps {
  request: Request;
  property?: Property;
  delay?: number;
}

export function RequestCard({
  request,
  property,
  delay = 0,
}: RequestCardProps) {
  const getIcon = () => {
    switch (request.type) {
      case "Reparatur":
        return <WrenchIcon className="w-5 h-5 text-blue-500" />;
      case "Neuvermietung":
        return <UserPlusIcon className="w-5 h-5 text-emerald-500" />;
      case "Mietanpassung":
        return <TrendingUpIcon className="w-5 h-5 text-purple-500" />;
      case "Handwerkerauftrag":
        return <HammerIcon className="w-5 h-5 text-orange-500" />;
      default:
        return <WrenchIcon className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Link
        to={`/requests/${request.id}`}
        className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group block"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{request.title}</h3>
              <p className="text-xs text-slate-500">{request.type}</p>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <div className="space-y-2 mt-4">
          {property && (
            <div className="flex items-center text-sm text-slate-600">
              <MapPinIcon className="w-4 h-4 mr-2 text-slate-400" />
              <span className="truncate">
                {property.address}{" "}
                {request.unitId
                  ? `• ${property.units.find((u) => u.id === request.unitId)?.number || ""}`
                  : ""}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
              {formatDate(request.dateSubmitted)}
            </div>
            {request.costEstimate && (
              <div className="font-medium text-slate-900">
                {request.costEstimate.toLocaleString("de-DE")} €
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
