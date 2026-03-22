import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLocation } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "~/components/Sidebar";
import { TopBar } from "~/components/TopBar";
import { requireAuth } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  return null;
}

function getPageInfo(pathname: string) {
  if (pathname.startsWith("/properties/")) {
    return { title: "Objektdetails", breadcrumb: "Objekte", breadcrumbTo: "/properties" };
  }
  if (pathname.startsWith("/requests/")) {
    return { title: "Anfragedetails", breadcrumb: "Anfragen", breadcrumbTo: "/requests" };
  }

  switch (pathname) {
    case "/dashboard":
      return { title: "Dashboard" };
    case "/properties":
      return { title: "Objekte" };
    case "/requests":
      return { title: "Anfragen" };
    case "/messages":
      return { title: "Nachrichten" };
    case "/settings":
      return { title: "Einstellungen" };
    default:
      return { title: "" };
  }
}

export default function AppLayout() {
  const location = useLocation();
  const { title, breadcrumb, breadcrumbTo } = getPageInfo(location.pathname);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar
          title={title}
          breadcrumb={breadcrumb}
          breadcrumbTo={breadcrumbTo}
        />

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
