import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { UserRole } from "~/types";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__immoconnect_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["immoconnect-secret-key"],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function requireAuth(request: Request) {
  const session = await getSession(request);
  const isLoggedIn = session.get("isLoggedIn");
  if (!isLoggedIn) {
    throw redirect("/login");
  }
  return session;
}

export async function requireAdmin(request: Request) {
  const session = await requireAuth(request);
  const role = session.get("role") as UserRole | undefined;
  if (role !== "admin") {
    throw redirect("/dashboard");
  }
  return session;
}

export async function getUserRole(request: Request): Promise<UserRole> {
  const session = await getSession(request);
  return (session.get("role") as UserRole | undefined) ?? "vermieter";
}

export async function createUserSession(role: UserRole, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("isLoggedIn", true);
  session.set("role", role);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
