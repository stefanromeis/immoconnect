import { motion } from "framer-motion";
import { TrendingUpIcon, TrendingDownIcon, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  trend,
  icon: Icon,
  delay = 0,
}: MetricCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  const isArrears = title.toLowerCase().includes("rückstand");
  let trendColor = "text-gray-500";
  if (isPositive) trendColor = isArrears ? "text-red-600" : "text-emerald-600";
  if (isNegative) trendColor = isArrears ? "text-emerald-600" : "text-red-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-50 rounded-lg">
          <Icon className="w-5 h-5 text-slate-500" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center text-sm font-medium ${trendColor}`}
          >
            {isPositive ? (
              <TrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
    </motion.div>
  );
}
