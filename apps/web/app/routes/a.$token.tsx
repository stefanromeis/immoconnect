import { json, redirect } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { validateToken, actOnToken } from "~/services/api.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const result = await validateToken(params.token!);
  return json({ token: params.token!, result });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const status = formData.get("status") as string;
  if (!status) return json({ error: "Fehlende Statusangabe" }, { status: 400 });

  const res = await actOnToken(params.token!, { status });
  if (!res.ok) return json({ error: "Aktion fehlgeschlagen" }, { status: 500 });

  return redirect(`/a/${params.token!}/done?status=${encodeURIComponent(status)}`);
}

export default function MagicLinkPage() {
  const { token, result } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";

  if (!result.valid) {
    return (
      <ExpiredPage
        email={"email" in result ? result.email : undefined}
        token={token}
      />
    );
  }

  const { token: actionToken, request } = result as {
    token: { scope: string; resourceId: string };
    request?: { title: string; description: string; costEstimate?: number; type: string };
  };

  if (actionToken.scope === "approve-request" && request) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              {request.type}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{request.title}</h1>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">{request.description}</p>

          {request.costEstimate != null && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <p className="text-sm text-amber-700 font-medium">Geschätzter Betrag</p>
              <p className="text-3xl font-bold text-amber-900 mt-1">
                {request.costEstimate.toLocaleString("de-DE", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          )}

          <Form method="post" className="space-y-3">
            <button
              type="submit"
              name="status"
              value="Genehmigt"
              disabled={busy}
              className="w-full py-4 text-xl font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:opacity-50 transition-colors"
            >
              {busy ? "Wird gespeichert…" : "✓ Genehmigen"}
            </button>
            <button
              type="submit"
              name="status"
              value="Abgelehnt"
              disabled={busy}
              className="w-full py-4 text-xl font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50 transition-colors"
            >
              {busy ? "Wird gespeichert…" : "✗ Ablehnen"}
            </button>
          </Form>

          <p className="text-center text-sm text-gray-400">
            Dieser Link ist einmalig verwendbar und 48 Stunden gültig.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <p className="text-gray-500">Unbekannte Aktion.</p>
    </div>
  );
}

function ExpiredPage({ email, token }: { email?: string; token: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 space-y-6 text-center">
        <div className="text-6xl">⏱</div>
        <h1 className="text-3xl font-bold text-gray-900">Link abgelaufen</h1>
        <p className="text-lg text-gray-600">
          Dieser Link ist nicht mehr gültig. Sie können einen neuen Link anfordern.
        </p>
        <a
          href={`/auth/request-link${email ? `?email=${encodeURIComponent(email)}` : ""}`}
          className="block w-full py-4 text-xl font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Neuen Link anfordern
        </a>
      </div>
    </div>
  );
}
