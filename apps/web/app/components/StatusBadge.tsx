interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";
  let dotColor = "bg-gray-500";

  const normalizedStatus = status.toLowerCase();

  if (
    normalizedStatus.includes("vermietet") ||
    normalizedStatus.includes("genehmigt")
  ) {
    bgColor = "bg-emerald-50";
    textColor = "text-emerald-700";
    dotColor = "bg-emerald-500";
  } else if (
    normalizedStatus.includes("rückstand") ||
    normalizedStatus.includes("abgelehnt")
  ) {
    bgColor = "bg-red-50";
    textColor = "text-red-700";
    dotColor = "bg-red-500";
  } else if (normalizedStatus.includes("ausstehend")) {
    bgColor = "bg-amber-50";
    textColor = "text-amber-700";
    dotColor = "bg-amber-500";
  } else if (normalizedStatus.includes("rückruf")) {
    bgColor = "bg-blue-50";
    textColor = "text-blue-700";
    dotColor = "bg-blue-500";
  } else if (normalizedStatus.includes("leerstehend")) {
    bgColor = "bg-slate-100";
    textColor = "text-slate-700";
    dotColor = "bg-slate-400";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`}
        aria-hidden="true"
      ></span>
      {status}
    </span>
  );
}
