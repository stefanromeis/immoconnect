import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { resendMagicLink } from "~/services/api.server";

type ActionData = { ok: true } | { error: string };

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = (formData.get("email") as string)?.trim();
  const scope = formData.get("scope") as string;
  const resourceId = formData.get("resourceId") as string;

  if (!email) return json<ActionData>({ error: "Bitte geben Sie Ihre E-Mail-Adresse ein." });

  // scope/resourceId may be absent if the user lands here directly
  // without them we can't resend — ask them to contact the manager
  if (!scope || !resourceId) {
    return json<ActionData>({
      error:
        "Fehlende Informationen. Bitte kontaktieren Sie Ihren Hausverwalter für einen neuen Link.",
    });
  }

  await resendMagicLink(email, scope, resourceId);
  // Always return ok — don't reveal whether the email is registered
  return json<ActionData>({ ok: true });
}

export default function RequestLinkPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const busy = navigation.state !== "idle";
  const [params] = useSearchParams();
  const prefillEmail = params.get("email") ?? "";

  if (actionData && "ok" in actionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 space-y-4 text-center">
          <div className="text-6xl">📬</div>
          <h1 className="text-3xl font-bold text-gray-900">E-Mail versandt</h1>
          <p className="text-lg text-gray-600">
            Falls Ihre E-Mail-Adresse bei uns registriert ist, erhalten Sie in Kürze einen neuen
            Link.
          </p>
          <p className="text-sm text-gray-400 pt-2">Sie können dieses Fenster jetzt schließen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Neuen Link anfordern</h1>
          <p className="mt-2 text-lg text-gray-600">
            Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen neuen Zugangslink.
          </p>
        </div>

        {actionData && "error" in actionData && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
            {actionData.error}
          </div>
        )}

        <Form method="post" className="space-y-4">
          {/* Preserve scope/resourceId from the URL so the API knows what to resend */}
          <input type="hidden" name="scope" value={params.get("scope") ?? ""} />
          <input type="hidden" name="resourceId" value={params.get("resourceId") ?? ""} />

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              E-Mail-Adresse
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoFocus
              defaultValue={prefillEmail}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-xl focus:border-blue-500 focus:outline-none"
              placeholder="ihre@email.de"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 text-xl font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {busy ? "Wird gesendet…" : "Link anfordern"}
          </button>
        </Form>
      </div>
    </div>
  );
}
