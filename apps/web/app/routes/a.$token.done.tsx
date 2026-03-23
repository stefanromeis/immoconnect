import { useSearchParams } from "@remix-run/react";

export default function DonePage() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const approved = status === "Genehmigt";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 space-y-4 text-center">
        <div className="text-6xl">{approved ? "✅" : "❌"}</div>
        <h1 className="text-3xl font-bold text-gray-900">
          {approved ? "Genehmigt" : "Abgelehnt"}
        </h1>
        <p className="text-lg text-gray-600">
          {approved
            ? "Ihre Genehmigung wurde erfolgreich übermittelt."
            : "Die Ablehnung wurde erfolgreich übermittelt."}
        </p>
        <p className="text-sm text-gray-400 pt-4">
          Sie können dieses Fenster jetzt schließen.
        </p>
      </div>
    </div>
  );
}
