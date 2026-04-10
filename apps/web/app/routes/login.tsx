import { useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { motion } from "framer-motion";
import { BuildingIcon, Loader2Icon, ShieldIcon } from "lucide-react";
import { getSession, createUserSession } from "~/services/session.server";
import type { UserRole } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session.get("isLoggedIn")) {
    const role = session.get("role") as UserRole | undefined;
    return redirect(role === "admin" ? "/admin" : "/dashboard");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const role = (formData.get("role") as UserRole | null) ?? "vermieter";

  // Simulate auth delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return createUserSession(role, role === "admin" ? "/admin" : "/dashboard");
}

export default function LoginPage() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("vermieter");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div
              className={`p-3 rounded-xl shadow-lg ${selectedRole === "admin" ? "bg-purple-600 shadow-purple-600/20" : "bg-blue-600 shadow-blue-600/20"}`}
            >
              {selectedRole === "admin" ? (
                <ShieldIcon className="w-8 h-8 text-white" />
              ) : (
                <BuildingIcon className="w-8 h-8 text-white" />
              )}
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              ImmoConnect
            </h1>
            <p className="text-slate-500 text-sm">
              Ihr Portal für transparente Immobilienverwaltung
            </p>
          </div>

          {/* Role selector (demo only) */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setSelectedRole("vermieter")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${selectedRole === "vermieter" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Vermieter
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("admin")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${selectedRole === "admin" ? "bg-purple-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Admin
            </button>
          </div>

          <Form method="post" className="space-y-5">
            <input type="hidden" name="role" value={selectedRole} />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                E-Mail Adresse
              </label>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder={
                  selectedRole === "admin"
                    ? "admin@immoconnect.de"
                    : "vermieter@beispiel.de"
                }
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Passwort
                </label>
                <span className="text-xs text-blue-600 font-medium cursor-pointer">
                  Passwort vergessen?
                </span>
              </div>
              <input
                type="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center mt-2 disabled:opacity-70 ${selectedRole === "admin" ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isLoading ? (
                <Loader2Icon className="w-5 h-5 animate-spin" />
              ) : (
                "Anmelden"
              )}
            </button>
          </Form>
        </div>

        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Noch keinen Zugang? <br />
            <span className="font-medium text-slate-700">
              Freischaltung erfolgt durch Ihren Verwalter.
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
