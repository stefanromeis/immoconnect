import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  if (session.get("isLoggedIn")) {
    return redirect("/dashboard");
  }
  return redirect("/login");
}
