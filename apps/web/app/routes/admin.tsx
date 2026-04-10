import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "~/components/AdminSidebar";
import { TopBar } from "~/components/TopBar";
import { requireAdmin } from "~/services/session.server";
import { mockUsers } from "~/data/mockUsers.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  const pendingCount = mockUsers.filter((u) => u.status === "Ausstehend").length;
  return json({ pendingCount });
}

function getPageInfo(pathname: string) {
  switch (pathname) {
    case "/admin":
    case "/admin/":
      return { title: "Admin Übersicht" };
    case "/admin/users":
      return { title: "Benutzerverwaltung" };
    case "/admin/settings":
      return { title: "Einstellungen" };
    default:
      return { title: "" };
  }
}

export default function AdminLayout() {
  const { pendingCount } = useLoaderData<typeof loader>();
  const location = useLocation();
  const { title } = getPageInfo(location.pathname);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar pendingUsersCount={pendingCount} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar title={title} />

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
