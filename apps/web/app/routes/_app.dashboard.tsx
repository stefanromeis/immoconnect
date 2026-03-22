import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import {
  EuroIcon,
  PercentIcon,
  AlertCircleIcon,
  InboxIcon,
  ArrowRightIcon,
} from "lucide-react";
import { MetricCard } from "~/components/MetricCard";
import { RequestCard } from "~/components/RequestCard";
import { StatusBadge } from "~/components/StatusBadge";
import {
  fetchMetrics,
  fetchProperties,
  fetchRequests,
} from "~/services/api.server";

export async function loader() {
  const [metrics, properties, requests] = await Promise.all([
    fetchMetrics(),
    fetchProperties(),
    fetchRequests(),
  ]);
  return json({ metrics, properties, requests });
}

export default function DashboardPage() {
  const { metrics, properties, requests } = useLoaderData<typeof loader>();

  const recentRequests = requests
    .filter((r) => r.status === "Ausstehend")
    .slice(0, 3);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Willkommen zurück, Johannes
          </h1>
          <p className="text-slate-500">
            Hier ist die aktuelle Übersicht Ihres Portfolios.
          </p>
        </div>
        <Link
          to="/requests"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
        >
          Alle Anfragen ansehen
          <ArrowRightIcon className="w-4 h-4 ml-1.5" />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Gesamtmiete (Soll)"
          value={`${metrics.totalRent.toLocaleString("de-DE")} €`}
          trend={metrics.rentTrend}
          icon={EuroIcon}
          delay={0.1}
        />
        <MetricCard
          title="Vermietungsquote"
          value={`${metrics.occupancyRate}%`}
          trend={metrics.occupancyTrend}
          icon={PercentIcon}
          delay={0.2}
        />
        <MetricCard
          title="Offene Rückstände"
          value={`${metrics.totalArrears.toLocaleString("de-DE")} €`}
          trend={metrics.arrearsTrend}
          icon={AlertCircleIcon}
          delay={0.3}
        />
        <MetricCard
          title="Offene Anfragen"
          value={metrics.openRequests}
          trend={metrics.requestsTrend}
          icon={InboxIcon}
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Aktuelle Anfragen zur Freigabe
            </h2>
          </div>
          <div className="space-y-4">
            {recentRequests.map((request, index) => {
              const property = properties.find(
                (p) => p.id === request.propertyId
              );
              return (
                <RequestCard
                  key={request.id}
                  request={request}
                  property={property}
                  delay={0.5 + index * 0.1}
                />
              );
            })}
          </div>
        </div>

        {/* Property Overview Compact */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-slate-900">
              Objektübersicht
            </h2>
            <Link
              to="/properties"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Alle
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="divide-y divide-slate-100">
              {properties.slice(0, 4).map((property) => {
                const isFullyRented = property.occupancyRate === 100;
                return (
                  <Link
                    key={property.id}
                    to={`/properties/${property.id}`}
                    className="p-4 hover:bg-slate-50 cursor-pointer transition-colors flex justify-between items-center block"
                  >
                    <div>
                      <p className="font-medium text-slate-900 text-sm">
                        {property.address}
                      </p>
                      <p className="text-xs text-slate-500">{property.city}</p>
                    </div>
                    <StatusBadge
                      status={
                        isFullyRented ? "Vollvermietet" : "Teilvermietet"
                      }
                    />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
