import { useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPinIcon,
  EuroIcon,
  PaperclipIcon,
  MessageSquareIcon,
  CheckIcon,
  XIcon,
  PhoneIcon,
  ClockIcon,
  AlertTriangleIcon,
} from "lucide-react";
import {
  fetchRequest,
  fetchProperties,
  updateRequestStatus,
} from "~/services/api.server";
import { StatusBadge } from "~/components/StatusBadge";

export async function loader({ params }: LoaderFunctionArgs) {
  const [request, properties] = await Promise.all([
    fetchRequest(params.requestId!),
    fetchProperties(),
  ]);
  const property = properties.find((p) => p.id === request.propertyId);
  const unit = property?.units.find((u) => u.id === request.unitId);
  return json({ request, property, unit });
}

export async function action({ params, request: httpRequest }: ActionFunctionArgs) {
  const formData = await httpRequest.formData();
  const status = formData.get("status") as string;
  const updated = await updateRequestStatus(params.requestId!, status);
  return json({ request: updated });
}

export default function RequestDetailPage() {
  const { request, property, unit } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Use optimistic status: if fetcher submitted, use that status
  const currentStatus =
    fetcher.formData?.get("status")?.toString() ?? request.status;
  const isPending = currentStatus === "Ausstehend";

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const handleApprove = () => {
    fetcher.submit({ status: "Genehmigt" }, { method: "post" });
    setShowApproveModal(false);
  };

  const handleReject = () => {
    fetcher.submit({ status: "Abgelehnt" }, { method: "post" });
    setShowRejectModal(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-32">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <StatusBadge status={currentStatus} />
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${
                request.priority === "Hoch"
                  ? "bg-red-100 text-red-700"
                  : request.priority === "Mittel"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-700"
              }`}
            >
              Priorität: {request.priority}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {request.title}
          </h1>
          <p className="text-slate-500 flex items-center gap-2">
            <span className="font-medium text-slate-700">{request.type}</span>
            <span>•</span>
            Eingegangen am {formatDate(request.dateSubmitted)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Beschreibung
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
              {request.description}
            </p>

            {request.managerNote && (
              <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                <MessageSquareIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Notiz der Hausverwaltung
                  </p>
                  <p className="text-sm text-blue-800">
                    {request.managerNote}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                Anhänge
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {request.attachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="p-2 bg-slate-100 rounded-md">
                      <PaperclipIcon className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-sm text-slate-700 truncate font-medium">
                      {file}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Context Info */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Objekt & Kosten
            </h3>

            <div className="space-y-4">
              {property && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">
                    Betroffenes Objekt
                  </p>
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {property.address}
                      </p>
                      {unit && (
                        <p className="text-sm text-slate-600">{unit.number}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {request.costEstimate && (
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">
                    Kostenschätzung
                  </p>
                  <div className="flex items-center gap-2">
                    <EuroIcon className="w-4 h-4 text-slate-400" />
                    <p className="text-lg font-bold text-slate-900">
                      {request.costEstimate.toLocaleString("de-DE")} €
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Verlauf
            </h3>
            <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                <p className="text-sm font-medium text-slate-900">
                  Anfrage erstellt
                </p>
                <p className="text-xs text-slate-500">
                  {formatDate(request.dateSubmitted)}
                </p>
              </div>
              {!isPending && (
                <div className="relative">
                  <div
                    className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                      currentStatus === "Genehmigt"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <p className="text-sm font-medium text-slate-900">
                    {currentStatus === "Genehmigt"
                      ? "Freigabe erteilt"
                      : "Anfrage abgelehnt"}
                  </p>
                  <p className="text-xs text-slate-500">Gerade eben</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar (Sticky Bottom) */}
      {isPending && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(true)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <CheckIcon className="w-5 h-5" />
                Genehmigen
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-lg font-medium transition-colors"
              >
                <XIcon className="w-5 h-5" />
                Ablehnen
              </button>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg font-medium transition-colors">
                <PhoneIcon className="w-4 h-4" />
                Rückruf
              </button>
              <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg font-medium transition-colors">
                <ClockIcon className="w-4 h-4" />
                Termin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showApproveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Freigabe bestätigen
                </h2>
                <p className="text-slate-600 mb-6">
                  Möchten Sie die Anfrage &quot;{request.title}&quot; wirklich
                  genehmigen?
                  {request.costEstimate &&
                    ` Damit geben Sie Kosten in Höhe von ${request.costEstimate.toLocaleString("de-DE")} € frei.`}
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowApproveModal(false)}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Kostenpflichtig genehmigen
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <AlertTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Anfrage ablehnen
                </h2>
                <p className="text-slate-600 mb-4">
                  Bitte geben Sie einen Grund für die Ablehnung an (optional).
                </p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Begründung für die Hausverwaltung..."
                  className="w-full h-24 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-6"
                ></textarea>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Endgültig ablehnen
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
